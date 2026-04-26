import { generateGroqResponse } from '../ai/groq.service';

export const generateNextQuestion = async (
    questionNumber: number,
    previousAnswers: Array<{ question: string; answer: string; detectedMood?: string }>,
    currentMood?: string
): Promise<{ question: string; options: string[] }> => {
    
    console.log('\n🎯 ===== GENERATING DYNAMIC QUESTION =====');
    console.log('📊 Question Number:', questionNumber);
    console.log('📝 Previous Answers Count:', previousAnswers.length);
    console.log('😊 Current Mood:', currentMood || 'Not detected yet');

    // First question
    if (questionNumber === 1) {
        console.log('✅ First question - asking about general mood');
        return {
            question: "How have you been feeling emotionally today?",
            options: ["Very Positive and Energetic", "Okay, just a normal day", "A bit stressed or anxious", "Feeling down or sad", "Completely exhausted/Burned out"]
        };
    }

    // Build context
    const conversationHistory = previousAnswers
        .map((qa, idx) => `Q${idx + 1}: ${qa.question}\nA${idx + 1}: ${qa.answer}${qa.detectedMood ? ` (Mood: ${qa.detectedMood})` : ''}`)
        .join('\n\n');

    const systemPrompt = `You are a mental health assessment AI conducting a personalized psychological evaluation.

CONTEXT:
- Current Question Number: ${questionNumber}/10
- Previous Answers: ${previousAnswers.length}
- Detected Mood: ${currentMood || 'Not yet determined'}

CONVERSATION HISTORY:
${conversationHistory}

YOUR ROLE:
Based on the user's previous answers, generate the NEXT most relevant mental health question.

CRITICAL RULES:
1. NEVER repeat a question that was already asked. Check the CONVERSATION HISTORY and create a completely DIFFERENT question.
2. ALWAYS build on previous answers but explore a NEW angle of their mental health (e.g., if they talked about sleep, ask about work or relationships).
3. Keep the question clear and concise (max 20 words).
4. Provide EXACTLY 4 or 5 multiple-choice options.
5. The options MUST BE UNIQUE to this specific question and highly relevant. Do NOT use generic options like "Yes", "No", "Good", "Bad". Be creative and specific.
6. The question MUST NOT be a yes/no question.

OUTPUT FORMAT:
Return ONLY a valid JSON object in this format:
{
  "question": "The question text here?",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
}
No other text. Just the JSON.

Generate now:`;

    console.log('\n📤 Sending to Groq API with High Variance...');

    try {
        const responseText = await generateGroqResponse(systemPrompt, 0.9, true);
        const parsed = JSON.parse(responseText);
        if (parsed.question) {
            console.log('✅ Next Question Generated:', parsed.question);
            return {
                question: parsed.question,
                options: parsed.options || ["Very likely", "Somewhat likely", "Not very likely", "Not at all"]
            };
        }
    } catch (e) {
        console.error('Groq JSON parsing error:', e);
    }
    
    return {
        question: "Can you tell me more about how you are coping with this?",
        options: ["I have good coping strategies", "I try to ignore it", "I talk to friends/family", "I am struggling to cope"]
    };
};

export const detectMoodFromSingleAnswer = async (answer: string): Promise<{ mood: string; confidence: number }> => {
    const prompt = `Analyze this mental health assessment answer and detect the mood.

Answer: "${answer}"

CONFIDENCE RULES:
- If this looks like a pre-selected MCQ option (short, structured phrase), confidence = 35-55.
- If vague or 1-2 words, confidence = 40-60.
- If moderately descriptive, confidence = 55-75.
- Only 75+ if the user wrote detailed personal sentences spontaneously.

Return ONLY valid JSON with "mood" (must be exactly one of: happy, sad, stressed, anxious, neutral, burnout) and "confidence" (0-100). No markdown.

Example: {"mood":"stressed","confidence":58}`;

    try {
        const response = await generateGroqResponse(prompt);
        const match = response.match(/\{[\s\S]*\}/);
        if (match) {
            const parsed = JSON.parse(match[0]);
            return {
                mood: String(parsed.mood).toLowerCase(),
                confidence: Number(parsed.confidence) || 50
            };
        }
    } catch (e) {
        console.error('Mood detection error:', e);
    }
    
    return { mood: 'neutral', confidence: 50 };
};
