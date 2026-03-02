package com.coffee.franchise.api.dto.Response;

import com.coffee.franchise.api.enums.WarehouseStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseResponse {

    private UUID id;
    private String code;
    private String name;
    private String location;
    private String description;
    private WarehouseStatus status;
    private UUID managerId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
