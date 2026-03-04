package com.coffee.franchise.api.repository;

import com.coffee.franchise.api.dto.Response.IngredientResponse;
import com.coffee.franchise.api.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, UUID> {

    Ingredient findByName(String name);

    List<Ingredient> findByNameContainingIgnoreCase(String name);


}
