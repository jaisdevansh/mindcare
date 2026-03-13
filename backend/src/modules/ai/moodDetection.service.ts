import { generateGroqResponse } from './groq.service';

export const detectMood = async (text: string): Promise<{ mood: string, score: number }> => {
    const prompt = `Analyze the following text and return ONLY a valid JSON object with "mood" (must be exactly one of: happy, sad, angry, stressed, neutral) and "score" (a number between 0 and 100 indicating confidence). No other text or markdown formatting. Text: "${text}"`;

    const response = await generateGroqResponse(prompt);
    try {
        const match = response.match(/\{[\s\S]*\}/);
        if (match) {
            return JSON.parse(match[0]);
        }
        return JSON.parse(response);
    } catch (e) {
        console.error('Mood parsing error:', e);
        return { mood: 'neutral', score: 50 };
    }
};
