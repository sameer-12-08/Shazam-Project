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
            // Returning a valid PromptResponse object for errors is better than throwing an exception
            List<String> errors = new ArrayList<>();
            errors.add("Prompt cannot be empty.");
            return new PromptResponse(originalPrompt, "", errors, 0);
        }

        System.out.println("🔄 Refining prompt: " + originalPrompt.substring(0, Math.min(50, originalPrompt.length())) + "...");

        // Analyze the prompt
        List<String> improvements = new ArrayList<>();
        StringBuilder refinedPrompt = new StringBuilder();

        // Step 1: Add context if missing
        if (!hasContext(originalPrompt)) {
            refinedPrompt.append("Context: [Please provide relevant background information here].\n\n");
            improvements.add("Added a placeholder for context.");
        }

        // Step 2: Enhance clarity
        String enhancedPrompt = enhanceClarity(originalPrompt);
        refinedPrompt.append(enhancedPrompt);

        if (!originalPrompt.equals(enhancedPrompt)) {
            improvements.add("Enhanced clarity and specificity.");
        }

        // Step 3: Add structure
        if (!hasStructure(originalPrompt)) {
            refinedPrompt.append("\n\nFormat Requirements:\n");
            refinedPrompt.append("- Provide a detailed explanation.\n");
            refinedPrompt.append("- Include examples where applicable.\n");
            refinedPrompt.append("- Use a clear, structured format (e.g., markdown).");
            improvements.add("Added output structure guidelines.");
        }

        // Step 4: Add tone specification
        if (!hasTone(originalPrompt)) {
            refinedPrompt.append("\nTone: Professional and informative.");
            improvements.add("Specified communication tone.");
        }

        // Step 5: Add constraints if needed
        if (needsConstraints(originalPrompt)) {
            refinedPrompt.append("\n\nConstraints:\n");
            refinedPrompt.append("- Focus on accurate, factual information.\n");
            refinedPrompt.append("- Provide practical, actionable guidance.");
            improvements.add("Added quality constraints.");
        }

        // Calculate quality score
        int qualityScore = calculateQualityScore(originalPrompt, refinedPrompt.toString(), improvements);

        System.out.println("✅ Refinement complete. Quality score: " + qualityScore + "/100");

        return new PromptResponse(
                originalPrompt,
                refinedPrompt.toString(),
                improvements,
                qualityScore
        );
    }

    private boolean hasContext(String prompt) {
        String lower = prompt.toLowerCase();
        return lower.contains("context:") || lower.contains("background:") || lower.contains("situation:") || prompt.length() > 150;
    }

    private boolean hasStructure(String prompt) {
        String lower = prompt.toLowerCase();
        return lower.contains("format:") || lower.contains("structure:") || lower.contains("requirements:") || lower.contains("\n-") || lower.contains("1.") || lower.contains("2.");
    }

    private boolean hasTone(String prompt) {
        String lower = prompt.toLowerCase();
        return lower.contains("tone:") || lower.contains("style:") || lower.contains("professional") || lower.contains("casual") || lower.contains("formal");
    }

    private boolean needsConstraints(String prompt) {
        String lower = prompt.toLowerCase();
        return lower.contains("write") || lower.contains("create") || lower.contains("generate") || lower.contains("code") || lower.contains("explain");
    }

    private String enhanceClarity(String prompt) {
        String result = prompt;
        
        result = result.replaceAll("\\b(write|create)\\b", "develop a comprehensive");
        result = result.replaceAll("\\b(explain|describe)\\b", "provide a detailed explanation of");
        result = result.replaceAll("\\b(tell me about)\\b", "give a thorough overview of");
        result = result.replaceAll("\\b(code|program)\\b", "write a clean, well-commented piece of code for");
        
        // Capitalize first letter if it isn't already
        if (!result.isEmpty() && Character.isLowerCase(result.charAt(0))) {
            result = Character.toUpperCase(result.charAt(0)) + result.substring(1);
        }
        
        return result;
    }

    private int calculateQualityScore(String original, String refined, List<String> improvements) {
        int score = 20; // Base score

        // Increase score based on the number of improvements made
        score += improvements.size() * 10;
        
        // Length improvement
        if (refined.length() > original.length() * 1.2) {
            score += 15;
        }

        // Structure
        if (hasStructure(refined)) {
            score += 15;
        }

        // Context
        if (hasContext(refined)) {
            score += 10;
        }

        // Tone
        if (hasTone(refined)) {
            score += 10;
        }

        return Math.min(score, 100);
    }
}
