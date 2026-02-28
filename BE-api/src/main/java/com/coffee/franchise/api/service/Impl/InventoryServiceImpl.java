package com.coffee.franchise.api.service.Impl;

import com.coffee.franchise.api.dto.Request.InventoryQuantityRequestDTO;
import com.coffee.franchise.api.dto.Request.ReservationSyncRequestDTO;
import com.coffee.franchise.api.dto.Response.InventoryResponseDTO;
import com.coffee.franchise.api.entity.Ingredient;
import com.coffee.franchise.api.entity.Inventory;
import com.coffee.franchise.api.entity.Warehouse;
import com.coffee.franchise.api.repository.IngredientRepository;
import com.coffee.franchise.api.repository.InventoryRepository;
import com.coffee.franchise.api.repository.WarehouseRepository;
import com.coffee.franchise.api.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

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

    @Override
    @Transactional(readOnly = true)
    public InventoryResponseDTO track(UUID warehouseId, UUID ingredientId) {

        Inventory inventory = inventoryRepository
                .findByWarehouseIdAndIngredientId(warehouseId, ingredientId)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        return InventoryResponseDTO.builder()
                .inventoryId(inventory.getId())
                .warehouseId(inventory.getWarehouse().getId())
                .ingredientId(inventory.getIngredient().getId())
                .quantityAvailable(inventory.getQuantityAvailable())
                .quantityReserved(inventory.getQuantityReserved())
                .lastUpdated(inventory.getLastUpdated())
                .build();
    }

    // ================= INCREASE =================
    @Override
    @Transactional
    public InventoryResponseDTO increase(InventoryQuantityRequestDTO request) {

        Inventory inventory = inventoryRepository
                .findByWarehouseIdAndIngredientId(
                        request.getWarehouseId(),
                        request.getIngredientId()
                )
                .orElseGet(() -> {

                    Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                            .orElseThrow(() -> new RuntimeException("Warehouse not found"));

                    Ingredient ingredient = ingredientRepository.findById(request.getIngredientId())
                            .orElseThrow(() -> new RuntimeException("Ingredient not found"));

                    return Inventory.builder()
                            .warehouse(warehouse)
                            .ingredient(ingredient)
                            .quantityAvailable(BigDecimal.ZERO)
                            .quantityReserved(BigDecimal.ZERO)
                            .lastUpdated(LocalDateTime.now())
                            .build();
                });

        inventory.setQuantityAvailable(
                inventory.getQuantityAvailable().add(request.getQuantity())
        );
        inventory.setLastUpdated(LocalDateTime.now());

        inventoryRepository.save(inventory);

        return InventoryResponseDTO.builder()
                .inventoryId(inventory.getId())
                .warehouseId(inventory.getWarehouse().getId())
                .ingredientId(inventory.getIngredient().getId())
                .quantityAvailable(inventory.getQuantityAvailable())
                .quantityReserved(inventory.getQuantityReserved())
                .lastUpdated(inventory.getLastUpdated())
                .build();
    }

    // ================= DECREASE =================
    @Override
    @Transactional
    public InventoryResponseDTO decrease(InventoryQuantityRequestDTO request) {

        Inventory inventory = inventoryRepository
                .findByWarehouseIdAndIngredientId(
                        request.getWarehouseId(),
                        request.getIngredientId()
                )
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        if (inventory.getQuantityAvailable().compareTo(request.getQuantity()) < 0) {
            throw new RuntimeException("Not enough stock");
        }

        inventory.setQuantityAvailable(
                inventory.getQuantityAvailable().subtract(request.getQuantity())
        );
        inventory.setLastUpdated(LocalDateTime.now());

        inventoryRepository.save(inventory);

        return InventoryResponseDTO.builder()
                .inventoryId(inventory.getId())
                .warehouseId(inventory.getWarehouse().getId())
                .ingredientId(inventory.getIngredient().getId())
                .quantityAvailable(inventory.getQuantityAvailable())
                .quantityReserved(inventory.getQuantityReserved())
                .lastUpdated(inventory.getLastUpdated())
                .build();
    }

    // ================= ADJUST =================
    @Override
    @Transactional
    public InventoryResponseDTO adjust(InventoryQuantityRequestDTO request) {

        Inventory inventory = inventoryRepository
                .findByWarehouseIdAndIngredientId(
                        request.getWarehouseId(),
                        request.getIngredientId()
                )
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        inventory.setQuantityAvailable(request.getQuantity());
        inventory.setLastUpdated(LocalDateTime.now());

        inventoryRepository.save(inventory);

        return InventoryResponseDTO.builder()
                .inventoryId(inventory.getId())
                .warehouseId(inventory.getWarehouse().getId())
                .ingredientId(inventory.getIngredient().getId())
                .quantityAvailable(inventory.getQuantityAvailable())
                .quantityReserved(inventory.getQuantityReserved())
                .lastUpdated(inventory.getLastUpdated())
                .build();
    }

    // ================= RESERVATION =================
    @Override
    @Transactional
    public InventoryResponseDTO syncReservation(ReservationSyncRequestDTO request) {

        Inventory inventory = inventoryRepository
                .findByWarehouseIdAndIngredientId(
                        request.getWarehouseId(),
                        request.getIngredientId()
                )
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        BigDecimal quantity = request.getQuantity();

        switch (request.getAction()) {

            case RESERVE -> {
                if (inventory.getQuantityAvailable().compareTo(quantity) < 0) {
                    throw new RuntimeException("Not enough stock to reserve");
                }

                inventory.setQuantityAvailable(
                        inventory.getQuantityAvailable().subtract(quantity)
                );
                inventory.setQuantityReserved(
                        inventory.getQuantityReserved().add(quantity)
                );
            }

            case RELEASE -> {
                if (inventory.getQuantityReserved().compareTo(quantity) < 0) {
                    throw new RuntimeException("Reserved not enough to release");
                }

                inventory.setQuantityReserved(
                        inventory.getQuantityReserved().subtract(quantity)
                );
                inventory.setQuantityAvailable(
                        inventory.getQuantityAvailable().add(quantity)
                );
            }
        }

        inventory.setLastUpdated(LocalDateTime.now());
        inventoryRepository.save(inventory);

        return InventoryResponseDTO.builder()
                .inventoryId(inventory.getId())
                .warehouseId(inventory.getWarehouse().getId())
                .ingredientId(inventory.getIngredient().getId())
                .quantityAvailable(inventory.getQuantityAvailable())
                .quantityReserved(inventory.getQuantityReserved())
                .lastUpdated(inventory.getLastUpdated())
                .build();
    }
}
