package com.coffee.franchise.api.repository;

import com.coffee.franchise.api.entity.SupplierIngredient;
import com.coffee.franchise.api.enums.SupplierIngredientStatus;
import com.coffee.franchise.api.enums.SupplierStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SupplierIngredientRepository extends JpaRepository<SupplierIngredient, UUID> {
    Optional<SupplierIngredient> findBySupplierIdAndIngredientId(UUID supplierId, UUID ingredientId);

    @Query("SELECT si FROM SupplierIngredient si JOIN FETCH si.ingredient ing " +
            "WHERE si.supplier.id = :supplierId AND si.status = :status")
    List<SupplierIngredient> findAllBySupplierIdAndStatusWithIngredient(
            @Param("supplierId") UUID supplierId,
            @Param("status") SupplierIngredientStatus status
    );

    @Query("SELECT si FROM SupplierIngredient si " +
            "JOIN FETCH si.supplier s " +
            "JOIN FETCH si.ingredient ing " +
            "WHERE si.status = :ingredientStatus AND s.status = :supplierStatus")
    List<SupplierIngredient> findAllMarketplaceItems(
            @Param("ingredientStatus") SupplierIngredientStatus ingredientStatus,
            @Param("supplierStatus") SupplierStatus supplierStatus
    );
}
