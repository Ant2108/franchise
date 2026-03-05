import apiClient from '../../../services/axiosClient';

const inboundApi = {
    /**
     * Lấy danh sách đơn nhập hàng, hỗ trợ filter qua params (vd: { status: 'PENDING' }).
     */
    getOrders: (params = {}) => {
        return apiClient.get('/inbounds', params);
    },

    /**
     * Lấy chi tiết một đơn nhập hàng theo ID.
     */
    getOrderById: (id) => {
        return apiClient.get(`/inbounds/${id}`);
    },

    /**
     * Tạo mới đơn nhập hàng.
     */
    createOrder: (data) => {
        return apiClient.post('/inbounds', data);
    },


    /**
     * Cập nhật trạng thái đơn nhập hàng.
     */
    updateOrderStatus: (id, status, notes = '', itemReceipts = [], actualDate = null) => {
        return apiClient.put(`/inbounds/${id}/status`, { status, notes, itemReceipts, actualDate });
    },

    /**
     * Lấy danh sách marketplace item cho màn hình Inbound Suppliers.
     * Trả về ingredient + supplier + giá + khoảng cách (nếu có warehouseId/header).
     */
    getMarketplaceItems: (params = {}) => {
        return apiClient.get('/suppliers/marketplace', params);
    },
};

export default inboundApi;
