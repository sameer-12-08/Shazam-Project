package com.sameerbasha1.shazam.controller;

import com.sameerbasha1.shazam.model.PromptRequest;
import com.sameerbasha1.shazam.model.PromptResponse;
import com.sameerbasha1.shazam.service.PromptRefinerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://handmade-malcolm-outwardly.ngrok-free.dev",
        "https://watson-contents-episodes-audio.trycloudflare.com"
})

public class PromptRefinerController {

    @Autowired
    private PromptRefinerService refinerService;

    /**
     * Refine a user's prompt
     */
    @PostMapping("/refine")
    public ResponseEntity<?> refinePrompt(@RequestBody PromptRequest request) {
        try {
            System.out.println("📝 Received prompt refinement request");

            // Validate input
            if (request.getPrompt() == null || request.getPrompt().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Prompt cannot be empty"));
            }

            // Refine the prompt
            PromptResponse response = refinerService.refinePrompt(request.getPrompt());

            System.out.println("✅ Prompt refined successfully");

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            System.err.println("❌ Invalid input: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));

        } catch (Exception e) {
            System.err.println("❌ Refinement failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to refine prompt: " + e.getMessage()));
        }
    }

    /**
     * Get service status
     */
    @GetMapping("/refine/status")
    public ResponseEntity<?> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("service", "Prompt Refiner");
        status.put("status", "UP");
        status.put("version", "1.0");
        status.put("description", "AI-powered prompt enhancement service");

        return ResponseEntity.ok(status);
    }

    /**
     * Get refinement tips
     */
    @GetMapping("/refine/tips")
    public ResponseEntity<?> getRefinementTips() {
        Map<String, Object> tips = new HashMap<>();
        tips.put("tips", new String[]{
                "Be specific about what you want",
                "Include context and background information",
                "Specify the desired format or structure",
                "Mention the tone (professional, casual, etc.)",
                "Add any constraints or requirements",
                "Use clear and concise language",
                "Break complex requests into parts"
        });

        return ResponseEntity.ok(tips);
    }
}