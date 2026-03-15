package com.coffee.franchise.api.controller;

import com.coffee.franchise.api.dto.Request.WarehouseRequest;
import com.coffee.franchise.api.dto.Request.WarehouseUpdateStatusRequest;
import com.coffee.franchise.api.dto.Response.InventoryListItemResponse;
import com.coffee.franchise.api.dto.Response.WarehouseResponse;
import com.coffee.franchise.api.entity.Warehouse;
import com.coffee.franchise.api.enums.WarehouseStatus;
import com.coffee.franchise.api.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/warehouses")
@RequiredArgsConstructor
public class WarehouseController {
    private final WarehouseService warehouseService;
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<WarehouseResponse> getAllWarehouses() {
        return warehouseService.getAllWarehouses();
    }

    @PostMapping
    public WarehouseResponse createWarehouse(@RequestBody WarehouseRequest request)  {
        return warehouseService.createWarehouse(request);
    }
    @GetMapping("/{id}/detail")
    public WarehouseResponse getWarehouseById(@PathVariable UUID id) {
        return warehouseService.getWarehouse(id);
    }

    @PutMapping("/{id}")
    public WarehouseResponse updateWarehouse(@PathVariable UUID id, @RequestBody WarehouseRequest request) {
        return warehouseService.updateWarehouse(request, id);
    }
    @PatchMapping("/{id}")
    public WarehouseResponse updateStatus(@PathVariable UUID id, @RequestBody WarehouseUpdateStatusRequest request) {
        return warehouseService.updateStatus(id, request.getStatus());
    }
    @GetMapping("/{id}/inventory")
    public List<InventoryListItemResponse>  getInventory(@PathVariable UUID id) {
        return warehouseService.findInventoryByWarehouseId(id);
    }
}
