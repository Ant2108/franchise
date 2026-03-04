package com.coffee.franchise.api.dto.Request;

<<<<<<< HEAD
import lombok.Data;
=======
import lombok.*;
import lombok.experimental.FieldDefaults;
>>>>>>> aa90a4dc28b5ffd5de1131d84a7daabd39e4d12d

import java.math.BigDecimal;
import java.util.UUID;

@Data
<<<<<<< HEAD
public class InventoryRequest {

    private UUID warehouseId;
    private UUID ingredientId;
    private BigDecimal quantityAvailable;
    private BigDecimal quantityReserved;
=======
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class InventoryRequest {
    private UUID warrehouseId;
    private UUID ingredientId;
    private BigDecimal quantitytoAdd;
    private double quantityAvailable;
    private double quantityReserved;

>>>>>>> aa90a4dc28b5ffd5de1131d84a7daabd39e4d12d
}
