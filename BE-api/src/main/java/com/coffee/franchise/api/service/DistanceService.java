package com.coffee.franchise.api.service;

import com.coffee.franchise.api.dto.Response.DistanceResponse;

import java.util.UUID;

public interface DistanceService {

    DistanceResponse calculateDistance(UUID supplierId, UUID warehouseId);
}
