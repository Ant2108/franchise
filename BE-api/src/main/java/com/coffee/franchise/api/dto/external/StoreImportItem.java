package com.coffee.franchise.api.dto.external;

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
public class StoreImportItem {
    private UUID ingredientId;
    private BigDecimal quantityReceived;
    private BigDecimal unitCost;
    private LocalDateTime expiryDate;
}
