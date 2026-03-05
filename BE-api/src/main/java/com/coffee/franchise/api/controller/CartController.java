package com.coffee.franchise.api.controller;

import com.coffee.franchise.api.dto.Request.AddToCartRequest;
import com.coffee.franchise.api.dto.Request.UpdateCartItemRequest;
import com.coffee.franchise.api.dto.Response.CartResponse;
import com.coffee.franchise.api.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    /**
     * Lấy thông tin giỏ hàng của warehouse, nhóm theo supplier
     */
    @GetMapping
    public ResponseEntity<CartResponse> getCart(
            @RequestHeader("X-Warehouse-Id") UUID warehouseId) {
        return ResponseEntity.ok(cartService.getCart(warehouseId));
    }

    /**
     * Thêm sản phẩm vào giỏ hàng
     */
    @PostMapping
    public ResponseEntity<CartResponse.CartItemResponse> addToCart(
            @RequestHeader("X-Warehouse-Id") UUID warehouseId,
            @Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(cartService.addToCart(warehouseId, request));
    }

    /**
     * Cập nhật số lượng sản phẩm trong giỏ
     */
    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse.CartItemResponse> updateCartItemQuantity(
            @PathVariable UUID cartItemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        return ResponseEntity.ok(cartService.updateCartItemQuantity(cartItemId, request));
    }

    /**
     * Xóa một sản phẩm khỏi giỏ hàng
     */
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<Void> removeCartItem(@PathVariable UUID cartItemId) {
        cartService.removeCartItem(cartItemId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Xóa toàn bộ giỏ hàng
     */
    @DeleteMapping
    public ResponseEntity<Void> clearCart(
            @RequestHeader("X-Warehouse-Id") UUID warehouseId) {
        cartService.clearCart(warehouseId);
        return ResponseEntity.noContent().build();
    }
}
