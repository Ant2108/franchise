package com.coffee.franchise.api.service;

import com.coffee.franchise.api.dto.Request.InboundOrderRequest;
import com.coffee.franchise.api.dto.Response.InboundOrderResponse;
import com.coffee.franchise.api.dto.Request.InboundOrderStatusUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface InboundOrderService {

        InboundOrderResponse createInboundOrder(InboundOrderRequest request);

        List<InboundOrderResponse> getAllInboundOrders();

        List<InboundOrderResponse> getAllInboundOrdersByWarehouseId(UUID warehouseId);

        InboundOrderResponse getInboundOrderById(UUID id);

        InboundOrderResponse updateInboundOrderStatus(UUID id, InboundOrderStatusUpdateRequest request);
}
