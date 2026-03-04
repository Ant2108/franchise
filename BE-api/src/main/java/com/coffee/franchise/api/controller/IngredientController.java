package com.coffee.franchise.api.controller;

import com.coffee.franchise.api.dto.request.IngredientRequest;
import com.coffee.franchise.api.dto.request.UpdateIngredientRequest;
import com.coffee.franchise.api.dto.response.IngredientResponse;
import com.coffee.franchise.api.service.IngredientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ingredients")
public class IngredientController {

    @Autowired
    private IngredientService ingredientService;
    @PostMapping("/create")
     public ResponseEntity<IngredientResponse> createIngredient(
             @Valid @RequestBody IngredientRequest ingredientRequest){
        return  ResponseEntity.ok(ingredientService.createIngredient(ingredientRequest));
    }

    @GetMapping
    public ResponseEntity<List<IngredientResponse>> getAllIngredients()
    {
        return ResponseEntity.ok(ingredientService.getAllIngredients());
    }

    @GetMapping("/search")
    public ResponseEntity<List<IngredientResponse>> searchIngredients(@Valid @RequestParam String name){
        List<IngredientResponse> ingredient = ingredientService.searchIngredient(name);
        return ResponseEntity.ok(ingredient);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<IngredientResponse> updateIngredient(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateIngredientRequest updateIngredientRequest
    ){
        return ResponseEntity.ok(ingredientService.updateIngredient(id,updateIngredientRequest));
    }
}
