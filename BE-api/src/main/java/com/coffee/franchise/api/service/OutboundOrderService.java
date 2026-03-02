package com.coffee.franchise.api.service;

import com.coffee.franchise.api.dto.OutboundOrderRequest;
import com.coffee.franchise.api.dto.OutboundOrderResponse;
import com.coffee.franchise.api.dto.OutboundOrderStatusUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface OutboundOrderService {

        OutboundOrderResponse createOutboundOrder(OutboundOrderRequest request);

        List<OutboundOrderResponse> getAllOutboundOrders();

        OutboundOrderResponse getOutboundOrderById(UUID id);

        OutboundOrderResponse updateOutboundOrderStatus(UUID id, OutboundOrderStatusUpdateRequest request);
}
