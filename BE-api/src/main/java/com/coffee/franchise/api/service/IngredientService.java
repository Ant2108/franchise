package com.coffee.franchise.api.service;

import com.coffee.franchise.api.dto.Request.IngredientRequest;
import com.coffee.franchise.api.dto.Request.UpdateIngredientRequest;
import com.coffee.franchise.api.dto.Response.IngredientResponse;

import java.util.List;
import java.util.UUID;

public interface IngredientService {
      IngredientResponse createIngredient(IngredientRequest ingredientRequest);

      List<IngredientResponse> searchIngredient(String name);

      IngredientResponse updateIngredient(UUID id , UpdateIngredientRequest updateIngredientRequest);

      IngredientResponse deleteIngredientById(UUID id);

    List<IngredientResponse> getAllIngredients();

    List<IngredientResponse> getAvailableIngredients();

}
