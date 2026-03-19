import axios from 'axios';
import { getCookie, setCookie, removeCookie, removeUserRoles } from '../utils/cookieUtils';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: false,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// =======================
// REQUEST INTERCEPTOR
// =======================
axiosInstance.interceptors.request.use((config) => {
  const token = getCookie('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const warehouseId = getCookie("warehouse_id");
  if (warehouseId) {
    config.headers['X-Warehouse-Id'] = warehouseId;
  }

  // 🔥 AUTO HANDLE CONTENT-TYPE
  if (config.data instanceof FormData) {
    // 👉 để browser tự set multipart
    delete config.headers['Content-Type'];
  } else {
    // 👉 mặc định JSON
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

// =======================
// RESPONSE INTERCEPTOR
// =======================
axiosInstance.interceptors.response.use(
  (response) => response,
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
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getCookie('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.result || response.data;

        setCookie('access_token', accessToken, 7);
        if (newRefreshToken) {
          setCookie('refresh_token', newRefreshToken, 7);
        }

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);

        removeCookie('access_token');
        removeCookie('refresh_token');
        removeUserRoles();
        removeCookie('warehouse_id');

        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// =======================
// API CLIENT
// =======================
const apiClient = {
  get: (url, params = {}, config = {}) =>
    axiosInstance.get(url, { ...config, params }).then(res => res.data),

  post: (url, data = {}, config = {}) =>
    axiosInstance.post(url, data, config).then(res => res.data),

  put: (url, data = {}, config = {}) =>
    axiosInstance.put(url, data, config).then(res => res.data),

  patch: (url, data = {}, config = {}) =>
    axiosInstance.patch(url, data, config).then(res => res.data),

  delete: (url, config = {}) =>
    axiosInstance.delete(url, config).then(res => res.data),
};

export default apiClient;