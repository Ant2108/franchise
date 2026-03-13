package com.coffee.franchise.api.dto.Request;

import com.coffee.franchise.api.enums.WarehouseStatus;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseRequest {

    private String code;
    private String name;
    private String location;
    private String description;
    private WarehouseStatus status;
    private BigDecimal latitude;
    private BigDecimal longitude;
}
