package com.coffee.franchise.api.service;

import com.coffee.franchise.api.dto.Request.IngredientRequest;
import com.coffee.franchise.api.dto.Request.UpdateIngredientRequest;
import com.coffee.franchise.api.dto.Response.IngredientOptionResponse;
import com.coffee.franchise.api.dto.Response.IngredientResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface IngredientService {
      IngredientResponse createIngredient(IngredientRequest ingredientRequest, MultipartFile image) throws Exception;

      List<IngredientResponse> searchIngredient(String name);

      IngredientResponse updateIngredient(UUID id , UpdateIngredientRequest updateIngredientRequest,MultipartFile image) throws Exception;

      IngredientResponse deleteIngredientById(UUID id);

    List<IngredientOptionResponse> getAllIngredients();

    List<IngredientResponse> getAvailableIngredients();

    IngredientResponse getIngredientById(UUID id);

}
