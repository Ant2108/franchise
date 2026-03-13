package com.coffee.franchise.api.dto.Response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Builder
public class SupplierMarketplaceItemResponse {
    private UUID supplierIngredientId;
    private UUID supplierId;
    private String supplierName;
    private UUID ingredientId;
    private String ingredientName;
    private String ingredientImageUrl;
    private String unit;
    private BigDecimal unitPrice;
    private BigDecimal minimumOrderQuantity;
    private Integer leadTimeDays;
    private Double distanceKm;
}
