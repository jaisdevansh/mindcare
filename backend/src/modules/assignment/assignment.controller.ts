import { Response, NextFunction } from 'express';
import { sendResponse } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';
import {
    ASSIGNMENT_QUESTIONS,
    ASSIGNMENT_QUESTIONS_MCQ,
    ASSIGNMENT_QUESTIONS_DESCRIPTIVE,
    detectMoodFromAnswers,
    detectDepressionRisk,
    predictTomorrowMood,
    generateTherapistSuggestions,
    selectExercises,
    calculateMentalScore,
} from './assignment.service';
import { AssignmentResult } from './assignmentResult.model';
import { EmotionLog } from './emotionLog.model';

// ─── GET QUESTIONS ─────────────────────────────────────────────────────────────

export const getQuestions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const mode = (req.query.mode as string) || 'descriptive';
        const questions = mode === 'mcq' ? ASSIGNMENT_QUESTIONS_MCQ : ASSIGNMENT_QUESTIONS_DESCRIPTIVE;
        sendResponse(res, 200, true, 'Assignment questions fetched', { questions, mode });
    } catch (error) {
        next(error);
    }
};

// ─── SUBMIT ASSIGNMENT ────────────────────────────────────────────────────────

export const submitAssignment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { answers } = req.body;
        const userId = req.user.id;

        if (!answers || !Array.isArray(answers) || answers.length < 5) {
            sendResponse(res, 400, false, 'Please answer at least 5 questions.');
            return;
        }

        // Build combined text summary from questions + answers
        const summary = ASSIGNMENT_QUESTIONS
            .slice(0, answers.length)
            .map((q, i) => `Q${q.id}: ${q.question}\nA: ${answers[i] || 'No answer'}`)
            .join('\n\n');

        // Run all AI analyses in parallel for speed
        const [moodResult, depressionResult] = await Promise.all([
            detectMoodFromAnswers(summary),
            detectDepressionRisk(summary),
        ]);

        const { mentalScore, category } = calculateMentalScore(depressionResult.depressionScore);

        // Mood prediction and suggestions can run in parallel too
        const [predictionResult, suggestions] = await Promise.all([
            predictTomorrowMood(summary, moodResult.mood),
            generateTherapistSuggestions(summary, moodResult.mood, depressionResult.riskLevel),
        ]);

        const exercises = selectExercises(depressionResult.riskLevel, moodResult.mood);
        const helperRecommended = depressionResult.depressionScore > 60;

        // Save assignment result
        const result = await AssignmentResult.create({
            userId,
            answers,
            detectedMood: moodResult.mood,
            confidenceScore: moodResult.confidenceScore,
            depressionScore: depressionResult.depressionScore,
            riskLevel: depressionResult.riskLevel,
            mentalScore,
            mentalScoreCategory: category,
            predictedMood: predictionResult.predictedMood,
            predictedMoodConfidence: predictionResult.confidence,
            suggestedExercises: exercises,
            aiSuggestions: suggestions,
            helperRecommended,
        });

        // Save to emotion logs for graph data
        await EmotionLog.create({
            userId,
            detectedMood: moodResult.mood,
            confidenceScore: moodResult.confidenceScore,
            source: 'assignment',
        });

        sendResponse(res, 200, true, 'Assignment analyzed successfully', {
            mood: moodResult.mood,
            confidenceScore: moodResult.confidenceScore,
            depressionScore: depressionResult.depressionScore,
            riskLevel: depressionResult.riskLevel,
            mentalScore,
            mentalScoreCategory: category,
            predictedMood: predictionResult.predictedMood,
            predictedMoodConfidence: predictionResult.confidence,
            exercises,
            suggestions,
            helperRecommended,
            helperMessage: helperRecommended
                ? "It seems like you could use some extra support. Consider connecting with a verified MindCare Helper."
                : null,
            resultId: result._id,
        });
    } catch (error) {
        next(error);
    }
};

// ─── GET ASSIGNMENT HISTORY ───────────────────────────────────────────────────

export const getAssignmentHistory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user.id;
        const results = await AssignmentResult.find({ userId })
            .select('-answers')
            .sort({ createdAt: -1 })
            .limit(20);
        sendResponse(res, 200, true, 'Assignment history fetched', results);
    } catch (error) {
        next(error);
    }
};

// ─── GET EMOTION LOGS (for graph) ─────────────────────────────────────────────

export const getEmotionLogs = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user.id;
        const logs = await EmotionLog.find({ userId }).sort({ createdAt: 1 }).limit(30);
        sendResponse(res, 200, true, 'Emotion logs fetched', logs);
    } catch (error) {
        next(error);
    }
};

// ─── GET LATEST RESULT ────────────────────────────────────────────────────────

export const getLatestResult = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user.id;
        const result = await AssignmentResult.findOne({ userId }).sort({ createdAt: -1 });
        if (!result) {
            sendResponse(res, 404, false, 'No assignment results found');
            return;
        }
        sendResponse(res, 200, true, 'Latest result fetched', result);
    } catch (error) {
        next(error);
    }
};
