package com.coffee.franchise.api.repository;

import com.coffee.franchise.api.entity.SupplierIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SupplierIngredientRepository extends JpaRepository<SupplierIngredient, UUID> {
    Optional<SupplierIngredient> findBySupplierIdAndIngredientId(UUID supplierId, UUID ingredientId);
}
