package com.coffee.franchise.api.dto.external;

import com.coffee.franchise.api.enums.OutboundOrderStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExternalOutboundStatusUpdateRequest {
    @JsonProperty("wareHouseId")
    private UUID warehouseId;

    private String batchCode;
    private UUID franchiseStoreId;
    private LocalDateTime receiveDate;
    private OutboundOrderStatus status;
}
