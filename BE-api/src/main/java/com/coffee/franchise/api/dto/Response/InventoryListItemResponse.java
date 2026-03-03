package com.coffee.franchise.api.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryListItemResponse {

    private UUID inventoryId;
    private UUID warehouseId;
    private UUID ingredientId;
    private String ingredientName;
    private String unit;
    private BigDecimal quantityAvailable;
    private BigDecimal quantityReserved;
    private LocalDateTime lastUpdated;
}
