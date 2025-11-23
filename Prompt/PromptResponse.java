package com.sameerbasha1.shazam.model;

import java.util.List;

/**
 * Represents the response from the prompt refinement process.
 */
public class PromptResponse {

    private String originalPrompt;
    private String refinedPrompt;
    private List<String> improvements;
    private int qualityScore;

    public PromptResponse(String originalPrompt, String refinedPrompt, List<String> improvements, int qualityScore) {
        this.originalPrompt = originalPrompt;
        this.refinedPrompt = refinedPrompt;
        this.improvements = improvements;
        this.qualityScore = qualityScore;
    }

    // Getters and Setters
    public String getOriginalPrompt() {
        return originalPrompt;
    }

    public void setOriginalPrompt(String originalPrompt) {
        this.originalPrompt = originalPrompt;
    }

    public String getRefinedPrompt() {
        return refinedPrompt;
    }

    public void setRefinedPrompt(String refinedPrompt) {
        this.refinedPrompt = refinedPrompt;
    }

    public List<String> getImprovements() {
        return improvements;
    }

    public void setImprovements(List<String> improvements) {
        this.improvements = improvements;
    }

    public int getQualityScore() {
        return qualityScore;
    }

    public void setQualityScore(int qualityScore) {
        this.qualityScore = qualityScore;
    }
}
