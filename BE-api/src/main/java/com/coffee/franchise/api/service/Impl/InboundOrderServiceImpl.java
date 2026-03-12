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

                                BigDecimal availableQuantity = supplierIngredient.getStockQuantity() != null
                                        ? supplierIngredient.getStockQuantity().subtract(
                                                supplierIngredient.getReservedQuantity() != null ? supplierIngredient.getReservedQuantity() : BigDecimal.ZERO)
                                        : null;

                                if (availableQuantity != null &&
                                                itemReq.getQuantity().compareTo(availableQuantity) > 0) {
                                        throw new IllegalArgumentException(
                                                        "Nhà cung cấp không đủ số lượng cho nguyên liệu " + itemReq.getIngredientId()
                                                                        + ". Có thể đặt tối đa: " + availableQuantity);
                                }

                                if (supplierIngredient.getReservedQuantity() == null) {
                                        supplierIngredient.setReservedQuantity(BigDecimal.ZERO);
                                }
                                supplierIngredient.setReservedQuantity(supplierIngredient.getReservedQuantity().add(itemReq.getQuantity()));
                                supplierIngredientRepository.save(supplierIngredient);

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

                List<InboundOrderItem> orderItems = inboundOrderItemRepository.findByInboundOrderId(order.getId());

                if (request.getItemReceipts() != null && !request.getItemReceipts().isEmpty()) {
                        Set<UUID> validItemIds = orderItems.stream()
                                        .map(InboundOrderItem::getId)
                                        .collect(Collectors.toSet());

                        for (InboundOrderStatusUpdateRequest.ItemReceiptRequest receipt : request.getItemReceipts()) {
                                if (receipt.getItemId() == null || !validItemIds.contains(receipt.getItemId())) {
                                        throw new IllegalArgumentException(
                                                        "Invalid item id in itemReceipts: " + receipt.getItemId());
                                }
                        }

                        Map<UUID, InboundOrderStatusUpdateRequest.ItemReceiptRequest> receiptByItemId = request
                                        .getItemReceipts()
                                        .stream()
                                        .collect(Collectors.toMap(
                                                        InboundOrderStatusUpdateRequest.ItemReceiptRequest::getItemId,
                                                        r -> r,
                                                        (r1, r2) -> r2));

                        for (InboundOrderItem item : orderItems) {
                                InboundOrderStatusUpdateRequest.ItemReceiptRequest receipt = receiptByItemId
                                                .get(item.getId());
                                if (receipt == null) {
                                        continue;
                                }

                                BigDecimal receivedQuantity = Boolean.TRUE.equals(receipt.getReceived())
                                                ? receipt.getReceivedQuantity()
                                                : BigDecimal.ZERO;

                                if (Boolean.TRUE.equals(receipt.getReceived()) && receivedQuantity == null) {
                                        throw new IllegalArgumentException(
                                                        "receivedQuantity is required when item is marked as received");
                                }

                                if (receivedQuantity == null) {
                                        receivedQuantity = BigDecimal.ZERO;
                                }

                                if (receivedQuantity.compareTo(BigDecimal.ZERO) < 0) {
                                        throw new IllegalArgumentException("receivedQuantity cannot be negative");
                                }

                                if (item.getQuantity() != null && receivedQuantity.compareTo(item.getQuantity()) > 0) {
                                        throw new IllegalArgumentException(
                                                        "receivedQuantity cannot be greater than requested quantity");
                                }

                                item.setReceivedQuantity(receivedQuantity);
                        }

                        inboundOrderItemRepository.saveAll(orderItems);
                }

                if (order.getStatus() != InboundOrderStatus.COMPLETED && order.getStatus() != InboundOrderStatus.CANCELLED) {
                        if (request.getStatus() == InboundOrderStatus.CANCELLED) {
                                for (InboundOrderItem item : orderItems) {
                                        supplierIngredientRepository.findBySupplierIdAndIngredientId(order.getSupplier().getId(), item.getIngredient().getId())
                                                .ifPresent(si -> {
                                                        if (si.getReservedQuantity() != null) {
                                                                si.setReservedQuantity(si.getReservedQuantity().subtract(item.getQuantity()).max(BigDecimal.ZERO));
                                                                supplierIngredientRepository.save(si);
                                                        }
                                                });
                                }
                        } else if (request.getStatus() == InboundOrderStatus.COMPLETED) {
                                for (InboundOrderItem item : orderItems) {
                                        supplierIngredientRepository.findBySupplierIdAndIngredientId(order.getSupplier().getId(), item.getIngredient().getId())
                                                .ifPresent(si -> {
                                                        if (si.getReservedQuantity() != null) {
                                                                si.setReservedQuantity(si.getReservedQuantity().subtract(item.getQuantity()).max(BigDecimal.ZERO));
                                                        }
                                                        if (si.getStockQuantity() != null) {
                                                                BigDecimal received = item.getReceivedQuantity() != null ? item.getReceivedQuantity() : item.getQuantity();
                                                                si.setStockQuantity(si.getStockQuantity().subtract(received).max(BigDecimal.ZERO));
                                                        }
                                                        supplierIngredientRepository.save(si);
                                                });
                                }
                        }
                }

                // Nếu trạng thái mới là COMPLETED và trạng thái cũ không phải COMPLETED, thì
                // cập nhật Inventory
                if (request.getStatus() == InboundOrderStatus.COMPLETED
                                && order.getStatus() != InboundOrderStatus.COMPLETED) {
                        for (InboundOrderItem item : orderItems) {
                                BigDecimal quantityToAdd = item.getReceivedQuantity() != null
                                                ? item.getReceivedQuantity()
                                                : item.getQuantity();

                                if (quantityToAdd == null || quantityToAdd.compareTo(BigDecimal.ZERO) <= 0) {
                                        continue;
                                }

                                inventoryService.addInventory(order.getWarehouse().getId(),
                                                item.getIngredient().getId(),
                                                quantityToAdd);
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

        @Override
        @Transactional
        public List<InboundOrderResponse> checkoutCart(UUID warehouseId) {
                // Lấy Cart và tất cả items
                Cart cart = cartRepository.findByWarehouseIdWithItems(warehouseId)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Không tìm thấy giỏ hàng cho warehouse này"));

                List<CartItem> cartItems = cart.getItems();
                if (cartItems == null || cartItems.isEmpty()) {
                        throw new IllegalArgumentException("Giỏ hàng trống, không thể đặt hàng");
                }

                Warehouse warehouse = cart.getWarehouse();

                // Gom nhóm theo Supplier
                Map<UUID, List<CartItem>> groupedBySupplier = cartItems.stream()
                                .collect(Collectors.groupingBy(
                                                item -> item.getSupplierIngredient().getSupplier().getId()));

                List<InboundOrderResponse> createdOrders = new ArrayList<>();

                for (Map.Entry<UUID, List<CartItem>> entry : groupedBySupplier.entrySet()) {
                        UUID supplierId = entry.getKey();
                        List<CartItem> supplierCartItems = entry.getValue();

                        // Lấy Supplier entity
                        com.coffee.franchise.api.entity.Supplier supplier = supplierRepository.findById(supplierId)
                                        .orElseThrow(() -> new IllegalArgumentException(
                                                        "Không tìm thấy nhà cung cấp: " + supplierId));

                        // Tạo InboundOrder cho supplier này
                        InboundOrder order = InboundOrder.builder()
                                        .warehouse(warehouse)
                                        .supplier(supplier)
                                        .status(InboundOrderStatus.PENDING)
                                        .expectedDate(LocalDateTime.now().plusDays(
                                                        supplierCartItems.stream()
                                                                        .map(ci -> ci.getSupplierIngredient()
                                                                                        .getLeadTimeDays())
                                                                        .filter(java.util.Objects::nonNull)
                                                                        .max(Integer::compareTo)
                                                                        .orElse(7)))
                                        .totalAmount(BigDecimal.ZERO)
                                        .build();

                        InboundOrder savedOrder = inboundOrderRepository.save(order);

                        // Tạo InboundOrderItem từ CartItem
                        BigDecimal totalAmount = BigDecimal.ZERO;
                        for (CartItem cartItem : supplierCartItems) {
                                SupplierIngredient si = cartItem.getSupplierIngredient();

                                if (si.getMinimumOrderQuantity() != null &&
                                                cartItem.getQuantity().compareTo(si.getMinimumOrderQuantity()) < 0) {
                                        throw new IllegalArgumentException(
                                                        "Số lượng nguyên liệu " + si.getIngredient().getName()
                                                                        + " phải lớn hơn hoặc bằng mức tối thiểu: "
                                                                        + si.getMinimumOrderQuantity());
                                }

                                BigDecimal availableQuantity = si.getStockQuantity() != null
                                        ? si.getStockQuantity().subtract(
                                                si.getReservedQuantity() != null ? si.getReservedQuantity() : BigDecimal.ZERO)
                                        : null;

                                if (availableQuantity != null &&
                                                cartItem.getQuantity().compareTo(availableQuantity) > 0) {
                                        throw new IllegalArgumentException(
                                                        "Nhà cung cấp không đủ số lượng cho nguyên liệu " + si.getIngredient().getName()
                                                                        + ". Có thể đặt tối đa: " + availableQuantity);
                                }

                                if (si.getReservedQuantity() == null) {
                                        si.setReservedQuantity(BigDecimal.ZERO);
                                }
                                si.setReservedQuantity(si.getReservedQuantity().add(cartItem.getQuantity()));
                                supplierIngredientRepository.save(si);

                                InboundOrderItem orderItem = InboundOrderItem.builder()
                                                .inboundOrder(savedOrder)
                                                .ingredient(si.getIngredient())
                                                .quantity(cartItem.getQuantity())
                                                .unitPrice(cartItem.getUnitPrice())
                                                .build();
                                inboundOrderItemRepository.save(orderItem);
                                totalAmount = totalAmount.add(
                                                cartItem.getQuantity().multiply(cartItem.getUnitPrice()));
                        }

                        savedOrder.setTotalAmount(totalAmount);
                        inboundOrderRepository.save(savedOrder);

                        createdOrders.add(mapToResponse(savedOrder));
                }

                // Xóa toàn bộ items trong giỏ hàng
                cart.getItems().clear();
                cartRepository.save(cart);

                return createdOrders;
        }

        private InboundOrderResponse mapToResponse(InboundOrder order) {
                List<InboundOrderItem> items = inboundOrderItemRepository.findByInboundOrderId(order.getId());

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
