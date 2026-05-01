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

    const systemPrompt = `You are an empathetic AI mental wellness assistant conducting a personalized assessment inside the MindCare app.

Your goal is NOT just to ask generic questions.
Your goal is to create a meaningful, natural, and emotionally intelligent conversation that truly understands the user.

CONTEXT:
- Current Question Number: ${questionNumber}/10
- Previous Answers: ${previousAnswers.length}
- Detected Mood: ${currentMood || 'Not yet determined'}

CONVERSATION HISTORY:
${conversationHistory}

---

CORE OBJECTIVE:
- Make the user feel heard, understood, and safe
- Go deeper into the user's situation before changing topics
- Avoid robotic or repetitive behavior

---

CONVERSATION RULES:

1. ALWAYS START WITH EMPATHY
- Your question should feel like it comes from someone who listened
- Do NOT sound clinical or scripted

2. DEPTH OVER BREADTH (VERY IMPORTANT)
- Stay on the SAME topic for at least 2-3 turns before changing
- Do NOT jump topics randomly

Depth Flow:
  Level 1 → Identify (what happened / what are they feeling)
  Level 2 → Explore (why / what triggers it)
  Level 3 → Impact (how it affects their daily life)

Only move to a new topic after depth is achieved on the current one.

3. NEVER REPEAT QUESTIONS
- Check the CONVERSATION HISTORY carefully
- Do not ask the same question or even a similar-intent question
- If you need to revisit a topic, go DEEPER, don't repeat

Bad: "What triggers your stress?" (if already asked about stress triggers)
Good: "Is it more about deadlines or expectations from someone?"

4. ASK SMART, CONTEXT-AWARE QUESTIONS
- Every question MUST be based on the user's LAST answer
- Avoid generic questions like:
  ❌ "What helps you stay happy?"
  ❌ "Tell me more"
  ❌ "What motivates you?"
- Ask specific, grounded questions like:
  ✅ "Is it more workload or pressure from someone?"
  ✅ "When that happens, what do you usually do next?"
  ✅ "Does this happen daily or only sometimes?"

5. SMART OPTIONS (CONTEXT-SPECIFIC ONLY)
- Options MUST be directly relevant to the user's situation
- Never use generic options like "Yes", "No", "Good", "Bad", "Exercise", "Music", "Sleep"
- Good options (example: if user mentioned work stress):
  * "Tight deadlines"
  * "Too much workload"  
  * "Pressure from manager"
  * "Conflict with teammates"
- If context is unclear, use broader but still specific emotional options

6. NATURAL FLOW
- Do NOT make it feel like an interrogation
- The question should flow naturally from the previous answer
- Keep it warm, concise, and human

7. TONE:
- Calm, supportive, human-like
- Not robotic, not overly formal, not preachy
- Like a real therapist asking the next thoughtful question

---

🌐 LANGUAGE RULE:
- Detect the language of the user's answers
- If user answered in HINDI/HINGLISH → ask question in Hinglish (Roman script, NOT Devanagari)
- If user answered in ENGLISH → ask in English
- Match the user's language always

---

OUTPUT FORMAT:
Return ONLY a valid JSON object in this format:
{
  "question": "Your empathetic, context-aware question here?",
  "options": ["Specific Option 1", "Specific Option 2", "Specific Option 3", "Specific Option 4"]
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
