package com.coffee.franchise.api.service;

import com.coffee.franchise.api.dto.Request.SupplierRequest;
import com.coffee.franchise.api.dto.Response.SupplierIngredientOptionResponse;
import com.coffee.franchise.api.dto.Response.SupplierResponse;
import com.coffee.franchise.api.entity.Supplier;
import com.coffee.franchise.api.entity.SupplierIngredient;
import com.coffee.franchise.api.enums.SupplierIngredientStatus;
import com.coffee.franchise.api.repository.SupplierIngredientRepository;
import com.coffee.franchise.api.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final SupplierIngredientRepository supplierIngredientRepository;

    public SupplierService(SupplierRepository supplierRepository, SupplierIngredientRepository supplierIngredientRepository) {
        this.supplierRepository = supplierRepository;
        this.supplierIngredientRepository = supplierIngredientRepository;
    }

    // S18 - Create Supplier
    @Transactional
    public SupplierResponse createSupplier(SupplierRequest dto) {
        Supplier supplier = Supplier.builder()
                .name(dto.getName())
                .contactName(dto.getContactName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .status(dto.getStatus())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Supplier savedSupplier = supplierRepository.save(supplier);
        return mapToResponse(savedSupplier);
    }

    // S20 - Update Supplier
    @Transactional
    public SupplierResponse updateSupplier(UUID id, SupplierRequest dto) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));

        supplier.setName(dto.getName());
        supplier.setContactName(dto.getContactName());
        supplier.setEmail(dto.getEmail());
        supplier.setPhone(dto.getPhone());
        supplier.setAddress(dto.getAddress());
        supplier.setStatus(dto.getStatus());
        supplier.setUpdatedAt(LocalDateTime.now());

        return mapToResponse(supplierRepository.save(supplier));
    }

    // S21 - Get Detail
    public SupplierResponse getSupplierDetail(UUID id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        return mapToResponse(supplier);
    }

    // S22 - Search Supplier
    public List<SupplierResponse> searchSupplier(String keyword) {

        List<Supplier> suppliers = supplierRepository
                .findByNameContainingIgnoreCase(keyword);

        return suppliers.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SupplierResponse> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SupplierIngredientOptionResponse> getSupplierIngredients(UUID supplierId) {
        if (!supplierRepository.existsById(supplierId)) {
            throw new RuntimeException("Supplier not found with id: " + supplierId);
        }

        List<SupplierIngredient> supplierIngredients =
                supplierIngredientRepository.findAllBySupplierIdAndStatusWithIngredient(
                        supplierId,
                        SupplierIngredientStatus.ACTIVE
                );

        return supplierIngredients.stream()
                .map(si -> SupplierIngredientOptionResponse.builder()
                        .ingredientId(si.getIngredient().getId())
                        .ingredientName(si.getIngredient().getName())
                        .unit(si.getIngredient().getUnit())
                        .build())
                .collect(Collectors.toList());
    }



    private SupplierResponse mapToResponse(Supplier supplier) {
        return SupplierResponse.builder()
                .id(supplier.getId())
                .name(supplier.getName())
                .contactName(supplier.getContactName())
                .email(supplier.getEmail())
                .phone(supplier.getPhone())
                .address(supplier.getAddress())
                .status(supplier.getStatus())
                .createdAt(supplier.getCreatedAt())
                .updatedAt(supplier.getUpdatedAt())
                .build();
    }
    public void deleteSupplier(UUID id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        supplierRepository.delete(supplier);
    }
}