package com.coffee.franchise.api.repository;

import com.coffee.franchise.api.entity.InboundOrder;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InboundOrderRepository extends JpaRepository<InboundOrder, UUID> {
    
    @EntityGraph(attributePaths = {"items", "warehouse", "supplier"})
    @NonNull
    List<InboundOrder> findAll();

    @EntityGraph(attributePaths = {"items", "warehouse", "supplier"})
    List<InboundOrder> findByWarehouseId(UUID warehouseId);

    @EntityGraph(attributePaths = {"items", "warehouse", "supplier"})
    @NonNull
    java.util.Optional<InboundOrder> findById(@NonNull UUID id);
}

