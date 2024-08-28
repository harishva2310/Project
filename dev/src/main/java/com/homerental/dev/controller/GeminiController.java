package com.homerental.dev.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;


@RestController
@RequestMapping("/api/help")
public class GeminiController {
    @Value("${gemini.apiKey}")
    private String apiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    @PostMapping("/generate-content")
    public ResponseEntity<String> generateContent(@RequestParam String question) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        List<Map<String, Object>> contents = new ArrayList<>();
        Map<String, Object> content = new HashMap<>();
        content.put("role", "user");

        List<Map<String, String>> parts = new ArrayList<>();
        parts.add(createPart("input: What are the vehicles available in Vehicle Rental Application"));
        parts.add(createPart("output: We have a wide range of premium cars such as the Tesla Model X, Ferrari 812, Lamborghini Huracan and motorcycles such as Ducati Diavel, Harley Davidson."));
        parts.add(createPart("input: Are there any refund policies"));
        parts.add(createPart("output: Currently there are no refund policies available."));
        parts.add(createPart("input: How can I pay for the rental"));
        parts.add(createPart("output: You can pay for the rental booking by credit card using Stripe payments or you can reserve a vehicle of your choice and pay for it while picking it up from the location."));
        parts.add(createPart("input: What are the technologies used in the Vehicle Rental Application"));
        parts.add(createPart("output: The application is currently deployed on Oracle Cloud Infrastructure (OCI) and uses the following tools and technologies\nOracle Autonomous Database for transaction processing and storage,\nSpring Boot backend microservice for REST APIs, query processing,\nTypescript and ReactJS frontend microservice with Bootstrap CSS for user-friendly UI,\nOkta for OAuth2.0 authentication with JWT tokens for security,\nStripe API for payments processing,\nNginx for load-balancing and reverse-proxy requests,\nRedis caching for improving response time and reducing load on database,\nDeployed using Docker and Kubernetes for high scalability and availability,\nJenkins and Git for CI/CD,\nApache Kafka for streaming, notifications, logging\nSpring Hashicorp Vault for secrets storage,\nGoogle Gemini for answering FAQs"));
        parts.add(createPart("input: Can I know about the developer of this application"));
        parts.add(createPart("output: Sure, The developer is Harish Anand who is an experienced professional in delivering software solutions for major companies and is a Master's graduate. You can contact him at https://www.linkedin.com/in/harishva1997/ to hire him."));
        parts.add(createPart("input: How to view my bookings"));
        parts.add(createPart("output: To view your bookings, sign into the application and then click on the top right corner of the page where it says 'My Bookings'."));
        parts.add(createPart("input: " + question));
        parts.add(createPart("output: "));

        content.put("parts", parts);
        contents.add(content);
        requestBody.put("contents", contents);

        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 1);
        generationConfig.put("topK", 64);
        generationConfig.put("topP", 0.95);
        generationConfig.put("maxOutputTokens", 8192);
        generationConfig.put("responseMimeType", "text/plain");
        requestBody.put("generationConfig", generationConfig);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        String url = GEMINI_API_URL + "?key=" + apiKey;
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
        if (response.getStatusCode() == HttpStatus.OK) {
            return ResponseEntity.ok(extractTextContent(response.getBody()));
        } else {
            return ResponseEntity.status(response.getStatusCode()).body("Error generating content");
        }
        
    }

    private String extractTextContent(String jsonResponse) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            JsonNode textNode = rootNode
                .path("candidates")
                .path(0)
                .path("content")
                .path("parts")
                .path(0)
                .path("text");

            return textNode.asText();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error extracting text content";
        }
    }

    private Map<String, String> createPart(String text) {
        Map<String, String> part = new HashMap<>();
        part.put("text", text);
        return part;
    }
}
