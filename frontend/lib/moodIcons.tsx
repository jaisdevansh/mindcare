import { Smile, Meh, Frown, Zap, AlertCircle, Flame, Brain } from 'lucide-react';

// Mood icon mapping with Lucide icons
export const MOOD_ICONS = {
    happy: Smile,
    neutral: Meh,
    sad: Frown,
    stressed: Zap,
    anxious: AlertCircle,
    burnout: Flame,
    unknown: Brain
} as const;

// Mood colors
export const MOOD_COLORS = {
    happy: 'text-emerald-500',
    neutral: 'text-indigo-500',
    sad: 'text-blue-500',
    stressed: 'text-amber-500',
    anxious: 'text-orange-500',
    burnout: 'text-rose-500',
    unknown: 'text-purple-500'
} as const;

// Mood background gradients
export const MOOD_BG = {
    happy: 'from-emerald-500/15 to-teal-500/5 border-emerald-500/20',
    neutral: 'from-indigo-500/15 to-violet-500/5 border-indigo-500/20',
    sad: 'from-blue-500/15 to-indigo-500/5 border-blue-500/20',
    stressed: 'from-amber-500/15 to-yellow-500/5 border-amber-500/20',
    anxious: 'from-orange-500/15 to-amber-500/5 border-orange-500/20',
    burnout: 'from-rose-500/15 to-red-500/5 border-rose-500/20',
} as const;

// Mood insights
export const MOOD_INSIGHT = {
    happy: 'You\'re in a great space today. Keep nurturing that positivity.',
    neutral: 'You\'re in a balanced state — a good day to reflect and recharge.',
    sad: 'It\'s okay to feel this way. Consider a grounding or breathing exercise.',
    stressed: 'Stress is high today. Try the 4-7-8 breathing exercise below.',
    anxious: 'You seem anxious. A short walk or grounding technique may help.',
    burnout: 'Signs of burnout detected. Rest is productive — take it easy today.',
} as const;

// Mood score mapping for charts
export const MOOD_SCORE_MAP = {
    happy: 5,
    neutral: 3,
    sad: 1,
    stressed: 2,
    anxious: 2,
    burnout: 0
} as const;

// Get mood icon component
export const getMoodIcon = (mood: string, className: string = 'w-5 h-5') => {
    const moodKey = mood.toLowerCase() as keyof typeof MOOD_ICONS;
    const Icon = MOOD_ICONS[moodKey] || MOOD_ICONS.unknown;
    const colorClass = MOOD_COLORS[moodKey] || MOOD_COLORS.unknown;
    
    return <Icon className={`${className} ${colorClass}`} />;
};

// Get mood color class
export const getMoodColor = (mood: string): string => {
    const moodKey = mood.toLowerCase() as keyof typeof MOOD_COLORS;
    return MOOD_COLORS[moodKey] || MOOD_COLORS.unknown;
};

// Get mood background
export const getMoodBg = (mood: string): string => {
    const moodKey = mood.toLowerCase() as keyof typeof MOOD_BG;
    return MOOD_BG[moodKey] || MOOD_BG.neutral;
};

// Get mood insight
export const getMoodInsight = (mood: string): string => {
    const moodKey = mood.toLowerCase() as keyof typeof MOOD_INSIGHT;
    return MOOD_INSIGHT[moodKey] || MOOD_INSIGHT.neutral;
};

// Get mood score
export const getMoodScore = (mood: string): number => {
    const moodKey = mood.toLowerCase() as keyof typeof MOOD_SCORE_MAP;
    return MOOD_SCORE_MAP[moodKey] || 3;
};
