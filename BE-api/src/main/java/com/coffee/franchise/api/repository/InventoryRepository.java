package com.coffee.franchise.api.repository;

import com.coffee.franchise.api.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, UUID> {
    Optional<Inventory> findByWarehouseIdAndIngredientId(UUID warehouseId, UUID ingredientId);
<<<<<<< HEAD
    List<Inventory> findAllBy();
    Optional<Inventory> findById(UUID id);

    List<Inventory> findByIngredientNameContainingIgnoreCase(String ingredientName);
=======

    List<Inventory> findByWarehouseId(UUID warehouseId);

    @Query("SELECT i FROM Inventory i JOIN FETCH i.ingredient ing JOIN FETCH i.warehouse w")
    List<Inventory> findAllWithDetails();

    @Query("SELECT i FROM Inventory i JOIN FETCH i.ingredient ing JOIN FETCH i.warehouse w WHERE w.id = :warehouseId")
    List<Inventory> findAllByWarehouseIdWithDetails(@Param("warehouseId") UUID warehouseId);

    @Query("SELECT i FROM Inventory i JOIN FETCH i.ingredient ing JOIN FETCH i.warehouse w " +
           "WHERE i.quantityAvailable <= ing.alertThreshold AND ing.alertThreshold IS NOT NULL")
    List<Inventory> findAllLowStock();

    @Query("SELECT i FROM Inventory i JOIN FETCH i.ingredient ing JOIN FETCH i.warehouse w " +
           "WHERE w.id = :warehouseId AND i.quantityAvailable <= ing.alertThreshold AND ing.alertThreshold IS NOT NULL")
    List<Inventory> findLowStockByWarehouseId(@Param("warehouseId") UUID warehouseId);



>>>>>>> aa90a4dc28b5ffd5de1131d84a7daabd39e4d12d
}
