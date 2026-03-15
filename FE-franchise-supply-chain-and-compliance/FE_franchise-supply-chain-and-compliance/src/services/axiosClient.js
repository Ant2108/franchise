import { getCookie } from "../utils/cookieUtils";
const API_URL = import.meta.env.VITE_API_BASE_URL ;

/**
 * Xử lý response từ fetch, tự động parse JSON và bắt lỗi.
 */
const handleResponse = async (response) => {
  const text = await response.text();

  // Thử parse JSON nếu có thể
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      (typeof data === "string" ? data : null) ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data;
};

/**
 * Tạo headers mặc định cho mỗi request.
 * Có thể mở rộng thêm Authorization token ở đây.
 */
const getDefaultHeaders = () => {
    const headers = {
        "Content-Type": "application/json",
    };

    const token = getCookie("access_token");

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const warehouseId =
        localStorage.getItem("warehouse_id") ||
        "11111111-1111-1111-1111-111111111111";

    if (warehouseId) {
        headers["X-Warehouse-Id"] = warehouseId;
    }

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
            credentials: "include",
        });
        return handleResponse(response);
    },

    post: async (endpoint, data = {}, params = {}) => {
        const isFormData = data instanceof FormData;
        const headers = getDefaultHeaders();
        
        if (isFormData) {
            delete headers['Content-Type'];
        }

        const query = new URLSearchParams(params).toString();
        const url = query ? `${API_URL}${endpoint}?${query}` : `${API_URL}${endpoint}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: isFormData ? data : JSON.stringify(data),
            credentials: "include"
        });
        return handleResponse(response);
    },

    put: async (endpoint, data = {}, params = {}) => {
        const isFormData = data instanceof FormData;
        const headers = getDefaultHeaders();

        if (isFormData) {
            delete headers['Content-Type'];
        }

        const query = new URLSearchParams(params).toString();
        const url = query ? `${API_URL}${endpoint}?${query}` : `${API_URL}${endpoint}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: headers,
            body: isFormData ? data : JSON.stringify(data),
            credentials: "include"
        });
        return handleResponse(response);
    },

    delete: async (endpoint) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getDefaultHeaders(),
            credentials: "include"  
        });
        return handleResponse(response);
    },
    patch: async (endpoint, data = {}, params = {}) => {
        const headers = getDefaultHeaders();

        const query = new URLSearchParams(params).toString();
        const url = query ? `${API_URL}${endpoint}?${query}` : `${API_URL}${endpoint}`;

        const response = await fetch(url, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(data),
            credentials: "include"
        });

        return handleResponse(response);
    },
};

export default apiClient;
