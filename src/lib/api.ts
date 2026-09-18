import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ENDPOINTS } from '../utils/apiendpoint';

export const tokenManager = {
  getToken: (): string | null => {
    const token = localStorage.getItem('authToken');
    if (!token || token === 'undefined' || token === 'null' || token === '[object Object]') {
      return null;
    }
    return token.trim();
  },

  setToken: (token: string): void => {
    if (token && typeof token === 'string' && token.trim() !== '') {
      localStorage.setItem('authToken', token.trim());
    }
  },

  removeToken: (): void => {
    localStorage.removeItem('authToken');
  },

  getRefreshToken: (): string | null => {
    const token = localStorage.getItem('refreshToken');
    if (!token || token === 'undefined' || token === 'null' || token === '[object Object]') {
      return null;
    }
    return token.trim();
  },

  setRefreshToken: (token: string): void => {
    if (token && typeof token === 'string' && token.trim() !== '') {
      localStorage.setItem('refreshToken', token.trim());
    }
  },

  removeRefreshToken: (): void => {
    localStorage.removeItem('refreshToken');
  },

  isTokenValid: (): boolean => {
    const token = tokenManager.getToken();
    if (!token) return false;

    if (token.includes('.')) {
      try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return true;

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
        const json = atob(padded);
        const payload = JSON.parse(json);

        const currentTimeSeconds = Date.now() / 1000;
        if (typeof payload.exp === 'number') {
          return payload.exp > currentTimeSeconds;
        }
        return true;
      } catch {
        return true;
      }
    }

    return true;
  },

  clearAuthData: (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
  }
};

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || '/api/v1/',
  timeout: 1000000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const isAuthLoginRequest =
      config.url?.includes('/auth/login') ||
      config.url?.includes('auth/login');

    if (!isAuthLoginRequest) {
      const token = tokenManager.getToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

apiClient.interceptors.response.use(
  (response) => {
    const authHeader = response.headers?.['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const newToken = authHeader.substring(7).trim();
      if (newToken) {
        tokenManager.setToken(newToken);
      }
    }
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    const isAuthRequest =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('auth/login') ||
      originalRequest?.url?.includes('/auth/refresh-token') ||
      originalRequest?.url?.includes('auth/refresh-token');

    if (isAuthRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      const refreshToken = tokenManager.getRefreshToken();

      if (!refreshToken) {
        tokenManager.clearAuthData();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            if (newToken) {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(apiClient(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;

      try {
        const response = await apiClient.post(ENDPOINTS.refreshToken, { refreshToken });
        const payload = response.data?.data || response.data;
        const newAccessToken = payload?.token || payload?.accessToken;
        const newRefreshToken = payload?.refreshToken;

        if (!newAccessToken) {
          throw new Error('No access token returned from refresh');
        }

        tokenManager.setToken(newAccessToken);
        if (newRefreshToken) {
          tokenManager.setRefreshToken(newRefreshToken);
        }

        onTokenRefreshed(newAccessToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        onTokenRefreshed('');
        tokenManager.clearAuthData();
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

export default apiClient;
