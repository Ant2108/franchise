package com.coffee.franchise.api.service.Impl;

import com.coffee.franchise.api.dto.Response.InventoryLogResponse;
import com.coffee.franchise.api.entity.Ingredient;
import com.coffee.franchise.api.entity.InventoryLog;
import com.coffee.franchise.api.entity.Warehouse;
import com.coffee.franchise.api.enums.TransactionType;
import com.coffee.franchise.api.repository.IngredientRepository;
import com.coffee.franchise.api.repository.InventoryLogRepository;
import com.coffee.franchise.api.repository.WarehouseRepository;
import com.coffee.franchise.api.service.InventoryLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryLogServiceImpl implements InventoryLogService {

    private final InventoryLogRepository inventoryLogRepository;
    private final WarehouseRepository warehouseRepository;
    private final IngredientRepository ingredientRepository;

    @Override
    @Transactional
    public InventoryLogResponse logInventoryChange(UUID warehouseId, UUID ingredientId, TransactionType transactionType, BigDecimal quantityChanged, UUID referenceId) {
        Warehouse warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new IllegalArgumentException("Warehouse not found with id: " + warehouseId));
        Ingredient ingredient = ingredientRepository.findById(ingredientId)
                .orElseThrow(() -> new IllegalArgumentException("Ingredient not found with id: " + ingredientId));

        InventoryLog log = InventoryLog.builder()
                .warehouse(warehouse)
                .ingredient(ingredient)
                .transactionType(transactionType)
                .quantityChanged(quantityChanged)
                .referenceId(referenceId)
                .createdAt(LocalDateTime.now())
                .build();

        InventoryLog savedLog = inventoryLogRepository.save(log);
        return mapToResponse(savedLog);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryLogResponse> getLogsByWarehouseAndIngredient(UUID warehouseId, UUID ingredientId) {
        List<InventoryLog> logs = inventoryLogRepository
                .findByWarehouseIdAndIngredientIdOrderByCreatedAtDesc(warehouseId, ingredientId);
        return logs.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryLogResponse> getLogsByWarehouse(UUID warehouseId) {
        List<InventoryLog> logs = inventoryLogRepository
                .findByWarehouseIdOrderByCreatedAtDesc(warehouseId);
        return logs.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryLogResponse> getLogsByReferenceId(UUID referenceId) {
        List<InventoryLog> logs = inventoryLogRepository
                .findByReferenceIdOrderByCreatedAtDesc(referenceId);
        return logs.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private InventoryLogResponse mapToResponse(InventoryLog log) {
        return InventoryLogResponse.builder()
                .id(log.getId())
                .warehouseId(log.getWarehouse().getId())
                .warehouseName(log.getWarehouse().getName())
                .ingredientId(log.getIngredient().getId())
                .ingredientName(log.getIngredient().getName())
                .transactionType(log.getTransactionType().name())
                .quantityChanged(log.getQuantityChanged())
                .referenceId(log.getReferenceId())
                .createdAt(log.getCreatedAt())
                .build();
    }
}

