package com.coffee.franchise.api.service.Impl;

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
import com.coffee.franchise.api.service.InventoryService;
import com.coffee.franchise.api.service.OutboundOrderService;
import com.coffee.franchise.api.client.StoreApiClient;
import com.coffee.franchise.api.dto.external.StoreImportItem;
import com.coffee.franchise.api.dto.external.StoreImportRequest;
import com.coffee.franchise.api.dto.external.ExternalOutboundStatusUpdateRequest;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OutboundOrderServiceImpl implements OutboundOrderService {

    private final OutboundOrderRepository outboundOrderRepository;
    private final OutboundOrderItemRepository outboundOrderItemRepository;
    private final WarehouseRepository warehouseRepository;
    private final IngredientRepository ingredientRepository;
    private final InventoryService inventoryService;
    private final StoreApiClient storeApiClient;

    @Override
    @Transactional
    public OutboundOrderResponse createOutboundOrder(OutboundOrderRequest request) {
        OutboundOrder order = OutboundOrder.builder()
                .warehouse(warehouseRepository.findById(request.getWarehouseId())
                        .filter(w -> !Boolean.TRUE.equals(w.getDeleted()))
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Warehouse not found or deleted")))
                .destinationFranchiseId(request.getDestinationFranchiseId())
                .status(OutboundOrderStatus.PENDING)
                .batchCode(request.getBatchCode())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        OutboundOrder savedOrder = outboundOrderRepository.save(order);

        BigDecimal currentOrderTotalPrice = BigDecimal.ZERO;

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (var itemReq : request.getItems()) {
                com.coffee.franchise.api.entity.Ingredient ingredient = ingredientRepository.findById(itemReq.getIngredientId())
                        .orElseThrow(() -> new IllegalArgumentException("Ingredient not found"));
                        
                BigDecimal unitPrice = ingredient.getPrice() != null ? ingredient.getPrice() : BigDecimal.ZERO;
                BigDecimal itemQuantity = itemReq.getQuantity() != null ? itemReq.getQuantity() : BigDecimal.ZERO;

                OutboundOrderItem item = OutboundOrderItem.builder()
                        .outboundOrder(savedOrder)
                        .ingredient(ingredient)
                        .quantity(itemReq.getQuantity())
                        .unitPrice(unitPrice)
                        .build();

                outboundOrderItemRepository.save(item);

                BigDecimal itemTotalPrice = unitPrice.multiply(itemQuantity);
                currentOrderTotalPrice = currentOrderTotalPrice.add(itemTotalPrice);

                // Giữ trước số lượng tồn kho khi tạo đơn hàng
                inventoryService.reserveInventory(savedOrder.getWarehouse().getId(),
                        item.getIngredient().getId(),
                        item.getQuantity());
            }
        }
        
        savedOrder.setTotalPrice(currentOrderTotalPrice);
        savedOrder = outboundOrderRepository.save(savedOrder);

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

        if (order.getStatus() == request.getStatus()) {
             return mapToResponse(order);
        }

        List<OutboundOrderItem> items = processInternalStatusUpdate(order, request.getStatus());

        // 2. Logic Đồng bộ OpenFeign sang Store (Cửa hàng)
        syncWithStoreApi(order, items, request);

        return mapToResponse(order);
    }

    @Override
    @Transactional
    public OutboundOrderResponse updateExternalOutboundOrderStatus(ExternalOutboundStatusUpdateRequest request) {
        OutboundOrder order = outboundOrderRepository.findByWarehouseIdAndBatchCode(request.getWarehouseId(), request.getBatchCode())
                .orElseThrow(() -> new IllegalArgumentException("OutboundOrder not found for warehouseId and batchCode"));

        if (order.getStatus() == request.getStatus()) {
             return mapToResponse(order);
        }
        
        processInternalStatusUpdate(order, request.getStatus());

        return mapToResponse(order);
    }

    private List<OutboundOrderItem> processInternalStatusUpdate(OutboundOrder order, OutboundOrderStatus newStatus) {
        // Lấy danh sách item thuộc đơn này để xử lý
        List<OutboundOrderItem> items = outboundOrderItemRepository.findAll().stream()
                .filter(i -> i.getOutboundOrder().getId().equals(order.getId()))
                .collect(Collectors.toList());

        // 1. Logic Inventory Nội Bộ (Warehouse)
        if (newStatus == OutboundOrderStatus.DELIVERED) {
            for (OutboundOrderItem item : items) {
                inventoryService.confirmOutboundInventory(
                    order.getWarehouse().getId(),
                    item.getIngredient().getId(),
                    item.getQuantity()
                );
            }
        }

        if (newStatus == OutboundOrderStatus.CANCELED) {
            for (OutboundOrderItem item : items) {
                inventoryService.releaseInventory(
                    order.getWarehouse().getId(),
                    item.getIngredient().getId(),
                    item.getQuantity()
                );
            }
        }

        // Cập nhật trạng thái
        order.setStatus(newStatus);
        order.setUpdatedAt(LocalDateTime.now());
        outboundOrderRepository.save(order);

        return items;
    }

    private void syncWithStoreApi(OutboundOrder order, List<OutboundOrderItem> items, OutboundOrderStatusUpdateRequest request) {
        List<StoreImportItem> storeItems = items.stream().map(i -> StoreImportItem.builder()
                .ingredientId(i.getIngredient().getId())
                .quantityReceived(i.getQuantity())
                .unitCost(i.getUnitPrice() != null ? i.getUnitPrice() : BigDecimal.ZERO)
                .expiryDate(LocalDateTime.now().plusMonths(6)) // Add động 6 tháng expiry
                .build()).collect(Collectors.toList());

        StoreImportRequest storeRequest = StoreImportRequest.builder()
                .warehouseRequestId(order.getId())
                .status(request.getStatus().name()) // Động theo trạng thái thực tế
                .batchCode(order.getBatchCode())
                .franchiseStoreId(order.getDestinationFranchiseId())
                .importDate(LocalDateTime.now())
                .items(storeItems)
                // Cấu hình linh hoạt rejectionReason nếu API request tương lai của bạn hỗ trợ
                .rejectionReason(request.getStatus() == OutboundOrderStatus.CANCELED ? "Warehouse canceled order" : null)
                .build();

        try {
            storeApiClient.confirmInventoryImport(storeRequest);
            log.info("Thành công gửi update sync sang API Store cho Order ID: {}", order.getId());
        } catch (FeignException e) {
            log.error("API Error từ hệ thống Store trong lúc đồng bộ - Status Code: {}, Lỗi: {}", e.status(), e.contentUTF8());
            // Việc throw RuntimeException giúp Trigger cho hàm @Transactional Rollback toàn bộ trạng thái và tồn kho nếu API Store gặp từ chối
            throw new RuntimeException("Gặp sự cố khi đồng bộ qua hệ thống Store: " + e.getMessage());
        }
    }

    private OutboundOrderResponse mapToResponse(OutboundOrder order) {
        List<OutboundOrderItem> items = outboundOrderItemRepository.findAll().stream()
                .filter(item -> item.getOutboundOrder().getId().equals(order.getId()))
                .collect(Collectors.toList());

        List<OutboundOrderResponse.OutboundOrderItemResponse> itemResponses = items.stream()
                .map(item -> {
                    BigDecimal unitPrice = item.getUnitPrice() != null ? item.getUnitPrice() : BigDecimal.ZERO;
                    BigDecimal quantity = item.getQuantity() != null ? item.getQuantity() : BigDecimal.ZERO;
                    BigDecimal itemTotalPrice = unitPrice.multiply(quantity);

                    return OutboundOrderResponse.OutboundOrderItemResponse.builder()
                            .id(item.getId())
                            .ingredientId(item.getIngredient().getId())
                            .ingredientName(item.getIngredient().getName())
                            .unit(item.getIngredient().getUnit())
                            .quantity(item.getQuantity())
                            .unitPrice(unitPrice)
                            .totalPrice(itemTotalPrice)
                            .expiryDate(LocalDateTime.now().plusMonths(6))
                            .build();
                })
                .collect(Collectors.toList());

        return OutboundOrderResponse.builder()
                .id(order.getId())
                .warehouseId(order.getWarehouse().getId())
                .warehouseName(order.getWarehouse().getName())
                .destinationFranchiseId(order.getDestinationFranchiseId())
                .destinationFranchiseName("Cửa hàng "
                        + order.getDestinationFranchiseId().toString().substring(0, 4))
                .status(order.getStatus())
                .batchCode(order.getBatchCode())
                .totalPrice(order.getTotalPrice())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .items(itemResponses)
                .build();
    }
}
