'use client';
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Trash2, EyeOff, Bell, Search, Flag, CheckCircle, RefreshCw, X, Filter } from "lucide-react";
import toast from "react-hot-toast";

// Mock data — connect to real moderation API when available
const generatePosts = () => Array.from({ length: 18 }, (_, i) => ({
    _id: `post-${i}`,
    author: ['Priya Sharma', 'Rahul Mehta', 'Ananya Gupta', 'Dev Patel', 'Sneha Roy'][i % 5],
    content: [
        "Feeling really anxious about upcoming exams. Anyone have tips?",
        "Today was tough but I'm proud I made it through.",
        "Has anyone tried the breathing exercises? They helped me so much!",
        "Sometimes I wonder if it's all worth it...",
        "Grateful for this community. You guys really understand.",
        "I've been struggling with sleep. Any suggestions?",
    ][i % 6],
    likes: Math.floor(Math.random() * 50),
    comments: Math.floor(Math.random() * 20),
    createdAt: new Date(Date.now() - i * 3600000 * 8).toISOString(),
    status: ['active', 'active', 'active', 'reported', 'hidden'][i % 5] as 'active' | 'reported' | 'hidden',
    reportReason: i % 5 === 3 ? ['Harmful content', 'Spam', 'Harassment'][i % 3] : undefined,
}));

const statusBadge = (s: string) => ({
    active: 'bg-green-500/10 border-green-500/20 text-green-500',
    reported: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    hidden: 'bg-red-500/10 border-red-500/20 text-red-400',
}[s] || 'bg-white/5 text-[#A67C52]');

