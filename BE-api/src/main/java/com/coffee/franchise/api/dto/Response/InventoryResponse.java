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
    private UUID id;
    private UUID warehouse_id;
    private UUID ingredients_id;
    private String name;
    private BigDecimal quantity_available;
    private BigDecimal quantity_reserved;
    private LocalDateTime lastUpdated;

    public static InventoryResponse fromEntity(Inventory inventory){
        return InventoryResponse.builder()
                .id(inventory.getId())
                .warehouse_id(inventory.getWarehouse().getId())
                .ingredients_id(inventory.getIngredient().getId())
                .name(inventory.getIngredient().getName())
                .quantity_available(inventory.getQuantityAvailable())
                .quantity_reserved(inventory.getQuantityReserved())
                .lastUpdated(inventory.getLastUpdated())
                .build();
    }
}
