package com.coffee.franchise.api.repository;

import com.coffee.franchise.api.entity.Supplier;
import com.coffee.franchise.api.enums.SupplierStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface SupplierRepository extends JpaRepository<Supplier, UUID> {
    List<Supplier> findByNameContainingIgnoreCase(String keyword);

    @Query("SELECT s FROM Supplier s WHERE s.status = com.coffee.franchise.api.enums.SupplierStatus.ACTIVE")
    List<Supplier> findActiveSuppliers();

    List<Supplier> findByNameContainingIgnoreCaseAndStatus(String keyword, SupplierStatus status);
}
