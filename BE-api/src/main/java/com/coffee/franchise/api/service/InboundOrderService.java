package com.coffee.franchise.api.service;

import com.coffee.franchise.api.dto.InboundOrderRequest;
import com.coffee.franchise.api.dto.InboundOrderResponse;
import com.coffee.franchise.api.dto.InboundOrderStatusUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface InboundOrderService {

        InboundOrderResponse createInboundOrder(InboundOrderRequest request);

        List<InboundOrderResponse> getAllInboundOrders();

        InboundOrderResponse getInboundOrderById(UUID id);

        InboundOrderResponse updateInboundOrderStatus(UUID id, InboundOrderStatusUpdateRequest request);
}
