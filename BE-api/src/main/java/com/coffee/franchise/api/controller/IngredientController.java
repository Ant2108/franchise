package com.coffee.franchise.api.controller;

import com.coffee.franchise.api.dto.Request.IngredientRequest;
import com.coffee.franchise.api.dto.Request.UpdateIngredientRequest;
import com.coffee.franchise.api.dto.Response.IngredientResponse;
import com.coffee.franchise.api.service.IngredientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ingredients")
public class IngredientController {

    @Autowired
    private IngredientService ingredientService;
    @PostMapping(value = "/create",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
     public ResponseEntity<IngredientResponse> createIngredient(
             @Valid @ModelAttribute IngredientRequest ingredientRequest, @RequestPart(required = false) MultipartFile imageFile) throws Exception {
        return  ResponseEntity.ok(ingredientService.createIngredient(ingredientRequest,imageFile));
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
    @GetMapping("/available")
    public ResponseEntity<List<IngredientResponse>> getAvailableIngredients() {
        return ResponseEntity.ok(ingredientService.getAvailableIngredients());
    }
}
