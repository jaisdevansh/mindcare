import { generateGroqResponse } from './groq.service';
import { AIChat } from './aiChat.model';
import { MoodLog } from './moodLog.model';
import { DepressionAnalysis } from './depressionAnalysis.model';
import { aiLogger } from '../../utils/logger';

interface ConversationContext {
    mood: string;
    depressionScore: number;
    riskLevel: string;
    recentMessages: string[];
    lastQuestion: string;
    userHistorySummary: string;
}

// Extract conversation context from database
const buildConversationContext = async (userId: string, currentMessage: string, moodData: any, depressionData: any): Promise<ConversationContext> => {
    aiLogger.info('Building Conversation Context...');
    aiLogger.debug(`Current Message: ${currentMessage}`);
    
    // Get last 5 user messages (excluding current one which was just saved)
    const recentChats = await AIChat.find({ userId, role: 'user' }).sort({ createdAt: -1 }).limit(6);
    const recentMessages = recentChats.reverse().slice(0, 5).map(c => c.content);
    aiLogger.debug(`Recent Messages Count: ${recentMessages.length}`, recentMessages);
    
    // Get last AI question (to avoid repetition)
    const lastAIMessage = await AIChat.findOne({ userId, role: 'ai' }).sort({ createdAt: -1 });
    const lastQuestion = lastAIMessage?.content || '';
    aiLogger.debug(`Last AI Question: ${lastQuestion ? lastQuestion.substring(0, 80) + '...' : 'None (first conversation)'}`);
    
    // Get user history summary (last 10 mood logs)
    const moodHistory = await MoodLog.find({ userId }).sort({ createdAt: -1 }).limit(10);
    const moodCounts: Record<string, number> = {};
    moodHistory.forEach(m => {
        const mood = m.detectedMood.toLowerCase();
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });
    const dominantMood = Object.keys(moodCounts).sort((a, b) => moodCounts[b] - moodCounts[a])[0] || 'neutral';
    aiLogger.debug(`Mood History Count: ${moodHistory.length}`);
    aiLogger.debug('Mood Distribution', moodCounts);
    aiLogger.debug(`Dominant Mood: ${dominantMood}`);
    
    // Get average depression score
    const depressionHistory = await DepressionAnalysis.find({ userId }).sort({ createdAt: -1 }).limit(10);
    const avgDepression = depressionHistory.length > 0 
        ? Math.round(depressionHistory.reduce((sum, d) => sum + d.depressionScore, 0) / depressionHistory.length)
        : 0;
    aiLogger.debug(`Depression History Count: ${depressionHistory.length}`);
    aiLogger.debug(`Average Depression Score: ${avgDepression}`);
    
    const userHistorySummary = `Dominant mood: ${dominantMood}. Average depression score: ${avgDepression}/100. Recent pattern: ${moodHistory.length > 0 ? 'tracked' : 'new user'}.`;
    
    const context = {
        mood: moodData.mood.toLowerCase(),
        depressionScore: depressionData.depressionScore,
        riskLevel: depressionData.riskLevel,
        recentMessages: [...recentMessages, currentMessage],
        lastQuestion,
        userHistorySummary
    };
    
    aiLogger.separator();
    aiLogger.aiChat('===== CONTEXT SUMMARY =====');
    aiLogger.aiChat(`Current Mood: ${context.mood}`);
    aiLogger.aiChat(`Depression Score: ${context.depressionScore}/100`);
    aiLogger.aiChat(`Risk Level: ${context.riskLevel}`);
    aiLogger.aiChat(`Total Messages in Context: ${context.recentMessages.length}`);
    aiLogger.aiChat(`Last Question: ${context.lastQuestion ? 'Yes' : 'No (first time)'}`);
    aiLogger.aiChat(`User History: ${context.userHistorySummary}`);
    aiLogger.aiChat('===== CONTEXT BUILT =====');
    aiLogger.separator();
    
    return context;
};

