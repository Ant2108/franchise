package com.coffee.franchise.api.service;

import com.coffee.franchise.api.dto.Request.WarehouseRequest;
import com.coffee.franchise.api.dto.Response.WarehouseResponse;
import com.coffee.franchise.api.entity.Warehouse;
import com.coffee.franchise.api.enums.WarehouseStatus;

import java.util.List;
import java.util.UUID;

public interface WarehouseService {

    WarehouseResponse getWarehouse(UUID id);
    WarehouseResponse createWarehouse(WarehouseRequest warehouse);
    WarehouseResponse updateWarehouse(WarehouseRequest warehouse,UUID id);
    WarehouseResponse updateStatus(UUID id, WarehouseStatus status);
    List<WarehouseResponse> getAllWarehouses();
    void deleteWarehouse(UUID id);

}
