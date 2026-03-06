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
        private UUID inventoryId;
        private UUID warehouseId;
        private String warehouseName;
        private UUID ingredientId;
        private String ingredientName;
        private BigDecimal quantityAvailable;
        private BigDecimal price;
        private BigDecimal quantityReserved;
        private LocalDateTime lastUpdated;

    public static InventoryResponse fromEntity(Inventory item,BigDecimal price){
        return InventoryResponse.builder()
                .inventoryId(item.getId())
                .warehouseId(item.getWarehouse().getId())
                .warehouseName(item.getWarehouse().getName())
                .ingredientId(item.getIngredient().getId())
                .ingredientName(item.getIngredient().getName())
                .quantityAvailable(item.getQuantityAvailable())
                .price(price)
                .quantityReserved(item.getQuantityReserved())
                .build();
    }
}
