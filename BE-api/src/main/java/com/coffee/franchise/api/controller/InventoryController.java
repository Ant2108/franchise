package com.coffee.franchise.api.controller;

import com.coffee.franchise.api.dto.Request.InventoryQuantityRequestDTO;
import com.coffee.franchise.api.dto.Request.ReservationSyncRequestDTO;
import com.coffee.franchise.api.dto.Response.InventoryResponseDTO;
import com.coffee.franchise.api.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

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

    // ================= INCREASE =================
    @PostMapping("/increase")
    public ResponseEntity<InventoryResponseDTO> increaseInventory(
            @Valid @RequestBody InventoryQuantityRequestDTO request
    ) {
        return ResponseEntity.ok(
                inventoryService.increase(request)
        );
    }

    // ================= DECREASE =================
    @PostMapping("/decrease")
    public ResponseEntity<InventoryResponseDTO> decreaseInventory(
            @Valid @RequestBody InventoryQuantityRequestDTO request
    ) {
        return ResponseEntity.ok(
                inventoryService.decrease(request)
        );
    }

    // ================= ADJUST =================
    @PostMapping("/adjust")
    public ResponseEntity<InventoryResponseDTO> adjustInventory(
            @Valid @RequestBody InventoryQuantityRequestDTO request
    ) {
        return ResponseEntity.ok(
                inventoryService.adjust(request)
        );
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