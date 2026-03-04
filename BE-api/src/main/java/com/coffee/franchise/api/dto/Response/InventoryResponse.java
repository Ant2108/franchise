package com.coffee.franchise.api.dto.Response;

import com.coffee.franchise.api.entity.Inventory;
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

    public static InventoryResponse fromEntity(Inventory item){
        return InventoryResponse.builder()
                .warehouseId(item.getWarehouse().getId())
                .ingredientId(item.getIngredient().getId())
                .quantityAvailable(item.getQuantityAvailable())
                .quantityReserved(item.getQuantityReserved())
                .build();
    }
}
