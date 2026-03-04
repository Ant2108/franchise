const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Xử lý response từ fetch, tự động parse JSON và bắt lỗi.
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.message || errorData.error || `Request failed with status ${response.status}`;
        throw new Error(message);
    }
    // Trả về null nếu response rỗng (204 No Content)
    const text = await response.text();
    return text ? JSON.parse(text) : null;
};

/**
 * Tạo headers mặc định cho mỗi request.
 * Có thể mở rộng thêm Authorization token ở đây.
 */
const getDefaultHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
    };

    // TODO: Thêm token nếu có xác thực
    // const token = localStorage.getItem('token');
    // if (token) {
    //     headers['Authorization'] = `Bearer ${token}`;
    // }

    return headers;
};

/**
 * API Client dùng chung cho toàn dự án.
 * Cung cấp các method: get, post, put, delete.
 */
const apiClient = {
    get: async (endpoint, params = {}) => {
        const query = new URLSearchParams(params).toString();
        const url = query ? `${API_URL}${endpoint}?${query}` : `${API_URL}${endpoint}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: getDefaultHeaders(),
        });
        return handleResponse(response);
    },

    post: async (endpoint, data = {}) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: getDefaultHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    put: async (endpoint, data = {}) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: getDefaultHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    delete: async (endpoint) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getDefaultHeaders(),
        });
        return handleResponse(response);
    },
};

export default apiClient;
