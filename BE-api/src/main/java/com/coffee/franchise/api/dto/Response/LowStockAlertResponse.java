package com.coffee.franchise.api.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LowStockAlertResponse {
    private UUID warehouseId;
    private String warehouseName;
    private UUID ingredientId;
    private String ingredientName;
    private String ingredientUnit;
    private BigDecimal quantityAvailable;
    private BigDecimal alertThreshold;
    private BigDecimal deficit;
}

