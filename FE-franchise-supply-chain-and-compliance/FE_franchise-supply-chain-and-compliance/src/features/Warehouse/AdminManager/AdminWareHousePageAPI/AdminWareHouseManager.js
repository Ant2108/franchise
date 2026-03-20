import apiClient from "../../../../services/axiosClient";

export const AdminWareHouseManager = {
    getWarehouseManagers: () => {
        return apiClient.get(`/accounts/all/warehouse-managers`);
    },
    getWarehouseManagerDetail: (id) => {
        return apiClient.get(`/accounts/admin/${id}`);
    },   
};