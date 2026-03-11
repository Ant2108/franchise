package com.coffee.franchise.api.service.Impl;

import com.coffee.franchise.api.dto.Request.InventoryRequest;
import com.coffee.franchise.api.dto.Response.InventoryListItemResponse;
import com.coffee.franchise.api.dto.Response.InventoryResponse;
import com.coffee.franchise.api.entity.Ingredient;
import com.coffee.franchise.api.entity.Inventory;
import com.coffee.franchise.api.repository.IngredientRepository;
import com.coffee.franchise.api.repository.InventoryRepository;
import com.coffee.franchise.api.repository.SupplierIngredientRepository;
import com.coffee.franchise.api.repository.WarehouseRepository;
import com.coffee.franchise.api.service.InventoryServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryServiceInterface {
    private final InventoryRepository inventoryRepository;
    private final SupplierIngredientRepository supplierIngredientRepository;
    private final IngredientRepository ingredientRepository;

    @Override
    public List<InventoryResponse> getInventoryList(UUID warehouseId) {

        List<Inventory> inventories = warehouseId != null
                ? inventoryRepository.findAllByWarehouseIdWithDetails(warehouseId)
                : inventoryRepository.findAllWithDetails();

        return inventories.stream()
                .map(item -> InventoryResponse.fromEntity(
                        item,
                        getTotalPrice(item.getIngredient().getId())
                ))
                .toList();
    }


    @Override
    public InventoryResponse getItemDetails(UUID itemId) {
        Inventory inventory = inventoryRepository.getById(itemId);
        return InventoryResponse.fromEntity(inventory,getTotalPrice(inventory.getIngredient().getId()));
    }

    @Override
    public List<InventoryResponse> searchItem(String name) {
        return inventoryRepository
                .findByIngredientNameContainingIgnoreCase(name)
                .stream()
                .map(item -> InventoryResponse.fromEntity(
                        item,
                        getTotalPrice(item.getIngredient().getId())
                ))
                .toList();
    }

    @Override
    public InventoryResponse updateItem(UUID id, InventoryRequest request) {
        Inventory exist = inventoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Item don't exist in Inventory"));
        Ingredient ingredient = ingredientRepository.findById(request.getIngredientId()).orElse(exist.getIngredient());
        if (request.getQuantityAvailable() != null) {
            exist.setQuantityAvailable(request.getQuantityAvailable());
        }

        if (request.getQuantityReserved() != null) {
            exist.setQuantityReserved(request.getQuantityReserved());
        }

        exist.setIngredient(ingredient);
        exist.setLastUpdated(LocalDateTime.now());

        return InventoryResponse.fromEntity(inventoryRepository.save(exist),getTotalPrice(exist.getIngredient().getId()));
    }

    private BigDecimal getTotalPrice(UUID ingID){
        return supplierIngredientRepository.getTotalPriceByIngredientId(ingID);
    }
    public class InventoryMapper {

        public static InventoryListItemResponse toListItem(Inventory inventory) {

            return InventoryListItemResponse.builder()
                    .inventoryId(inventory.getId())
                    .warehouseId(inventory.getWarehouse().getId())
                    .ingredientId(inventory.getIngredient().getId())
                    .ingredientName(inventory.getIngredient().getName())
                    .unit(inventory.getIngredient().getUnit())
                    .quantityAvailable(inventory.getQuantityAvailable())
                    .quantityReserved(inventory.getQuantityReserved())
                    .lastUpdated(inventory.getLastUpdated())
                    .build();
        }

    }

}
