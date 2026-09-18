import api from './api';

export const portalService = {
    // Member Dashboard
    async getMemberSummary() {
        const response = await api.get('/portal/member-summary/');
        return response.data;
    },

    // Admin Portal
    async getAdminOverview() {
        const response = await api.get('/portal/admin-overview/');
        return response.data;
    },

    async updateMembership(userId, data) {
        const response = await api.post(`/portal/members/${userId}/membership/`, data);
        return response.data;
    },

    async deleteMember(userId) {
        const response = await api.delete(`/portal/members/${userId}/`);
        return response.data;
    },

    // 2-Step OTP Verification
    async sendAdminOTP(phoneNumber, username = '') {
        const response = await api.post('/portal/send-otp/', { phone_number: phoneNumber, username });
        return response.data;
    },

    async verifyAdminOTP(phoneNumber, otpCode) {
        const response = await api.post('/portal/verify-otp/', { phone_number: phoneNumber, otp_code: otpCode });
        return response.data;
    },

    // Category Guidance (General Fitness, Weight Loss, Weight Gain)
    async getCategoryGuidance() {
        const response = await api.get('/portal/guidance/');
        return response.data;
    },

    async saveCategoryGuidance(data) {
        const response = await api.post('/portal/guidance/', data);
        return response.data;
    },

    // Member Daily Workout Timings & Logs
    async getWorkoutLogs() {
        const response = await api.get('/portal/workout-logs/');
        return response.data;
    },

    async createWorkoutLog(data) {
        const response = await api.post('/portal/workout-logs/', data);
        return response.data;
    },

    // Workouts
    async getWorkouts() {
        const response = await api.get('/portal/workouts/');
        return response.data;
    },

    async updateWorkout(planId, data) {
        const response = await api.put(`/portal/workouts/${planId}/`, data);
        return response.data;
    },

    async createWorkout(data) {
        const response = await api.post('/portal/workouts/', data);
        return response.data;
    },

    // Diets
    async getDiets(category = '') {
        const url = category ? `/portal/diets/?category=${category}` : '/portal/diets/';
        const response = await api.get(url);
        return response.data;
    },

    async updateDiet(dietId, data) {
        const response = await api.put(`/portal/diets/${dietId}/`, data);
        return response.data;
    },

    // Trainer Instructions
    async createInstruction(data) {
        const response = await api.post('/portal/instructions/', data);
        return response.data;
    },

    // Workout Room & Gym Gallery Media Management
    async getGalleryMedia(category = '') {
        const url = category ? `/portal/gallery/?category=${category}` : '/portal/gallery/';
        const response = await api.get(url);
        return response.data;
    },

    async createGalleryMedia(data) {
        const response = await api.post('/portal/gallery/', data);
        return response.data;
    },

    async deleteGalleryMedia(mediaId) {
        const response = await api.delete(`/portal/gallery/${mediaId}/`);
        return response.data;
    }
};
