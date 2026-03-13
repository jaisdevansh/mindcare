'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import {
    MessageSquare, Heart, Plus, Search, Globe, Loader2,
    Send, X, Sparkles, Clock, Trash2, ChevronDown, ChevronUp, CornerDownRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/lib/api';
import { useAppStore } from '@/lib/store';
import toast from 'react-hot-toast';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Reply {
    _id: string;
    content: string;
    createdAt: string;
    userId?: { _id?: string; name: string };
}

interface Post {
    _id: string;
    content: string;
    likesCount: number;
    createdAt: string;
    replies: Reply[];
    userId?: { _id?: string; name: string; profileImage?: string };
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const MOOD_TAGS = ['Reflective', 'Need Support', 'Empowered', 'Grateful', 'Anxious', 'Hopeful', 'Burned Out', 'Peaceful'];
const MOOD_COLORS: Record<string, string> = {
    'Reflective': 'bg-indigo-500/10 border-indigo-500/25 text-indigo-300',
    'Need Support': 'bg-rose-500/10 border-rose-500/25 text-rose-300',
    'Empowered': 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300',
    'Grateful': 'bg-amber-500/10 border-amber-500/25 text-amber-300',
    'Anxious': 'bg-orange-500/10 border-orange-500/25 text-orange-300',
    'Hopeful': 'bg-cyan-500/10 border-cyan-500/25 text-cyan-300',
    'Burned Out': 'bg-red-500/10 border-red-500/25 text-red-300',
    'Peaceful': 'bg-violet-500/10 border-violet-500/25 text-violet-300',
};

function relativeTime(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

function anonId(id: string) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) & 0xffffff;
    return `Anon·${chars[hash % chars.length]}${chars[(hash >> 4) % chars.length]}${(hash % 90) + 10}`;
}

// ─── NEW POST MODAL ───────────────────────────────────────────────────────────

