package com.coffee.franchise.api.dto.Response;

import com.coffee.franchise.api.enums.SupplierStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class SupplierResponse {
    private UUID id;
    private String name;
    private String contactName;
    private String email;
    private String phone;
    private String address;
    private BigDecimal latitude;

    private BigDecimal longitude;
    private SupplierStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}