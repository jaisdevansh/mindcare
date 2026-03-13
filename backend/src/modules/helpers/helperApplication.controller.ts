import { Response, NextFunction } from 'express';
import { sendResponse } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';
import { HelperApplication } from './helperApplication.model';
import { User } from '../users/user.model';
import { Helper } from './helper.model';
import bcrypt from 'bcrypt';

// ─── SUBMIT APPLICATION ───────────────────────────────────────────────────────

export const applyToBeHelper = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user.id;

        // Check if already applied
        const existing = await HelperApplication.findOne({ userId });
        if (existing) {
            sendResponse(res, 400, false, `You already have a ${existing.status} application.`);
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            sendResponse(res, 404, false, 'User not found');
            return;
        }
        if (user.role === 'helper') {
            sendResponse(res, 400, false, 'You are already a helper.');
            return;
        }

        const { phone, bio, motivation, experience, specializations, availability, hasTraining, trainingDetails } = req.body;

        if (!phone || !bio || !motivation || !experience || !availability) {
            sendResponse(res, 400, false, 'Please fill all required fields.');
            return;
        }

        const application = await HelperApplication.create({
            userId,
            name: user.name,
            email: user.email,
            phone,
            bio,
            motivation,
            experience,
            specializations: specializations || [],
            availability,
            hasTraining: hasTraining || false,
            trainingDetails: trainingDetails || '',
        });

        sendResponse(res, 201, true, 'Your application has been submitted. The admin will review it shortly.', application);
    } catch (error) {
        next(error);
    }
};

// ─── GET MY APPLICATION STATUS ────────────────────────────────────────────────

export const getMyApplication = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user.id;
        const application = await HelperApplication.findOne({ userId }).sort({ createdAt: -1 });
        if (!application) {
            sendResponse(res, 404, false, 'No application found');
            return;
        }
        sendResponse(res, 200, true, 'Application fetched', application);
    } catch (error) {
        next(error);
    }
};

// ─── ADMIN: GET ALL APPLICATIONS ──────────────────────────────────────────────

export const getAllApplications = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};
        const applications = await HelperApplication.find(filter).sort({ createdAt: -1 });
        sendResponse(res, 200, true, 'Applications fetched', applications);
    } catch (error) {
        next(error);
    }
};

// ─── ADMIN: APPROVE APPLICATION ───────────────────────────────────────────────

export const approveApplication = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const { adminNote } = req.body;

        const application = await HelperApplication.findById(id);
        if (!application) {
            sendResponse(res, 404, false, 'Application not found');
            return;
        }

        // Update application status
        application.status = 'approved';
        application.adminNote = adminNote || '';
        application.reviewedAt = new Date();
        await application.save();

        // Upgrade user role to helper
        const user = await User.findByIdAndUpdate(
            application.userId,
            { role: 'helper' },
            { new: true }
        );

        if (!user) {
            sendResponse(res, 404, false, 'User not found');
            return;
        }

        // Create a Helper record so they show in the helpers list
        const existingHelper = await Helper.findOne({ email: user.email });
        if (!existingHelper) {
            await Helper.create({
                name: user.name,
                email: user.email,
                password: await bcrypt.hash(Math.random().toString(36), 10), // placeholder password
                bio: application.bio,
                skills: application.specializations,
                verified: true,
                isVerified: true,
            });
        } else {
            existingHelper.verified = true;
            await existingHelper.save();
        }

        sendResponse(res, 200, true, `${user.name}'s application approved. They are now a helper.`, { application, user });
    } catch (error) {
        next(error);
    }
};

// ─── ADMIN: REJECT APPLICATION ────────────────────────────────────────────────

export const rejectApplication = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const { adminNote } = req.body;

        const application = await HelperApplication.findByIdAndUpdate(
            id,
            { status: 'rejected', adminNote: adminNote || '', reviewedAt: new Date() },
            { new: true }
        );

        if (!application) {
            sendResponse(res, 404, false, 'Application not found');
            return;
        }

        sendResponse(res, 200, true, 'Application rejected.', application);
    } catch (error) {
        next(error);
    }
};
