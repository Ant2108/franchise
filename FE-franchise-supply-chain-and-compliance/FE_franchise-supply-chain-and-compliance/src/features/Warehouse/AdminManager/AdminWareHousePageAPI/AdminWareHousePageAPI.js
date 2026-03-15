import apiClient from '../../../../services/axiosClient';

const WareHouseAdminAPI = {
    getAllWarehouses: (params = {}) => {
        return apiClient.get('/warehouses', params);
    },

    getWarehouseDetail: (id) => {
        return apiClient.get(`/warehouses/${id}/detail`);
    },

    createWarehouse: (data) => {
        return apiClient.post('/warehouses', data);
    },
    updateWarehouse: (id, data) => {
        return apiClient.put(`/warehouses/${id}`, data);},

    updateWarehousePartial: (id, data) => {
        return apiClient.patch(`/warehouses/${id}`, data);
    },

    updateWarehouseStatus: (id, status, notes = '') => {
        return apiClient.patch(`/warehouses/${id}`, {
            status,
            notes
        });
    }
};

export default WareHouseAdminAPI;