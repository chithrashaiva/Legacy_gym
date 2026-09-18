import api from './api';

export const authService = {
    async register(userData) {
        const response = await api.post('/auth/register/', userData);
        return response.data;
    },

    async login(credentials) {
        const response = await api.post('/auth/login/', credentials);
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    },

    async getCaptcha() {
        try {
            const response = await api.get('/auth/captcha/');
            return response.data;
        } catch (err) {
            // fallback client-side generation if offline
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            let code = '';
            for (let i = 0; i < 6; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return { captcha_code: code, captcha_token: 'local_' + code };
        }
    }
};
