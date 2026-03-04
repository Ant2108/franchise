package com.coffee.franchise.api.dto.Response;

<<<<<<< HEAD
import com.coffee.franchise.api.entity.Inventory;
=======
>>>>>>> aa90a4dc28b5ffd5de1131d84a7daabd39e4d12d
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
<<<<<<< HEAD
=======

>>>>>>> aa90a4dc28b5ffd5de1131d84a7daabd39e4d12d
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryResponse {
<<<<<<< HEAD
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
=======

        private UUID warehouseId;
        private UUID ingredientId;
        private BigDecimal quantityAvailable;
        private BigDecimal quantityReserved;
        private LocalDateTime lastUpdated;


>>>>>>> aa90a4dc28b5ffd5de1131d84a7daabd39e4d12d
}
