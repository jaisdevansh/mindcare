
import { apiFetch } from "../api";

export const authService = {
    async login(credentials: any) {
        return apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
        });
    },

    async signup(userData: any) {
        return apiFetch("/auth/register", {
            method: "POST",
            body: JSON.stringify(userData),
        });
    },

    async getMe() {
        return apiFetch("/auth/me");
    },

    logout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },
    async forgotPassword(email: string) {
        return apiFetch("/auth/forgot-password", {
            method: "POST",
            body: JSON.stringify({ email }),
        });
    },
    async resetPassword(token: string, newPassword: any) {
        return apiFetch("/auth/reset-password", {
            method: "POST",
            body: JSON.stringify({ token, newPassword }),
        });
    }
};
