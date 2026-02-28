package com.coffee.franchise.api.repository;

import com.coffee.franchise.api.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, UUID> {
    Optional<Inventory> findByWarehouseIdAndIngredientId(UUID warehouseId, UUID ingredientId);

}
