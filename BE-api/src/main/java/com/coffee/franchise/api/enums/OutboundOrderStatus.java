package com.coffee.franchise.api.enums;

public enum OutboundOrderStatus {
    PENDING, // chờ xử lý
    PACKING, // đang đóng gói
    SHIPPING, // đang giao hàng
    DELIVERED, // đã giao hàng
    CANCELED // đã hủy
}
