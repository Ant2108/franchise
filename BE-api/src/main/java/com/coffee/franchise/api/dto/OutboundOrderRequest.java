package com.coffee.franchise.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OutboundOrderRequest {
    private UUID warehouseId;
    private UUID destinationFranchiseId;
    private List<OutboundOrderItemRequest> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OutboundOrderItemRequest {
        private UUID ingredientId;

        @NotNull(message = "Quantity cannot be null")
        @Positive(message = "Quantity must be greater than zero")
        private BigDecimal quantity;
    }
}
