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
import { DynamicAssessment } from './dynamicAssessment.model';
import { generateNextQuestion, detectMoodFromSingleAnswer } from './dynamicAssessment.service';
import { createNotification } from '../notifications/notification.service';
import { randomUUID } from 'crypto';

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

// ─── DYNAMIC ASSESSMENT: START ────────────────────────────────────────────────

export const startDynamicAssessment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user.id;
        const sessionId = randomUUID();

        console.log('\n🚀 ===== STARTING DYNAMIC ASSESSMENT =====');
        console.log('👤 User ID:', userId);
        console.log('🆔 Session ID:', sessionId);

        // Create new dynamic assessment session
        const assessment = await DynamicAssessment.create({
            userId,
            sessionId,
            questions: [],
            currentQuestionNumber: 1,
            isCompleted: false
        });

        // Generate first question
        const firstQuestion = await generateNextQuestion(1, []);

        console.log('✅ Assessment session created');
        console.log('❓ First Question:', firstQuestion.question);
        console.log('===== START COMPLETE =====\n');

        sendResponse(res, 200, true, 'Dynamic assessment started', {
            sessionId,
            questionNumber: 1,
            totalQuestions: 10,
            question: firstQuestion.question,
            options: firstQuestion.options
        });
    } catch (error) {
        console.error('❌ Start assessment error:', error);
        next(error);
    }
};

// ─── DYNAMIC ASSESSMENT: GET NEXT QUESTION ────────────────────────────────────

export const getNextQuestion = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { sessionId, answer } = req.body;
        const userId = req.user.id;

        console.log('\n🔄 ===== PROCESSING ANSWER & GENERATING NEXT QUESTION =====');
        console.log('🆔 Session ID:', sessionId);
        console.log('💬 User Answer:', answer);

        if (!sessionId || !answer) {
            sendResponse(res, 400, false, 'Session ID and answer are required');
            return;
        }

        // Find assessment session
        const assessment = await DynamicAssessment.findOne({ sessionId, userId });
        if (!assessment) {
            sendResponse(res, 404, false, 'Assessment session not found');
            return;
        }

        if (assessment.isCompleted) {
            sendResponse(res, 400, false, 'Assessment already completed');
            return;
        }

        const currentQuestionNumber = assessment.currentQuestionNumber;
        console.log('📊 Current Question Number:', currentQuestionNumber);

        // Get the question that was just answered
        const currentQuestion = assessment.questions.length > 0 
            ? assessment.questions[assessment.questions.length - 1].question
            : "How have you been feeling emotionally today?";

        // Detect mood from answer
        console.log('🔍 Detecting mood from answer...');
        const moodData = await detectMoodFromSingleAnswer(answer);
        console.log('😊 Detected Mood:', moodData);

        // Save answer
        assessment.questions.push({
            questionNumber: currentQuestionNumber,
            question: currentQuestion,
            answer,
            detectedMood: moodData.mood,
            timestamp: new Date()
        });

        // Check if we've reached 10 questions
        if (currentQuestionNumber >= 10) {
            console.log('✅ Assessment complete - 10 questions answered');
            assessment.isCompleted = true;
            await assessment.save();

            sendResponse(res, 200, true, 'Assessment completed', {
                sessionId,
                isCompleted: true,
                totalQuestions: 10,
                message: 'Please submit the assessment for final analysis'
            });
            return;
        }

        // Generate next question
        assessment.currentQuestionNumber = currentQuestionNumber + 1;
        await assessment.save();

        const nextQuestion = await generateNextQuestion(
            assessment.currentQuestionNumber,
            assessment.questions.map(q => ({
                question: q.question || '',
                answer: q.answer || '',
                detectedMood: q.detectedMood || undefined
            })),
            moodData.mood
        );

        console.log('✅ Next question generated');
        console.log('===== NEXT QUESTION READY =====\n');

        sendResponse(res, 200, true, 'Next question generated', {
            sessionId,
            questionNumber: assessment.currentQuestionNumber,
            totalQuestions: 10,
            question: nextQuestion.question,
            options: nextQuestion.options,
            isCompleted: false
        });
    } catch (error) {
        console.error('❌ Get next question error:', error);
        next(error);
    }
};

// ─── DYNAMIC ASSESSMENT: SUBMIT ───────────────────────────────────────────────

export const submitDynamicAssessment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { sessionId } = req.body;
        const userId = req.user.id;

        console.log('\n📊 ===== SUBMITTING DYNAMIC ASSESSMENT =====');
        console.log('🆔 Session ID:', sessionId);
        console.log('👤 User ID:', userId);

        if (!sessionId) {
            sendResponse(res, 400, false, 'Session ID is required');
            return;
        }

        // Find assessment session
        const assessment = await DynamicAssessment.findOne({ sessionId, userId });
        if (!assessment) {
            sendResponse(res, 404, false, 'Assessment session not found');
            return;
        }

        if (!assessment.isCompleted) {
            sendResponse(res, 400, false, 'Please complete all questions first');
            return;
        }

        console.log('📝 Total Questions Answered:', assessment.questions.length);

        // Build summary from all Q&A
        const summary = assessment.questions
            .map(q => `Q${q.questionNumber}: ${q.question}\nA: ${q.answer}`)
            .join('\n\n');

        console.log('\n🔍 Running AI analysis...');

        // Run all AI analyses
        const [moodResult, depressionResult] = await Promise.all([
            detectMoodFromAnswers(summary),
            detectDepressionRisk(summary),
        ]);

        console.log('😊 Final Mood:', moodResult);
        console.log('📊 Depression Analysis:', depressionResult);

        const { mentalScore, category } = calculateMentalScore(depressionResult.depressionScore);

        const [predictionResult, suggestions] = await Promise.all([
            predictTomorrowMood(summary, moodResult.mood),
            generateTherapistSuggestions(summary, moodResult.mood, depressionResult.riskLevel),
        ]);

        const exercises = selectExercises(depressionResult.riskLevel, moodResult.mood);
        const helperRecommended = depressionResult.depressionScore > 60;

        // Save final analysis to assessment
        assessment.finalAnalysis = {
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
        };
        await assessment.save();

        // Also save to AssignmentResult for history
        const result = await AssignmentResult.create({
            userId,
            answers: assessment.questions.map(q => q.answer || ''),
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

        // Save to emotion logs
        await EmotionLog.create({
            userId,
            detectedMood: moodResult.mood,
            confidenceScore: moodResult.confidenceScore,
            source: 'dynamic_assessment',
        });

        console.log('✅ Analysis complete and saved');
        console.log('===== SUBMISSION COMPLETE =====\n');

        sendResponse(res, 200, true, 'Dynamic assessment analyzed successfully', {
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
            resultId: String((result as any)._id),
        });
    } catch (error) {
        console.error('❌ Submit assessment error:', error);
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

        // Trigger notification
        await createNotification(
            userId,
            'Assessment Completed',
            `Your recent assessment shows your mood is ${moodResult.mood}. Click to view insights.`,
            'assessment',
            '/history'
        );

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
            resultId: String((result as any)._id),
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
