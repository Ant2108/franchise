package com.coffee.franchise.api.repository;

import com.coffee.franchise.api.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, UUID> {
    List<Supplier> findByNameContainingIgnoreCase(String name);
}
