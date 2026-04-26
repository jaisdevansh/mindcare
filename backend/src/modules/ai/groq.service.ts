import Groq from 'groq-sdk';
import { env } from '../../config/env';

const groq = env.groqApiKey ? new Groq({ apiKey: env.groqApiKey }) : null;

export const generateGroqResponse = async (prompt: string, temperature: number = 0.7, jsonMode: boolean = false): Promise<string> => {
    if (!groq) return '{"error": "Groq API not configured."}';
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature,
            ...(jsonMode && { response_format: { type: 'json_object' } })
        });
        return chatCompletion.choices[0]?.message?.content || '{}';
    } catch (error) {
        console.error('Groq error:', error);
        return '{}';
    }
};
