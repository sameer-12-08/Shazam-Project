package com.sameerbasha1.shazam.service;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

/**
 * Service to handle the core logic of refining prompts.
 * This version provides suggestions to the user on how to improve their prompt.
 */
@Service
public class PromptRefinerService {

    /**
     * Analyzes a raw user-submitted prompt and suggests improvements.
     * @param rawPrompt The original prompt from the user.
     * @return A string containing a list of suggestions, or a confirmation if the prompt is already good.
     */
    public String refinePrompt(String rawPrompt) {
        if (rawPrompt == null || rawPrompt.trim().isEmpty()) {
            return "Prompt cannot be empty. Please provide a prompt to refine.";
        }

        // Use a list to hold refinement suggestions
        List<String> suggestions = new ArrayList<>();

        // Rule 1: Check if the prompt assigns a role to the AI.
        // (?i) makes the match case-insensitive.
        if (!rawPrompt.matches("(?i).*\\b(act as|you are|role is)\\b.*re")) {
            suggestions.add("Assign a role to the AI (e.g., 'Act as a travel guide...').");
        }

        // Rule 2: Check if a specific output format is requested.
        if (!rawPrompt.matches("(?i).*\\b(format as|use markdown|as a list|in a table|as json)\\b.*re")) {
            suggestions.add("Specify the desired output format (e.g., 'Format the result as a numbered list.').");
        }

        // Rule 3: Check if the target audience is defined.
        if (!rawPrompt.matches("(?i).*\\b(for an audience of|my audience is|target audience)\\b.*re")) {
            suggestions.add("Define the target audience to tailor the tone (e.g., '...for an audience of experts.').");
        }

        // Rule 4: Check for constraints or negative constraints.
        if (!rawPrompt.matches("(?i).*\\b(do not|don't|avoid|ensure that|must include)\\b.*re")) {
            suggestions.add("Add constraints to guide the output (e.g., 'Do not use technical jargon.').");
        }

        // If no suggestions were generated, the prompt is likely well-structured.
        if (suggestions.isEmpty()) {
            return "This prompt is already well-structured! No immediate refinements suggested.";
        }

        // Build the final response string.
        return "Here are some suggestions to improve your prompt:\n- " + String.join("\n- ", suggestions);
    }
}
