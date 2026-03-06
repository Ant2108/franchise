package com.coffee.franchise.api.service.Impl;

import com.coffee.franchise.api.dto.Response.SupplierResponse;
import com.coffee.franchise.api.dto.Response.WarehouseResponse;
import com.coffee.franchise.api.service.SupplierService;
import com.coffee.franchise.api.service.WarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    @Autowired
    private WarehouseService warehouseService;

    private final RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private SupplierService supplierService;

    public String chat(String message) {

        List<WarehouseResponse> warehouses =
                warehouseService.getAllWarehouses();

        StringBuilder warehouseText = new StringBuilder();

        for (WarehouseResponse w : warehouses) {

            warehouseText.append("Warehouse: ")
                    .append(w.getName())
                    .append(", Status: ")
                    .append(w.getStatus())
                    .append(", Address: ")
                    .append(w.getLocation())
                    .append("\n");
        }

        List<SupplierResponse> suppliers =
                supplierService.getAllSuppliers();
        StringBuilder supplierText = new StringBuilder();
        for (SupplierResponse s : suppliers) {
            supplierText.append("Supplier: ")
                    .append(s.getName())
                    .append("ContactName:")
                    .append(s.getContactName())
                    .append("PhoneNumber:")
                    .append(s.getPhone())
                    .append(", Address: ")
                    .append(s.getAddress())
                    .append("\n");

        }


        String prompt = """
        You are an AI assistant for a Coffee Franchise Supply Chain System.
        
        You have access to system data below.
        
        IMPORTANT RULES:
        - Only answer the user's question.
        - Only use the data relevant to the question.
        - Do NOT explain unrelated data.
        - Keep answers short and direct.
        
        ========================
        Warehouse Data:
        %s
        
        ========================
        Supplier Data:
        %s
        
        ========================
        User Question:
        %s
        """.formatted(
                        warehouseText.toString(),
                        supplierText.toString(),
                        message
                );

        String url = "http://localhost:11434/api/generate";

        Map<String, Object> body = new HashMap<>();
        body.put("model", "llama3");
        body.put("prompt", prompt);
        body.put("stream", false);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(url, request, Map.class);

        return response.getBody().get("response").toString();
    }
}