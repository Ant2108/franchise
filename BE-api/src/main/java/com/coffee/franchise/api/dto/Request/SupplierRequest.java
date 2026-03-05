package com.coffee.franchise.api.dto.Request;

import com.coffee.franchise.api.enums.SupplierStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class SupplierRequest {

    @NotBlank(message = "Tên nhà cung cấp không được để trống")
    private String name;

    private String contactName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String phone;

    private String address;

    private BigDecimal latitude;

    private BigDecimal longitude;

    @NotNull(message = "Trạng thái không được để trống")
    private SupplierStatus status;
}