package com.sameerbasha1.shazam.service;

import com.sameerbasha1.shazam.model.TransferSession;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class FileStorageService {

    private final Path uploadDir = Paths.get("uploads");
    private final Map<String, TransferSession> sessions = new ConcurrentHashMap<>();
    private static final long EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(uploadDir);
            System.out.println("📁 Upload directory created: " + uploadDir.toAbsolutePath());

            // Schedule cleanup task
            new Timer().scheduleAtFixedRate(new TimerTask() {
                @Override
                public void run() {
                    cleanupExpiredSessions();
                }
            }, 0, 60000); // Check every minute
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public TransferSession storeFiles(MultipartFile[] files, String uploaderIp) throws IOException {
        String transferId = generateTransferId();
        Path transferDir = uploadDir.resolve(transferId);
        Files.createDirectories(transferDir);

        List<String> fileNames = new ArrayList<>();
        long totalSize = 0;

        System.out.println("📤 Storing " + files.length + " files for transfer: " + transferId);

        for (MultipartFile file : files) {
            String fileName = sanitizeFileName(file.getOriginalFilename());
            Path targetPath = transferDir.resolve(fileName);
            Files.copy(file.getInputStream(), targetPath);
            fileNames.add(fileName);
            totalSize += file.getSize();

            System.out.println("  ✓ Saved: " + fileName + " (" + formatSize(file.getSize()) + ")");
        }

        // Create transfer session
        TransferSession session = new TransferSession(
                transferId,
                transferDir,
                fileNames,
                System.currentTimeMillis() + EXPIRY_TIME
        );
        session.setUploaderIp(uploaderIp);
        session.setTotalSize(totalSize);

        sessions.put(transferId, session);

        System.out.println("✅ Transfer created: " + transferId + " | Total: " + formatSize(totalSize));

        return session;
    }

    public Resource loadFile(String transferId) throws IOException {
        TransferSession session = sessions.get(transferId);

        if (session == null) {
            System.out.println("❌ Transfer not found: " + transferId);
            throw new FileNotFoundException("Transfer not found");
        }

        if (session.isExpired()) {
            System.out.println("⏰ Transfer expired: " + transferId);
            sessions.remove(transferId);
            deleteDirectory(session.getPath());
            throw new FileNotFoundException("Transfer has expired");
        }

        if (!session.canDownload()) {
            System.out.println("🚫 Download limit reached: " + transferId);
            throw new IOException("Download limit reached");
        }

        // Increment download counter
        session.incrementDownloadCount();

        System.out.println("📥 Download #" + session.getDownloadCount() + " for transfer: " + transferId);

        // If multiple files, create a zip
        if (session.getFileNames().size() > 1) {
            Path zipPath = createZip(session);
            return new UrlResource(zipPath.toUri());
        } else {
            // Single file
            Path filePath = session.getPath().resolve(session.getFileNames().get(0));
            return new UrlResource(filePath.toUri());
        }
    }

    public TransferSession getTransferInfo(String transferId) {
        return sessions.get(transferId);
    }

    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("activeTransfers", sessions.size());
        stats.put("totalDownloads", sessions.values().stream()
                .mapToInt(TransferSession::getDownloadCount)
                .sum());
        stats.put("totalSize", sessions.values().stream()
                .mapToLong(TransferSession::getTotalSize)
                .sum());
        return stats;
    }

    private Path createZip(TransferSession session) throws IOException {
        String zipFileName = "transfer_" + session.getId() + ".zip";
        Path zipPath = session.getPath().resolve(zipFileName);

        // Create zip only if it doesn't exist
        if (!Files.exists(zipPath)) {
            System.out.println("📦 Creating ZIP archive: " + zipFileName);

            try (ZipOutputStream zos = new ZipOutputStream(
                    new FileOutputStream(zipPath.toFile()))) {

                for (String fileName : session.getFileNames()) {
                    Path filePath = session.getPath().resolve(fileName);
                    ZipEntry zipEntry = new ZipEntry(fileName);
                    zos.putNextEntry(zipEntry);
                    Files.copy(filePath, zos);
                    zos.closeEntry();
                }
            }

            System.out.println("✅ ZIP created: " + formatSize(Files.size(zipPath)));
        }

        return zipPath;
    }

    private void cleanupExpiredSessions() {
        int cleaned = 0;
        List<String> toRemove = new ArrayList<>();

        for (Map.Entry<String, TransferSession> entry : sessions.entrySet()) {
            TransferSession session = entry.getValue();
            if (session.isExpired()) {
                toRemove.add(entry.getKey());
            }
        }

        for (String transferId : toRemove) {
            TransferSession session = sessions.remove(transferId);
            try {
                deleteDirectory(session.getPath());
                cleaned++;
                System.out.println("🧹 Cleaned expired transfer: " + transferId);
            } catch (IOException e) {
                System.err.println("❌ Failed to delete: " + transferId);
                e.printStackTrace();
            }
        }

        if (cleaned > 0) {
            System.out.println("✅ Cleanup completed: " + cleaned + " transfers removed");
        }
    }

    private void deleteDirectory(Path path) throws IOException {
        if (Files.exists(path)) {
            Files.walk(path)
                    .sorted((a, b) -> -a.compareTo(b))
                    .forEach(p -> {
                        try {
                            Files.delete(p);
                        } catch (IOException e) {
                            System.err.println("Failed to delete: " + p);
                        }
                    });
        }
    }

    private String generateTransferId() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    private String sanitizeFileName(String fileName) {
        if (fileName == null) return "file";
        // Remove potentially dangerous characters
        return fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private String formatSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        String pre = "KMGT".charAt(exp - 1) + "";
        return String.format("%.1f %sB", bytes / Math.pow(1024, exp), pre);
    }
}