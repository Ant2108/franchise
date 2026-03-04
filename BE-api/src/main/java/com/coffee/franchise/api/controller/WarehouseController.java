package com.coffee.franchise.api.controller;

import com.coffee.franchise.api.dto.Request.WarehouseRequest;
import com.coffee.franchise.api.dto.Response.WarehouseResponse;
import com.coffee.franchise.api.entity.Warehouse;
import com.coffee.franchise.api.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/warehouses")
@RequiredArgsConstructor
public class WarehouseController {
    private final WarehouseService warehouseService;

    @PostMapping
    public WarehouseResponse createWarehouse(@RequestBody WarehouseRequest warehouse) {
        return warehouseService.createWarehouse(warehouse);
    }

    @GetMapping("/{id}/detail")
    public WarehouseResponse getWarehouseById(@PathVariable UUID id) {
        return warehouseService.getWarehouse(id);
    }
}
