package com.coffee.franchise.api.service;

import com.coffee.franchise.api.dto.Request.AddToCartRequest;
import com.coffee.franchise.api.dto.Request.UpdateCartItemRequest;
import com.coffee.franchise.api.dto.Response.CartResponse;

import java.util.UUID;

public interface CartService {

    CartResponse.CartItemResponse addToCart(UUID warehouseId, AddToCartRequest request);

    CartResponse getCart(UUID warehouseId);

    CartResponse.CartItemResponse updateCartItemQuantity(UUID cartItemId, UpdateCartItemRequest request);

    void removeCartItem(UUID cartItemId);

    void clearCart(UUID warehouseId);
}
