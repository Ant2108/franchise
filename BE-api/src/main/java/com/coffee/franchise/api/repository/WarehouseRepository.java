package com.coffee.franchise.api.repository;

import com.coffee.franchise.api.entity.Warehouse;
import jakarta.persistence.Id;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, UUID> {
    boolean existsByCodeAndDeletedFalse(String code);
    List<Warehouse> findByDeletedFalse();
    Optional<Warehouse> findByIdAndDeletedFalse(UUID id);
    Optional<Warehouse> findByManagerIdAndDeletedFalse(UUID managerId);
}
