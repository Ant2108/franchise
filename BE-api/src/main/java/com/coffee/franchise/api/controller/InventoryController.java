package com.coffee.franchise.api.controller;

import com.coffee.franchise.api.dto.Request.InventoryRequest;
import com.coffee.franchise.api.dto.Response.InventoryResponse;
import com.coffee.franchise.api.dto.Response.InventoryListItemResponse;
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

    @GetMapping
    public ResponseEntity<List<InventoryListItemResponse>> getInventoryList(
            @RequestHeader(value = "X-Warehouse-Id", required = false) UUID warehouseId
    ) {
        return ResponseEntity.ok(inventoryService.getInventoryList(warehouseId));
    }

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

    @GetMapping("/all")
    public ResponseEntity<List<InventoryResponseDTO>> getAllInventories() {
        return ResponseEntity.ok(inventoryService.getAllInventories());
    }

    @GetMapping("/low-stock/warehouse/{warehouseId}")
    public ResponseEntity<List<LowStockAlertResponse>> getLowStockAlertsByWarehouse(@PathVariable UUID warehouseId) {
        List<LowStockAlertResponse> alerts = inventoryService.getLowStockAlertsByWarehouse(warehouseId);
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/track")
    public ResponseEntity<InventoryResponseDTO> trackInventory(
            @RequestParam UUID warehouseId,
            @RequestParam UUID ingredientId
    ) {
        return ResponseEntity.ok(
                inventoryService.track(warehouseId, ingredientId)
        );
    }

    @PostMapping("/increase")
    public ResponseEntity<InventoryResponseDTO> increaseInventory(
            @Valid @RequestBody InventoryQuantityRequestDTO request
    ) {
        return ResponseEntity.ok(
                inventoryService.increase(request)
        );
    }

    @PostMapping("/decrease")
    public ResponseEntity<InventoryResponseDTO> decreaseInventory(
            @Valid @RequestBody InventoryQuantityRequestDTO request
    ) {
        return ResponseEntity.ok(
                inventoryService.decrease(request)
        );
    }

    @PostMapping("/adjust")
    public ResponseEntity<InventoryResponseDTO> adjustInventory(
            @Valid @RequestBody InventoryQuantityRequestDTO request
    ) {
        return ResponseEntity.ok(
                inventoryService.adjust(request)
        );
    }

    @PostMapping("/reservation/sync")
    public ResponseEntity<InventoryResponseDTO> syncReservation(
            @Valid @RequestBody ReservationSyncRequestDTO request
    ) {
        return ResponseEntity.ok(
                inventoryService.syncReservation(request)
        );
    }

}