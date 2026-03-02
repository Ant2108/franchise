package com.coffee.franchise.api.controller;

import com.coffee.franchise.api.dto.Request.InboundOrderRequest;
import com.coffee.franchise.api.dto.Response.InboundOrderResponse;
import com.coffee.franchise.api.dto.Request.InboundOrderStatusUpdateRequest;
import com.coffee.franchise.api.service.InboundOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/inbounds")
@RequiredArgsConstructor
public class InboundOrderController {

    private final InboundOrderService inboundOrderService;

    @PostMapping
    public ResponseEntity<InboundOrderResponse> createInboundOrder(
            @RequestHeader(value = "X-Warehouse-Id", required = false) UUID warehouseId,
            @Valid @RequestBody InboundOrderRequest request) {
        if (warehouseId != null) {
            request.setWarehouseId(warehouseId);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(inboundOrderService.createInboundOrder(request));
    }

    @GetMapping
    public ResponseEntity<List<InboundOrderResponse>> getAllInboundOrders(
            @RequestHeader(value = "X-Warehouse-Id", required = false) UUID warehouseId) {
        if (warehouseId != null) {
            return ResponseEntity.ok(inboundOrderService.getAllInboundOrdersByWarehouseId(warehouseId));
        }
        return ResponseEntity.ok(inboundOrderService.getAllInboundOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InboundOrderResponse> getInboundOrderById(@PathVariable UUID id) {
        return ResponseEntity.ok(inboundOrderService.getInboundOrderById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<InboundOrderResponse> updateInboundOrderStatus(@PathVariable UUID id,
            @RequestBody InboundOrderStatusUpdateRequest request) {
        return ResponseEntity.ok(inboundOrderService.updateInboundOrderStatus(id, request));
    }
}
