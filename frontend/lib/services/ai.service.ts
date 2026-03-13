
import { apiFetch } from "../api";

export const aiService = {
    async chat(message: string) {
        return apiFetch("/ai/chat", {
            method: "POST",
            body: JSON.stringify({ message }),
        });
    },

    async detectMood(text: string) {
        return apiFetch("/ai/mood-detect", {
            method: "POST",
            body: JSON.stringify({ text }),
        });
    },

    async checkDepression(responses: any) {
        return apiFetch("/ai/depression-check", {
            method: "POST",
            body: JSON.stringify({ responses }),
        });
    },

    async getHistory() {
        return apiFetch("/ai/chat-history");
    },

    async getStats() {
        return apiFetch("/ai/stats");
    }
};
