import Groq from 'groq-sdk';
import { env } from '../../config/env';
import { generateGeminiResponse } from './gemini.service';

const groq = env.groqApiKey ? new Groq({ apiKey: env.groqApiKey }) : null;

export const generateGroqResponse = async (prompt: string, temperature: number = 0.7, jsonMode: boolean = false): Promise<string> => {
    if (groq) {
        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'openai/gpt-oss-120b',
                temperature,
                ...(jsonMode && { response_format: { type: 'json_object' } })
            });
            const content = chatCompletion.choices[0]?.message?.content;
            if (content && content.trim() !== '{}') {
                return content;
            }
        } catch (error: any) {
            console.warn('Groq primary model error, trying gpt-oss-20b:', error?.message || error);
            try {
                const retryCompletion = await groq.chat.completions.create({
                    messages: [{ role: 'user', content: prompt }],
                    model: 'openai/gpt-oss-20b',
                    temperature,
                    ...(jsonMode && { response_format: { type: 'json_object' } })
                });
                const content = retryCompletion.choices[0]?.message?.content;
                if (content && content.trim() !== '{}') {
                    return content;
                }
            } catch (retryError: any) {
                console.warn('Groq backup model error, falling back to Gemini:', retryError?.message || retryError);
            }
        }
    }

    // Reliable fallback to Gemini 2.5 Flash
    console.log('🔄 Using Gemini fallback for AI response generation');
    return await generateGeminiResponse(prompt);
};

