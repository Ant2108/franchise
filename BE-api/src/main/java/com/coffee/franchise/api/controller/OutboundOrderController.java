package com.coffee.franchise.api.controller;

import com.coffee.franchise.api.dto.Request.OutboundOrderRequest;
import com.coffee.franchise.api.dto.Response.OutboundOrderResponse;
import com.coffee.franchise.api.dto.Request.OutboundOrderStatusUpdateRequest;
import com.coffee.franchise.api.service.OutboundOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/outbounds")
@RequiredArgsConstructor
public class OutboundOrderController {

    private final OutboundOrderService outboundOrderService;

    @PostMapping
    public ResponseEntity<OutboundOrderResponse> createOutboundOrder(
            @RequestHeader(value = "X-Warehouse-Id", required = false) UUID warehouseId,
            @Valid @RequestBody OutboundOrderRequest request) {
        if (warehouseId != null) {
            request.setWarehouseId(warehouseId);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(outboundOrderService.createOutboundOrder(request));
    }

    @GetMapping
    public ResponseEntity<List<OutboundOrderResponse>> getAllOutboundOrders(
            @RequestHeader(value = "X-Warehouse-Id", required = false) UUID warehouseId) {
        if (warehouseId != null) {
            return ResponseEntity.ok(outboundOrderService.getAllOutboundOrdersByWarehouseId(warehouseId));
        }
        return ResponseEntity.ok(outboundOrderService.getAllOutboundOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OutboundOrderResponse> getOutboundOrderById(@PathVariable UUID id) {
        return ResponseEntity.ok(outboundOrderService.getOutboundOrderById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OutboundOrderResponse> updateOutboundOrderStatus(@PathVariable UUID id,
            @RequestBody OutboundOrderStatusUpdateRequest request) {
        return ResponseEntity.ok(outboundOrderService.updateOutboundOrderStatus(id, request));
    }
}
