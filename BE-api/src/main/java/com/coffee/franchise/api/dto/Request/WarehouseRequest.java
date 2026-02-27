package com.coffee.franchise.api.dto.Request;

import com.coffee.franchise.api.enums.WarehouseStatus;
import lombok.Data;

import java.util.UUID;

@Data
public class WarehouseRequest {
    private String name;
    private String location;
    private UUID managerId;
    private WarehouseStatus status;
}

