package com.homerental.dev.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homerental.dev.config.VaultConfigV1;

@RestController
@RequestMapping("/api/vault")
public class VaultController {
    
    
    @Autowired
    private VaultConfigV1 vaultConfig;

    @GetMapping("/stripe-api-key")
    public ResponseEntity<String> getStripeApiKey() {
        try {
            String apiKey = vaultConfig.getStripeApiKey();
            return ResponseEntity.ok(apiKey);
        } catch (RuntimeException e) {
            // Log error and return appropriate response
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to fetch the API key from Vault.");
        }
    }
}
