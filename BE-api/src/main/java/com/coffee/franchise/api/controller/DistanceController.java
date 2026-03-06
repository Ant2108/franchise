package com.coffee.franchise.api.controller;


import com.coffee.franchise.api.dto.Response.DistanceResponse;
import com.coffee.franchise.api.service.DistanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("api/v1/distances")
public class DistanceController {
    @Autowired
    DistanceService distanceService;
    @GetMapping()
    public DistanceResponse getDistance(
            @RequestParam UUID supplierId,
            @RequestParam UUID warehouseId
    ){
        return distanceService.calculateDistance(supplierId, warehouseId);
    }
}
