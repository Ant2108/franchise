package com.coffee.franchise.api.service.Impl;

import com.coffee.franchise.api.dto.Request.WarehouseRequest;
import com.coffee.franchise.api.dto.Response.InventoryListItemResponse;
import com.coffee.franchise.api.dto.Response.InventoryResponse;
import com.coffee.franchise.api.dto.Response.WarehouseResponse;
import com.coffee.franchise.api.entity.Inventory;
import com.coffee.franchise.api.entity.Warehouse;
import com.coffee.franchise.api.enums.WarehouseStatus;
import com.coffee.franchise.api.repository.InventoryRepository;
import com.coffee.franchise.api.repository.WarehouseRepository;
import com.coffee.franchise.api.service.CloudinaryService;
import com.coffee.franchise.api.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final InventoryRepository inventoryRepository;
    @Autowired
    CloudinaryService cloudinaryService;

    // ================= GET BY ID =================
    @Override
    public WarehouseResponse getWarehouse(UUID id) {
        Warehouse warehouse = findActiveWarehouseOrThrow(id);
        return mapToResponse(warehouse);
    }

    // ================= CREATE =================
    @Override
    public WarehouseResponse createWarehouse(WarehouseRequest request)  {
           String imageUrl = null;




        String generatedCode = generateWarehouseCode();

        Warehouse warehouse = Warehouse.builder()
                .code(generatedCode)
                .name(request.getName())
                .location(request.getLocation())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .description(request.getDescription())
                .imageUrl(imageUrl)
                .status(request.getStatus() != null
                        ? request.getStatus()
                        : WarehouseStatus.ACTIVE)
                .managerId(request.getManagerId())
                .deleted(false)
                .build();

        return mapToResponse(warehouseRepository.save(warehouse));
    }

    // ================= UPDATE FULL =================
    @Override
    public WarehouseResponse updateWarehouse(WarehouseRequest request, UUID id) {

        Warehouse warehouse = findActiveWarehouseOrThrow(id);

        warehouse.setName(request.getName());
        warehouse.setLocation(request.getLocation());
        warehouse.setLatitude(request.getLatitude());
        warehouse.setLongitude(request.getLongitude());
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

    @Override
    public List<InventoryListItemResponse> findInventoryByWarehouseId(UUID warehouseId) {
        List<Inventory> inventories = inventoryRepository
                .findByWarehouseId(warehouseId);

        return inventories.stream()
                .map(InventoryServiceImpl.InventoryMapper::toListItem)
                .toList();
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
    @Override
    public WarehouseResponse assignManager(UUID warehouseId, UUID managerId, boolean confirmReplace) {

        Warehouse warehouse = findActiveWarehouseOrThrow(warehouseId);

        // ✅ Unassign
        if (managerId == null) {
            warehouse.setManagerId(null);
            return mapToResponse(warehouseRepository.save(warehouse));
        }

        // ✅ Check manager đang ở warehouse khác
        Warehouse currentWarehouseOfManager = warehouseRepository
                .findByManagerIdAndDeletedFalse(managerId)
                .orElse(null);

        if (currentWarehouseOfManager != null &&
                !currentWarehouseOfManager.getId().equals(warehouseId)) {

            if (!confirmReplace) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Manager is assigned to another warehouse. Confirm to move."
                );
            }

            // 👉 remove khỏi warehouse cũ
            currentWarehouseOfManager.setManagerId(null);
            warehouseRepository.save(currentWarehouseOfManager);
        }

        // ✅ Check warehouse đã có manager chưa
        if (warehouse.getManagerId() != null &&
                !warehouse.getManagerId().equals(managerId)) {

            if (!confirmReplace) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Warehouse already has a manager. Confirm to replace."
                );
            }
        }

        // ✅ Assign
        warehouse.setManagerId(managerId);

        return mapToResponse(warehouseRepository.save(warehouse));
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
                .longitude(warehouse.getLongitude())
                .latitude(warehouse.getLatitude())
                .managerId(warehouse.getManagerId())
                .createdAt(warehouse.getCreatedAt())
                .updatedAt(warehouse.getUpdatedAt())
                .build();
    }
    private String generateWarehouseCode() {

        long count = warehouseRepository.count() + 1;

        return "WH-" + String.format("%03d", count);
    }
}
