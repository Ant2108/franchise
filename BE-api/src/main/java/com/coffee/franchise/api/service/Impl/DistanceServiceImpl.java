package com.coffee.franchise.api.service.Impl;

import com.coffee.franchise.api.dto.Response.DistanceResponse;
import com.coffee.franchise.api.entity.Supplier;
import com.coffee.franchise.api.entity.Warehouse;
import com.coffee.franchise.api.exception.AppException;
import com.coffee.franchise.api.repository.SupplierRepository;
import com.coffee.franchise.api.repository.WarehouseRepository;
import com.coffee.franchise.api.service.DistanceService;
import com.coffee.franchise.api.utility.DistanceUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DistanceServiceImpl implements DistanceService {

    @Autowired
    private WarehouseRepository warehouseRepository;
    @Autowired
    private SupplierRepository supplierRepository;

    public DistanceResponse calculateDistance(UUID supplierId, UUID warehouseId) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST,"Supplier not found"));

        Warehouse warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST,"Warehouse not found"));

        if (supplier.getLatitude() == null || supplier.getLongitude() == null ||
                warehouse.getLatitude() == null || warehouse.getLongitude() == null) {
            throw new AppException(HttpStatus.BAD_REQUEST,"Missing coordinates");
        }

        double distance = DistanceUtil.calculateDistance(
                supplier.getLatitude().doubleValue(),
                supplier.getLongitude().doubleValue(),
                warehouse.getLatitude().doubleValue(),
                warehouse.getLongitude().doubleValue()
        );
        double rounded = Math.round(distance * 100.0) / 100.0;

        return DistanceResponse.builder()
                .distanceKm(rounded)
                .supplierId(supplierId)
                .warehouseId(warehouseId)
                .build();
    }
}
