import { Response, NextFunction } from 'express';
import { sendResponse } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';
import { detectMood } from './moodDetection.service';
import { checkDepressionRisk } from './depressionDetection.service';
import { generateSupportiveResponse } from './aiChat.service';
import { MoodLog } from './moodLog.model';
import { DepressionAnalysis } from './depressionAnalysis.model';
import { AIChat } from './aiChat.model';

export const processChat = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { message } = req.body;
        if (!message) {
            sendResponse(res, 400, false, 'Message is required');
            return;
        }

        // 1. Save user message and analyze mood
        const moodData = await detectMood(message);
        await MoodLog.create({
            userId: req.user.id,
            text: message,
            detectedMood: moodData.mood,
            confidenceScore: moodData.score,
        });

        await AIChat.create({
            userId: req.user.id,
            role: 'user',
            content: message
        });

        // 2. Analyze depression risk and save to depression_analysis
        const depressionData = await checkDepressionRisk(message);
        await DepressionAnalysis.create({
            userId: req.user.id,
            text: message,
            depressionScore: depressionData.depressionScore,
            riskLevel: depressionData.riskLevel,
        });

        // 3. Generate supportive AI response
        const aiResponse = await generateSupportiveResponse(message, moodData, depressionData);

        // 4. Save AI response
        await AIChat.create({
            userId: req.user.id,
            role: 'ai',
            content: aiResponse
        });

        sendResponse(res, 200, true, 'AI response generated successfully', {
            aiResponse,
            mood: moodData,
            depressionRisk: depressionData,
        });
    } catch (error) {
        next(error);
    }
};

export const moodDetectEndpoint = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { text } = req.body;
        if (!text) {
            sendResponse(res, 400, false, 'Text is required');
            return;
        }
        const moodData = await detectMood(text);
        await MoodLog.create({
            userId: req.user.id,
            text,
            detectedMood: moodData.mood,
            confidenceScore: moodData.score,
        });
        sendResponse(res, 200, true, 'Mood detected', moodData);
    } catch (error) {
        next(error);
    }
};

export const depressionCheckEndpoint = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { text } = req.body;
        if (!text) {
            sendResponse(res, 400, false, 'Text is required');
            return;
        }
        const depressionData = await checkDepressionRisk(text);
        await DepressionAnalysis.create({
            userId: req.user.id,
            text,
            depressionScore: depressionData.depressionScore,
            riskLevel: depressionData.riskLevel,
        });
        sendResponse(res, 200, true, 'Depression risk analyzed', depressionData);
    } catch (error) {
        next(error);
    }
};

export const getMoodHistory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user.id;
        const history = await MoodLog.find({ userId }).sort({ createdAt: -1 }).limit(10);
        sendResponse(res, 200, true, 'Mood history fetched', history);
    } catch (error) {
        next(error);
    }
};

export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user.id;

        // Get last depression analysis for risk score
        const lastDepression = await DepressionAnalysis.findOne({ userId }).sort({ createdAt: -1 });

        // Get last mood log
        const lastMood = await MoodLog.findOne({ userId }).sort({ createdAt: -1 });

        sendResponse(res, 200, true, 'Dashboard stats fetched', {
            riskScore: lastDepression ? lastDepression.depressionScore : 0,
            lastMood: lastMood ? lastMood.detectedMood : 'Neutral',
            riskLevel: lastDepression ? lastDepression.riskLevel : 'Low'
        });
    } catch (error) {
        next(error);
    }
};

export const getAIChatHistory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user.id;
        const chats = await AIChat.find({ userId }).sort({ createdAt: 1 });
        sendResponse(res, 200, true, 'Chat history fetched', chats);
    } catch (error) {
        next(error);
    }
};
