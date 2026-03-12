package com.coffee.franchise.api.dto.Response;

import com.coffee.franchise.api.enums.SupplierIngredientStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierIngredientOptionResponse {
    private String name;
    private UUID ingredientId;
    private String ingredientName;
    private String unitPrice;
    private BigDecimal minimumOrderQuantity;
    private BigDecimal stockQuantity;
    private Integer leadTimeDays;
    private SupplierIngredientStatus status;

}
