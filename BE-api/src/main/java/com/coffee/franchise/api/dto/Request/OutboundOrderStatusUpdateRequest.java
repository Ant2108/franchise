package com.coffee.franchise.api.dto;

import com.coffee.franchise.api.enums.OutboundOrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OutboundOrderStatusUpdateRequest {
    private OutboundOrderStatus status;
}
