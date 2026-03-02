package com.coffee.franchise.api.dto.Request;

import com.coffee.franchise.api.enums.InboundOrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InboundOrderStatusUpdateRequest {
    private InboundOrderStatus status;
    private LocalDateTime actualDate;
}
