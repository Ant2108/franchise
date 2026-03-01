package com.coffee.franchise.api.dto.Request;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class InventoryRequest {

    private UUID warehouseId;
    private UUID ingredientId;
    private BigDecimal quantityAvailable;
    private BigDecimal quantityReserved;
}
