package com.coffee.franchise.api.dto;

import com.coffee.franchise.api.enums.InboundOrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InboundOrderResponse {
    private UUID id;
    private UUID warehouseId;
    private UUID supplierId;
    private InboundOrderStatus status;
    private BigDecimal totalAmount;
    private LocalDateTime expectedDate;
    private LocalDateTime actualDate;
    private List<InboundOrderItemResponse> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InboundOrderItemResponse {
        private UUID id;
        private UUID ingredientId;
        private BigDecimal quantity;
        private BigDecimal unitPrice;
    }
}
