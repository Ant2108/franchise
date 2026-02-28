package com.coffee.franchise.api.service;

import com.coffee.franchise.api.dto.OutboundOrderRequest;
import com.coffee.franchise.api.dto.OutboundOrderResponse;
import com.coffee.franchise.api.dto.OutboundOrderStatusUpdateRequest;
import com.coffee.franchise.api.entity.OutboundOrder;
import com.coffee.franchise.api.entity.OutboundOrderItem;
import com.coffee.franchise.api.enums.OutboundOrderStatus;
import com.coffee.franchise.api.repository.IngredientRepository;
import com.coffee.franchise.api.repository.OutboundOrderItemRepository;
import com.coffee.franchise.api.repository.OutboundOrderRepository;
import com.coffee.franchise.api.repository.WarehouseRepository;
import com.coffee.franchise.api.service.Impl.InventoryServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OutboundOrderService {

        private final OutboundOrderRepository outboundOrderRepository;
        private final OutboundOrderItemRepository outboundOrderItemRepository;
        private final WarehouseRepository warehouseRepository;
        private final IngredientRepository ingredientRepository;
        private final InventoryServiceImpl inventoryServiceImpl;

        @Transactional
        public OutboundOrderResponse createOutboundOrder(OutboundOrderRequest request) {
                OutboundOrder order = OutboundOrder.builder()
                                .warehouse(warehouseRepository.findById(request.getWarehouseId())
                                                .orElseThrow(() -> new IllegalArgumentException("Warehouse not found")))
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

                                // Reserve inventory when order is created
                                inventoryServiceImpl.reserveInventory(savedOrder.getWarehouse().getId(),
                                                item.getIngredient().getId(),
                                                item.getQuantity());
                        });
                }

                return mapToResponse(savedOrder);
        }

        @Transactional(readOnly = true)
        public List<OutboundOrderResponse> getAllOutboundOrders() {
                return outboundOrderRepository.findAll().stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public OutboundOrderResponse getOutboundOrderById(UUID id) {
                return outboundOrderRepository.findById(id)
                                .map(this::mapToResponse)
                                .orElseThrow(() -> new IllegalArgumentException("OutboundOrder not found"));
        }

        @Transactional
        public OutboundOrderResponse updateOutboundOrderStatus(UUID id, OutboundOrderStatusUpdateRequest request) {
                OutboundOrder order = outboundOrderRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException("OutboundOrder not found"));

                // If status changes to DELIVERED, confirm the inventory (deduct reserved)
                if (request.getStatus() == OutboundOrderStatus.DELIVERED
                                && order.getStatus() != OutboundOrderStatus.DELIVERED) {
                        List<OutboundOrderItem> items = outboundOrderItemRepository.findAll().stream()
                                        .filter(i -> i.getOutboundOrder().getId().equals(order.getId()))
                                        .collect(Collectors.toList());

                        for (OutboundOrderItem item : items) {
                                inventoryServiceImpl.confirmOutboundInventory(order.getWarehouse().getId(),
                                                item.getIngredient().getId(),
                                                item.getQuantity());
                        }
                }
                // Logic to release inventory if order is cancelled could be added here if there
                // was a CANCELLED status

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
                                                + order.getDestinationFranchiseId().toString().substring(0, 4)) // Mock
                                                                                                                // name
                                                                                                                // since
                                                                                                                // there's
                                                                                                                // no
                                                                                                                // FranchiseStore
                                                                                                                // entity
                                                                                                                // here
                                .status(order.getStatus())
                                .createdAt(order.getCreatedAt())
                                .updatedAt(order.getUpdatedAt())
                                .items(itemResponses)
                                .build();
        }
}
