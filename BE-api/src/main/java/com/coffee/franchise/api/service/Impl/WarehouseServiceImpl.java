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
    private final CloudinaryService cloudinaryService;

    // ================= GET BY ID =================
    @Override
    public WarehouseResponse getWarehouse(UUID id) {
        return mapToResponse(findActiveWarehouseOrThrow(id));
    }

    // ================= CREATE =================
    @Override
    public WarehouseResponse createWarehouse(WarehouseRequest request) {

        // Validate code (nếu bạn cho nhập code thì check ở đây)
        // if (warehouseRepository.existsByCodeAndDeletedFalse(request.getCode())) { ... }

        String generatedCode = generateWarehouseCode();

        Warehouse warehouse = Warehouse.builder()
                .code(generatedCode)
                .name(request.getName())
                .location(request.getLocation())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .description(request.getDescription())
                .imageUrl(null)
                .status(request.getStatus() != null
                        ? request.getStatus()
                        : WarehouseStatus.ACTIVE)
                .managerId(request.getManagerId())
                .deleted(false)
                .build();

        return mapToResponse(warehouseRepository.save(warehouse));
    }

    // ================= UPDATE =================
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

    // ================= INVENTORY =================
    @Override
    public List<InventoryListItemResponse> findInventoryByWarehouseId(UUID warehouseId) {

        // đảm bảo warehouse chưa bị delete
        findActiveWarehouseOrThrow(warehouseId);

        return inventoryRepository.findByWarehouseId(warehouseId)
                .stream()
                .map(InventoryServiceImpl.InventoryMapper::toListItem)
                .toList();
    }

    // ================= ASSIGN MANAGER =================
    @Override
    public WarehouseResponse assignManager(UUID warehouseId, UUID managerId, boolean confirmReplace) {

        Warehouse warehouse = findActiveWarehouseOrThrow(warehouseId);

        // ===== Unassign =====
        if (managerId == null) {
            warehouse.setManagerId(null);
            return mapToResponse(warehouseRepository.save(warehouse));
        }

        // ===== Check manager đang ở warehouse khác =====
        Warehouse currentWarehouse = warehouseRepository
                .findByManagerIdAndDeletedFalse(managerId)
                .orElse(null);

        if (currentWarehouse != null &&
                !currentWarehouse.getId().equals(warehouseId)) {

            if (!confirmReplace) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Manager is assigned to another warehouse. Confirm to move."
                );
            }

            // remove khỏi warehouse cũ
            currentWarehouse.setManagerId(null);
            warehouseRepository.save(currentWarehouse);
        }

        // ===== Check warehouse đã có manager =====
        if (warehouse.getManagerId() != null &&
                !warehouse.getManagerId().equals(managerId)) {

            if (!confirmReplace) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Warehouse already has a manager. Confirm to replace."
                );
            }
        }

        // ===== Assign =====
        warehouse.setManagerId(managerId);

        return mapToResponse(warehouseRepository.save(warehouse));
    }

    // ================= GET BY MANAGER =================
    @Override
    public WarehouseResponse getByManagerId(UUID managerId) {
        Warehouse warehouse = warehouseRepository
                .findByManagerIdAndDeletedFalse(managerId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Manager chưa được assign warehouse"
                ));

        return mapToResponse(warehouse);
    }

    // ================= COMMON =================
    private Warehouse findActiveWarehouseOrThrow(UUID id) {
        return warehouseRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResponseStatusException(
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
                .longitude(warehouse.getLongitude())
                .latitude(warehouse.getLatitude())
                .managerId(warehouse.getManagerId())
                .createdAt(warehouse.getCreatedAt())
                .updatedAt(warehouse.getUpdatedAt())
                .build();
    }

    // ================= UTIL =================
    private String generateWarehouseCode() {
        return "WH-" + System.currentTimeMillis();
    }
}
