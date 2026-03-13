
import { apiFetch } from "../api";

export const userService = {
    async updateProfile(profileData: any) {
        return apiFetch("/users/update-profile", {
            method: "PUT",
            body: JSON.stringify(profileData),
        });
    },

    async uploadProfileImage(formData: FormData) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

        const response = await fetch(`${baseUrl}/users/upload-profile-image`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                // Do NOT set Content-Type — browser sets it with multipart boundary
            },
            body: formData,
        });

        // Always return parsed JSON (success or failure) — don't throw
        try {
            return await response.json();
        } catch {
            return { success: false, message: `HTTP ${response.status}` };
        }
    },

    async changePassword(passwords: any) {
        return apiFetch("/users/change-password", {
            method: "PUT",
            body: JSON.stringify(passwords),
        });
    }
};
