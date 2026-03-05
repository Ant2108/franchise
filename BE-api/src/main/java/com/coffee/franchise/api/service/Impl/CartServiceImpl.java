package com.coffee.franchise.api.service.Impl;

import com.coffee.franchise.api.dto.Request.AddToCartRequest;
import com.coffee.franchise.api.dto.Request.UpdateCartItemRequest;
import com.coffee.franchise.api.dto.Response.CartResponse;
import com.coffee.franchise.api.entity.Cart;
import com.coffee.franchise.api.entity.CartItem;
import com.coffee.franchise.api.entity.SupplierIngredient;
import com.coffee.franchise.api.entity.Warehouse;
import com.coffee.franchise.api.repository.CartItemRepository;
import com.coffee.franchise.api.repository.CartRepository;
import com.coffee.franchise.api.repository.SupplierIngredientRepository;
import com.coffee.franchise.api.repository.WarehouseRepository;
import com.coffee.franchise.api.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final WarehouseRepository warehouseRepository;
    private final SupplierIngredientRepository supplierIngredientRepository;

    @Override
    @Transactional
    public CartResponse.CartItemResponse addToCart(UUID warehouseId, AddToCartRequest request) {
        // Tìm hoặc tạo Cart cho warehouse
        Cart cart = cartRepository.findByWarehouseId(warehouseId)
                .orElseGet(() -> {
                    Warehouse warehouse = warehouseRepository.findById(warehouseId)
                            .filter(w -> !Boolean.TRUE.equals(w.getDeleted()))
                            .orElseThrow(() -> new IllegalArgumentException("Warehouse không tồn tại hoặc đã bị xóa"));
                    Cart newCart = Cart.builder()
                            .warehouse(warehouse)
                            .build();
                    return cartRepository.save(newCart);
                });

        // Tìm SupplierIngredient
        SupplierIngredient supplierIngredient = supplierIngredientRepository
                .findById(request.getSupplierIngredientId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy sản phẩm của nhà cung cấp với id: " + request.getSupplierIngredientId()));

        // Kiểm tra xem trong giỏ đã có sản phẩm này chưa -> cộng dồn quantity
        Optional<CartItem> existingItem = cartItemRepository
                .findByCartIdAndSupplierIngredientId(cart.getId(), supplierIngredient.getId());

        CartItem cartItem;
        if (existingItem.isPresent()) {
            cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity().add(request.getQuantity()));
            // Cập nhật giá mới nhất từ SupplierIngredient
            cartItem.setUnitPrice(supplierIngredient.getUnitPrice() != null
                    ? supplierIngredient.getUnitPrice()
                    : BigDecimal.ZERO);
        } else {
            cartItem = CartItem.builder()
                    .cart(cart)
                    .supplierIngredient(supplierIngredient)
                    .quantity(request.getQuantity())
                    .unitPrice(supplierIngredient.getUnitPrice() != null
                            ? supplierIngredient.getUnitPrice()
                            : BigDecimal.ZERO)
                    .build();
        }

        cartItem = cartItemRepository.save(cartItem);

        return mapToCartItemResponse(cartItem);
    }

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCart(UUID warehouseId) {
        Optional<Cart> cartOpt = cartRepository.findByWarehouseIdWithItems(warehouseId);

        if (cartOpt.isEmpty()) {
            // Trả về giỏ hàng rỗng
            return CartResponse.builder()
                    .warehouseId(warehouseId)
                    .grandTotal(BigDecimal.ZERO)
                    .totalItems(0)
                    .cartBySuppliers(Collections.emptyList())
                    .build();
        }

        Cart cart = cartOpt.get();
        List<CartItem> items = cart.getItems();

        if (items == null || items.isEmpty()) {
            return CartResponse.builder()
                    .warehouseId(warehouseId)
                    .grandTotal(BigDecimal.ZERO)
                    .totalItems(0)
                    .cartBySuppliers(Collections.emptyList())
                    .build();
        }

        // Gom nhóm theo Supplier
        Map<UUID, List<CartItem>> groupedBySupplier = items.stream()
                .collect(Collectors.groupingBy(
                        item -> item.getSupplierIngredient().getSupplier().getId()));

        List<CartResponse.CartBySupplierResponse> supplierGroups = new ArrayList<>();

        for (Map.Entry<UUID, List<CartItem>> entry : groupedBySupplier.entrySet()) {
            List<CartItem> supplierItems = entry.getValue();
            // Lấy tên supplier từ item đầu tiên trong nhóm
            String supplierName = supplierItems.get(0).getSupplierIngredient().getSupplier().getName();

            List<CartResponse.CartItemResponse> itemResponses = supplierItems.stream()
                    .map(this::mapToCartItemResponse)
                    .collect(Collectors.toList());

            BigDecimal subTotal = itemResponses.stream()
                    .map(CartResponse.CartItemResponse::getLineTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            supplierGroups.add(CartResponse.CartBySupplierResponse.builder()
                    .supplierId(entry.getKey())
                    .supplierName(supplierName)
                    .subTotal(subTotal)
                    .items(itemResponses)
                    .build());
        }

        BigDecimal grandTotal = supplierGroups.stream()
                .map(CartResponse.CartBySupplierResponse::getSubTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = items.size();

        return CartResponse.builder()
                .warehouseId(warehouseId)
                .grandTotal(grandTotal)
                .totalItems(totalItems)
                .cartBySuppliers(supplierGroups)
                .build();
    }

    @Override
    @Transactional
    public CartResponse.CartItemResponse updateCartItemQuantity(UUID cartItemId, UpdateCartItemRequest request) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm trong giỏ hàng"));

        cartItem.setQuantity(request.getQuantity());
        cartItem = cartItemRepository.save(cartItem);

        return mapToCartItemResponse(cartItem);
    }

    @Override
    @Transactional
    public void removeCartItem(UUID cartItemId) {
        if (!cartItemRepository.existsById(cartItemId)) {
            throw new IllegalArgumentException("Không tìm thấy sản phẩm trong giỏ hàng");
        }
        cartItemRepository.deleteById(cartItemId);
    }

    @Override
    @Transactional
    public void clearCart(UUID warehouseId) {
        Cart cart = cartRepository.findByWarehouseId(warehouseId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy giỏ hàng cho warehouse này"));

        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private CartResponse.CartItemResponse mapToCartItemResponse(CartItem item) {
        SupplierIngredient si = item.getSupplierIngredient();
        BigDecimal lineTotal = item.getQuantity().multiply(item.getUnitPrice());

        return CartResponse.CartItemResponse.builder()
                .cartItemId(item.getId())
                .supplierIngredientId(si.getId())
                .ingredientId(si.getIngredient().getId())
                .ingredientName(si.getIngredient().getName())
                .unit(si.getIngredient().getUnit())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .lineTotal(lineTotal)
                .build();
    }
}
