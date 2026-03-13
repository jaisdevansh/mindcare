import { apiFetch } from "../api";

export const adminService = {
    async getDashboardStats() {
        return apiFetch("/admin/dashboard");
    },

    async getUsers() {
        return apiFetch("/admin/users");
    },

    async toggleUserStatus(id: string) {
        return apiFetch(`/admin/users/${id}/toggle-status`, {
            method: "PUT",
        });
    },

    async deleteUser(id: string, type: string) {
        return apiFetch(`/admin/users/${id}?type=${type}`, {
            method: "DELETE",
        });
    },

    async updateUserDetails(id: string, data: { name: string, email: string, type: string }) {
        return apiFetch(`/admin/users/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    },

    async getApplications() {
        return apiFetch("/admin/applications");
    },

    async approveApplication(id: string, adminNote?: string) {
        return apiFetch(`/admin/applications/${id}/approve`, {
            method: "PUT",
            body: JSON.stringify({ adminNote }),
        });
    },

    async rejectApplication(id: string, adminNote?: string) {
        return apiFetch(`/admin/applications/${id}/reject`, {
            method: "PUT",
            body: JSON.stringify({ adminNote }),
        });
    },
};
