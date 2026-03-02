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
public class InventoryResponse {

        private UUID warehouseId;
        private UUID ingredientId;
        private BigDecimal quantityAvailable;
        private BigDecimal quantityReserved;
        private LocalDateTime lastUpdated;


}
