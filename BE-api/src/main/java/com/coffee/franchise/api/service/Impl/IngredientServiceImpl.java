package com.coffee.franchise.api.service.Impl;


import com.coffee.franchise.api.dto.Request.IngredientRequest;
import com.coffee.franchise.api.dto.Response.IngredientResponse;
import com.coffee.franchise.api.dto.Request.UpdateIngredientRequest;
import com.coffee.franchise.api.entity.Ingredient;
import com.coffee.franchise.api.exception.AppException;
import com.coffee.franchise.api.repository.IngredientRepository;
import com.coffee.franchise.api.service.IngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
@Service
public class IngredientServiceImpl implements IngredientService {

    @Autowired
    private IngredientRepository ingredientRepo;

    @Override
    public IngredientResponse createIngredient(IngredientRequest ingredientRequest) {
         Ingredient existIngredient = ingredientRepo.findByName(ingredientRequest.getIngredientName());
         if ( existIngredient != null) {
             throw new RuntimeException("Ingredient name already exists");
         }

        Ingredient ingredient = Ingredient.builder()
                .name(ingredientRequest.getIngredientName())
                .unit(ingredientRequest.getUnit())
                .alertThreshold(ingredientRequest.getAlertThreshold())
                .description(ingredientRequest.getDescription())
                .build();


        return IngredientResponse.fromEntity(ingredientRepo.save(ingredient));
    }

    @Override
    public List<IngredientResponse> searchIngredient(String ingredientName) {
        return ingredientRepo
                .findByNameContainingIgnoreCase(ingredientName)
                .stream()
                .map(IngredientResponse::fromEntity)
                .toList();
    }

    @Override
    public IngredientResponse updateIngredient(UUID id, UpdateIngredientRequest updateIngredientRequest) {
        Ingredient existing = ingredientRepo.findById(id).orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "Ingredient not found"));

        existing.setName(updateIngredientRequest.getIngredientName());
        existing.setUnit(updateIngredientRequest.getUnit());
        existing.setAlertThreshold(updateIngredientRequest.getAlertThreshold());
        existing.setDescription(updateIngredientRequest.getDescription());

        return IngredientResponse.fromEntity(ingredientRepo.save(existing));
    }




    @Override
    public IngredientResponse deleteIngredientById(UUID id) {
        return null;
    }

    @Override
    public List<IngredientResponse> getAllIngredients() {
        return ingredientRepo.findAll()
                .stream()
                .map(IngredientResponse :: fromEntity)
                .toList();
    }

    @Override
    public List<IngredientResponse> getAvailableIngredients() {
        return ingredientRepo.getAvailableIngredients()
                .stream()
                .map(IngredientResponse::fromEntity)
                .toList();
    }
}
