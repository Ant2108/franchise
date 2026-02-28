import apiClient from '../../../services/axiosClient';

const outboundApi = {
    /**
     * Lấy danh sách đơn xuất hàng, hỗ trợ filter qua params (vd: { status: 'PENDING' }).
     */
    getOrders: (params = {}) => {
        return apiClient.get('/outbounds', params);
    },

    /**
     * Lấy chi tiết một đơn xuất hàng theo ID.
     */
    getOrderById: (id) => {
        return apiClient.get(`/outbounds/${id}`);
    },

    /**
     * Tạo đơn xuất hàng mới.
     */
    createOrder: (data) => {
        return apiClient.post('/outbounds', data);
    },

    /**
     * Cập nhật trạng thái đơn xuất hàng.
     */
    updateOrderStatus: (id, status, notes = '') => {
        return apiClient.put(`/outbounds/${id}/status`, { status, notes });
    },
};

export default outboundApi;
