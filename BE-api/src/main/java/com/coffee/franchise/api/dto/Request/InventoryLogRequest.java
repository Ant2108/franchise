package com.coffee.franchise.api.dto.Request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class InventoryLogRequest {
    private UUID warehouseId;
    private UUID ingredientId;
    private BigDecimal quantity;
    private UUID referenceId; // ID of the related entity (e.g., order, transfer)
    private LocalDateTime createdAt;
}
