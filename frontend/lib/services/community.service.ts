import { apiFetch } from "../api";

export const communityService = {
    async getPosts() {
        return apiFetch("/community");
    },
    async createPost(content: string) {
        return apiFetch("/community", {
            method: "POST",
            body: JSON.stringify({ content }),
        });
    }
};
