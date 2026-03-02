package com.coffee.franchise.api.service;

import com.coffee.franchise.api.dto.Request.InventoryRequest;
import com.coffee.franchise.api.dto.Response.InventoryResponse;
import com.coffee.franchise.api.dto.Response.LowStockAlertResponse;
import com.coffee.franchise.api.entity.Ingredient;
import com.coffee.franchise.api.entity.Inventory;
import com.coffee.franchise.api.entity.Warehouse;
import com.coffee.franchise.api.enums.TransactionType;
import com.coffee.franchise.api.repository.IngredientRepository;
import com.coffee.franchise.api.repository.InventoryRepository;
import com.coffee.franchise.api.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final WarehouseRepository warehouseRepository;
    private final IngredientRepository ingredientRepository;
    private final InventoryLogService inventoryLogService;

    @Transactional
    public InventoryResponse getInventory(UUID warehouseId, UUID ingredientId) {
        Inventory inventory = inventoryRepository.findByWarehouseIdAndIngredientId(warehouseId, ingredientId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Inventory not found for ingredient " + ingredientId + " in warehouse " + warehouseId));

        return InventoryResponse.builder()
                .warehouseId(warehouseId)
                .ingredientId(ingredientId)
                .quantityAvailable(inventory.getQuantityAvailable())
                .quantityReserved(inventory.getQuantityReserved())
                .lastUpdated(inventory.getLastUpdated())
                .build();
    }

    @Transactional
    public InventoryResponse addInventory(UUID warehouseId, UUID ingredientId, BigDecimal quantityToAdd) {
        Inventory inventory = inventoryRepository.findByWarehouseIdAndIngredientId(warehouseId, ingredientId)
                .orElseGet(() -> createNewInventory(warehouseId, ingredientId));

        inventory.setQuantityAvailable(inventory.getQuantityAvailable().add(quantityToAdd));
        inventory.setLastUpdated(LocalDateTime.now());

        inventoryRepository.save(inventory);

        // Log the inventory change
        inventoryLogService.logInventoryChange(warehouseId, ingredientId,
                TransactionType.INBOUND, quantityToAdd, null);

        return InventoryResponse.builder()
                .warehouseId(warehouseId)
                .ingredientId(ingredientId)
                .quantityAvailable(inventory.getQuantityAvailable())
                .quantityReserved(inventory.getQuantityReserved())
                .lastUpdated(inventory.getLastUpdated())
                .build();
    }

    @Transactional
    public InventoryResponse reserveInventory(UUID warehouseId, UUID ingredientId, BigDecimal quantityToReserve) {
        Inventory inventory = inventoryRepository.findByWarehouseIdAndIngredientId(warehouseId, ingredientId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Inventory not found for ingredient " + ingredientId + " in warehouse " + warehouseId));

        if (inventory.getQuantityAvailable().compareTo(quantityToReserve) < 0) {
            throw new IllegalArgumentException("Not enough available quantity for ingredient " + ingredientId);
        }

        inventory.setQuantityAvailable(inventory.getQuantityAvailable().subtract(quantityToReserve));
        inventory.setQuantityReserved(inventory.getQuantityReserved().add(quantityToReserve));
        inventory.setLastUpdated(LocalDateTime.now());

        inventoryRepository.save(inventory);

        // Log the reservation (negative change on available stock)
        inventoryLogService.logInventoryChange(warehouseId, ingredientId,
                TransactionType.OUTBOUND, quantityToReserve.negate(), null);

        // Check for low stock after reservation
        checkAndLogLowStock(inventory);

        return InventoryResponse.builder()
                .warehouseId(warehouseId)
                .ingredientId(ingredientId)
                .quantityAvailable(inventory.getQuantityAvailable())
                .quantityReserved(inventory.getQuantityReserved())
                .lastUpdated(inventory.getLastUpdated())
                .build();
    }

    @Transactional
    public InventoryResponse releaseInventory(UUID warehouseId, UUID ingredientId, BigDecimal quantityToRelease) {
        Inventory inventory = inventoryRepository.findByWarehouseIdAndIngredientId(warehouseId, ingredientId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Inventory not found for ingredient " + ingredientId + " in warehouse " + warehouseId));

        if (inventory.getQuantityReserved().compareTo(quantityToRelease) < 0) {
            throw new IllegalArgumentException(
                    "Reserved quantity is less than release quantity for ingredient " + ingredientId);
        }

        inventory.setQuantityReserved(inventory.getQuantityReserved().subtract(quantityToRelease));
        inventory.setQuantityAvailable(inventory.getQuantityAvailable().add(quantityToRelease));
        inventory.setLastUpdated(LocalDateTime.now());

        inventoryRepository.save(inventory);

        // Log the release (positive adjustment back to available)
        inventoryLogService.logInventoryChange(warehouseId, ingredientId,
                TransactionType.ADJUSTMENT, quantityToRelease, null);

        return InventoryResponse.builder()
                .warehouseId(warehouseId)
                .ingredientId(ingredientId)
                .quantityAvailable(inventory.getQuantityAvailable())
                .quantityReserved(inventory.getQuantityReserved())
                .lastUpdated(inventory.getLastUpdated())
                .build();
    }

    @Transactional
    public void confirmOutboundInventory(UUID warehouseId, UUID ingredientId, BigDecimal quantityToOutbound) {
        Inventory inventory = inventoryRepository.findByWarehouseIdAndIngredientId(warehouseId, ingredientId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Inventory not found for ingredient " + ingredientId + " in warehouse " + warehouseId));

        if (inventory.getQuantityReserved().compareTo(quantityToOutbound) < 0) {
            throw new IllegalArgumentException(
                    "Reserved quantity is less than outbound quantity for ingredient " + ingredientId);
        }

        inventory.setQuantityReserved(inventory.getQuantityReserved().subtract(quantityToOutbound));
        inventory.setLastUpdated(LocalDateTime.now());

        inventoryRepository.save(inventory);

        // Log the confirmed outbound dispatch
        inventoryLogService.logInventoryChange(warehouseId, ingredientId,
                TransactionType.ORDER_DISPATCH, quantityToOutbound.negate(), null);

        // Check for low stock after outbound
        checkAndLogLowStock(inventory);
    }

    private Inventory createNewInventory(UUID warehouseId, UUID ingredientId) {
        Warehouse warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new IllegalArgumentException("Warehouse not found with id: " + warehouseId));
        Ingredient ingredient = ingredientRepository.findById(ingredientId)
                .orElseThrow(() -> new IllegalArgumentException("Ingredient not found with id: " + ingredientId));

        return Inventory.builder()
                .warehouse(warehouse)
                .ingredient(ingredient)
                .quantityAvailable(BigDecimal.ZERO)
                .quantityReserved(BigDecimal.ZERO)
                .lastUpdated(LocalDateTime.now())
                .build();
    }


    @Transactional(readOnly = true)
    public List<LowStockAlertResponse> getLowStockAlerts() {
        List<Inventory> lowStockItems = inventoryRepository.findAllLowStock();
        return lowStockItems.stream()
                .map(this::mapToLowStockAlert)
                .collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
    public List<LowStockAlertResponse> getLowStockAlertsByWarehouse(UUID warehouseId) {
        List<Inventory> lowStockItems = inventoryRepository.findLowStockByWarehouseId(warehouseId);
        return lowStockItems.stream()
                .map(this::mapToLowStockAlert)
                .collect(Collectors.toList());
    }


    private void checkAndLogLowStock(Inventory inventory) {
        Ingredient ingredient = inventory.getIngredient();
        if (ingredient.getAlertThreshold() != null
                && inventory.getQuantityAvailable().compareTo(ingredient.getAlertThreshold()) <= 0) {
            log.warn("LOW STOCK ALERT: Ingredient '{}' in warehouse '{}' has quantity {} (threshold: {})",
                    ingredient.getName(),
                    inventory.getWarehouse().getName(),
                    inventory.getQuantityAvailable(),
                    ingredient.getAlertThreshold());
        }
    }

    private LowStockAlertResponse mapToLowStockAlert(Inventory inventory) {
        Ingredient ingredient = inventory.getIngredient();
        return LowStockAlertResponse.builder()
                .warehouseId(inventory.getWarehouse().getId())
                .warehouseName(inventory.getWarehouse().getName())
                .ingredientId(ingredient.getId())
                .ingredientName(ingredient.getName())
                .ingredientUnit(ingredient.getUnit())
                .quantityAvailable(inventory.getQuantityAvailable())
                .alertThreshold(ingredient.getAlertThreshold())
                .deficit(ingredient.getAlertThreshold().subtract(inventory.getQuantityAvailable()))
                .build();
    }


}
