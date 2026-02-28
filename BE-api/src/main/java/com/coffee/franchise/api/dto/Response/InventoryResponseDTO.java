package com.coffee.franchise.api.dto.Response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryResponseDTO {

    private UUID inventoryId;

    private UUID warehouseId;

    private UUID ingredientId;

    private BigDecimal quantityAvailable;

    private BigDecimal quantityReserved;

    private LocalDateTime lastUpdated;
}