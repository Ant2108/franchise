package com.coffee.franchise.api.controller;

import com.coffee.franchise.api.dto.Response.InventoryLogResponse;
import com.coffee.franchise.api.service.InventoryLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/inventory-logs")
@RequiredArgsConstructor
public class InventoryLogController {

    private final InventoryLogService inventoryLogService;

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<InventoryLogResponse>> getLogsByWarehouse(@PathVariable UUID warehouseId) {
        List<InventoryLogResponse> logs = inventoryLogService.getLogsByWarehouse(warehouseId);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/warehouse/{warehouseId}/ingredient/{ingredientId}")
    public ResponseEntity<List<InventoryLogResponse>> getLogsByWarehouseAndIngredient(@PathVariable UUID warehouseId, @PathVariable UUID ingredientId) {
        List<InventoryLogResponse> logs = inventoryLogService.getLogsByWarehouseAndIngredient(warehouseId, ingredientId);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/warehouse/get-all")
    public ResponseEntity<List<InventoryLogResponse>> getAllInventoryLogs() {
        List<InventoryLogResponse> logs = inventoryLogService.getAllInventoryLogs();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/reference/{referenceId}")
    public ResponseEntity<List<InventoryLogResponse>> getLogsByReferenceId(@PathVariable UUID referenceId) {
        List<InventoryLogResponse> logs = inventoryLogService.getLogsByReferenceId(referenceId);
        return ResponseEntity.ok(logs);
    }
}

