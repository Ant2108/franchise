import apiClient from '../../../services/axiosClient';

/**
 * Tìm kiếm supplier theo keyword.
 */
export const getSuppliers = (keyword = '') => {
    if (keyword) {
        return apiClient.get('/suppliers/search', { keyword });
    }
    return apiClient.get('/suppliers');
};

/**
 * Lấy tất cả suppliers.
 */
export const getAllSuppliers = () => {
    return apiClient.get('/suppliers');
};

/**
 * Lấy chi tiết supplier theo ID.
 */
export const getSupplierDetail = (id) => {
    return apiClient.get(`/suppliers/${id}`);
};

/**
 * Tạo mới supplier.
 */
export const createSupplier = (data) => {
    return apiClient.post('/suppliers', data);
};

/**
 * Cập nhật supplier theo ID.
 */
export const updateSupplier = (id, data) => {
    return apiClient.put(`/suppliers/${id}`, data);
};

/**
 * Xóa supplier theo ID.
 */
export const deleteSupplier = (id) => {
    return apiClient.delete(`/suppliers/${id}`);
};

/**
 * Lấy danh sách marketplace items.
 */
export const getMarketplaceItems = (warehouseId, keyword = '') => {
    const params = {};
    if (warehouseId) params.warehouseId = warehouseId;
    if (keyword) params.keyword = keyword;
    return apiClient.get('/suppliers/marketplace', params);
};

/**
 * Lấy danh sách nguyên liệu của supplier.
 */
export const getSupplierIngredients = (id) => {
    return apiClient.get(`/suppliers/${id}/ingredients`);
};

