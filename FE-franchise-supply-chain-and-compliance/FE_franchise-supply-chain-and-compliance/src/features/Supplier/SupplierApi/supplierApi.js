import apiClient from '../../../services/axiosClient';

const supplierApi = {
    /**
     * Lấy danh sách tất cả nhà cung cấp
     */
    getSuppliers: (params = {}) => {
        return apiClient.get('/suppliers', params);
    },

    /**
     * Lấy danh sách nguyên liệu của một nhà cung cấp cụ thể
     */
    getSupplierIngredients: (supplierId) => {
        return apiClient.get(`/suppliers/${supplierId}/ingredients`); 
    }
};

export default supplierApi;