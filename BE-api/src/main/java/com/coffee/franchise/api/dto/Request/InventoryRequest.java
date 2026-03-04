package com.coffee.franchise.api.dto.Request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class InventoryRequest {
    private UUID warrehouseId;
    private UUID ingredientId;
    private BigDecimal quantitytoAdd;
    private BigDecimal quantityAvailable;
    private BigDecimal quantityReserved;

}
