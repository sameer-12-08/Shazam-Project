package com.sameerbasha1.shazam.model;

import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;

public class TransferSession {
    private String id;
    private Path path;
    private List<String> fileNames;
    private long expiryTime;
    private int downloadCount;
    private LocalDateTime createdAt;
    private LocalDateTime lastAccessedAt;
    private String uploaderIp;
    private long totalSize;

    public TransferSession(String id, Path path, List<String> fileNames, long expiryTime) {
        this.id = id;
        this.path = path;
        this.fileNames = fileNames;
        this.expiryTime = expiryTime;
        this.downloadCount = 0;
        this.createdAt = LocalDateTime.now();
        this.lastAccessedAt = LocalDateTime.now();
        this.totalSize = 0;
    }

    public boolean isExpired() {
        return System.currentTimeMillis() > expiryTime;
    }

    public void incrementDownloadCount() {
        this.downloadCount++;
        this.lastAccessedAt = LocalDateTime.now();
    }

    public boolean canDownload() {
        // Allow unlimited downloads within 24 hours
        // Or limit to 1 download: return downloadCount < 1;
        return !isExpired();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public Path getPath() {
        return path;
    }

    public List<String> getFileNames() {
        return fileNames;
    }

    public long getExpiryTime() {
        return expiryTime;
    }

    public int getDownloadCount() {
        return downloadCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getLastAccessedAt() {
        return lastAccessedAt;
    }

    public void setUploaderIp(String uploaderIp) {
        this.uploaderIp = uploaderIp;
    }

    public String getUploaderIp() {
        return uploaderIp;
    }

    public void setTotalSize(long totalSize) {
        this.totalSize = totalSize;
    }

    public long getTotalSize() {
        return totalSize;
    }
}