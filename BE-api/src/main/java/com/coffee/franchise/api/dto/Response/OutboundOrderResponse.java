package com.coffee.franchise.api.dto.Response;

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
    private String warehouseName;
    private UUID destinationFranchiseId;
    private String destinationFranchiseName;
    private OutboundOrderStatus status;
    private String batchCode;
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
        private String ingredientName;
        private String unit;
        private BigDecimal quantity;
        private String imageUrl;

    }
}