export const generateSupportiveResponse = async (userMessage: string, moodData: any, depressionData: any, userId?: string): Promise<string> => {
    aiLogger.info('Generating AI Response...');
    
    // If userId not provided, fallback to simple response
    if (!userId) {
        aiLogger.warning('No userId provided - using simple response mode');
        const prompt = `You are MindCare AI, an empathetic mental wellness assistant.
User message: "${userMessage}"
Mood: ${moodData.mood} | Risk: ${depressionData.riskLevel} (${depressionData.depressionScore}/100)

Provide a supportive response (3-4 sentences). If high risk, gently suggest professional help.`;
        const response = await generateGroqResponse(prompt);
        aiLogger.success('Simple response generated');
        return response;
    }
    
    // Build rich conversation context
    const context = await buildConversationContext(userId, userMessage, moodData, depressionData);
    
    aiLogger.info('Sending to Groq API with System Prompt...');
    
    const systemPrompt = `You are "Aria", a warm, empathetic AI therapist inside the MindCare platform. You speak like a real human therapist — caring, gentle, and emotionally intelligent.

CONTEXT ABOUT THIS USER:
- Current mood: ${context.mood}
- Depression score: ${context.depressionScore}/100
- Risk level: ${context.riskLevel}
- Conversation history: ${JSON.stringify(context.recentMessages)}
- Last thing you said: "${context.lastQuestion}"
- User history: ${context.userHistorySummary}

🌐 LANGUAGE RULE (MOST IMPORTANT — NEVER BREAK THIS):
- Detect the language of the CURRENT user message.
- If the user writes in HINDI (Devanagari script like "मुझे अच्छा नहीं लग रहा") → respond in HINGLISH (Roman script Hindi like "Main samajh sakti hoon, yeh sun ke dil bhaari ho gaya"). DO NOT use Devanagari in your response — use Roman script only.
- If the user writes in HINGLISH (Roman script Hindi, e.g. "mujhe accha nahi lag raha") → respond in Hinglish (Roman script).
- If the user writes in ENGLISH → respond in English only.
- NEVER respond in English if the user wrote in Hindi or Hinglish.
- ALWAYS use Roman script (not Devanagari) for Hinglish responses — this is critical for voice readability.
- This rule overrides everything else. Language matching is mandatory.

Examples of correct Hinglish responses:
- "Main samajh sakti hoon, yeh sach mein bahut mushkil hota hai."
- "Yeh sunke dukh hua. Kya tum mujhe aur bata sakte ho is baare mein?"
- "Tumhari feelings bilkul sahi hain. Tum akele nahi ho is mein."

YOUR PERSONALITY:
- Warm, non-judgmental, deeply empathetic
- You sound like a real human therapist, not a robot
- You never use bullet points or lists in responses
- You speak in natural, flowing sentences
- You validate feelings before offering any perspective
- Use gentle phrases in the user's language:
  English: "I hear you", "That sounds really hard", "It makes sense you feel this way"
  Hinglish: "Main samajh sakti hoon", "Yeh bahut mushkil hota hai", "Tumhari feelings bilkul sahi hain"

HOW TO RESPOND:
1. ALWAYS acknowledge and validate what the user said first (1-2 sentences)
2. Then either ask ONE focused follow-up question OR offer a gentle, practical perspective
3. If risk is HIGH: be extra gentle, focus on emotional safety, mention professional support warmly
4. If the user seems in crisis: validate deeply and gently suggest calling iCall (9152987821)
5. Never give a generic response — always reference what the user actually said
6. Keep responses to 3-5 sentences max — concise but deeply caring
7. End with either a soft question or a supportive statement, never both

RULES:
- NEVER say "As an AI..." or break character
- NEVER repeat the last question verbatim
- NEVER give a clinical diagnosis
- NEVER use bullet points or numbered lists
- ALWAYS match the user's language — this is non-negotiable

Current user message: "${userMessage}"

Respond as Aria now. CRITICAL: If responding in Hinglish, use ONLY Roman script — never Devanagari. English TTS cannot read Devanagari properly.`;

    aiLogger.debug(`System Prompt Length: ${systemPrompt.length} characters`);
    aiLogger.info('Calling Groq API...');
    
    const response = await generateGroqResponse(systemPrompt);
    
    aiLogger.success('Groq API Response Received');
    aiLogger.debug(`Response Length: ${response.length} characters`);
    aiLogger.aiChat(`Response Preview: ${response.substring(0, 150)}${response.length > 150 ? '...' : ''}`);
    
    return response.trim();
};
