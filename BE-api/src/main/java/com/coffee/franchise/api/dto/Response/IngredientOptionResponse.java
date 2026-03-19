package com.coffee.franchise.api.dto.Response;

import com.coffee.franchise.api.entity.Ingredient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IngredientOptionResponse {
    public UUID id;
    public String name;
    public String description;

    public static IngredientOptionResponse optionResponse(Ingredient ingredient) {
        return IngredientOptionResponse.builder()
                .id(ingredient.getId())
                .name(ingredient.getName())
                .description(ingredient.getDescription())
                .build();
    }
}
