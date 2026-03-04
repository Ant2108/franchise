package com.coffee.franchise.api.service;

import com.coffee.franchise.api.dto.request.IngredientRequest;
import com.coffee.franchise.api.dto.request.UpdateIngredientRequest;
import com.coffee.franchise.api.dto.response.IngredientResponse;

import java.util.List;
import java.util.UUID;

public interface IngredientService {
      IngredientResponse createIngredient(IngredientRequest ingredientRequest);

      List<IngredientResponse> searchIngredient(String name);

      IngredientResponse updateIngredient(UUID id , UpdateIngredientRequest updateIngredientRequest);

      IngredientResponse deleteIngredientById(UUID id);

    List<IngredientResponse> getAllIngredients();

}
