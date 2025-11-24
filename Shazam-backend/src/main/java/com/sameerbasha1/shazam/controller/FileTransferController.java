package com.sameerbasha1.shazam.controller;

import com.sameerbasha1.shazam.model.TransferInfo;
import com.sameerbasha1.shazam.model.TransferSession;
import com.sameerbasha1.shazam.model.UploadResponse;
import com.sameerbasha1.shazam.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://handmade-malcolm-outwardly.ngrok-free.dev",
        "https://watson-contents-episodes-audio.trycloudflare.com"
})

public class FileTransferController {

    @Autowired
    private FileStorageService storageService;

    /**
     * Upload files and create transfer session
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFiles(
            @RequestParam("files") MultipartFile[] files,
            HttpServletRequest request) {
        try {
            // Validate files
            if (files == null || files.length == 0) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "No files provided"));
            }

            // Get client IP
            String clientIp = getClientIp(request);

            // Store files
            TransferSession session = storageService.storeFiles(files, clientIp);

            // Generate download URL (use your actual IP or domain)
            String baseUrl = getBaseUrl(request);
            String downloadUrl = baseUrl + "/api/d/" + session.getId();

            // Create response with transfer info
            Map<String, Object> response = new HashMap<>();
            response.put("url", downloadUrl);
            response.put("transferId", session.getId());
            response.put("fileCount", session.getFileNames().size());
            response.put("totalSize", session.getTotalSize());
            response.put("expiresAt", LocalDateTime.ofInstant(
                    Instant.ofEpochMilli(session.getExpiryTime()),
                    ZoneId.systemDefault()
            ));

            System.out.println("✅ Upload successful - Transfer ID: " + session.getId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Upload failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }

    /**
     * Download files by transfer ID
     */
    @GetMapping("/d/{transferId}")
    public ResponseEntity<Resource> downloadFiles(
            @PathVariable String transferId,
            HttpServletRequest request) {
        try {
            System.out.println("📥 Download request for: " + transferId + " from " + getClientIp(request));

            Resource file = storageService.loadFile(transferId);
            String filename = file.getFilename();

            // Determine content type
            String contentType = filename.endsWith(".zip")
                    ? "application/zip"
                    : "application/octet-stream";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + filename + "\"")
                    .header(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "*")
                    .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                    .header(HttpHeaders.PRAGMA, "no-cache")
                    .header(HttpHeaders.EXPIRES, "0")
                    .header("X-Content-Type-Options", "nosniff")
                    .body(file);

        } catch (Exception e) {
            System.err.println("❌ Download failed: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get transfer information (without downloading)
     */
    @GetMapping("/transfer/{transferId}/info")
    public ResponseEntity<?> getTransferInfo(@PathVariable String transferId) {
        try {
            TransferSession session = storageService.getTransferInfo(transferId);

            if (session == null || session.isExpired()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Transfer not found or expired"));
            }

            Map<String, Object> info = new HashMap<>();
            info.put("transferId", session.getId());
            info.put("fileCount", session.getFileNames().size());
            info.put("fileNames", session.getFileNames());
            info.put("totalSize", session.getTotalSize());
            info.put("downloadCount", session.getDownloadCount());
            info.put("expiresAt", LocalDateTime.ofInstant(
                    Instant.ofEpochMilli(session.getExpiryTime()),
                    ZoneId.systemDefault()
            ));
            info.put("canDownload", session.canDownload());

            return ResponseEntity.ok(info);

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get server statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getStatistics() {
        return ResponseEntity.ok(storageService.getStatistics());
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "timestamp", LocalDateTime.now(),
                "service", "Seamless Transfer API"
        ));
    }

    // Helper methods

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    private String getBaseUrl(HttpServletRequest request) {
        String scheme = request.getScheme();
        String serverName = request.getServerName();
        int serverPort = request.getServerPort();

        String port = (serverPort == 80 || serverPort == 443) ? "" : ":" + serverPort;
        return scheme + "://" + serverName + port;
    }
}