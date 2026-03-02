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

    // ================= GET BY ID =================
    @Override
    public WarehouseResponse getWarehouse(UUID id) {
        Warehouse warehouse = findActiveWarehouseOrThrow(id);
        return mapToResponse(warehouse);
    }

    // ================= CREATE =================
    @Override
    public WarehouseResponse createWarehouse(WarehouseRequest request) {

        if (warehouseRepository.existsByCode(request.getCode())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Warehouse code already exists"
            );
        }

        Warehouse warehouse = Warehouse.builder()
                .code(request.getCode())
                .name(request.getName())
                .location(request.getLocation())
                .description(request.getDescription())
                .status(request.getStatus() != null
                        ? request.getStatus()
                        : WarehouseStatus.ACTIVE)
                .managerId(UUID.randomUUID())
                .deleted(false)
                .build();

        return mapToResponse(warehouseRepository.save(warehouse));
    }

    // ================= UPDATE FULL =================
    @Override
    public WarehouseResponse updateWarehouse(WarehouseRequest request, UUID id) {

        Warehouse warehouse = findActiveWarehouseOrThrow(id);

        warehouse.setCode(request.getCode());
        warehouse.setName(request.getName());
        warehouse.setLocation(request.getLocation());
        warehouse.setDescription(request.getDescription());
        warehouse.setStatus(request.getStatus());

        return mapToResponse(warehouseRepository.save(warehouse));
    }

    // ================= UPDATE STATUS =================
    @Override
    public WarehouseResponse updateStatus(UUID id, WarehouseStatus status) {

        Warehouse warehouse = findActiveWarehouseOrThrow(id);

        warehouse.setStatus(status);

        return mapToResponse(warehouseRepository.save(warehouse));
    }

    // ================= GET ALL =================
    @Override
    public List<WarehouseResponse> getAllWarehouses() {
        return warehouseRepository.findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ================= SOFT DELETE =================
    @Override
    public void deleteWarehouse(UUID id) {
        Warehouse warehouse = findActiveWarehouseOrThrow(id);
        warehouse.setDeleted(true);
        warehouseRepository.save(warehouse);
    }

    // ================= COMMON METHOD =================
    private Warehouse findActiveWarehouseOrThrow(UUID id) {
        return warehouseRepository.findById(id)
                .filter(w -> !Boolean.TRUE.equals(w.getDeleted()))
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Warehouse not found with id " + id
                        ));
    }

    // ================= MAPPER =================
    private WarehouseResponse mapToResponse(Warehouse warehouse) {

        return WarehouseResponse.builder()
                .id(warehouse.getId())
                .code(warehouse.getCode())
                .name(warehouse.getName())
                .location(warehouse.getLocation())
                .description(warehouse.getDescription())
                .status(warehouse.getStatus())

                .managerId(warehouse.getManagerId())
                .createdAt(warehouse.getCreatedAt())
                .updatedAt(warehouse.getUpdatedAt())
                .build();
    }
}
