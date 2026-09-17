import axios from 'axios';

const getApiUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
        // Strip extraneous quotes (e.g. '"/api"' -> '/api') and trailing slashes
        const cleaned = envUrl.replace(/^['"]+|['"]+$/g, '').trim().replace(/\/+$/, '');
        if (cleaned) return cleaned;
    }
    if (typeof window !== 'undefined' && window.location.hostname.includes('onrender.com')) {
        return 'https://legacy-gym-backend.onrender.com/api';
    }
    return 'http://localhost:8000/api';
};

const API_URL = getApiUrl();

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) throw new Error('No refresh token');
                
                const response = await axios.post(`${API_URL}/auth/refresh/`, {
                    refresh: refreshToken
                });
                
                localStorage.setItem('access_token', response.data.access);
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
