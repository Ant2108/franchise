package com.coffee.franchise.api.dto.Response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
 @Builder
public class WarehouseResponse {
    private UUID id;
    private String name;
    private String location;
    private String status;
    private UUID managerId;
}
