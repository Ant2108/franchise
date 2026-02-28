package com.coffee.franchise.api.dto;

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
public class InboundOrderRequest {
    private UUID warehouseId;
    private UUID supplierId;
    private LocalDateTime expectedDate;
    private List<InboundOrderItemRequest> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InboundOrderItemRequest {
        private UUID ingredientId;
        private BigDecimal quantity;
        private BigDecimal unitPrice;
    }
}
