package com.coffee.franchise.api.repository;

import com.coffee.franchise.api.entity.OutboundOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OutboundOrderRepository extends JpaRepository<OutboundOrder, UUID> {
}
