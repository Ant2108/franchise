package com.coffee.franchise.api.dto.Request;

import com.coffee.franchise.api.enums.InboundOrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InboundOrderStatusUpdateRequest {
    private InboundOrderStatus status;
    private LocalDateTime actualDate;
    private List<ItemReceiptRequest> itemReceipts;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemReceiptRequest {
        private UUID itemId;
        private Boolean received;
        private BigDecimal receivedQuantity;
    }
}
