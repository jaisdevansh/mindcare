import { Response, NextFunction } from 'express';
import { Post } from './post.model';
import { sendResponse } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';

// ─── CREATE POST ──────────────────────────────────────────────────────────────

export const createPost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { content } = req.body;
        if (!content) {
            sendResponse(res, 400, false, 'Content is required');
            return;
        }
        const newPost = await Post.create({ userId: req.user.id, content });
        const populated = await newPost.populate('userId', 'name profileImage');
        sendResponse(res, 201, true, 'Post created successfully', populated);
    } catch (error) {
        next(error);
    }
};

// ─── GET ALL POSTS ────────────────────────────────────────────────────────────

export const getPosts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const posts = await Post.find()
            .populate('userId', 'name profileImage')
            .populate('replies.userId', 'name')
            .sort({ createdAt: -1 });
        sendResponse(res, 200, true, 'Posts fetched', posts);
    } catch (error) {
        next(error);
    }
};

// ─── DELETE POST (owner only) ─────────────────────────────────────────────────

export const deletePost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            sendResponse(res, 404, false, 'Post not found');
            return;
        }
        if (post.userId.toString() !== req.user.id) {
            sendResponse(res, 403, false, 'Not authorised to delete this post');
            return;
        }
        await post.deleteOne();
        sendResponse(res, 200, true, 'Post deleted');
    } catch (error) {
        next(error);
    }
};

// ─── ADD REPLY ────────────────────────────────────────────────────────────────

export const addReply = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { content } = req.body;
        if (!content) {
            sendResponse(res, 400, false, 'Reply content is required');
            return;
        }
        const post = await Post.findById(req.params.id);
        if (!post) {
            sendResponse(res, 404, false, 'Post not found');
            return;
        }
        (post.replies as any).push({ userId: req.user.id, content });
        await post.save();
        await post.populate('replies.userId', 'name');
        const newReply = (post.replies as any)[(post.replies as any).length - 1];
        sendResponse(res, 201, true, 'Reply added', newReply);
    } catch (error) {
        next(error);
    }
};

// ─── DELETE REPLY (owner only) ────────────────────────────────────────────────

export const deleteReply = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            sendResponse(res, 404, false, 'Post not found');
            return;
        }
        const reply = (post.replies as any).id(req.params.replyId);
        if (!reply) {
            sendResponse(res, 404, false, 'Reply not found');
            return;
        }
        if (reply.userId.toString() !== req.user.id) {
            sendResponse(res, 403, false, 'Not authorised to delete this reply');
            return;
        }
        reply.deleteOne();
        await post.save();
        sendResponse(res, 200, true, 'Reply deleted');
    } catch (error) {
        next(error);
    }
};
