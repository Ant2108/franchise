package com.coffee.franchise.api.service;

import com.coffee.franchise.api.dto.Response.InventoryResponse;
import com.coffee.franchise.api.entity.Ingredient;
import com.coffee.franchise.api.entity.Inventory;
import com.coffee.franchise.api.entity.Warehouse;
import com.coffee.franchise.api.repository.IngredientRepository;
import com.coffee.franchise.api.repository.InventoryRepository;
import com.coffee.franchise.api.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final WarehouseRepository warehouseRepository;
    private final IngredientRepository ingredientRepository;


    @Transactional
    public void addInventory(UUID warehouseId, UUID ingredientId, BigDecimal quantityToAdd) {
        Inventory inventory = inventoryRepository.findByWarehouseIdAndIngredientId(warehouseId, ingredientId)
                .orElseGet(() -> createNewInventory(warehouseId, ingredientId));

        inventory.setQuantityAvailable(inventory.getQuantityAvailable().add(quantityToAdd));
        inventory.setLastUpdated(LocalDateTime.now());

        inventoryRepository.save(inventory);
    }

    @Transactional
    public void reserveInventory(UUID warehouseId, UUID ingredientId, BigDecimal quantityToReserve) {
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
    }

    @Transactional
    public void releaseInventory(UUID warehouseId, UUID ingredientId, BigDecimal quantityToRelease) {
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
}
