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
    },

    assignManager: (warehouseId, managerId, confirmReplace = false) => {
        const queryParams = new URLSearchParams();
        if (managerId) queryParams.append('managerId', managerId);
        else queryParams.append('managerId', '');
        
        queryParams.append('confirmReplace', confirmReplace);
        
        return apiClient.put(`/warehouses/${warehouseId}/assign-manager?${queryParams.toString()}`, {});
    }
};

export default WareHouseAdminAPI;