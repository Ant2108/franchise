package com.coffee.franchise.api.dto;

import com.coffee.franchise.api.enums.OutboundOrderStatus;
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
public class OutboundOrderResponse {
    private UUID id;
    private UUID warehouseId;
    private UUID destinationFranchiseId;
    private OutboundOrderStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OutboundOrderItemResponse> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OutboundOrderItemResponse {
        private UUID id;
        private UUID ingredientId;
        private BigDecimal quantity;
    }
}
