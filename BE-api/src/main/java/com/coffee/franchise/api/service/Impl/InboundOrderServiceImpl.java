package com.coffee.franchise.api.service.Impl;

import com.coffee.franchise.api.dto.Request.InboundOrderRequest;
import com.coffee.franchise.api.dto.Response.InboundOrderResponse;
import com.coffee.franchise.api.dto.Request.InboundOrderStatusUpdateRequest;
import com.coffee.franchise.api.entity.InboundOrder;
import com.coffee.franchise.api.entity.InboundOrderItem;
import com.coffee.franchise.api.enums.InboundOrderStatus;
import com.coffee.franchise.api.repository.InboundOrderItemRepository;
import com.coffee.franchise.api.repository.InboundOrderRepository;
import com.coffee.franchise.api.repository.IngredientRepository;
import com.coffee.franchise.api.repository.SupplierIngredientRepository;
import com.coffee.franchise.api.repository.SupplierRepository;
import com.coffee.franchise.api.repository.WarehouseRepository;
import com.coffee.franchise.api.entity.SupplierIngredient;
import com.coffee.franchise.api.service.InboundOrderService;
import com.coffee.franchise.api.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InboundOrderServiceImpl implements InboundOrderService {

    private final InboundOrderRepository inboundOrderRepository;
    private final InboundOrderItemRepository inboundOrderItemRepository;
    private final WarehouseRepository warehouseRepository;
    private final SupplierRepository supplierRepository;
    private final IngredientRepository ingredientRepository;
    private final SupplierIngredientRepository supplierIngredientRepository;
    private final InventoryService inventoryService;

    @Override
    @Transactional
    public InboundOrderResponse createInboundOrder(InboundOrderRequest request) {
        InboundOrder order = InboundOrder.builder()
                .warehouse(warehouseRepository.findById(request.getWarehouseId())
                        .filter(w -> !Boolean.TRUE.equals(w.getDeleted()))
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Warehouse not found or deleted")))
                .supplier(supplierRepository.findById(request.getSupplierId())
                        .orElseThrow(() -> new IllegalArgumentException("Supplier not found")))
                .status(InboundOrderStatus.PENDING)
                .expectedDate(request.getExpectedDate())
                .totalAmount(BigDecimal.ZERO)
                .build();

        InboundOrder savedOrder = inboundOrderRepository.save(order);
        BigDecimal totalAmount = BigDecimal.ZERO;

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            List<InboundOrderItem> items = request.getItems().stream().map(itemReq -> {
                SupplierIngredient supplierIngredient = supplierIngredientRepository
                        .findBySupplierIdAndIngredientId(request.getSupplierId(),
                                itemReq.getIngredientId())
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Nhà cung cấp này không bán nguyên liệu: "
                                        + itemReq.getIngredientId()));

                if (supplierIngredient.getMinimumOrderQuantity() != null &&
                        itemReq.getQuantity().compareTo(
                                supplierIngredient.getMinimumOrderQuantity()) < 0) {
                    throw new IllegalArgumentException(
                            "Số lượng nhập kho cho nguyên liệu " + itemReq.getIngredientId()
                                    + " phải lớn hơn hoặc bằng mức tối thiểu: "
                                    + supplierIngredient.getMinimumOrderQuantity());
                }

                InboundOrderItem item = InboundOrderItem.builder()
                        .inboundOrder(savedOrder)
                        .ingredient(ingredientRepository.findById(itemReq.getIngredientId())
                                .orElseThrow(() -> new IllegalArgumentException(
                                        "Không tìm thấy nguyên liệu")))
                        .quantity(itemReq.getQuantity())
                        .unitPrice(supplierIngredient.getUnitPrice() != null
                                ? supplierIngredient.getUnitPrice()
                                : BigDecimal.ZERO)
                        .build();
                return inboundOrderItemRepository.save(item);
            }).collect(Collectors.toList());

            totalAmount = items.stream()
                    .map(item -> item.getQuantity().multiply(item.getUnitPrice()))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        savedOrder.setTotalAmount(totalAmount);
        inboundOrderRepository.save(savedOrder);

        return mapToResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InboundOrderResponse> getAllInboundOrders() {
        return inboundOrderRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InboundOrderResponse> getAllInboundOrdersByWarehouseId(UUID warehouseId) {
        return inboundOrderRepository.findByWarehouseId(warehouseId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public InboundOrderResponse getInboundOrderById(UUID id) {
        return inboundOrderRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new IllegalArgumentException("InboundOrder not found"));
    }

    @Override
    @Transactional
    public InboundOrderResponse updateInboundOrderStatus(UUID id, InboundOrderStatusUpdateRequest request) {
        InboundOrder order = inboundOrderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("InboundOrder not found"));

        // Nếu trạng thái mới là COMPLETED và trạng thái cũ không phải COMPLETED, thì
        // cập nhật Inventory
        if (request.getStatus() == InboundOrderStatus.COMPLETED
                && order.getStatus() != InboundOrderStatus.COMPLETED) {
            List<InboundOrderItem> items = inboundOrderItemRepository.findAll(); // Cần query theo order id

            // Query các items thuộc order này
            List<InboundOrderItem> orderItems = items.stream()
                    .filter(item -> item.getInboundOrder().getId().equals(order.getId()))
                    .collect(Collectors.toList());

            for (InboundOrderItem item : orderItems) {
                inventoryService.addInventory(order.getWarehouse().getId(),
                        item.getIngredient().getId(),
                        item.getQuantity());
            }
        }

        order.setStatus(request.getStatus());
        if (request.getActualDate() != null) {
            order.setActualDate(request.getActualDate());
        } else if (request.getStatus() == InboundOrderStatus.COMPLETED) {
            order.setActualDate(LocalDateTime.now());
        }

        inboundOrderRepository.save(order);
        return mapToResponse(order);
    }

    private InboundOrderResponse mapToResponse(InboundOrder order) {
        List<InboundOrderItem> items = inboundOrderItemRepository.findAll().stream()
                .filter(item -> item.getInboundOrder().getId().equals(order.getId()))
                .collect(Collectors.toList());

        List<InboundOrderResponse.InboundOrderItemResponse> itemResponses = items.stream()
                .map(item -> InboundOrderResponse.InboundOrderItemResponse.builder()
                        .id(item.getId())
                        .ingredientId(item.getIngredient().getId())
                        .ingredientName(item.getIngredient().getName())
                        .unit(item.getIngredient().getUnit())
                        .quantity(item.getQuantity())
                        .receivedQuantity(item.getReceivedQuantity())
                        .unitPrice(item.getUnitPrice())
                        .build())
                .collect(Collectors.toList());

        return InboundOrderResponse.builder()
                .id(order.getId())
                .warehouseId(order.getWarehouse().getId())
                .warehouseName(order.getWarehouse().getName())
                .supplierId(order.getSupplier().getId())
                .supplierName(order.getSupplier().getName())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .expectedDate(order.getExpectedDate())
                .actualDate(order.getActualDate())
                .items(itemResponses)
                .build();
    }
}
