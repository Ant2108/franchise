package com.coffee.franchise.api.dto.Response;

import lombok.Builder;
import lombok.Data;


import java.util.UUID;

@Data
@Builder
public class DistanceResponse {
    public UUID supplierId;
    public UUID warehouseId;
    public double distanceKm;



}

