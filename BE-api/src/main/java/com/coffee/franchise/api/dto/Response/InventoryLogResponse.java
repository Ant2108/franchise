package com.coffee.franchise.api.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryLogResponse {
    private UUID id;
    private UUID warehouseId;
    private String warehouseName;
    private UUID ingredientId;
    private String ingredientName;
    private String transactionType;
    private BigDecimal quantityChanged;
    private UUID referenceId;
    private LocalDateTime createdAt;
}
