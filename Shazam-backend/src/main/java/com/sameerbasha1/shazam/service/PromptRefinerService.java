package com.sameerbasha1.shazam.service;
import org.springframework.stereotype.Service;
@Service
public class PromptRefinerService {
    public String refinePrompt(String rawPrompt) {
        if (rawPrompt == null || rawPrompt.trim().isEmpty()) {
            return "Prompt cannot be empty. Please provide a detailed prompt.";
        }
        StringBuilder refinedPrompt = new StringBuilder(rawPrompt);
        if (rawPrompt.length() < 50) {
            refinedPrompt.append(" Please provide a detailed and descriptive response.");
        }
        if (!rawPrompt.toLowerCase().contains("professional")) {
            refinedPrompt.append(" Ensure the tone is professional.");
        }
        return refinedPrompt.toString();
    }
}