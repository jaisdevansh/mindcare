import { generateGeminiResponse } from '../ai/gemini.service';
import { generateGroqResponse } from '../ai/groq.service';

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────

const EXERCISES = {
    breathing: '🌬️ 4-4-4 Box Breathing: Inhale for 4s → Hold 4s → Exhale 4s. Repeat for 2 minutes.',
    grounding: '🌿 5-4-3-2-1 Grounding: Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.',
    stretch: '🙆 Shoulder Roll: Roll your shoulders backward slowly 5 times.',
    water: '💧 Hydration Break: Drink a full glass of water slowly and mindfully.',
    walk: '🚶 Mini Walk: Step outside or walk around your room for 3 minutes.',
    eyes: '👁️ Eye Rest: Close your eyes completely for 60 seconds. Focus on your breath.',
    journaling: '📓 Quick Journal: Write 3 sentences about how you feel right now without judgment.',
    music: '🎵 Calming Sound: Put on soft background music or nature sounds for 5 minutes.',
};

// ─── QUESTIONS ─────────────────────────────────────────────────────────────────

export const ASSIGNMENT_QUESTIONS_DESCRIPTIVE = [
    { id: 1, question: "How have you been feeling emotionally today? Describe your overall mood." },
    { id: 2, question: "How often do you feel stressed or overwhelmed lately? (Daily / Few times a week / Rarely)" },
    { id: 3, question: "How well did you sleep last night? Did you wake up feeling rested?" },
    { id: 4, question: "Do you feel motivated to complete your daily tasks and responsibilities?" },
    { id: 5, question: "How often do you feel anxious, worried, or restless?" },
    { id: 6, question: "Do you feel lonely or disconnected from the people around you?" },
    { id: 7, question: "How often do you feel sad, hopeless, or empty?" },
    { id: 8, question: "Do you still find enjoyment and pleasure in activities you normally like?" },
    { id: 9, question: "How would you rate your energy level today on a scale of 1-10?" },
    { id: 10, question: "Do you feel supported and cared for by the people around you?" },
];

export const ASSIGNMENT_QUESTIONS_MCQ = [
    {
        id: 1,
        question: "How would you describe your overall mood today?",
        options: ["😊 Great — I feel happy and positive", "😐 Okay — neither good nor bad", "😔 Low — feeling a bit down", "😰 Anxious or on edge", "🥵 Burned out and exhausted"]
    },
    {
        id: 2,
        question: "How often have you felt stressed or overwhelmed in the past week?",
        options: ["Almost never", "Once or twice", "Several times", "Almost every day", "Constantly — it's unmanageable"]
    },
    {
        id: 3,
        question: "How was your sleep last night?",
        options: ["Excellent — woke up fully refreshed", "Good — mostly restful", "Average — some interruptions", "Poor — barely slept", "Very poor — couldn't sleep at all"]
    },
    {
        id: 4,
        question: "How motivated do you feel to handle your daily tasks?",
        options: ["Very motivated — getting things done", "Somewhat motivated", "Neutral — going through the motions", "Hard to find motivation", "Completely unmotivated"]
    },
    {
        id: 5,
        question: "How often do you experience feelings of anxiety or worry?",
        options: ["Rarely or never", "Occasionally", "A few times a week", "Most days", "Every day — it's overwhelming"]
    },
    {
        id: 6,
        question: "How connected do you feel to the people around you?",
        options: ["Very connected — strong support system", "Somewhat connected", "Neutral", "Somewhat lonely or isolated", "Very lonely and disconnected"]
    },
    {
        id: 7,
        question: "How often do you experience feelings of sadness or hopelessness?",
        options: ["Never", "Rarely", "Sometimes", "Often", "Almost always"]
    },
    {
        id: 8,
        question: "Can you still enjoy activities or hobbies you normally love?",
        options: ["Yes — fully enjoying them", "Mostly yes", "A little less than usual", "Struggling to enjoy anything", "No enjoyment at all"]
    },
    {
        id: 9,
        question: "How would you rate your energy level today?",
        options: ["⚡ Very high — full of energy", "🟢 Good — feeling active", "🟡 Moderate — managing okay", "🟠 Low — tired most of the time", "🔴 Very low — exhausted"]
    },
    {
        id: 10,
        question: "How supported do you feel by the people in your life?",
        options: ["Very supported — people have my back", "Somewhat supported", "It varies", "I don't feel very supported", "I feel completely alone"]
    },
];

