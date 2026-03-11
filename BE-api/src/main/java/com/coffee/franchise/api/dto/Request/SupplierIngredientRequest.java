package com.coffee.franchise.api.dto.Request;

import com.coffee.franchise.api.enums.SupplierIngredientStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierIngredientRequest {

    @NotNull(message = "supplierId cannot be null")
    private UUID supplierId;

    @NotNull(message = "ingredientId cannot be null")
    private UUID ingredientId;

    @NotNull(message = "unitPrice cannot be null")
    @DecimalMin(value = "0.0", inclusive = false, message = "unitPrice must be greater than 0")
    private BigDecimal unitPrice;

    @NotNull(message = "minimumOrderQuantity cannot be null")
    @DecimalMin(value = "0.0", inclusive = false, message = "minimumOrderQuantity must be greater than 0")
    private BigDecimal minimumOrderQuantity;

    @NotNull(message = "stockQuantity cannot be null")
    @Positive(message = "stockQuantity must be greater than 0")
    private Long stockQuantity;

    @NotNull(message = "leadTimeDays cannot be null")
    @Positive(message = "leadTimeDays must be greater than 0")
    private Integer leadTimeDays;

    @NotNull(message = "status cannot be null")
    private SupplierIngredientStatus status;
}