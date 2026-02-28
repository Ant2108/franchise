package com.coffee.franchise.api.controller;

import com.coffee.franchise.api.repository.IngredientRepository;
import com.coffee.franchise.api.repository.SupplierRepository;
import com.coffee.franchise.api.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/metadata")
@RequiredArgsConstructor
public class MetadataController {

    private final IngredientRepository ingredientRepository;
    private final SupplierRepository supplierRepository;
    private final WarehouseRepository warehouseRepository;

    public record OptionDto(UUID id, String name) {
    }

    public record IngredientOptionDto(UUID id, String name, String unit) {
    }

    @GetMapping("/ingredients")
    public List<IngredientOptionDto> getIngredients() {
        return ingredientRepository.findAll().stream()
                .map(i -> new IngredientOptionDto(i.getId(), i.getName(), i.getUnit()))
                .collect(Collectors.toList());
    }

    @GetMapping("/suppliers")
    public List<OptionDto> getSuppliers() {
        return supplierRepository.findAll().stream()
                .map(s -> new OptionDto(s.getId(), s.getName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/warehouses")
    public List<OptionDto> getWarehouses() {
        return warehouseRepository.findAll().stream()
                .map(w -> new OptionDto(w.getId(), w.getName()))
                .collect(Collectors.toList());
    }
}
