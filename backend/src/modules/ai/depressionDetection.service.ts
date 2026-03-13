import { generateGeminiResponse } from './gemini.service';

export const checkDepressionRisk = async (text: string): Promise<{ depressionScore: number, riskLevel: string }> => {
    const prompt = `Analyze the clinical depression risk of the following text with emotional reasoning. Return ONLY a valid JSON object containing exactly "depressionScore" (number 0-100) and "riskLevel" (must be one of: low, moderate, high). No other text or markdown formatting. Text: "${text}"`;

    const response = await generateGeminiResponse(prompt);
    try {
        const match = response.match(/\{[\s\S]*\}/);
        if (match) {
            return JSON.parse(match[0]);
        }
        return JSON.parse(response);
    } catch (e) {
        console.error('Depression risk parsing error:', e);
        return { depressionScore: 10, riskLevel: 'low' };
    }
};
