package com.coffee.franchise.api.repository;

import com.coffee.franchise.api.entity.InventoryLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InventoryLogRepository extends JpaRepository<InventoryLog, UUID> {

    List<InventoryLog> findByWarehouseIdAndIngredientIdOrderByCreatedAtDesc(UUID warehouseId, UUID ingredientId);

    List<InventoryLog> findByWarehouseIdOrderByCreatedAtDesc(UUID warehouseId);

    List<InventoryLog> findByReferenceIdOrderByCreatedAtDesc(UUID referenceId);
}
