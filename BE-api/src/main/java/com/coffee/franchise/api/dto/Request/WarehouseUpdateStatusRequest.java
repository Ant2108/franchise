package com.coffee.franchise.api.dto.Request;

import com.coffee.franchise.api.enums.WarehouseStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WarehouseUpdateStatusRequest {

    @NotNull
    @Schema(
            description = "Warehouse status",
            example = "ACTIVE"
    )
    private WarehouseStatus status;
}