// Backwards compat alias (used by controller)
export const ASSIGNMENT_QUESTIONS = ASSIGNMENT_QUESTIONS_DESCRIPTIVE;


// ─── SAFE JSON PARSER ──────────────────────────────────────────────────────────
// Handles markdown fences, extracts JSON from surrounding text

const safeParseJSON = (text: string): any => {
    // Strip markdown code fences
    let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    // 1. Try direct parse
    try { return JSON.parse(cleaned); } catch { /* continue */ }

    // 2. Try to extract first JSON object
    const objMatch = cleaned.match(/\{[\s\S]*?\}/);
    if (objMatch) {
        try { return JSON.parse(objMatch[0]); } catch { /* continue */ }
    }

    // 3. Try to extract first JSON array
    const arrMatch = cleaned.match(/\[[\s\S]*?\]/);
    if (arrMatch) {
        try { return JSON.parse(arrMatch[0]); } catch { /* continue */ }
    }

    return null;
};

// ─── MOOD DETECTION ────────────────────────────────────────────────────────────

export const detectMoodFromAnswers = async (summary: string): Promise<{ mood: string; confidenceScore: number }> => {
    try {
        const prompt = `You are an expert clinical psychologist AI. Read the user's exact responses carefully and deduce their true current mood and a REALISTIC confidence score (0-100) based strictly on their words.

User responses:
${summary}

CRITICAL INSTRUCTIONS:
1. Do not sugarcoat the mood. If they sound depressed or exhausted, output 'sad' or 'burnout'.
2. The confidenceScore must reflect HOW CLEARLY the user expressed their feelings:
   - If answers are pre-selected MCQ options (short, non-descriptive), score 35-55 (low — user just clicked, not described).
   - If answers are brief/vague (1-2 words), score 40-60.
   - If answers are moderately descriptive, score 55-75.
   - Only give 75-90 if the user wrote detailed, emotionally specific, spontaneous sentences.
   - NEVER give above 90 unless the answers are deeply personal and emotionally explicit.
3. You MUST respond ONLY with a raw JSON object containing "mood" and "confidenceScore". No markdown.

Valid moods: happy, neutral, sad, stressed, anxious, burnout

Example output format:
{"mood":"stressed","confidenceScore":62}`;

        const raw = await generateGroqResponse(prompt, 0.2, true);
        console.log('[Mood] Raw AI response:', raw.substring(0, 100));
        const parsed = safeParseJSON(raw);
        if (parsed?.mood) {
            return {
                mood: String(parsed.mood).toLowerCase(),
                confidenceScore: Number(parsed.confidenceScore) || 55,
            };
        }
    } catch (err) {
        console.error('[Mood detection error]', err);
    }
    return { mood: 'neutral', confidenceScore: 50 };
};

// ─── DEPRESSION RISK ───────────────────────────────────────────────────────────

export const detectDepressionRisk = async (summary: string): Promise<{ depressionScore: number; riskLevel: 'Low' | 'Moderate' | 'High' }> => {
    try {
        const prompt = `You are an expert clinical psychiatrist AI. Analyze this emotional summary and assess the user's depression risk and severity score (0-100) based STRICTLY on their exact answers.

User responses:
${summary}

CRITICAL INSTRUCTIONS:
1. Be extremely accurate. 0-30 = Low, 31-60 = Moderate, 61-100 = High.
2. If the user mentions poor sleep, lack of motivation, feelings of hopelessness, or isolation, the depressionScore MUST be appropriately high (e.g., 60-90) and riskLevel "High".
3. Do not default to low risk if negative symptoms are present.
4. You MUST respond ONLY with a raw JSON object containing "depressionScore" and "riskLevel".

Valid riskLevel values: Low, Moderate, High

Example output format:
{"depressionScore":75,"riskLevel":"High"}`;

        const raw = await generateGroqResponse(prompt, 0.2, true);
        console.log('[Depression] Raw AI response:', raw.substring(0, 100));
        const parsed = safeParseJSON(raw);
        if (parsed && typeof parsed.depressionScore !== 'undefined') {
            const score = Number(parsed.depressionScore);
            const risk: 'Low' | 'Moderate' | 'High' = (['Low', 'Moderate', 'High'].includes(parsed.riskLevel))
                ? parsed.riskLevel
                : (score > 60 ? 'High' : score > 30 ? 'Moderate' : 'Low');
            return { depressionScore: score, riskLevel: risk };
        }
    } catch (err) {
        console.error('[Depression detection error]', err);
    }
    return { depressionScore: 25, riskLevel: 'Low' };
};

