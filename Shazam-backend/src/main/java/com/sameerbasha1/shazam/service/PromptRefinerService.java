package com.sameerbasha1.shazam.service;

import com.sameerbasha1.shazam.model.PromptResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PromptRefinerService {

    /**
     * Main method to refine a user's prompt
     */
    public PromptResponse refinePrompt(String originalPrompt) {
        if (originalPrompt == null || originalPrompt.trim().isEmpty()) {
            throw new IllegalArgumentException("Prompt cannot be empty");
        }

        System.out.println("🔄 Refining prompt: " + originalPrompt.substring(0, Math.min(50, originalPrompt.length())) + "...");

        // Analyze the prompt
        List<String> improvements = new ArrayList<>();
        StringBuilder refinedPrompt = new StringBuilder();

        // Step 1: Add context if missing
        if (!hasContext(originalPrompt)) {
            refinedPrompt.append("Context: ");
            improvements.add("Added context specification");
        }

        // Step 2: Enhance clarity
        String enhancedPrompt = enhanceClarity(originalPrompt);
        refinedPrompt.append(enhancedPrompt);

        if (!originalPrompt.equals(enhancedPrompt)) {
            improvements.add("Enhanced clarity and specificity");
        }

        // Step 3: Add structure
        if (!hasStructure(originalPrompt)) {
            refinedPrompt.append("\n\nFormat Requirements:\n");
            refinedPrompt.append("- Provide detailed explanation\n");
            refinedPrompt.append("- Include examples where applicable\n");
            refinedPrompt.append("- Use clear, structured format");
            improvements.add("Added output structure guidelines");
        }

        // Step 4: Add tone specification
        if (!hasTone(originalPrompt)) {
            refinedPrompt.append("\n\nTone: Professional and informative");
            improvements.add("Specified communication tone");
        }

        // Step 5: Add constraints if needed
        if (needsConstraints(originalPrompt)) {
            refinedPrompt.append("\n\nConstraints:\n");
            refinedPrompt.append("- Focus on accurate, factual information\n");
            refinedPrompt.append("- Provide practical, actionable guidance");
            improvements.add("Added quality constraints");
        }

        // Calculate quality score
        int qualityScore = calculateQualityScore(originalPrompt, refinedPrompt.toString());

        System.out.println("✅ Refinement complete. Quality score: " + qualityScore + "/100");

        return new PromptResponse(
                originalPrompt,
                refinedPrompt.toString(),
                improvements,
                qualityScore
        );
    }

    /**
     * Check if prompt has context
     */
    private boolean hasContext(String prompt) {
        String lower = prompt.toLowerCase();
        return lower.contains("context:") ||
                lower.contains("background:") ||
                lower.contains("situation:") ||
                prompt.length() > 100;
    }

    /**
     * Check if prompt has structure
     */
    private boolean hasStructure(String prompt) {
        return prompt.contains("format:") ||
                prompt.contains("structure:") ||
                prompt.contains("requirements:") ||
                prompt.contains("\n-") ||
                prompt.contains("1.") ||
                prompt.contains("2.");
    }

    /**
     * Check if prompt specifies tone
     */
    private boolean hasTone(String prompt) {
        String lower = prompt.toLowerCase();
        return lower.contains("tone:") ||
                lower.contains("style:") ||
                lower.contains("professional") ||
                lower.contains("casual") ||
                lower.contains("formal");
    }

    /**
     * Check if prompt needs constraints
     */
    private boolean needsConstraints(String prompt) {
        String lower = prompt.toLowerCase();
        return lower.contains("write") ||
                lower.contains("create") ||
                lower.contains("generate") ||
                lower.contains("code") ||
                lower.contains("explain");
    }

    /**
     * Enhance clarity of the prompt
     */
    private String enhanceClarity(String prompt) {
        StringBuilder enhanced = new StringBuilder();

        // Capitalize first letter
        if (!prompt.isEmpty()) {
            enhanced.append(Character.toUpperCase(prompt.charAt(0)));
            enhanced.append(prompt.substring(1));
        }

        // Add period if missing
        if (!prompt.endsWith(".") && !prompt.endsWith("?") && !prompt.endsWith("!")) {
            enhanced.append(".");
        }

        // Add specificity markers
        String result = enhanced.toString();

        // Enhance vague words
        result = result.replaceAll("\\bwrite\\b", "write a detailed");
        result = result.replaceAll("\\bexplain\\b", "explain in detail");
        result = result.replaceAll("\\btell me\\b", "provide comprehensive information");
        result = result.replaceAll("\\bcode\\b", "code with comments and explanations");
        result = result.replaceAll("\\bhelp\\b", "provide step-by-step guidance");

        return result;
    }

    /**
     * Calculate quality score (0-100)
     */
    private int calculateQualityScore(String original, String refined) {
        int score = 50; // Base score

        // Length improvement
        if (refined.length() > original.length() * 1.5) {
            score += 15;
        }

        // Structure
        if (refined.contains("\n")) {
            score += 10;
        }

        // Specificity
        if (refined.contains("detailed") || refined.contains("specific")) {
            score += 10;
        }

        // Context
        if (refined.toLowerCase().contains("context:")) {
            score += 5;
        }

        // Format
        if (refined.toLowerCase().contains("format:")) {
            score += 5;
        }

        // Tone
        if (refined.toLowerCase().contains("tone:")) {
            score += 5;
        }

        return Math.min(score, 100);
    }

    /**
     * Get statistics about refinements
     */
    public String getServiceStats() {
        return "Prompt Refiner Service: Active and running";
    }
}