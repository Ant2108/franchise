package com.coffee.franchise.api.service.Impl;

import com.coffee.franchise.api.dto.Request.InventoryRequest;
import com.coffee.franchise.api.dto.Response.InventoryResponse;
import com.coffee.franchise.api.entity.Ingredient;
import com.coffee.franchise.api.entity.Inventory;
import com.coffee.franchise.api.entity.Warehouse;
import com.coffee.franchise.api.repository.IngredientRepository;
import com.coffee.franchise.api.repository.InventoryRepository;
import com.coffee.franchise.api.repository.WarehouseRepository;
import com.coffee.franchise.api.service.InventoryServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryServiceInterface {
    private final InventoryRepository inventoryRepository;
    private final WarehouseRepository warehouseRepository;
    private final IngredientRepository ingredientRepository;
@Override
public InventoryResponse addInventory(InventoryRequest request) {

    Inventory exist = inventoryRepository.findByWarehouseIdAndIngredientId(request.getWarehouseId(),
                    request.getIngredientId())

            .orElseGet(() -> {

                Inventory newInventory = new Inventory();

                Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                        .orElseThrow(() -> new IllegalArgumentException("Warehouse not found"));

                Ingredient ingredient = ingredientRepository.findById(request.getIngredientId())
                        .orElseThrow(() -> new IllegalArgumentException("Ingredient not found"));

                newInventory.setWarehouse(warehouse);
                newInventory.setIngredient(ingredient);
                newInventory.setQuantityAvailable(request.getQuantityAvailable());
                newInventory.setQuantityReserved(request.getQuantityReserved());
                return newInventory;
            });

    return InventoryResponse.fromEntity(inventoryRepository.save(exist));
}

    @Override
    public List<InventoryResponse> getItemList() {
        return inventoryRepository.findAllBy().stream().map(InventoryResponse::fromEntity).toList();
    }

    @Override
    public InventoryResponse getItemDetails(UUID item_ID) {
        return inventoryRepository.findById(item_ID).map(InventoryResponse::fromEntity).orElse(null);
    }

    @Override
    public List<InventoryResponse> searchItem(String name) {
        return inventoryRepository.findByIngredientNameContainingIgnoreCase(name).stream().map(InventoryResponse::fromEntity).toList();
    }

    @Override
    public InventoryResponse updateItem(UUID id, InventoryRequest request) {
        Inventory exist = inventoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Inventory not found for ingredient " + id + " in inventory"));

        if (request.getIngredientId() != null) {
            exist.getIngredient().setId(request.getIngredientId());
        }

        if (request.getQuantityAvailable() != null) {
            exist.setQuantityAvailable(request.getQuantityAvailable());
        }

        if (request.getQuantityReserved() != null) {
            exist.setQuantityReserved(request.getQuantityReserved());
        }
        exist.setLastUpdated(LocalDateTime.now());
        return InventoryResponse.fromEntity(inventoryRepository.save(exist));
    }

}
