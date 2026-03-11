package com.coffee.franchise.api.service;

import com.coffee.franchise.api.dto.Request.SupplierIngredientRequest;
import com.coffee.franchise.api.dto.Request.SupplierRequest;
import com.coffee.franchise.api.dto.Response.SupplierIngredientOptionResponse;
import com.coffee.franchise.api.dto.Response.SupplierMarketplaceItemResponse;
import com.coffee.franchise.api.dto.Response.SupplierResponse;
import com.coffee.franchise.api.entity.Ingredient;
import com.coffee.franchise.api.entity.Supplier;
import com.coffee.franchise.api.entity.SupplierIngredient;
import com.coffee.franchise.api.entity.Warehouse;
import com.coffee.franchise.api.enums.SupplierIngredientStatus;
import com.coffee.franchise.api.enums.SupplierStatus;
import com.coffee.franchise.api.repository.IngredientRepository;
import com.coffee.franchise.api.repository.SupplierIngredientRepository;
import com.coffee.franchise.api.repository.SupplierRepository;
import com.coffee.franchise.api.repository.WarehouseRepository;
import com.coffee.franchise.api.utility.DistanceUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SupplierService {
    @Autowired
    WarehouseRepository warehouseRepository;

    @Autowired
    IngredientRepository ingredientRepository;

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
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
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
                        .name(si.getSupplier().getName())
                        .ingredientId(si.getIngredient().getId())
                        .ingredientName(si.getIngredient().getName())
                        .unit(si.getIngredient().getUnit())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SupplierMarketplaceItemResponse> getMarketplaceItems(UUID warehouseId, String keyword) {
        List<SupplierIngredient> marketplaceItems = supplierIngredientRepository.findAllMarketplaceItems(
                SupplierIngredientStatus.ACTIVE,
                SupplierStatus.ACTIVE
        );

        if (keyword != null && !keyword.isBlank()) {
            String normalizedKeyword = keyword.trim().toLowerCase(Locale.ROOT);
            marketplaceItems = marketplaceItems.stream()
                    .filter(item ->
                            item.getIngredient().getName().toLowerCase(Locale.ROOT).contains(normalizedKeyword)
                                    || item.getSupplier().getName().toLowerCase(Locale.ROOT).contains(normalizedKeyword))
                    .collect(Collectors.toList());
        }

        Map<UUID, Double> supplierDistanceMap = buildSupplierDistanceMap(warehouseId, marketplaceItems);

        return marketplaceItems.stream()
                .map(item -> SupplierMarketplaceItemResponse.builder()
                        .supplierIngredientId(item.getId())
                        .supplierId(item.getSupplier().getId())
                        .supplierName(item.getSupplier().getName())
                        .ingredientId(item.getIngredient().getId())
                        .ingredientName(item.getIngredient().getName())
                        .unit(item.getIngredient().getUnit())
                        .unitPrice(item.getUnitPrice())
                        .minimumOrderQuantity(item.getMinimumOrderQuantity())
                        .leadTimeDays(item.getLeadTimeDays())
                        .distanceKm(supplierDistanceMap.get(item.getSupplier().getId()))
                        .build())
                .collect(Collectors.toList());
    }

    private Map<UUID, Double> buildSupplierDistanceMap(UUID warehouseId, List<SupplierIngredient> marketplaceItems) {
        Map<UUID, Double> distanceMap = new HashMap<>();
        if (warehouseId == null) {
            return distanceMap;
        }

        Warehouse warehouse = warehouseRepository.findById(warehouseId).orElse(null);
        if (warehouse == null || warehouse.getLatitude() == null || warehouse.getLongitude() == null) {
            return distanceMap;
        }

        for (SupplierIngredient item : marketplaceItems) {
            UUID supplierId = item.getSupplier().getId();
            if (distanceMap.containsKey(supplierId)) {
                continue;
            }

            BigDecimal supplierLat = item.getSupplier().getLatitude();
            BigDecimal supplierLon = item.getSupplier().getLongitude();
            if (supplierLat == null || supplierLon == null) {
                distanceMap.put(supplierId, null);
                continue;
            }

            double distance = DistanceUtil.calculateDistance(
                    supplierLat.doubleValue(),
                    supplierLon.doubleValue(),
                    warehouse.getLatitude().doubleValue(),
                    warehouse.getLongitude().doubleValue()
            );
            distanceMap.put(supplierId, Math.round(distance * 100.0) / 100.0);
        }

        return distanceMap;
    }

    private SupplierResponse mapToResponse(Supplier supplier) {
        return SupplierResponse.builder()
                .id(supplier.getId())
                .name(supplier.getName())
                .contactName(supplier.getContactName())
                .email(supplier.getEmail())
                .phone(supplier.getPhone())
                .address(supplier.getAddress())
                .longitude(supplier.getLongitude())
                .latitude(supplier.getLatitude())
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

    @Transactional
    public void addIngredientToSupplier(SupplierIngredientRequest request) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        Ingredient ingredient = ingredientRepository.findById(request.getIngredientId())
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));

        SupplierIngredient supplierIngredient = SupplierIngredient.builder()
                .supplier(supplier)
                .ingredient(ingredient)
                .unitPrice(request.getUnitPrice())
                .minimumOrderQuantity(request.getMinimumOrderQuantity())
                .stockQuantity(BigDecimal.valueOf(request.getStockQuantity()))
                .leadTimeDays(request.getLeadTimeDays())
                .status(request.getStatus())
                .build();

        supplierIngredientRepository.save(supplierIngredient);
    }


}