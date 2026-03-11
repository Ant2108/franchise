package com.coffee.franchise.api.dto.Request;

import com.coffee.franchise.api.entity.SupplierIngredient;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IngredientRequest {


      @NotNull(message = "ingredientName can be not null")
      public String ingredientName;

      @NotNull(message = "unit can be not null")
      public String unit;

    @NotNull(message = "alertThreshold cannot be null")
    @DecimalMin(value = "0.0", inclusive = false, message = "alertThreshold must be greater than 0")
    public BigDecimal alertThreshold;

      @Size(min = 5, message = "description must be between 5 and 100 characters")
      @Size(max = 100, message = "description must be between 5 and 100 characters")
      public String description;


}
