package com.sameerbasha1.shazam.model;

import java.time.LocalDateTime;

public class TransferInfo {
    private String transferId;
    private int fileCount;
    private long totalSize;
    private String downloadUrl;
    private LocalDateTime expiresAt;
    private int downloadCount;

    public TransferInfo(String transferId, int fileCount, long totalSize,
                        String downloadUrl, LocalDateTime expiresAt) {
        this.transferId = transferId;
        this.fileCount = fileCount;
        this.totalSize = totalSize;
        this.downloadUrl = downloadUrl;
        this.expiresAt = expiresAt;
        this.downloadCount = 0;
    }

    // Getters and Setters
    public String getTransferId() { return transferId; }
    public void setTransferId(String transferId) { this.transferId = transferId; }

    public int getFileCount() { return fileCount; }
    public void setFileCount(int fileCount) { this.fileCount = fileCount; }

    public long getTotalSize() { return totalSize; }
    public void setTotalSize(long totalSize) { this.totalSize = totalSize; }

    public String getDownloadUrl() { return downloadUrl; }
    public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public int getDownloadCount() { return downloadCount; }
    public void setDownloadCount(int downloadCount) { this.downloadCount = downloadCount; }
}