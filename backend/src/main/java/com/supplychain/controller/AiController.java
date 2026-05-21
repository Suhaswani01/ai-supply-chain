package com.supplychain.controller;

import com.supplychain.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AiController {

    private final AiService aiService;

    @GetMapping("/ai-insights")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> getInsights() {
        String result = aiService.getInsights();
        return ResponseEntity.ok(Map.of("result", result));
    }

    @GetMapping("/risk-scorer")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> getRiskScore() {
        String result = aiService.getRiskScore();
        return ResponseEntity.ok(Map.of("result", result));
    }

    @GetMapping("/forecasting")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> getForecast() {
        String result = aiService.getForecast();
        return ResponseEntity.ok(Map.of("result", result));
    }
}