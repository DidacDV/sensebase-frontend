import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type {
    AuthTokens,
    LoginCredentials,
    LoginResponse,
    RegisterCredentials,
    UserData
} from "@src/types/authenticationModel.ts";

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const ACCESS_TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const authenticationService = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const tokenManager = {
    getAccessToken: (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY),
    getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),

    setTokens: (tokens: AuthTokens): void => {
        localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
    },

    clearTokens: (): void => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },

    isAuthenticated: (): boolean => !!localStorage.getItem(ACCESS_TOKEN_KEY),
};

authenticationService.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

authenticationService.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<{ error?: string; details?: string; detail?: string }>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 - try to refresh token first
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = tokenManager.getRefreshToken();
            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
                        refresh: refreshToken,
                    });

                    const newAccessToken = response.data.access;
                    localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);

                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return authenticationService(originalRequest);
                } catch {
                    tokenManager.clearTokens();
                    window.location.href = '/login';
                    return Promise.reject(error);
                }
            }

            tokenManager.clearTokens();
            window.location.href = '/login';
            return Promise.reject(error);
        }

        if (error.response?.status === 403) {
            console.error('Access forbidden');
        }

        const message = error.response?.data?.details
            || error.response?.data?.detail
            || error.response?.data?.error
            || error.message;
        return Promise.reject(new Error(message));
    }
);
export const authApi = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await authenticationService.post<LoginResponse>('/users/login/', credentials);
        tokenManager.setTokens(response.data.tokens);
        return response.data;
    },

    register: async (credentials: RegisterCredentials): Promise<LoginResponse> => {
        const response = await authenticationService.post<LoginResponse>('/users/register/', credentials);
        tokenManager.setTokens(response.data.tokens);
        return response.data;
    },

    logout: async (): Promise<void> => {
        const refreshToken = tokenManager.getRefreshToken();
        try {
            if (refreshToken) {
                await authenticationService.post('/users/token/refresh/', { refresh: refreshToken });
            }
        } finally {
            tokenManager.clearTokens();
        }
    },

    refreshToken: async (): Promise<string> => {
        const refreshToken = tokenManager.getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token available');

        const response = await axios.post(`${API_BASE_URL}/users/token/refresh/`, {
            refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
        return newAccessToken;
    },

    getCurrentUser: async (): Promise<UserData> => {
        const response = await authenticationService.get<UserData>('/auth/me/');
        return response.data;
    },
};


export default authenticationService;