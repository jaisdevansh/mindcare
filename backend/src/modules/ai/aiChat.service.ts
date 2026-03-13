import { generateGroqResponse } from './groq.service';

export const generateSupportiveResponse = async (userMessage: string, moodData: any, depressionData: any): Promise<string> => {
    const prompt = `You are a supportive, empathetic, AI mental wellness assistant named MindCare.
The user just sent this message: "${userMessage}"
Context:
- Detected Mood: ${moodData.mood} (Confidence: ${moodData.score})
- Depression Risk Level: ${depressionData.riskLevel} (Score: ${depressionData.depressionScore})

Provide a kind, supportive, and helpful response. Limit to 3-4 sentences. If the risk level is high, gently suggest reaching out to a professional or helpline. Do not include json or any internal thoughts, just the final response for the user.`;

    const response = await generateGroqResponse(prompt);
    return response;
};
