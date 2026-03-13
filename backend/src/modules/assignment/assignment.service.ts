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
        const prompt = `You are a mental health AI. Analyze this user's emotional responses and detect their current mood.

User responses:
${summary}

You MUST respond ONLY with raw JSON. No markdown. No explanation. Example:
{"mood":"stressed","confidenceScore":72}

Valid moods: happy, neutral, sad, stressed, anxious, burnout`;

        const raw = await generateGeminiResponse(prompt);
        console.log('[Mood] Raw AI response:', raw.substring(0, 100));
        const parsed = safeParseJSON(raw);
        if (parsed?.mood) {
            return {
                mood: String(parsed.mood).toLowerCase(),
                confidenceScore: Number(parsed.confidenceScore) || 70,
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
        const prompt = `You are a clinical mental health AI. Analyze this emotional summary and assess depression risk.

User responses:
${summary}

You MUST respond ONLY with raw JSON. No markdown. No explanation. Example:
{"depressionScore":45,"riskLevel":"Moderate"}

Valid riskLevel values: Low, Moderate, High`;

        const raw = await generateGeminiResponse(prompt);
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
        const prompt = `You are a mental wellness AI. Predict the user's likely mood tomorrow based on today's responses.

Current mood: ${currentMood}

User responses:
${summary}

You MUST respond ONLY with raw JSON. No markdown. No explanation. Example:
{"predictedMood":"neutral","confidence":65}

Valid moods: happy, neutral, sad, stressed, anxious, burnout`;

        const raw = await generateGeminiResponse(prompt);
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

Give 4 short, warm, personalized self-care suggestions.

You MUST respond ONLY with a raw JSON array. No markdown. No explanation. Example:
["Suggestion 1","Suggestion 2","Suggestion 3","Suggestion 4"]`;

        const raw = await generateGroqResponse(prompt);
        console.log('[Suggestions] Raw AI response:', raw.substring(0, 100));
        const parsed = safeParseJSON(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.slice(0, 4).map(String);
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