const NewPostModal = ({ onClose, onCreated }: { onClose: () => void; onCreated: (p: Post) => void }) => {
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const ref = useRef<HTMLTextAreaElement>(null);
    useEffect(() => { ref.current?.focus(); }, []);

    const handleSubmit = async () => {
        if (!content.trim()) { toast.error('Write something first!'); return; }
        setSubmitting(true);
        try {
            const res = await apiFetch('/community', { method: 'POST', body: JSON.stringify({ content: content.trim() }) });
            if (res.success) { toast.success('Shared anonymously 🌿'); onCreated(res.data); onClose(); }
            else toast.error(res.message || 'Failed to post');
        } catch { toast.error('Something went wrong'); }
        finally { setSubmitting(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xl p-4" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                className="w-full max-w-lg bg-[#080D1A] border border-white/[0.08] rounded-[2rem] overflow-hidden shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="relative px-6 pt-6 pb-4 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#7C5CFF]/10 to-transparent" />
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#5B6CFF] flex items-center justify-center">
                                <Globe className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h2 className="text-base font-black text-white">Share to Community</h2>
                                <p className="text-[10px] text-[#9DA7B3]">Posted anonymously · your identity stays private</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-white/10 text-[#9DA7B3] hover:text-white transition-all">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="px-6 pb-5">
                    <textarea ref={ref} value={content} onChange={e => setContent(e.target.value)} rows={5} maxLength={500}
                        className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-[#7C5CFF]/50 rounded-2xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/20 resize-none transition-all"
                        placeholder="What's on your mind? Share how you're feeling today…" />
                    <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-[#9DA7B3]">{content.length}/500</span>
                        <div className="flex items-center gap-2">
                            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-[#9DA7B3] hover:text-white transition-colors">Cancel</button>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={handleSubmit} disabled={submitting || !content.trim()}
                                className="flex items-center gap-2 h-9 px-5 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-all shadow-lg shadow-[#7C5CFF]/20">
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-3.5 h-3.5" /> Share</>}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// ─── POST CARD ────────────────────────────────────────────────────────────────

const PostCard = ({
    post, index, currentUserId,
    onDelete, onReplyAdded, onReplyDeleted
}: {
    post: Post; index: number; currentUserId: string;
    onDelete: (id: string) => void;
    onReplyAdded: (postId: string, reply: Reply) => void;
    onReplyDeleted: (postId: string, replyId: string) => void;
}) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(post.likesCount);
    const [showReplies, setShowReplies] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deletingReplyId, setDeletingReplyId] = useState<string | null>(null);

    const tag = MOOD_TAGS[parseInt(post._id.slice(-2), 16) % MOOD_TAGS.length];
    const tagColor = MOOD_COLORS[tag];
    const postAnonId = anonId(post._id);
    const isOwner = post.userId?._id === currentUserId;

    const handleDelete = async () => {
        if (!confirm('Delete this post?')) return;
        setDeleting(true);
        try {
            const res = await apiFetch(`/community/${post._id}`, { method: 'DELETE' });
            if (res.success) { toast.success('Post deleted'); onDelete(post._id); }
            else toast.error(res.message || 'Failed to delete');
        } catch { toast.error('Something went wrong'); }
        finally { setDeleting(false); }
    };

    const handleReply = async () => {
        if (!replyText.trim()) return;
        setSubmittingReply(true);
        try {
            const res = await apiFetch(`/community/${post._id}/replies`, {
                method: 'POST',
                body: JSON.stringify({ content: replyText.trim() }),
            });
            if (res.success) {
                onReplyAdded(post._id, res.data);
                setReplyText('');
                toast.success('Reply posted');
            } else toast.error(res.message || 'Failed to reply');
        } catch { toast.error('Something went wrong'); }
        finally { setSubmittingReply(false); }
    };

    const handleDeleteReply = async (replyId: string) => {
        setDeletingReplyId(replyId);
        try {
            const res = await apiFetch(`/community/${post._id}/replies/${replyId}`, { method: 'DELETE' });
            if (res.success) { onReplyDeleted(post._id, replyId); toast.success('Reply deleted'); }
            else toast.error(res.message || 'Failed to delete reply');
        } catch { toast.error('Something went wrong'); }
        finally { setDeletingReplyId(null); }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.35 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/[0.14] transition-all group"
        >
            {/* Post body */}
            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C5CFF]/30 to-[#5B6CFF]/20 border border-white/10 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-black text-[#9DA7B3]">{postAnonId.slice(-2)}</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white leading-tight">{postAnonId}</p>
                            <div className="flex items-center gap-1 text-[#9DA7B3] text-xs">
                                <Clock className="w-2.5 h-2.5" />{relativeTime(post.createdAt)}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-widest ${tagColor}`}>{tag}</span>
                        {isOwner && (
                            <button onClick={handleDelete} disabled={deleting}
                                className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <p className="text-[#9DA7B3] text-sm leading-relaxed group-hover:text-slate-200 transition-colors mb-4">
                    {post.content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-3 border-t border-white/[0.05]">
                    <button onClick={() => { setLiked(p => !p); setLikes(p => liked ? p - 1 : p + 1); }}
                        className={`flex items-center gap-1.5 transition-all group/like text-xs font-medium ${liked ? 'text-rose-400' : 'text-[#9DA7B3] hover:text-rose-400'}`}>
                        <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''} group-hover/like:scale-110 transition-transform`} />
                        {likes}
                    </button>
                    <button onClick={() => setShowReplies(p => !p)}
                        className="flex items-center gap-1.5 text-xs font-medium text-[#9DA7B3] hover:text-[#7C5CFF] transition-all group/msg">
                        <MessageSquare className="w-4 h-4 group-hover/msg:scale-110 transition-transform" />
                        {post.replies.length > 0 ? `${post.replies.length} ${post.replies.length === 1 ? 'reply' : 'replies'}` : 'Reply'}
                        {post.replies.length > 0 && (showReplies ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </button>
                </div>
            </div>

            {/* Replies panel */}
            <AnimatePresence>
                {showReplies && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-white/[0.05]"
                    >
                        <div className="px-5 py-4 space-y-3 bg-white/[0.015]">
                            {/* Existing replies */}
                            {post.replies.map(reply => {
                                const isMyReply = reply.userId?._id === currentUserId;
                                const replyAnon = anonId(reply._id);
                                return (
                                    <motion.div key={reply._id}
                                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                        className="flex items-start gap-3 group/reply"
                                    >
                                        <CornerDownRight className="w-3.5 h-3.5 text-[#9DA7B3]/40 mt-1 shrink-0" />
                                        <div className="w-6 h-6 rounded-full bg-[#7C5CFF]/10 border border-white/10 flex items-center justify-center shrink-0">
                                            <span className="text-[8px] font-black text-[#9DA7B3]">{replyAnon.slice(-2)}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-[11px] font-bold text-white">{replyAnon}</span>
                                                <span className="text-[10px] text-[#9DA7B3]">{relativeTime(reply.createdAt)}</span>
                                            </div>
                                            <p className="text-xs text-[#9DA7B3] leading-relaxed">{reply.content}</p>
                                        </div>
                                        {isMyReply && (
                                            <button onClick={() => handleDeleteReply(reply._id)} disabled={deletingReplyId === reply._id}
                                                className="opacity-0 group-hover/reply:opacity-100 p-1 text-slate-600 hover:text-rose-400 transition-all shrink-0">
                                                {deletingReplyId === reply._id
                                                    ? <Loader2 className="w-3 h-3 animate-spin" />
                                                    : <Trash2 className="w-3 h-3" />}
                                            </button>
                                        )}
                                    </motion.div>
                                );
                            })}

                            {/* Reply input */}
                            <div className="flex items-center gap-2 pt-1">
                                <div className="w-6 h-6 rounded-full bg-[#7C5CFF]/10 border border-white/10 flex items-center justify-center shrink-0">
                                    <span className="text-[8px] font-black text-[#7C5CFF]">Y</span>
                                </div>
                                <div className="flex-1 flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] focus-within:border-[#7C5CFF]/40 rounded-xl px-3 py-2 transition-all">
                                    <input
                                        value={replyText}
                                        onChange={e => setReplyText(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
                                        placeholder="Write a reply…"
                                        maxLength={300}
                                        className="flex-1 bg-transparent text-white text-xs placeholder:text-white/20 outline-none"
                                    />
                                    <button onClick={handleReply} disabled={submittingReply || !replyText.trim()}
                                        className="text-[#7C5CFF] hover:text-[#9B7FFF] disabled:text-slate-700 transition-colors shrink-0">
                                        {submittingReply ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function CommunityPage() {
    const { user } = useAppStore();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        apiFetch('/community')
            .then(res => { if (res.success) setPosts(res.data || []); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = (id: string) => setPosts(prev => prev.filter(p => p._id !== id));

    const handleReplyAdded = (postId: string, reply: Reply) =>
        setPosts(prev => prev.map(p => p._id === postId ? { ...p, replies: [...(p.replies || []), reply] } : p));

    const handleReplyDeleted = (postId: string, replyId: string) =>
        setPosts(prev => prev.map(p => p._id === postId ? { ...p, replies: p.replies.filter(r => r._id !== replyId) } : p));

    const filtered = posts.filter(p => p.content.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-12">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-[10px] font-black uppercase tracking-widest mb-4">
                        <Globe className="w-3 h-3" /> Anonymous Space
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-1">Community Space</h1>
                    <p className="text-[#9DA7B3] text-sm font-medium">An anonymous haven for shared experiences and mutual support.</p>
                </div>
                <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 h-10 px-5 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#7C5CFF]/20 shrink-0">
                    <Plus className="w-4 h-4" /> New Post
                </motion.button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#9DA7B3]" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts…"
                    className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/30 focus:border-[#7C5CFF]/40 transition-all" />
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-7 h-7 text-[#7C5CFF] animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-violet-400" />
                    </div>
                    <p className="text-white font-bold">{search ? 'No posts match your search' : 'No posts yet'}</p>
                    <p className="text-[#9DA7B3] text-sm max-w-xs">
                        {search ? 'Try different keywords.' : 'Be the first to share something with the community.'}
                    </p>
                    {!search && (
                        <button onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 h-9 px-5 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-xl text-sm font-bold">
                            <Plus className="w-4 h-4" /> Share First Post
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-xs text-[#9DA7B3] font-bold uppercase tracking-widest px-1">
                        {filtered.length} post{filtered.length !== 1 ? 's' : ''} · newest first
                    </p>
                    {filtered.map((post, i) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            index={i}
                            currentUserId={user?._id || user?.id || ''}
                            onDelete={handleDelete}
                            onReplyAdded={handleReplyAdded}
                            onReplyDeleted={handleReplyDeleted}
                        />
                    ))}
                </div>
            )}

            <AnimatePresence>
                {showModal && (
                    <NewPostModal
                        onClose={() => setShowModal(false)}
                        onCreated={p => setPosts(prev => [{ ...p, replies: [] }, ...prev])}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
