import { apiFetch } from "../api";

export const helperService = {
    async getAllHelpers() {
        return apiFetch("/helpers");
    },
    async getProfile() {
        return apiFetch("/helpers/profile");
    }
};
