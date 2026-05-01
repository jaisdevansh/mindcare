import { apiFetch } from "../api";

export const helperService = {
    async getAllHelpers() {
        return apiFetch("/helpers");
    },
    async getProfile() {
        return apiFetch("/helpers/profile");
    },
    async getDashboardStats() {
        return apiFetch("/helpers/dashboard");
    },
    async acceptSupportRequest(sessionId: string) {
        return apiFetch(`/helpers/accept-request/${sessionId}`, { method: 'POST' });
    }
};
