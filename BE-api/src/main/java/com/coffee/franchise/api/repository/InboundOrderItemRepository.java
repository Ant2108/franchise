package com.coffee.franchise.api.repository;

import com.coffee.franchise.api.entity.InboundOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface InboundOrderItemRepository extends JpaRepository<InboundOrderItem, UUID> {
}
