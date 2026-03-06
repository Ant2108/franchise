import apiClient from "../../../../services/axiosClient.js";

const WareHouseInventoryLogAPI = {
    getInventoryLogs: (warehouseId) => {
        return apiClient.get(`/inventory-logs/warehouse/${warehouseId}`);
    },
    getAllInventoryLogs: () => {
        return apiClient.get(`/inventory-logs/warehouse/get-all`);
    },
    getInventoryLogsByIngredient: (warehouseId, ingredientId) => {
        return apiClient.get(`/inventory-logs/warehouse/${warehouseId}/ingredient/${ingredientId}`);
    },
    getInventoryLogsByReference: (referenceId) => {
        return apiClient.get(`/inventory-logs/reference/${referenceId}`);
    },
    getAllInboundOrders: () => {
        return apiClient.get(`/inbounds`);
    },
        getAllOutboundOrders: () => {
        return apiClient.get(`/outbounds`);
        },
    getAllInventories: () => {
        return apiClient.get(`/inventory/all`);
    },
    getLowStockAlerts: () => {
        return apiClient.get(`/inventory/low-stock`);
    }
};

export default WareHouseInventoryLogAPI;