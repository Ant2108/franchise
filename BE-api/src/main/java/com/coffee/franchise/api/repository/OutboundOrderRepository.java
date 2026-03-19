package com.coffee.franchise.api.repository;

import com.coffee.franchise.api.entity.OutboundOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OutboundOrderRepository extends JpaRepository<OutboundOrder, UUID> {
    List<OutboundOrder> findByWarehouseId(UUID warehouseId);
    java.util.Optional<OutboundOrder> findByWarehouseIdAndBatchCode(UUID warehouseId, String batchCode);
}
