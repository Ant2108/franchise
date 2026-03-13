package com.coffee.franchise.api.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {

    private UUID warehouseId;
    private BigDecimal grandTotal;
    private int totalItems;
    private List<CartBySupplierResponse> cartBySuppliers;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartBySupplierResponse {
        private UUID supplierId;
        private String supplierName;
        private BigDecimal subTotal;
        private List<CartItemResponse> items;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemResponse {
        private UUID cartItemId;
        private UUID supplierIngredientId;
        private UUID ingredientId;
        private String ingredientName;
        private String ingredientImageUrl;
        private String unit;
        private BigDecimal quantity;
        private BigDecimal unitPrice;
        private BigDecimal lineTotal;
    }
}
