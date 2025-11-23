package com.sameerbasha1.shazam.controller;

import com.sameerbasha1.shazam.service.PromptRefinerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

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
     * @return A map containing the "refinedPrompt" key with the refined prompt text.
     */
    @PostMapping("/refine")
    public Map<String, String> refinePrompt(@RequestBody Map<String, String> payload) {
        String rawPrompt = payload.get("prompt");
        String refinedPrompt = promptRefinerService.refinePrompt(rawPrompt);
        
        Map<String, String> response = new HashMap<>();
        response.put("refinedPrompt", refinedPrompt);
        
        return response;
    }
}
