package com.coffee.franchise.api.controller;

import com.coffee.franchise.api.dto.InboundOrderRequest;
import com.coffee.franchise.api.dto.InboundOrderResponse;
import com.coffee.franchise.api.dto.InboundOrderStatusUpdateRequest;
import com.coffee.franchise.api.service.InboundOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/inbounds")
@RequiredArgsConstructor
public class InboundOrderController {

    private final InboundOrderService inboundOrderService;

    @PostMapping
    public ResponseEntity<InboundOrderResponse> createInboundOrder(@RequestBody InboundOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inboundOrderService.createInboundOrder(request));
    }

    @GetMapping
    public ResponseEntity<List<InboundOrderResponse>> getAllInboundOrders() {
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
