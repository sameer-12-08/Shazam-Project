package com.sameerbasha1.shazam.controller;

import com.sameerbasha1.shazam.model.PromptResponse;
import com.sameerbasha1.shazam.service.PromptRefinerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for handling prompt refinement requests.
 */
@RestController
@RequestMapping("/api/prompt")
public class PromptRefinerController {

    private final PromptRefinerService promptRefinerService;

    @Autowired
    public PromptRefinerController(PromptRefinerService promptRefinerService) {
        this.promptRefinerService = promptRefinerService;
    }

    /**
     * Endpoint to refine a user-provided prompt.
     * @param payload A map containing the "prompt" key with the raw prompt text.
     * @return A PromptResponse object containing the full refinement details.
     */
    @PostMapping("/refine")
    public PromptResponse refinePrompt(@RequestBody Map<String, String> payload) {
        String rawPrompt = payload.get("prompt");
        return promptRefinerService.refinePrompt(rawPrompt);
    }
}
