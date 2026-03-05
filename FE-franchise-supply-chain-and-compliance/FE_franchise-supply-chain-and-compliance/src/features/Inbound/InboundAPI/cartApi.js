import apiClient from '../../../services/axiosClient';

const cartApi = {
    // Lấy thông tin giỏ hàng
    getCart: async () => {
        return apiClient.get('/carts');
    },

    // Thêm sản phẩm vào giỏ
    addToCart: async (data) => {
        return apiClient.post('/carts', data);
    },

    // Cập nhật số lượng
    updateCartItemQuantity: async (cartItemId, quantity) => {
        return apiClient.put(`/carts/items/${cartItemId}`, { quantity });
    },

    // Xóa một sản phẩm
    removeCartItem: async (cartItemId) => {
        return apiClient.delete(`/carts/items/${cartItemId}`);
    },

    // Xóa toàn bộ giỏ hàng
    clearCart: async () => {
        return apiClient.delete('/carts');
    },

    // Checkout giỏ hàng
    checkoutCart: async () => {
        return apiClient.post('/inbounds/checkout-cart');
    }
};

export default cartApi;
