package com.coffee.franchise.api.controller;

import com.coffee.franchise.api.dto.Request.InventoryRequest;
import com.coffee.franchise.api.dto.Response.InventoryResponse;
import com.coffee.franchise.api.dto.Response.LowStockAlertResponse;
import com.coffee.franchise.api.dto.Request.InventoryQuantityRequestDTO;
import com.coffee.franchise.api.dto.Request.ReservationSyncRequestDTO;
import com.coffee.franchise.api.dto.Response.InventoryResponseDTO;
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
    // ================= TRACK =================
    @GetMapping("/track")
    public ResponseEntity<InventoryResponseDTO> trackInventory(
            @RequestParam UUID warehouseId,
            @RequestParam UUID ingredientId
    ) {
        return ResponseEntity.ok(
                inventoryService.track(warehouseId, ingredientId)
        );
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<LowStockAlertResponse>> getLowStockAlerts() {
        List<LowStockAlertResponse> alerts = inventoryService.getLowStockAlerts();
        return ResponseEntity.ok(alerts);
    // ================= INCREASE =================
    @PostMapping("/increase")
    public ResponseEntity<InventoryResponseDTO> increaseInventory(
            @Valid @RequestBody InventoryQuantityRequestDTO request
    ) {
        return ResponseEntity.ok(
                inventoryService.increase(request)
        );
    }

    @GetMapping("/low-stock/warehouse/{warehouseId}")
    public ResponseEntity<List<LowStockAlertResponse>> getLowStockAlertsByWarehouse(@PathVariable UUID warehouseId) {
        List<LowStockAlertResponse> alerts = inventoryService.getLowStockAlertsByWarehouse(warehouseId);
        return ResponseEntity.ok(alerts);
    // ================= DECREASE =================
    @PostMapping("/decrease")
    public ResponseEntity<InventoryResponseDTO> decreaseInventory(
            @Valid @RequestBody InventoryQuantityRequestDTO request
    ) {
        return ResponseEntity.ok(
                inventoryService.decrease(request)
        );
    }

    }

    // ================= RESERVATION SYNC =================
    @PostMapping("/reservation/sync")
    public ResponseEntity<InventoryResponseDTO> syncReservation(
            @Valid @RequestBody ReservationSyncRequestDTO request
    ) {
        return ResponseEntity.ok(
                inventoryService.syncReservation(request)
        );
    }
}