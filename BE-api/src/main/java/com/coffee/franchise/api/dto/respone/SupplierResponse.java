package com.coffee.franchise.api.dto;

import com.coffee.franchise.api.enums.SupplierStatus;
import lombok.Builder;
import lombok.Getter;

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
    private SupplierStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}