package com.coffee.franchise.api.service.Impl;

import com.coffee.franchise.api.dto.Request.WarehouseRequest;
import com.coffee.franchise.api.dto.Response.WarehouseResponse;
import com.coffee.franchise.api.entity.Warehouse;
import com.coffee.franchise.api.repository.WarehouseRepository;
import com.coffee.franchise.api.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;

    @Override
    public WarehouseResponse getWarehouse(UUID id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Warehouse not found with id " + id
                        ));

        return mapToResponse(warehouse);
    }

    @Override
    public WarehouseResponse createWarehouse(WarehouseRequest warehouse) {

        Warehouse newWarehouse = Warehouse.builder()
                .name(warehouse.getName())
                .location(warehouse.getLocation())
                .build();

        Warehouse savedWarehouse = warehouseRepository.save(newWarehouse);

        return mapToResponse(savedWarehouse);
    }

    @Override
    public WarehouseResponse updateWarehouse(WarehouseRequest warehouse, UUID id) {

        Warehouse existingWarehouse = warehouseRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Warehouse not found with id " + id
                        ));

        existingWarehouse.setName(warehouse.getName());
        existingWarehouse.setLocation(warehouse.getLocation());
        existingWarehouse.setManagerId(warehouse.getManagerId());
        existingWarehouse.setStatus(warehouse.getStatus());

        Warehouse updatedWarehouse = warehouseRepository.save(existingWarehouse);

        return mapToResponse(updatedWarehouse);
    }

    // ===== Mapper =====
    private WarehouseResponse mapToResponse(Warehouse warehouse) {
        return WarehouseResponse.builder()
                .id(warehouse.getId())
                .name(warehouse.getName())
                .location(warehouse.getLocation())
                .managerId(warehouse.getManagerId())
                .status(String.valueOf(warehouse.getStatus()))
                .build();
    }


}
