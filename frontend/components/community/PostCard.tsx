'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ReplyBox = ({ onReply }: { onReply: (msg: string) => void }) => {
    const [text, setText] = useState('');

    const handleSend = () => {
        if (!text.trim()) return;
        onReply(text);
        setText('');
    };

    return (
        <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-black/20 rounded-xl border border-white/5 shadow-inner">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a supportive reply..."
                className="flex-1 bg-transparent border-none text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-0"
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
                onClick={handleSend}
                disabled={!text.trim()}
                className="p-2 text-indigo-400 hover:text-indigo-300 disabled:opacity-50 disabled:hover:text-indigo-400 transition"
            >
                <Send className="w-4 h-4" />
            </button>
        </div>
    );
};

export const PostCard = ({ post }: { post: any }) => {
    const [likes, setLikes] = useState(post.likes);
    const [isLiked, setIsLiked] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState(post.replies);

    const handleLike = () => {
        if (isLiked) {
            setLikes(likes - 1);
            setIsLiked(false);
        } else {
            setLikes(likes + 1);
            setIsLiked(true);
        }
    };

    const handleReply = (text: string) => {
        setReplies([...replies, { id: Date.now().toString(), anonymousId: 'Anon-' + Math.floor(Math.random() * 100) + 'X', message: text }]);
    };

    return (
        <Card className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-white/10 shrink-0">
                            <span className="text-xs font-bold text-slate-300">
                                {post.anonymousId.split('-')[1]}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-white block leading-tight">{post.anonymousId}</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Anonymous</span>
                        </div>
                    </div>
                    <span className="px-3 py-1 bg-white/10 rounded-full border border-white/5 text-xs text-indigo-300 font-medium tracking-wide shadow-sm flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        {post.moodTag}
                    </span>
                </div>

                <p className="text-slate-200 text-[15px] leading-relaxed mb-6 font-medium bg-black/20 p-4 rounded-xl shadow-inner border border-white/5 border-t-transparent border-l-transparent">
                    {post.message}
                </p>

                <div className="flex items-center gap-6">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 text-sm font-medium transition ${isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-400'
                            }`}
                    >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        {likes}
                    </button>

                    <button
                        onClick={() => setShowReplies(!showReplies)}
                        className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-indigo-400 transition"
                    >
                        <MessageCircle className="w-5 h-5" />
                        {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
                    </button>
                </div>

                <AnimatePresence>
                    {showReplies && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 pt-6 border-t border-white/10"
                        >
                            <div className="space-y-4 mb-4">
                                {replies.map((reply: any) => (
                                    <div key={reply.id} className="flex gap-3 items-start">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/5 shrink-0">
                                            <span className="text-[10px] font-bold text-slate-400">
                                                {reply.anonymousId.split('-')[1]}
                                            </span>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-2xl rounded-tl-sm border border-white/5 text-sm text-slate-300 w-full">
                                            <div className="text-[10px] text-slate-500 mb-1">{reply.anonymousId}</div>
                                            {reply.message}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <ReplyBox onReply={handleReply} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
};