export default function CommunityModeration() {
    const [posts, setPosts] = useState(generatePosts());
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'reported' | 'hidden'>('all');
    const [selected, setSelected] = useState<any>(null);

    const filtered = posts.filter(p => {
        const ms = !search || p.author.toLowerCase().includes(search) || p.content.toLowerCase().includes(search);
        return ms && (filter === 'all' || p.status === filter);
    });

    const counts = { all: posts.length, active: posts.filter(p => p.status === 'active').length, reported: posts.filter(p => p.status === 'reported').length, hidden: posts.filter(p => p.status === 'hidden').length };

    const actionPost = (id: string, action: 'hide' | 'delete' | 'restore') => {
        if (action === 'delete') {
            setPosts(prev => prev.filter(p => p._id !== id));
            toast.success('Post deleted');
        } else if (action === 'hide') {
            setPosts(prev => prev.map(p => p._id === id ? { ...p, status: 'hidden' as const } : p));
            toast.success('Post hidden');
        } else {
            setPosts(prev => prev.map(p => p._id === id ? { ...p, status: 'active' as const } : p));
            toast.success('Post restored');
        }
        setSelected(null);
    };

    return (
        <div className="space-y-5 pb-10">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Total Posts', value: counts.all, color: '#A67C52', icon: MessageSquare },
                    { label: 'Active', value: counts.active, color: '#4ade80', icon: CheckCircle },
                    { label: 'Reported', value: counts.reported, color: '#f97316', icon: Flag },
                    { label: 'Hidden', value: counts.hidden, color: '#f87171', icon: EyeOff },
                ].map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className="p-5 rounded-[1.5rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40 hover:border-[#A67C52]/30 transition-all">
                        <c.icon className="w-4 h-4 mb-3" style={{ color: c.color }} />
                        <p className="text-3xl font-black text-[#EDE0D4]">{c.value}</p>
                        <p className="text-[9px] text-[#A67C52]/50 font-black uppercase tracking-widest mt-1">{c.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-lg group">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#A67C52]/40" />
                    <input value={search} onChange={e => setSearch(e.target.value.toLowerCase())} placeholder="Search posts or authors…"
                        className="w-full h-11 bg-[#1A0F0E]/40 border border-[#3D2B1F]/40 rounded-2xl pl-10 pr-10 text-[#EDE0D4] text-sm focus:outline-none focus:ring-1 focus:ring-[#A67C52]/40 placeholder:text-[#A67C52]/25" />
                    {search && <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A67C52]/40 hover:text-[#A67C52]"><X className="w-4 h-4" /></button>}
                </div>
                <div className="flex gap-2">
                    {(['all', 'active', 'reported', 'hidden'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`h-11 px-4 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all ${filter === f ? 'bg-[#A67C52] text-white' : 'bg-[#1A0F0E]/40 border border-[#3D2B1F]/40 text-[#A67C52]/50 hover:text-[#A67C52]'}`}>
                            {f} ({counts[f]})
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-[2rem] bg-[#1A0F0E]/20 border border-[#3D2B1F]/40 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#1A0F0E]/60 border-b border-[#3D2B1F]/40">
                                {['Author', 'Post Content', 'Likes', 'Comments', 'Date', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-5 py-4 text-[#A67C52] font-black text-[10px] uppercase tracking-widest whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#3D2B1F]/20">
                            <AnimatePresence>
                                {filtered.map((post, i) => (
                                    <motion.tr key={post._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}
                                        className="hover:bg-[#A67C52]/5 transition-colors cursor-pointer"
                                        onClick={() => setSelected(post)}>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#A67C52]/30 to-[#7F5539]/20 flex items-center justify-center text-[#A67C52] font-black text-xs border border-[#A67C52]/20 shrink-0">
                                                    {post.author.charAt(0)}
                                                </div>
                                                <span className="text-sm font-bold text-[#EDE0D4] whitespace-nowrap">{post.author}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-sm text-[#EDE0D4]/60 max-w-xs truncate">{post.content}</p>
                                            {post.reportReason && <span className="text-[9px] text-orange-400 font-bold">⚠ {post.reportReason}</span>}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-[#A67C52]/60 font-bold">❤ {post.likes}</td>
                                        <td className="px-5 py-4 text-sm text-[#A67C52]/60 font-bold">💬 {post.comments}</td>
                                        <td className="px-5 py-4 text-xs text-[#A67C52]/40 whitespace-nowrap">
                                            {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusBadge(post.status)}`}>{post.status}</span>
                                        </td>
                                        <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                                            <div className="flex items-center gap-1.5">
                                                {post.status !== 'hidden' && (
                                                    <button onClick={() => actionPost(post._id, 'hide')} className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 transition-all" title="Hide">
                                                        <EyeOff className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                                {post.status === 'hidden' && (
                                                    <button onClick={() => actionPost(post._id, 'restore')} className="p-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 hover:bg-green-500/20 transition-all" title="Restore">
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                                <button onClick={() => { if (confirm('Delete this post permanently?')) actionPost(post._id, 'delete'); }}
                                                    className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all" title="Delete">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => toast('Warning sent to user (mock)', { icon: '⚠️' })}
                                                    className="p-2 rounded-xl bg-[#A67C52]/10 border border-[#A67C52]/20 text-[#A67C52] hover:bg-[#A67C52]/20 transition-all" title="Warn">
                                                    <Bell className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                    <div className="px-6 py-3 border-t border-[#3D2B1F]/30 bg-[#1A0F0E]/40">
                        <p className="text-[10px] text-[#A67C52]/40 font-medium">Showing {filtered.length} of {posts.length} posts</p>
                    </div>
                </div>
            </div>

            {/* Post detail modal */}
            <AnimatePresence>
                {selected && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="relative w-full max-w-lg bg-[#150D0B] border border-[#3D2B1F] rounded-[2rem] p-8 shadow-2xl">
                            <button onClick={() => setSelected(null)} className="absolute top-5 right-5 p-2 rounded-xl hover:bg-white/5 text-[#A67C52]/40"><X className="w-4 h-4" /></button>
                            <h3 className="text-lg font-black text-[#EDE0D4] mb-5">Post Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 pb-4 border-b border-[#3D2B1F]/40">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A67C52]/30 to-[#7F5539]/20 flex items-center justify-center text-[#A67C52] font-black border border-[#A67C52]/20">{selected.author.charAt(0)}</div>
                                    <div>
                                        <p className="font-bold text-[#EDE0D4]">{selected.author}</p>
                                        <p className="text-[10px] text-[#A67C52]/50">{new Date(selected.createdAt).toLocaleString('en-IN')}</p>
                                    </div>
                                    <span className={`ml-auto px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusBadge(selected.status)}`}>{selected.status}</span>
                                </div>
                                <p className="text-[#EDE0D4]/70 leading-relaxed text-sm italic">"{selected.content}"</p>
                                {selected.reportReason && (
                                    <div className="p-3 rounded-2xl bg-orange-500/5 border border-orange-500/20">
                                        <p className="text-xs text-orange-400"><span className="font-black">Report Reason:</span> {selected.reportReason}</p>
                                    </div>
                                )}
                                <div className="flex gap-3 pt-2">
                                    {selected.status !== 'hidden' && <button onClick={() => actionPost(selected._id, 'hide')} className="flex-1 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold hover:bg-orange-500/20 transition-all">Hide Post</button>}
                                    {selected.status === 'hidden' && <button onClick={() => actionPost(selected._id, 'restore')} className="flex-1 h-10 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-bold hover:bg-green-500/20 transition-all">Restore</button>}
                                    <button onClick={() => { if (confirm('Delete permanently?')) actionPost(selected._id, 'delete'); }} className="flex-1 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/20 transition-all">Delete</button>
                                    <button onClick={() => toast('Warning sent (mock)', { icon: '⚠️' })} className="flex-1 h-10 rounded-2xl bg-[#A67C52]/10 border border-[#A67C52]/20 text-[#A67C52] text-sm font-bold hover:bg-[#A67C52]/20 transition-all">Warn User</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
