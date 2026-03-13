"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { User, Settings, Shield, Bell, Lock, Palette, Camera, Save, X, Loader2, MapPin, Phone, Globe, Calendar } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getPublicUrl } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { userService } from '@/lib/services/user.service';
import { authService } from '@/lib/services/auth.service';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const { user, setUser } = useAppStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileImgSrc, setProfileImgSrc] = useState<string>('');
    const [imgKey, setImgKey] = useState(0);
    // Prevents the useEffect from overwriting the preview DURING upload
    const uploadingRef = useRef(false);

    const [formData, setFormData] = useState({
        name: user.name || '',
        bio: user.bio || '',
        gender: user.gender || '',
        location: user.location || '',
        phoneNumber: user.phoneNumber || '',
        preferredLanguage: user.preferredLanguage || '',
        anonymousMode: user.anonymousMode || false,
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    });

    // Sync formData when user changes (after hydration / after upload)
    useEffect(() => {
        setFormData({
            name: user.name || '',
            bio: user.bio || '',
            gender: user.gender || '',
            location: user.location || '',
            phoneNumber: user.phoneNumber || '',
            preferredLanguage: user.preferredLanguage || '',
            anonymousMode: user.anonymousMode || false,
            dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        });
    }, [user]);

    // Sync image src when user.profileImage changes — but NOT while uploading
    useEffect(() => {
        if (uploadingRef.current) return; // skip — handleFileChange owns the src during upload
        const base = getPublicUrl(user.profileImage) || user.avatar || '/images/avatar.png';
        const src = user.profileImage ? `${base}?t=${Date.now()}` : base;
        setProfileImgSrc(src);
        setImgKey(k => k + 1);
    }, [user.profileImage, user.avatar]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await userService.updateProfile(formData);
            if (response.success) {
                setUser(response.data);
                setIsEditing(false);
                toast.success('Profile updated successfully');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        // Reset input immediately so same file can be re-selected next time
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file (JPG, PNG, WebP)');
            return;
        }

        // 1️⃣ Instant blob preview
        const localPreview = URL.createObjectURL(file);
        uploadingRef.current = true;
        setProfileImgSrc(localPreview);
        setImgKey(k => k + 1);
        setIsUploading(true);

        try {
            // 2️⃣ Upload to backend
            const data = new FormData();
            data.append('profileImage', file);
            const uploadRes = await userService.uploadProfileImage(data);

            if (!uploadRes?.success) {
                throw new Error(uploadRes?.message || 'Upload failed');
            }

            // 3️⃣ Re-fetch fresh user from server (most reliable, no state patching)
            const meRes = await authService.getMe();
            if (meRes?.success && meRes.data) {
                const freshUser = meRes.data;
                setUser(freshUser);
                localStorage.setItem('user', JSON.stringify(freshUser));

                // 4️⃣ Set cache-busted URL
                const serverUrl = getPublicUrl(freshUser.profileImage);
                if (serverUrl) {
                    setProfileImgSrc(`${serverUrl}?t=${Date.now()}`);
                    setImgKey(k => k + 1);
                }
            } else {
                // Fallback: use path returned from upload directly
                const imgPath = uploadRes.data?.profileImage || uploadRes.data?.user?.profileImage;
                if (imgPath) {
                    const serverUrl = getPublicUrl(imgPath);
                    setProfileImgSrc(`${serverUrl}?t=${Date.now()}`);
                    setImgKey(k => k + 1);
                }
            }

            URL.revokeObjectURL(localPreview);
            toast.success('Profile picture updated! 🎉');

        } catch (error: any) {
            URL.revokeObjectURL(localPreview);
            // Revert to last known good image
            const fallback = getPublicUrl(user.profileImage) || '/images/avatar.png';
            setProfileImgSrc(fallback);
            setImgKey(k => k + 1);
            toast.error(error.message || 'Failed to upload image');
        } finally {
            setIsUploading(false);
            uploadingRef.current = false;
        }
    };

    const sections = [
        { icon: User, label: 'Personal Information', desc: 'Update your display name and private profile.' },
        { icon: Shield, label: 'Privacy & Security', desc: 'Manage your password and visibility settings.' },
        { icon: Bell, label: 'Notifications', desc: 'Configure how you want to be notified of updates.' },
        { icon: Palette, label: 'Appearance', desc: 'Customize your dashboard theme and colors.' }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center gap-8 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />

                <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-4 border-indigo-500/20 overflow-hidden relative shadow-2xl">
                        <img
                            key={imgKey}
                            src={profileImgSrc || '/images/avatar.png'}
                            alt={user.name}
                            className={`w-full h-full object-cover transition-all duration-300 ${isUploading ? 'opacity-50 scale-110 blur-sm' : 'group-hover:scale-110'}`}
                            onError={(e) => {
                                // Only fallback if it's not already the default avatar
                                const target = e.target as HTMLImageElement;
                                if (!target.src.includes('/images/avatar.png')) {
                                    target.src = '/images/avatar.png';
                                }
                            }}
                        />
                        {isUploading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                        )}
                        <div
                            onClick={handleImageClick}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity backdrop-blur-[2px]"
                        >
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>

                <div className="flex-1 text-center md:text-left z-10">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                        <h1 className="text-4xl font-black text-white tracking-tight">{user.name}</h1>
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest inline-block w-fit mx-auto md:mx-0">
                            {user.role}
                        </span>
                    </div>
                    <p className="text-slate-400 text-lg font-medium max-w-lg italic line-clamp-2">
                        {user.bio || "No bio yet. Tell the world about yourself."}
                    </p>
                </div>

                <div className="z-10">
                    {!isEditing ? (
                        <Button
                            onClick={() => setIsEditing(true)}
                            className="bg-white/10 hover:bg-white/20 text-white rounded-2xl px-6 h-12 border border-white/10 flex items-center gap-2 font-bold backdrop-blur-md transition-all active:scale-95"
                        >
                            <Settings className="w-4 h-4" />
                            Edit Profile
                        </Button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => setIsEditing(false)}
                                variant="outline"
                                className="border-white/10 text-white rounded-2xl px-6 h-12 hover:bg-white/5 transition-all font-bold"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-8 h-12 shadow-lg shadow-indigo-600/20 font-bold transition-all active:scale-95 flex items-center gap-2"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Update Profile
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {isEditing ? (
                    <motion.div
                        key="edit-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {/* Form Section */}
                        <div className="md:col-span-2 space-y-6">
                            <Card className="bg-white/5 border-white/10 p-8 rounded-3xl backdrop-blur-md">
                                <h2 className="text-xl font-bold text-white mb-8 border-b border-white/5 pb-4">Personal Details</h2>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400 ml-1">Display Name</label>
                                            <input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                                placeholder="Your Name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400 ml-1">Gender</label>
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#161B22] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                                <option value="prefer_not_to_say">Prefer not to say</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 ml-1">Bio</label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                                            placeholder="Write something about yourself..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400 ml-1 flex items-center gap-2">
                                                <Calendar className="w-4 h-4" /> Date of Birth
                                            </label>
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                value={formData.dateOfBirth}
                                                onChange={handleInputChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400 ml-1 flex items-center gap-2">
                                                <MapPin className="w-4 h-4" /> Location
                                            </label>
                                            <input
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                                placeholder="City, Country"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="bg-white/5 border-white/10 p-8 rounded-3xl backdrop-blur-md">
                                <h2 className="text-xl font-bold text-white mb-8 border-b border-white/5 pb-4">Communication</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 ml-1 flex items-center gap-2">
                                            <Phone className="w-4 h-4" /> Phone Number
                                        </label>
                                        <input
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 ml-1 flex items-center gap-2">
                                            <Globe className="w-4 h-4" /> Preferred Language
                                        </label>
                                        <input
                                            name="preferredLanguage"
                                            value={formData.preferredLanguage}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                            placeholder="English, Hindi, etc."
                                        />
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Settings Column */}
                        <div className="space-y-6">
                            <Card className="bg-white/5 border-white/10 p-8 rounded-3xl backdrop-blur-md">
                                <h2 className="text-xl font-bold text-white mb-6">Preferences</h2>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Anonymous Mode</h4>
                                        <p className="text-xs text-slate-500 mt-1">Hide your identity in community</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="anonymousMode"
                                            checked={formData.anonymousMode}
                                            onChange={handleInputChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>
                            </Card>

                            <div className="p-1">
                                <p className="text-xs text-slate-500 text-center leading-relaxed">
                                    Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'recently'}.
                                    Your data is encrypted and secure.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="view-grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {sections.map((section, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="bg-white/5 border-white/10 hover:bg-white/[0.08] transition-all cursor-pointer group rounded-3xl overflow-hidden relative border-l-4 border-l-transparent hover:border-l-indigo-500">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[40px] -mr-16 -mt-16" />
                                    <CardContent className="p-8 flex items-start gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-300">
                                            <section.icon className="w-7 h-7 text-indigo-400 group-hover:text-white transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-2">{section.label}</h3>
                                            <p className="text-sm text-slate-400 leading-relaxed font-medium">{section.desc}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Danger Zone */}
            {!isEditing && (
                <Card className="bg-rose-500/5 border-rose-500/10 rounded-[2.5rem] mt-12 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                    <CardHeader className="p-8 pb-0">
                        <CardTitle className="flex items-center gap-3 text-rose-500 text-2xl font-black italic uppercase tracking-wider">
                            <Shield className="w-6 h-6" />
                            Security / Danger Zone
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h4 className="text-white text-lg font-bold mb-1">Permanently Delete Account</h4>
                            <p className="text-sm text-slate-500 max-w-md font-medium">This action is irreversible. All your sessions, history, and medical data will be wiped from our servers.</p>
                        </div>
                        <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-2xl h-14 px-8 font-black uppercase tracking-tighter shadow-xl shadow-rose-600/20 active:scale-95 transition-all">
                            Delete Account
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
