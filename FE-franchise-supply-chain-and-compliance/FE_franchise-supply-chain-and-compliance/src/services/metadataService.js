import apiClient from './axiosClient';

/**
 * Metadata Service - dùng chung cho nhiều feature.
 */
const metadataApi = {
    getOptions: (endpoint) => {
        return apiClient.get(`/metadata/${endpoint}`);
    },

    getIngredients: () => metadataApi.getOptions('ingredients'),
    getSuppliers: () => metadataApi.getOptions('suppliers'),
    getWarehouses: () => metadataApi.getOptions('warehouses'),
};

export default metadataApi;
