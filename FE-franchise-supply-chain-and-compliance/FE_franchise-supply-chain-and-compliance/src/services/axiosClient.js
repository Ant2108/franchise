import axios from 'axios';
import { getCookie, setCookie, removeCookie, removeUserRoles } from '../utils/cookieUtils';

const API_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Tạo Axios instance với cấu hình mặc định
 */
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Request Interceptor - Thêm token vào mỗi request
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie('access_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const warehouseId = getCookie("warehouse_id");
    if (warehouseId) {
      config.headers['X-Warehouse-Id'] = warehouseId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor - Xử lý lỗi tập trung và token refresh
 */
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getCookie('refresh_token');
        
        if (!refreshToken) {
          // Tránh lặp vô hạn nếu không có refresh token
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.result || response.data;
        
        if (accessToken) {
          setCookie('access_token', accessToken, 7);
          if (newRefreshToken) {
            setCookie('refresh_token', newRefreshToken, 7);
          }
          processQueue(null, accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        }
        
        throw new Error('Failed to refresh token');
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Dọn dẹp sạch sẽ khi không thể refresh
        removeCookie('access_token');
        removeCookie('refresh_token');
        removeUserRoles();
        removeCookie('warehouse_id');
        
        // Chỉ redirect nếu không phải đang ở trang login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * API Client wrapper với các method tiện lợi
 */
const apiClient = {
  get: async (endpoint, params = {}, config = {}) => {
    const response = await axiosInstance.get(endpoint, { ...config, params });
    return response.data;
  },

  post: async (endpoint, data = {}, config = {}) => {
    const isFormData = data instanceof FormData;
    const headers = isFormData ? {} : undefined;
    
    const response = await axiosInstance.post(endpoint, data, {
      ...config,
      headers: { ...config.headers, ...headers },
    });
    return response.data;
  },

  put: async (endpoint, data = {}, config = {}) => {
    const isFormData = data instanceof FormData;
    const headers = isFormData ? {} : undefined;
    
    const response = await axiosInstance.put(endpoint, data, {
      ...config,
      headers: { ...config.headers, ...headers },
    });
    return response.data;
  },

  patch: async (endpoint, data = {}, config = {}) => {
    const response = await axiosInstance.patch(endpoint, data, config);
    return response.data;
  },

  delete: async (endpoint, config = {}) => {
    const response = await axiosInstance.delete(endpoint, config);
    return response.data;
  },
};

export default apiClient;
