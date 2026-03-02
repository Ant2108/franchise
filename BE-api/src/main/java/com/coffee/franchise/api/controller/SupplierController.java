package com.coffee.franchise.api.controller;

import com.coffee.franchise.api.dto.Request.SupplierRequest;
import com.coffee.franchise.api.dto.Response.SupplierResponse;
import com.coffee.franchise.api.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    // S18 & S19 - Create với Validation
    @PostMapping
    public ResponseEntity<SupplierResponse> createSupplier(@Valid @RequestBody SupplierRequest dto) {
        SupplierResponse response = supplierService.createSupplier(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // S20 - Update
    @PutMapping("/{id}")
    public ResponseEntity<SupplierResponse> updateSupplier(
            @PathVariable UUID id,
            @Valid @RequestBody SupplierRequest dto) {
        return ResponseEntity.ok(supplierService.updateSupplier(id, dto));
    }

    // S21 - Get Detail
    @GetMapping("/{id}")
    public ResponseEntity<SupplierResponse> getSupplierDetail(@PathVariable UUID id) {
        return ResponseEntity.ok(supplierService.getSupplierDetail(id));
    }

    // S22 - Search (Sửa lại path và param)
    @GetMapping("/search")
    public ResponseEntity<List<SupplierResponse>> searchSupplier(
            @RequestParam(required = false, defaultValue = "") String keyword) {
        return ResponseEntity.ok(supplierService.searchSupplier(keyword));
    }
}