
import { apiFetch } from "../api";

export const assignmentService = {
    async getQuestions(mode: 'descriptive' | 'mcq' = 'descriptive') {
        return apiFetch(`/assignment/questions?mode=${mode}`);
    },
    async submitAnswers(answers: string[]) {
        return apiFetch("/assignment/submit", {
            method: "POST",
            body: JSON.stringify({ answers }),
        });
    },
    async getHistory() {
        return apiFetch("/assignment/history");
    },
    async getLatest() {
        return apiFetch("/assignment/latest");
    },
    async getEmotionLogs() {
        return apiFetch("/assignment/emotion-logs");
    },
};
