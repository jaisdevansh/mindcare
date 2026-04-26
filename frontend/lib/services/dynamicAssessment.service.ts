import { apiFetch } from '../api';

export const dynamicAssessmentService = {
    // Start dynamic assessment
    async start() {
        return await apiFetch('/assignment/dynamic/start', {
            method: 'POST'
        });
    },

    // Answer question and get next
    async answerAndGetNext(sessionId: string, answer: string) {
        return await apiFetch('/assignment/dynamic/next', {
            method: 'POST',
            body: JSON.stringify({ sessionId, answer })
        });
    },

    // Submit final assessment
    async submit(sessionId: string) {
        return await apiFetch('/assignment/dynamic/submit', {
            method: 'POST',
            body: JSON.stringify({ sessionId })
        }, 120000); // 2 minute timeout for AI analysis
    }
};
