import apiClient from '../../../services/axiosClient';

const ingredientAPI = {

    getIngredient: (params = {}) => {
        return apiClient.get('/ingredients', {
            params
        });
    },

    createIngredient: (data) => {
        return apiClient.post('/ingredients/create', data);
    }

};

export default ingredientAPI;