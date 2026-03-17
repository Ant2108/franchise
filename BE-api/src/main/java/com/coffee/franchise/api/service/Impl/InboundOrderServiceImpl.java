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
import com.coffee.franchise.api.entity.Warehouse;
import com.coffee.franchise.api.entity.Cart;
import com.coffee.franchise.api.entity.CartItem;
import com.coffee.franchise.api.repository.CartRepository;
import com.coffee.franchise.api.service.InboundOrderService;
import com.coffee.franchise.api.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.ArrayList;
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
    private final CartRepository cartRepository;

    @Override
    @Transactional
    public InboundOrderResponse createInboundOrder(InboundOrderRequest request) {
        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .filter(w -> !Boolean.TRUE.equals(w.getDeleted()))
                .orElseThrow(() -> new IllegalArgumentException("Warehouse not found or deleted"));

        com.coffee.franchise.api.entity.Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new IllegalArgumentException("Supplier not found"));

        InboundOrder order = InboundOrder.builder()
                .warehouse(warehouse)
                .supplier(supplier)
                .status(InboundOrderStatus.PENDING)
                .expectedDate(request.getExpectedDate())
                .totalAmount(BigDecimal.ZERO)
                .items(new ArrayList<>())
                .build();

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            List<UUID> ingredientIds = request.getItems().stream()
                    .map(InboundOrderRequest.InboundOrderItemRequest::getIngredientId)
                    .toList();

            Map<UUID, SupplierIngredient> siMap = supplierIngredientRepository
                    .findBySupplierIdAndIngredientIdIn(request.getSupplierId(), ingredientIds)
                    .stream()
                    .collect(Collectors.toMap(si -> si.getIngredient().getId(), si -> si));

            BigDecimal totalAmount = BigDecimal.ZERO;
            for (InboundOrderRequest.InboundOrderItemRequest itemReq : request.getItems()) {
                SupplierIngredient si = siMap.get(itemReq.getIngredientId());
                if (si == null) {
                    throw new IllegalArgumentException("Nhà cung cấp này không bán nguyên liệu: " + itemReq.getIngredientId());
                }

                if (si.getMinimumOrderQuantity() != null &&
                        itemReq.getQuantity().compareTo(si.getMinimumOrderQuantity()) < 0) {
                    throw new IllegalArgumentException("Số lượng nhập kho cho nguyên liệu " + itemReq.getIngredientId()
                            + " phải lớn hơn hoặc bằng mức tối thiểu: " + si.getMinimumOrderQuantity());
                }

                BigDecimal availableQuantity = si.getStockQuantity() != null
                        ? si.getStockQuantity().subtract(si.getReservedQuantity() != null ? si.getReservedQuantity() : BigDecimal.ZERO)
                        : null;

                if (availableQuantity != null && itemReq.getQuantity().compareTo(availableQuantity) > 0) {
                    throw new IllegalArgumentException("Nhà cung cấp không đủ số lượng cho nguyên liệu " + itemReq.getIngredientId()
                            + ". Có thể đặt tối đa: " + availableQuantity);
                }

                if (si.getReservedQuantity() == null) si.setReservedQuantity(BigDecimal.ZERO);
                si.setReservedQuantity(si.getReservedQuantity().add(itemReq.getQuantity()));

                InboundOrderItem item = InboundOrderItem.builder()
                        .inboundOrder(order)
                        .ingredient(si.getIngredient())
                        .quantity(itemReq.getQuantity())
                        .unitPrice(si.getUnitPrice() != null ? si.getUnitPrice() : BigDecimal.ZERO)
                        .build();
                order.getItems().add(item);
                totalAmount = totalAmount.add(item.getQuantity().multiply(item.getUnitPrice()));
            }
            order.setTotalAmount(totalAmount);
            supplierIngredientRepository.saveAll(siMap.values());
        }

        InboundOrder savedOrder = inboundOrderRepository.save(order);
        return mapToResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InboundOrderResponse> getAllInboundOrders() {
        return inboundOrderRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<InboundOrderResponse> getAllInboundOrdersByWarehouseId(UUID warehouseId) {
        return inboundOrderRepository.findByWarehouseId(warehouseId).stream()
                .map(this::mapToResponse)
                .toList();
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

        List<InboundOrderItem> orderItems = order.getItems();

        if (request.getItemReceipts() != null && !request.getItemReceipts().isEmpty()) {
            Set<UUID> validItemIds = orderItems.stream()
                    .map(InboundOrderItem::getId)
                    .collect(Collectors.toSet());

            for (InboundOrderStatusUpdateRequest.ItemReceiptRequest receipt : request.getItemReceipts()) {
                if (receipt.getItemId() == null || !validItemIds.contains(receipt.getItemId())) {
                    throw new IllegalArgumentException("Invalid item id in itemReceipts: " + receipt.getItemId());
                }
            }

            Map<UUID, InboundOrderStatusUpdateRequest.ItemReceiptRequest> receiptByItemId = request.getItemReceipts().stream()
                    .collect(Collectors.toMap(InboundOrderStatusUpdateRequest.ItemReceiptRequest::getItemId, r -> r, (r1, r2) -> r2));

            for (InboundOrderItem item : orderItems) {
                InboundOrderStatusUpdateRequest.ItemReceiptRequest receipt = receiptByItemId.get(item.getId());
                if (receipt == null) continue;

                BigDecimal receivedQuantity = Boolean.TRUE.equals(receipt.getReceived())
                        ? receipt.getReceivedQuantity()
                        : BigDecimal.ZERO;

                if (Boolean.TRUE.equals(receipt.getReceived()) && receivedQuantity == null) {
                    throw new IllegalArgumentException("receivedQuantity is required when item is marked as received");
                }

                if (receivedQuantity == null) receivedQuantity = BigDecimal.ZERO;

                if (receivedQuantity.compareTo(BigDecimal.ZERO) < 0) {
                    throw new IllegalArgumentException("receivedQuantity cannot be negative");
                }

                if (item.getQuantity() != null && receivedQuantity.compareTo(item.getQuantity()) > 0) {
                    throw new IllegalArgumentException("receivedQuantity cannot be greater than requested quantity");
                }

                item.setReceivedQuantity(receivedQuantity);
            }
        }

        if (order.getStatus() != InboundOrderStatus.COMPLETED && order.getStatus() != InboundOrderStatus.CANCELLED) {
            List<UUID> ingredientIds = orderItems.stream().map(item -> item.getIngredient().getId()).toList();
            Map<UUID, SupplierIngredient> siMap = supplierIngredientRepository
                    .findBySupplierIdAndIngredientIdIn(order.getSupplier().getId(), ingredientIds)
                    .stream()
                    .collect(Collectors.toMap(si -> si.getIngredient().getId(), si -> si));

            if (request.getStatus() == InboundOrderStatus.CANCELLED) {
                for (InboundOrderItem item : orderItems) {
                    SupplierIngredient si = siMap.get(item.getIngredient().getId());
                    if (si != null && si.getReservedQuantity() != null) {
                        si.setReservedQuantity(si.getReservedQuantity().subtract(item.getQuantity()).max(BigDecimal.ZERO));
                    }
                }
            } else if (request.getStatus() == InboundOrderStatus.COMPLETED) {
                for (InboundOrderItem item : orderItems) {
                    SupplierIngredient si = siMap.get(item.getIngredient().getId());
                    if (si != null) {
                        if (si.getReservedQuantity() != null) {
                            si.setReservedQuantity(si.getReservedQuantity().subtract(item.getQuantity()).max(BigDecimal.ZERO));
                        }
                        if (si.getStockQuantity() != null) {
                            BigDecimal received = item.getReceivedQuantity() != null ? item.getReceivedQuantity() : item.getQuantity();
                            si.setStockQuantity(si.getStockQuantity().subtract(received).max(BigDecimal.ZERO));
                        }
                    }
                }
                
                // Cập nhật Inventory
                for (InboundOrderItem item : orderItems) {
                    BigDecimal quantityToAdd = item.getReceivedQuantity() != null ? item.getReceivedQuantity() : item.getQuantity();
                    if (quantityToAdd != null && quantityToAdd.compareTo(BigDecimal.ZERO) > 0) {
                        inventoryService.addInventory(order.getWarehouse().getId(), item.getIngredient().getId(), quantityToAdd);
                    }
                }
            }
            supplierIngredientRepository.saveAll(siMap.values());
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

    @Override
    @Transactional
    public List<InboundOrderResponse> checkoutCart(UUID warehouseId) {
        Cart cart = cartRepository.findByWarehouseIdWithItems(warehouseId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy giỏ hàng cho warehouse này"));

        List<CartItem> cartItems = cart.getItems();
        if (cartItems == null || cartItems.isEmpty()) {
            throw new IllegalArgumentException("Giỏ hàng trống, không thể đặt hàng");
        }

        Warehouse warehouse = cart.getWarehouse();
        Map<UUID, List<CartItem>> groupedBySupplier = cartItems.stream()
                .collect(Collectors.groupingBy(item -> item.getSupplierIngredient().getSupplier().getId()));

        List<InboundOrder> ordersToSave = new ArrayList<>();
        List<SupplierIngredient> siToUpdate = new ArrayList<>();

        for (Map.Entry<UUID, List<CartItem>> entry : groupedBySupplier.entrySet()) {
            UUID supplierId = entry.getKey();
            List<CartItem> supplierCartItems = entry.getValue();

            com.coffee.franchise.api.entity.Supplier supplier = supplierRepository.findById(supplierId)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhà cung cấp: " + supplierId));

            InboundOrder order = InboundOrder.builder()
                    .warehouse(warehouse)
                    .supplier(supplier)
                    .status(InboundOrderStatus.PENDING)
                    .expectedDate(LocalDateTime.now().plusDays(
                            supplierCartItems.stream()
                                    .map(ci -> ci.getSupplierIngredient().getLeadTimeDays())
                                    .filter(java.util.Objects::nonNull)
                                    .max(Integer::compareTo)
                                    .orElse(7)))
                    .totalAmount(BigDecimal.ZERO)
                    .items(new ArrayList<>())
                    .build();

            BigDecimal totalAmount = BigDecimal.ZERO;
            for (CartItem cartItem : supplierCartItems) {
                SupplierIngredient si = cartItem.getSupplierIngredient();

                if (si.getMinimumOrderQuantity() != null &&
                        cartItem.getQuantity().compareTo(si.getMinimumOrderQuantity()) < 0) {
                    throw new IllegalArgumentException("Số lượng nguyên liệu " + si.getIngredient().getName()
                            + " phải lớn hơn hoặc bằng mức tối thiểu: " + si.getMinimumOrderQuantity());
                }

                BigDecimal availableQuantity = si.getStockQuantity() != null
                        ? si.getStockQuantity().subtract(si.getReservedQuantity() != null ? si.getReservedQuantity() : BigDecimal.ZERO)
                        : null;

                if (availableQuantity != null && cartItem.getQuantity().compareTo(availableQuantity) > 0) {
                    throw new IllegalArgumentException("Nhà cung cấp không đủ số lượng cho nguyên liệu " + si.getIngredient().getName()
                            + ". Có thể đặt tối đa: " + availableQuantity);
                }

                if (si.getReservedQuantity() == null) si.setReservedQuantity(BigDecimal.ZERO);
                si.setReservedQuantity(si.getReservedQuantity().add(cartItem.getQuantity()));
                siToUpdate.add(si);

                InboundOrderItem orderItem = InboundOrderItem.builder()
                        .inboundOrder(order)
                        .ingredient(si.getIngredient())
                        .quantity(cartItem.getQuantity())
                        .unitPrice(cartItem.getUnitPrice())
                        .build();
                order.getItems().add(orderItem);
                totalAmount = totalAmount.add(cartItem.getQuantity().multiply(cartItem.getUnitPrice()));
            }

            order.setTotalAmount(totalAmount);
            ordersToSave.add(order);
        }

        supplierIngredientRepository.saveAll(siToUpdate);
        List<InboundOrder> savedOrders = inboundOrderRepository.saveAll(ordersToSave);
        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrders.stream().map(this::mapToResponse).toList();
    }

    private InboundOrderResponse mapToResponse(InboundOrder order) {
        List<InboundOrderResponse.InboundOrderItemResponse> itemResponses = order.getItems() == null
                ? new ArrayList<>()
                : order.getItems().stream()
                .map(item -> InboundOrderResponse.InboundOrderItemResponse.builder()
                        .id(item.getId())
                        .ingredientId(item.getIngredient().getId())
                        .ingredientName(item.getIngredient().getName())
                        .unit(item.getIngredient().getUnit())
                        .quantity(item.getQuantity())
                        .receivedQuantity(item.getReceivedQuantity())
                        .unitPrice(item.getUnitPrice())
                        .build())
                .toList();

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
