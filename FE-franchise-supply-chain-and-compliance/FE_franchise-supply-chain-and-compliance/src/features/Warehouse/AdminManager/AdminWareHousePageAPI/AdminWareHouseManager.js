import apiClient from "../../../../services/axiosClient";

export const AdminWareHouseManager = {
    getWarehouseManagers: () => {
        return apiClient.get(`/accounts/all/warehouse-managers`);
    },
};