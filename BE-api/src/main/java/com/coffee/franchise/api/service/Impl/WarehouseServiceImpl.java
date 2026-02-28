package com.coffee.franchise.api.service.Impl;

import com.coffee.franchise.api.dto.Request.WarehouseRequest;
import com.coffee.franchise.api.dto.Response.WarehouseResponse;
import com.coffee.franchise.api.entity.Warehouse;
import com.coffee.franchise.api.enums.WarehouseStatus;
import com.coffee.franchise.api.repository.WarehouseRepository;
import com.coffee.franchise.api.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
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
    public WarehouseResponse createWarehouse(WarehouseRequest request) {
        Warehouse newWarehouse = Warehouse.builder()
                .name(request.getName())
                .location(request.getLocation())
                .managerId(UUID.randomUUID())
                .status(WarehouseStatus.ACTIVE)
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
        Warehouse updatedWarehouse = warehouseRepository.save(existingWarehouse);

        return mapToResponse(updatedWarehouse);
    }

    @Override
    public WarehouseResponse updateStatus(UUID id, WarehouseStatus status) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Warehouse not found with id " + id
                        ));

        warehouse.setStatus(status);

        return mapToResponse(warehouseRepository.save(warehouse));
    }

    @Override
    public List<WarehouseResponse> getAllWarehouses() {
        return warehouseRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
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
    private UUID generateRandomUUID() {
        return UUID.randomUUID();
    }


}
