package com.coffee.franchise.api.dto.external;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreImportRequest {
    private UUID warehouseRequestId;
    private String status;
    private String rejectionReason;
    private String batchCode;
    private UUID franchiseStoreId;
    private LocalDateTime importDate;
    private List<StoreImportItem> items;
}