// ─── MOOD PREDICTION ───────────────────────────────────────────────────────────

export const predictTomorrowMood = async (summary: string, currentMood: string): Promise<{ predictedMood: string; confidence: number }> => {
    try {
        const prompt = `You are a mental wellness AI. Predict the user's most likely mood tomorrow based strictly on their exact responses today.

Current mood: ${currentMood}

User responses:
${summary}

CRITICAL INSTRUCTIONS:
1. Be realistic. If the user is currently "burnout" or "sad", they are unlikely to magically be "happy" tomorrow unless they mentioned a specific upcoming positive event.
2. Provide a realistic confidence percentage based on how consistent their answers are.
3. You MUST respond ONLY with a raw JSON object containing "predictedMood" and "confidence".

Valid moods: happy, neutral, sad, stressed, anxious, burnout

Example output format:
{"predictedMood":"anxious","confidence":70}`;

        const raw = await generateGroqResponse(prompt, 0.3, true);
        console.log('[Prediction] Raw AI response:', raw.substring(0, 100));
        const parsed = safeParseJSON(raw);
        if (parsed?.predictedMood) {
            return {
                predictedMood: String(parsed.predictedMood).toLowerCase(),
                confidence: Number(parsed.confidence) || 60,
            };
        }
    } catch (err) {
        console.error('[Mood prediction error]', err);
    }
    return { predictedMood: currentMood, confidence: 60 };
};

// ─── AI THERAPIST SUGGESTIONS ─────────────────────────────────────────────────

export const generateTherapistSuggestions = async (summary: string, mood: string, riskLevel: string): Promise<string[]> => {
    try {
        const prompt = `You are a compassionate AI therapist for MindCare. A user is feeling "${mood}" with ${riskLevel} risk.

Responses:
${summary}

CRITICAL RULES:
1. Do NOT give generic advice like "take a walk", "journal", or "drink water".
2. Create 4 HIGHLY PERSONALIZED and UNIQUE self-care suggestions based EXACTLY on what the user said in their responses above.
3. If they talked about work, give work-related stress advice. If they talked about sleep, give sleep-specific advice.
4. Keep them short, warm, and practical.

You MUST respond ONLY with a raw JSON object containing an array of strings under the key "suggestions". No markdown. Example:
{ "suggestions": ["Personalized tip 1", "Personalized tip 2", "Personalized tip 3", "Personalized tip 4"] }`;

        const raw = await generateGroqResponse(prompt, 0.9, true);
        console.log('[Suggestions] Raw AI response:', raw.substring(0, 100));
        const parsed = safeParseJSON(raw);
        if (parsed && Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0) {
            return parsed.suggestions.slice(0, 4).map(String);
        }
    } catch (err) {
        console.error('[Therapist suggestions error]', err);
    }
    return [
        "Try writing down 3 things you are grateful for today.",
        "Take a 10-minute walk in fresh air to clear your mind.",
        "Reach out to a trusted friend or family member for a chat.",
        "Listen to calming music and allow yourself to rest.",
    ];
};

// ─── EXERCISE SELECTION ────────────────────────────────────────────────────────

export const selectExercises = (riskLevel: string, mood: string): string[] => {
    const always = [EXERCISES.breathing, EXERCISES.water];
    if (riskLevel === 'High') return [...always, EXERCISES.grounding, EXERCISES.journaling];
    if (mood === 'stressed' || mood === 'anxious') return [...always, EXERCISES.stretch, EXERCISES.eyes];
    if (mood === 'burnout') return [...always, EXERCISES.walk, EXERCISES.music];
    return [...always, EXERCISES.grounding, EXERCISES.eyes];
};

// ─── MENTAL SCORE ──────────────────────────────────────────────────────────────

export const calculateMentalScore = (depressionScore: number): { mentalScore: number; category: 'High Risk' | 'Moderate' | 'Healthy' } => {
    const mentalScore = Math.max(0, 100 - depressionScore);
    const category = mentalScore <= 30 ? 'High Risk' : mentalScore <= 60 ? 'Moderate' : 'Healthy';
    return { mentalScore, category };
};
