package com.coffee.franchise.api.controller;

import com.coffee.franchise.api.dto.Request.InventoryRequest;
import com.coffee.franchise.api.dto.Response.InventoryResponse;
import com.coffee.franchise.api.dto.Response.LowStockAlertResponse;
import com.coffee.franchise.api.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping("/add")
    public ResponseEntity<InventoryResponse> addInventory(@Valid @RequestBody InventoryRequest request) {
        InventoryResponse response = inventoryService.addInventory(request.getWarrehouseId(), request.getIngredientId(), request.getQuantitytoAdd());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<LowStockAlertResponse>> getLowStockAlerts() {
        List<LowStockAlertResponse> alerts = inventoryService.getLowStockAlerts();
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/low-stock/warehouse/{warehouseId}")
    public ResponseEntity<List<LowStockAlertResponse>> getLowStockAlertsByWarehouse(@PathVariable UUID warehouseId) {
        List<LowStockAlertResponse> alerts = inventoryService.getLowStockAlertsByWarehouse(warehouseId);
        return ResponseEntity.ok(alerts);
    }

}
