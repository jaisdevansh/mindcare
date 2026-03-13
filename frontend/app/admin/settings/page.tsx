'use client';
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Brain, Shield, Bell, UserCheck, Save, RefreshCw, CheckCircle, Info } from "lucide-react";
import toast from "react-hot-toast";

const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="p-7 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40 space-y-5">
        <h3 className="text-base font-black text-[#EDE0D4] flex items-center gap-2">
            <Icon className="w-4 h-4 text-[#A67C52]" /> {title}
        </h3>
        {children}
    </div>
);

const Toggle = ({ enabled, onToggle, label, desc }: { enabled: boolean; onToggle: () => void; label: string; desc?: string }) => (
    <div className="flex items-center justify-between py-3 border-b border-[#3D2B1F]/20 last:border-none">
        <div>
            <p className="text-sm font-bold text-[#EDE0D4]">{label}</p>
            {desc && <p className="text-[10px] text-[#A67C52]/40 mt-0.5">{desc}</p>}
        </div>
        <button onClick={onToggle} className={`relative w-11 h-6 rounded-full transition-all duration-300 ${enabled ? 'bg-[#A67C52]' : 'bg-[#3D2B1F]/60'}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${enabled ? 'left-5' : 'left-0.5'}`} />
        </button>
    </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-[#A67C52] ml-0.5">{label}</label>
        {children}
    </div>
);

const Input = ({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input className={`w-full h-11 bg-[#0F0A08] border border-[#3D2B1F]/60 rounded-2xl px-4 text-[#EDE0D4] text-sm focus:outline-none focus:ring-1 focus:ring-[#A67C52]/50 transition-all placeholder:text-[#A67C52]/25 ${className}`} {...props} />
);

export default function SettingsPage() {
    const [saving, setSaving] = useState(false);

    // AI Settings
    const [aiModel, setAiModel] = useState('gemini-2.0-flash');
    const [maxTokens, setMaxTokens] = useState('2048');
    const [aiEnabled, setAiEnabled] = useState(true);
    const [moodDetection, setMoodDetection] = useState(true);
    const [crisisDetection, setCrisisDetection] = useState(true);

    // Helper Verification
    const [requireExperience, setRequireExperience] = useState(true);
    const [requireCertification, setRequireCertification] = useState(false);
    const [minExperience, setMinExperience] = useState('1');
    const [autoApprove, setAutoApprove] = useState(false);

    // Community
    const [moderationEnabled, setModerationEnabled] = useState(true);
    const [allowAnonymous, setAllowAnonymous] = useState(true);
    const [maxPostLength, setMaxPostLength] = useState('1000');
    const [profanityFilter, setProfanityFilter] = useState(true);

    // Notifications
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [newUserAlert, setNewUserAlert] = useState(false);
    const [helperAppAlert, setHelperAppAlert] = useState(true);
    const [reportAlert, setReportAlert] = useState(true);
    const [systemAlert, setSystemAlert] = useState(true);

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 1200));
        setSaving(false);
        toast.success('Settings saved successfully!');
    };

    return (
        <div className="space-y-6 pb-10">
            {/* Info banner */}
            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-[#A67C52]/8 border border-[#A67C52]/20">
                <Info className="w-4 h-4 text-[#A67C52] shrink-0" />
                <p className="text-xs text-[#A67C52]/80 font-medium">Changes apply platform-wide. Save settings after each section to ensure changes are persisted.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* AI Settings */}
                <Section title="AI Model Configuration" icon={Brain}>
                    <Field label="AI Model">
                        <select value={aiModel} onChange={e => setAiModel(e.target.value)}
                            className="w-full h-11 bg-[#0F0A08] border border-[#3D2B1F]/60 rounded-2xl px-4 text-[#EDE0D4] text-sm focus:outline-none focus:ring-1 focus:ring-[#A67C52]/50 appearance-none cursor-pointer">
                            <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                        </select>
                    </Field>
                    <Field label="Max Response Tokens">
                        <Input type="number" value={maxTokens} onChange={e => setMaxTokens(e.target.value)} min="256" max="8192" />
                    </Field>
                    <div className="pt-2 border-t border-[#3D2B1F]/30 space-y-0.5">
                        <Toggle enabled={aiEnabled} onToggle={() => setAiEnabled(v => !v)} label="AI Listener Enabled" desc="Allow users access to AI-powered chat" />
                        <Toggle enabled={moodDetection} onToggle={() => setMoodDetection(v => !v)} label="Mood Detection" desc="Analyze messages for emotional state" />
                        <Toggle enabled={crisisDetection} onToggle={() => setCrisisDetection(v => !v)} label="Crisis Detection" desc="Alert admins when high-risk content detected" />
                    </div>
                </Section>

                {/* Helper Verification */}
                <Section title="Helper Verification Requirements" icon={UserCheck}>
                    <Field label="Minimum Experience (years)">
                        <Input type="number" value={minExperience} onChange={e => setMinExperience(e.target.value)} min="0" max="20" />
                    </Field>
                    <div className="pt-2 border-t border-[#3D2B1F]/30 space-y-0.5">
                        <Toggle enabled={requireExperience} onToggle={() => setRequireExperience(v => !v)} label="Require Experience Proof" desc="Helpers must submit experience documentation" />
                        <Toggle enabled={requireCertification} onToggle={() => setRequireCertification(v => !v)} label="Require Certification" desc="Mandatory professional certification upload" />
                        <Toggle enabled={autoApprove} onToggle={() => setAutoApprove(v => !v)} label="Auto-Approve Applications" desc="Skip manual review (not recommended)" />
                    </div>
                </Section>

                {/* Community Rules */}
                <Section title="Community Rules & Moderation" icon={Shield}>
                    <Field label="Max Post Length (characters)">
                        <Input type="number" value={maxPostLength} onChange={e => setMaxPostLength(e.target.value)} min="100" max="5000" />
                    </Field>
                    <div className="pt-2 border-t border-[#3D2B1F]/30 space-y-0.5">
                        <Toggle enabled={moderationEnabled} onToggle={() => setModerationEnabled(v => !v)} label="Content Moderation Enabled" desc="Automatically flag suspicious content" />
                        <Toggle enabled={allowAnonymous} onToggle={() => setAllowAnonymous(v => !v)} label="Allow Anonymous Posts" desc="Users can post without revealing identity" />
                        <Toggle enabled={profanityFilter} onToggle={() => setProfanityFilter(v => !v)} label="Profanity Filter" desc="Auto-filter offensive language" />
                    </div>
                </Section>

                {/* Notification Settings */}
                <Section title="Admin Notification Settings" icon={Bell}>
                    <Field label="Alert Email">
                        <Input type="email" defaultValue="admin@mindcare.com" placeholder="admin@mindcare.com" />
                    </Field>
                    <div className="pt-2 border-t border-[#3D2B1F]/30 space-y-0.5">
                        <Toggle enabled={emailAlerts} onToggle={() => setEmailAlerts(v => !v)} label="Email Alerts Enabled" />
                        <Toggle enabled={newUserAlert} onToggle={() => setNewUserAlert(v => !v)} label="New User Signup" />
                        <Toggle enabled={helperAppAlert} onToggle={() => setHelperAppAlert(v => !v)} label="Helper Application Submitted" />
                        <Toggle enabled={reportAlert} onToggle={() => setReportAlert(v => !v)} label="Abuse Report Filed" />
                        <Toggle enabled={systemAlert} onToggle={() => setSystemAlert(v => !v)} label="System Health Alerts" />
                    </div>
                </Section>
            </div>

            {/* System status */}
            <div className="p-6 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                <h3 className="text-base font-black text-[#EDE0D4] flex items-center gap-2 mb-5">
                    <Settings className="w-4 h-4 text-[#A67C52]" /> System Status
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: 'Database', status: 'Online', ok: true },
                        { label: 'AI Service', status: 'Active', ok: true },
                        { label: 'Email Service', status: 'Active', ok: true },
                        { label: 'Storage', status: '68% used', ok: true },
                    ].map(s => (
                        <div key={s.label} className="p-4 rounded-2xl bg-[#0F0A08]/60 border border-[#3D2B1F]/40 flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${s.ok ? 'bg-green-500 shadow-[0_0_6px_rgba(74,222,128,0.6)]' : 'bg-red-500'}`} />
                            <div>
                                <p className="text-[10px] font-black text-[#A67C52]/50 uppercase tracking-widest">{s.label}</p>
                                <p className="text-xs font-bold text-[#EDE0D4]">{s.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Save */}
            <div className="flex justify-end">
                <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 h-12 px-10 rounded-2xl bg-gradient-to-r from-[#A67C52] to-[#7F5539] text-white font-black text-sm shadow-lg shadow-[#A67C52]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60">
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving…' : 'Save All Settings'}
                </button>
            </div>
        </div>
    );
}
