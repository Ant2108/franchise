package com.coffee.franchise.api.repository;

import com.coffee.franchise.api.entity.OutboundOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OutboundOrderItemRepository extends JpaRepository<OutboundOrderItem, UUID> {
}
