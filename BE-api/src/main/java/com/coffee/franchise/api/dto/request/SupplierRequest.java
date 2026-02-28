package com.coffee.franchise.api.dto.request;

import com.coffee.franchise.api.enums.SupplierStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

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

    @NotNull(message = "Trạng thái không được để trống")
    private SupplierStatus status;
}