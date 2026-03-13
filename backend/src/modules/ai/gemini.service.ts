import { GoogleGenAI } from '@google/genai';
import { env } from '../../config/env';

const ai = env.geminiApiKey ? new GoogleGenAI({ apiKey: env.geminiApiKey }) : null;

export const generateGeminiResponse = async (prompt: string): Promise<string> => {
    if (!ai) return '{"error": "Gemini API not configured."}';
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || '{}';
    } catch (error) {
        console.error('Gemini error:', error);
        return '{}';
    }
};
