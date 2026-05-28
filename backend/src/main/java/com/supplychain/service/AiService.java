package com.supplychain.service;

import com.supplychain.entity.Part;
import com.supplychain.entity.PurchaseOrder;
import com.supplychain.entity.Supplier;
import com.supplychain.repository.PartRepository;
import com.supplychain.repository.PurchaseOrderRepository;
import com.supplychain.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AiService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.model}")
    private String model;

    private final PartRepository partRepository;
    private final SupplierRepository supplierRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    // ── AI Insights ──────────────────────────────────────────────────────────
    public String getInsights() {
        List<Part> parts = partRepository.findAll();
        List<Supplier> suppliers = supplierRepository.findAll();
        List<PurchaseOrder> orders = purchaseOrderRepository.findAll();

        long lowStock    = parts.stream().filter(p -> "LOW_STOCK".equals(p.getStockStatus().name())).count();
        long outOfStock  = parts.stream().filter(p -> "OUT_OF_STOCK".equals(p.getStockStatus().name())).count();
        long pendingPOs  = orders.stream().filter(o -> "PENDING".equals(o.getStatus().name())).count();
        long approvedPOs = orders.stream().filter(o -> "APPROVED".equals(o.getStatus().name())).count();

        String prompt = String.format("""
            You are an AI supply chain analyst. Analyze this inventory data and respond ONLY with a valid JSON object. No explanation, no markdown, no text outside JSON.

            INVENTORY SUMMARY:
            - Total Parts: %d
            - Low Stock Parts: %d
            - Out of Stock Parts: %d
            - Total Suppliers: %d
            - Pending Purchase Orders: %d
            - Approved Purchase Orders: %d

            PARTS DETAIL:
            %s

            Return this exact JSON structure:
            {
              "healthScore": <number 0-100>,
              "healthLabel": "<Excellent|Good|Fair|Critical>",
              "totalParts": <number>,
              "lowStock": <number>,
              "outOfStock": <number>,
              "criticalIssues": [
                {"title": "<issue title>", "description": "<one line description>"},
                {"title": "<issue title>", "description": "<one line description>"},
                {"title": "<issue title>", "description": "<one line description>"}
              ],
              "recommendations": [
                {"title": "<action title>", "description": "<one line description>"},
                {"title": "<action title>", "description": "<one line description>"},
                {"title": "<action title>", "description": "<one line description>"}
              ],
              "summary": "<2 line summary of overall inventory health>"
            }
            """,
            parts.size(), lowStock, outOfStock,
            suppliers.size(), pendingPOs, approvedPOs,
            buildPartsDetail(parts)
        );

        return callGroq(prompt);
    }

    // ── Risk Scorer ──────────────────────────────────────────────────────────
    public String getRiskScore() {
        List<Part> parts = partRepository.findAll();
        List<Supplier> suppliers = supplierRepository.findAll();
        List<PurchaseOrder> orders = purchaseOrderRepository.findAll();

        String prompt = String.format("""
            You are a supply chain risk analyst. Analyze this data and respond ONLY with a valid JSON object. No explanation, no markdown, no text outside JSON.

            SUPPLIERS:
            %s

            PARTS WITH STOCK STATUS:
            %s

            PURCHASE ORDER STATUS:
            - Pending: %d
            - Approved: %d
            - Rejected: %d

            Return this exact JSON structure:
            {
              "overallScore": <number 0-10, one decimal>,
              "overallLevel": "<LOW|MEDIUM|HIGH>",
              "suppliers": [
                {"name": "<supplier name>", "score": <0-10>, "rating": <supplier rating>, "level": "<LOW|MEDIUM|HIGH>", "reason": "<one line reason>"}
              ],
              "riskFactors": [
                {"rank": 1, "title": "<risk title>", "description": "<one line description>", "severity": "<LOW|MEDIUM|HIGH>"},
                {"rank": 2, "title": "<risk title>", "description": "<one line description>", "severity": "<LOW|MEDIUM|HIGH>"},
                {"rank": 3, "title": "<risk title>", "description": "<one line description>", "severity": "<LOW|MEDIUM|HIGH>"}
              ],
              "recommendations": [
                {"title": "<action title>", "description": "<one line description>"},
                {"title": "<action title>", "description": "<one line description>"},
                {"title": "<action title>", "description": "<one line description>"}
              ]
            }
            """,
            buildSuppliersDetail(suppliers),
            buildPartsDetail(parts),
            orders.stream().filter(o -> "PENDING".equals(o.getStatus().name())).count(),
            orders.stream().filter(o -> "APPROVED".equals(o.getStatus().name())).count(),
            orders.stream().filter(o -> "REJECTED".equals(o.getStatus().name())).count()
        );

        return callGroq(prompt);
    }

    // ── 7-Day Forecast ───────────────────────────────────────────────────────
    public String getForecast() {
        List<Part> parts = partRepository.findAll();
        List<PurchaseOrder> orders = purchaseOrderRepository.findAll();

        String prompt = String.format("""
            You are a supply chain forecasting expert. Analyze current inventory and respond ONLY with a valid JSON object. No explanation, no markdown, no text outside JSON.

            CURRENT INVENTORY:
            %s

            RECENT PURCHASE ORDERS (last %d orders):
            %s

            Return this exact JSON structure:
            {
              "forecastPeriod": "7 days",
              "criticalParts": [
                {"name": "<part name>", "currentStock": <number>, "daysUntilStockout": <number>, "urgency": "<CRITICAL|HIGH|MEDIUM>"}
              ],
              "reorderSuggestions": [
                {"partName": "<part name>", "suggestedQuantity": <number>, "reason": "<one line reason>"}
              ],
              "dailyRisk": [
                {"day": 1, "label": "Day 1", "riskLevel": "<LOW|MEDIUM|HIGH|CRITICAL>", "note": "<one line>"},
                {"day": 2, "label": "Day 2", "riskLevel": "<LOW|MEDIUM|HIGH|CRITICAL>", "note": "<one line>"},
                {"day": 3, "label": "Day 3", "riskLevel": "<LOW|MEDIUM|HIGH|CRITICAL>", "note": "<one line>"},
                {"day": 4, "label": "Day 4", "riskLevel": "<LOW|MEDIUM|HIGH|CRITICAL>", "note": "<one line>"},
                {"day": 5, "label": "Day 5", "riskLevel": "<LOW|MEDIUM|HIGH|CRITICAL>", "note": "<one line>"},
                {"day": 6, "label": "Day 6", "riskLevel": "<LOW|MEDIUM|HIGH|CRITICAL>", "note": "<one line>"},
                {"day": 7, "label": "Day 7", "riskLevel": "<LOW|MEDIUM|HIGH|CRITICAL>", "note": "<one line>"}
              ],
              "priorityActions": [
                {"priority": 1, "action": "<action description>", "deadline": "<e.g. Today|Day 1-2|This week>"},
                {"priority": 2, "action": "<action description>", "deadline": "<e.g. Today|Day 1-2|This week>"},
                {"priority": 3, "action": "<action description>", "deadline": "<e.g. Today|Day 1-2|This week>"}
              ]
            }
            """,
            buildPartsDetail(parts),
            Math.min(orders.size(), 10),
            buildOrdersDetail(orders.stream().limit(10).toList())
        );

        return callGroq(prompt);
    }

    
    private String callGroq(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);

            Map<String, Object> body = new HashMap<>();
            body.put("model", model);
            body.put("messages", List.of(message));
            body.put("max_tokens", 1500);
            body.put("temperature", 0.2); // lower = more consistent JSON

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                apiUrl, HttpMethod.POST, request, Map.class
            );

            if (response.getBody() != null) {
                List choices = (List) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map choice = (Map) choices.get(0);
                    Map messageResp = (Map) choice.get("message");
                    return (String) messageResp.get("content");
                }
            }
            return "{\"error\": \"AI analysis unavailable. Please try again.\"}";

        } catch (Exception e) {
            return "{\"error\": \"" + e.getMessage().replace("\"", "'") + "\"}";
        }
    }

    // ── Helper Methods ───────────────────────────────────────────────────────
    private String buildPartsDetail(List<Part> parts) {
        StringBuilder sb = new StringBuilder();
        for (Part p : parts) {
            sb.append(String.format("- %s (Code: %s) | Stock: %d | Status: %s | Price: %.2f\n",
                p.getName(), p.getPartCode(), p.getQuantity(),
                p.getStockStatus().name(), p.getUnitPrice()));
        }
        return sb.toString();
    }

    private String buildSuppliersDetail(List<Supplier> suppliers) {
        StringBuilder sb = new StringBuilder();
        for (Supplier s : suppliers) {
            sb.append(String.format("- %s | Status: %s | Rating: %.1f\n",
                s.getName(), s.getStatus().name(),
                s.getRating() != null ? s.getRating() : 0.0));
        }
        return sb.toString();
    }

    private String buildOrdersDetail(List<PurchaseOrder> orders) {
        StringBuilder sb = new StringBuilder();
        for (PurchaseOrder o : orders) {
            sb.append(String.format("- PO: %s | Part: %s | Qty: %d | Status: %s\n",
                o.getPoNumber(),
                o.getPart() != null ? o.getPart().getName() : "N/A",
                o.getQuantity(),
                o.getStatus().name()));
        }
        return sb.toString();
    }
}