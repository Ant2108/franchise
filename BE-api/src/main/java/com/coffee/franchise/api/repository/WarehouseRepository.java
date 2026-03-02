package com.coffee.franchise.api.repository;

import com.coffee.franchise.api.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, UUID> {
    boolean existsByCode(String code);
    List<Warehouse> findByDeletedFalse();
}
