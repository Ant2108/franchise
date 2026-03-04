package com.coffee.franchise.api.dto.response;


import com.coffee.franchise.api.entity.Ingredient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IngredientResponse {

    public UUID id;
    public String ingredientName;
    public String unit;
    public BigDecimal alertThreshold;
    public String description;

    public static IngredientResponse fromEntity(Ingredient ingredient) {
        return IngredientResponse.builder()
                .id(ingredient.getId())
                .ingredientName(ingredient.getName())
                .unit(ingredient.getUnit())
                .alertThreshold(ingredient.getAlertThreshold())
                .description(ingredient.getDescription())
                .build();
    }

}
