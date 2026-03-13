import { Router } from 'express';
import { createPost, getPosts, deletePost, addReply, deleteReply } from './post.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getPosts);
router.post('/', authenticate, createPost);
router.delete('/:id', authenticate, deletePost);
router.post('/:id/replies', authenticate, addReply);
router.delete('/:id/replies/:replyId', authenticate, deleteReply);

export default router;
