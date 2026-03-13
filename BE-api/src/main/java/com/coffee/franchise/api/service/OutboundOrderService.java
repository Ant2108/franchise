package com.coffee.franchise.api.service;

import com.coffee.franchise.api.dto.Request.OutboundOrderRequest;
import com.coffee.franchise.api.dto.Response.OutboundOrderResponse;
import com.coffee.franchise.api.dto.Request.OutboundOrderStatusUpdateRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface OutboundOrderService {

        OutboundOrderResponse createOutboundOrder(OutboundOrderRequest request, MultipartFile file);

        List<OutboundOrderResponse> getAllOutboundOrders();

        List<OutboundOrderResponse> getAllOutboundOrdersByWarehouseId(UUID warehouseId);

        OutboundOrderResponse getOutboundOrderById(UUID id);

        OutboundOrderResponse updateOutboundOrderStatus(UUID id, OutboundOrderStatusUpdateRequest request);
}
