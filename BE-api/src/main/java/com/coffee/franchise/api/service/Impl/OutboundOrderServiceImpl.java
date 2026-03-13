package com.coffee.franchise.api.service.Impl;

import com.cloudinary.Cloudinary;
import com.coffee.franchise.api.dto.Request.OutboundOrderRequest;
import com.coffee.franchise.api.dto.Response.OutboundOrderResponse;
import com.coffee.franchise.api.dto.Request.OutboundOrderStatusUpdateRequest;
import com.coffee.franchise.api.entity.OutboundOrder;
import com.coffee.franchise.api.entity.OutboundOrderItem;
import com.coffee.franchise.api.enums.OutboundOrderStatus;
import com.coffee.franchise.api.repository.IngredientRepository;
import com.coffee.franchise.api.repository.OutboundOrderItemRepository;
import com.coffee.franchise.api.repository.OutboundOrderRepository;
import com.coffee.franchise.api.repository.WarehouseRepository;
import com.coffee.franchise.api.service.CloudinaryService;
import com.coffee.franchise.api.service.InventoryService;
import com.coffee.franchise.api.service.OutboundOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OutboundOrderServiceImpl implements OutboundOrderService {

    private final OutboundOrderRepository outboundOrderRepository;
    private final OutboundOrderItemRepository outboundOrderItemRepository;
    private final WarehouseRepository warehouseRepository;
    private final IngredientRepository ingredientRepository;
    private final InventoryService inventoryService;
    private final CloudinaryService cloudinary;

    @Override
    @Transactional
    public OutboundOrderResponse createOutboundOrder(OutboundOrderRequest request, MultipartFile file) {
        OutboundOrder order = OutboundOrder.builder()
                .warehouse(warehouseRepository.findById(request.getWarehouseId())
                        .filter(w -> !Boolean.TRUE.equals(w.getDeleted()))
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Warehouse not found or deleted")))
                .destinationFranchiseId(request.getDestinationFranchiseId())
                .status(OutboundOrderStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        OutboundOrder savedOrder = outboundOrderRepository.save(order);



        if (request.getItems() != null && !request.getItems().isEmpty()) {
            request.getItems().forEach(itemReq -> {
                OutboundOrderItem item = OutboundOrderItem.builder()
                        .outboundOrder(savedOrder)
                        .ingredient(ingredientRepository.findById(itemReq.getIngredientId())
                                .orElseThrow(() -> new IllegalArgumentException(
                                        "Ingredient not found")))
                        .quantity(itemReq.getQuantity())
                        .build();

                outboundOrderItemRepository.save(item);

                // Giữ trước số lượng tồn kho khi tạo đơn hàng
                inventoryService.reserveInventory(savedOrder.getWarehouse().getId(),
                        item.getIngredient().getId(),
                        item.getQuantity());
            });
        }

        return mapToResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OutboundOrderResponse> getAllOutboundOrders() {
        return outboundOrderRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OutboundOrderResponse> getAllOutboundOrdersByWarehouseId(UUID warehouseId) {
        return outboundOrderRepository.findByWarehouseId(warehouseId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OutboundOrderResponse getOutboundOrderById(UUID id) {
        return outboundOrderRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new IllegalArgumentException("OutboundOrder not found"));
    }

    @Override
    @Transactional
    public OutboundOrderResponse updateOutboundOrderStatus(UUID id, OutboundOrderStatusUpdateRequest request) {
        OutboundOrder order = outboundOrderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("OutboundOrder not found"));

        // Nếu trạng thái chuyển thành DELIVERED, xác nhận xuất kho (trừ số lượng đã giữ)
        if (request.getStatus() == OutboundOrderStatus.DELIVERED
                && order.getStatus() != OutboundOrderStatus.DELIVERED) {
            List<OutboundOrderItem> items = outboundOrderItemRepository.findAll().stream()
                    .filter(i -> i.getOutboundOrder().getId().equals(order.getId()))
                    .collect(Collectors.toList());

            for (OutboundOrderItem item : items) {
                inventoryService.confirmOutboundInventory(order.getWarehouse().getId(),
                        item.getIngredient().getId(),
                        item.getQuantity());
            }
        }

        // Nếu trạng thái chuyển thành CANCELED, giải phóng số lượng tồn kho đã giữ
        if (request.getStatus() == OutboundOrderStatus.CANCELED
                && order.getStatus() != OutboundOrderStatus.CANCELED) {
            List<OutboundOrderItem> items = outboundOrderItemRepository.findAll().stream()
                    .filter(i -> i.getOutboundOrder().getId().equals(order.getId()))
                    .collect(Collectors.toList());

            for (OutboundOrderItem item : items) {
                inventoryService.releaseInventory(order.getWarehouse().getId(),
                        item.getIngredient().getId(),
                        item.getQuantity());
            }
        }

        order.setStatus(request.getStatus());
        order.setUpdatedAt(LocalDateTime.now());

        outboundOrderRepository.save(order);
        return mapToResponse(order);
    }

    private OutboundOrderResponse mapToResponse(OutboundOrder order) {
        List<OutboundOrderItem> items = outboundOrderItemRepository.findAll().stream()
                .filter(item -> item.getOutboundOrder().getId().equals(order.getId()))
                .collect(Collectors.toList());

        List<OutboundOrderResponse.OutboundOrderItemResponse> itemResponses = items.stream()
                .map(item -> OutboundOrderResponse.OutboundOrderItemResponse.builder()
                        .id(item.getId())
                        .ingredientId(item.getIngredient().getId())
                        .ingredientName(item.getIngredient().getName())
                        .unit(item.getIngredient().getUnit())
                        .quantity(item.getQuantity())
                        .build())
                .collect(Collectors.toList());

        return OutboundOrderResponse.builder()
                .id(order.getId())
                .warehouseId(order.getWarehouse().getId())
                .warehouseName(order.getWarehouse().getName())
                .destinationFranchiseId(order.getDestinationFranchiseId())
                .destinationFranchiseName("Cửa hàng "
                        + order.getDestinationFranchiseId().toString().substring(0, 4))
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .items(itemResponses)
                .build();
    }
}
