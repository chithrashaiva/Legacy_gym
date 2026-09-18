import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { portalService } from '../services/portalService';
import { Link } from 'react-router-dom';
import {
    Users, DollarSign, Calendar, Dumbbell, Utensils, Send,
    Edit3, Check, X, Search, ShieldCheck, AlertTriangle,
    Clock, ArrowUpRight, TrendingUp, Sparkles, ChevronRight,
    Image, Video, Upload, Trash2, Plus, KeyRound, Lock, Shield,
    Bell, FileText, CheckCircle2
} from 'lucide-react';

export default function AdminPortal() {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Editing member modal / state
    const [editingMember, setEditingMember] = useState(null);
    const [formMembership, setFormMembership] = useState({
        plan_title: '',
        total_fee: '',
        paid_fee: '',
        status: 'active',
        date_of_joining: '',
        end_date: ''
    });

    // Schedule Instruction Form State
    const [instructionForm, setInstructionForm] = useState({
        title: '',
        instruction_text: '',
        scheduled_for_date: '',
        is_advance: true
    });
    const [instructionSuccess, setInstructionSuccess] = useState('');

    // Category Guidance Form State (General Fitness, Weight Loss, Weight Gain)
    const [guidanceForm, setGuidanceForm] = useState({
        category: 'weight_loss',
        title: 'Thermogenic Fat Loss & Caloric Deficit Protocol',
        guidance_text: 'Keep a 400-500 kcal daily deficit. Prioritize 1.8g protein per kg of body weight, perform post-workout HIIT sprints for 15 mins, and avoid refined sugars.'
    });
    const [guidanceSuccess, setGuidanceSuccess] = useState('');
    const [categoryGuidanceList, setCategoryGuidanceList] = useState([]);

    // Gallery Management State
    const [galleryItems, setGalleryItems] = useState([]);
    const [galleryLoading, setGalleryLoading] = useState(false);
    const [mediaForm, setMediaForm] = useState({
        title: '',
        category: 'Workout Room',
        media_type: 'photo',
        tag: 'Strength Training',
        media_url: '',
        description: ''
    });
    const [mediaSuccess, setMediaSuccess] = useState('');

    // 2-Step Verification Security State
    const [is2StepVerified, setIs2StepVerified] = useState(() => {
        return sessionStorage.getItem('admin_2step_verified') === 'true';
    });
    const [phoneInput, setPhoneInput] = useState('');
    const [otpInput, setOtpInput] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpDemoCode, setOtpDemoCode] = useState('');
    const [otpError, setOtpError] = useState('');
    const [verifyingOtp, setVerifyingOtp] = useState(false);

    useEffect(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setInstructionForm(prev => ({
            ...prev,
            scheduled_for_date: tomorrow.toISOString().split('T')[0]
        }));

        fetchOverview();
        loadGallery();
    }, []);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setOtpError('');
        try {
            const res = await portalService.sendAdminOTP(phoneInput, user?.username || 'admin');
            setOtpSent(true);
            setOtpDemoCode(res.otp_demo || '');
        } catch (err) {
            setOtpError(err.response?.data?.error || 'Failed to send OTP to mobile phone.');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setOtpError('');
        setVerifyingOtp(true);
        try {
            const res = await portalService.verifyAdminOTP(phoneInput, otpInput);
            if (res.verified) {
                sessionStorage.setItem('admin_2step_verified', 'true');
                setIs2StepVerified(true);
            } else {
                setOtpError(res.error || 'Invalid 2-step verification OTP code.');
            }
        } catch (err) {
            setOtpError(err.response?.data?.error || 'Verification failed. Invalid OTP code.');
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleLockPortal = () => {
        sessionStorage.removeItem('admin_2step_verified');
        setIs2StepVerified(false);
        setOtpInput('');
        setOtpSent(false);
    };

    const loadGallery = async () => {
        try {
            setGalleryLoading(true);
            const data = await portalService.getGalleryMedia();
            setGalleryItems(data);
        } catch (err) {
            console.error('Failed to load gallery media', err);
        } finally {
            setGalleryLoading(false);
        }
    };

    const handleAddMedia = async (e) => {
        e.preventDefault();
        try {
            await portalService.createGalleryMedia(mediaForm);
            setMediaSuccess('New workout room photo/video added to gallery successfully!');
            setTimeout(() => setMediaSuccess(''), 4000);
            setMediaForm({
                title: '',
                category: 'Workout Room',
                media_type: 'photo',
                tag: 'Strength Training',
                media_url: '',
                description: ''
            });
            loadGallery();
        } catch (err) {
            console.error('Error uploading media', err);
            alert('Failed to upload media. Please check URL and details.');
        }
    };

    const handleDeleteMedia = async (mediaId) => {
        if (!window.confirm('Are you sure you want to remove this media item from the gallery?')) return;
        try {
            await portalService.deleteGalleryMedia(mediaId);
            loadGallery();
        } catch (err) {
            console.error('Error deleting media', err);
            alert('Failed to delete media item.');
        }
    };

    const fetchOverview = async () => {
        try {
            setLoading(true);
            const data = await portalService.getAdminOverview();
            setOverview(data);
            setCategoryGuidanceList(data.category_guidance || []);
        } catch (err) {
            console.error('Failed to load admin overview', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCategoryGuidance = async (e) => {
        e.preventDefault();
        try {
            const updated = await portalService.saveCategoryGuidance(guidanceForm);
            setGuidanceSuccess(`Guidance for ${guidanceForm.category.replace('_', ' ').toUpperCase()} updated successfully! Broadcast to members.`);
            setTimeout(() => setGuidanceSuccess(''), 4000);
            fetchOverview();
        } catch (err) {
            console.error('Failed to save category guidance', err);
            alert('Failed to publish category guidance.');
        }
    };

    const handleEditClick = (member) => {
        const mem = member.membership || {};
        setEditingMember(member);
        setFormMembership({
            plan_title: mem.plan_title || '3 Months Pro',
            fitness_category: member.fitness_category || mem.fitness_category || 'general_fitness',
            total_fee: mem.total_fee || '9999.00',
            paid_fee: mem.paid_fee || '6000.00',
            status: mem.status || 'active',
            date_of_joining: mem.date_of_joining || new Date().toISOString().split('T')[0],
            end_date: mem.end_date || ''
        });
    };

    const handleSaveMembership = async (e) => {
        e.preventDefault();
        try {
            await portalService.updateMembership(editingMember.id, formMembership);
            setEditingMember(null);
            fetchOverview();
        } catch (err) {
            console.error('Error saving member update', err);
            alert('Failed to update member data');
        }
    };

    const handleDeleteMember = async (memberId, memberName) => {
        if (!window.confirm(`Are you sure you want to remove client "${memberName}" from Legacy Gym registry?`)) return;
        try {
            await portalService.deleteMember(memberId);
            fetchOverview();
        } catch (err) {
            console.error('Error deleting member', err);
            alert(err.response?.data?.error || 'Failed to remove member.');
        }
    };

    const handleSendInstruction = async (e) => {
        e.preventDefault();
        try {
            await portalService.createInstruction(instructionForm);
            setInstructionSuccess('Instruction scheduled successfully! Push notification broadcast to members.');
            setTimeout(() => setInstructionSuccess(''), 4000);
            setInstructionForm(prev => ({
                ...prev,
                title: '',
                instruction_text: ''
            }));
            fetchOverview();
        } catch (err) {
            console.error('Error creating instruction', err);
            alert('Failed to schedule instruction');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-amber-500">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                    <span className="text-zinc-400 font-medium tracking-wide">Loading Gym Admin Portal...</span>
                </div>
            </div>
        );
    }

    const metrics = overview?.metrics || {};
    const members = overview?.members || [];
    const instructions = overview?.instructions || [];
    const expiredAlerts = overview?.expired_members_alerts || [];

    const filteredMembers = members.filter(m => {
        const query = searchTerm.toLowerCase();
        const fullName = `${m.first_name || ''} ${m.last_name || ''}`.toLowerCase();
        const username = (m.username || '').toLowerCase();
        return fullName.includes(query) || username.includes(query);
    });

    return (
        <div className="min-h-screen bg-[#0c0d0e] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#0c0d0e]/90 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/20">
                                L
                            </div>
                            <span className="font-extrabold tracking-wider text-lg uppercase bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                                Legacy Lounge
                            </span>
                        </Link>
                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            Gym Admin & Trainer Portal
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {is2StepVerified ? (
                            <button
                                onClick={handleLockPortal}
                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
                            >
                                <ShieldCheck className="w-3.5 h-3.5" /> 2-Step Verified Active
                            </button>
                        ) : (
                            <button
                                onClick={() => setIs2StepVerified(false)}
                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
                            >
                                <Lock className="w-3.5 h-3.5" /> Require 2-Step Verification
                            </button>
                        )}

                        <Link
                            to="/dashboard"
                            className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-colors"
                        >
                            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                            View Member Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                
                {/* 2-Step Verification Modal prompt if not verified */}
                {!is2StepVerified && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-amber-500 text-black rounded-xl shrink-0 mt-1">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">Admin 2-Step Mobile OTP Verification Required</h3>
                                <p className="text-xs text-amber-200/80 mt-1 leading-relaxed max-w-xl">
                                    For high-security operations (financial updates, gallery media uploads), please complete your 2-step phone verification.
                                </p>
                            </div>
                        </div>

                        {!otpSent ? (
                            <form onSubmit={handleSendOTP} className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                                <input
                                    type="tel"
                                    required
                                    placeholder="Enter Phone Number (+91...)"
                                    value={phoneInput}
                                    onChange={e => setPhoneInput(e.target.value)}
                                    className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl shadow shrink-0 whitespace-nowrap"
                                >
                                    Send Mobile OTP
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                                {otpDemoCode && (
                                    <span className="text-[10px] text-amber-300 font-mono bg-zinc-900 border border-amber-500/30 px-2 py-1 rounded flex items-center">
                                        Demo OTP: <strong className="text-white ml-1">{otpDemoCode}</strong>
                                    </span>
                                )}
                                <input
                                    type="text"
                                    maxLength={6}
                                    required
                                    placeholder="6-Digit OTP"
                                    value={otpInput}
                                    onChange={e => setOtpInput(e.target.value)}
                                    className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 font-mono text-center focus:outline-none focus:border-amber-500 w-32"
                                />
                                <button
                                    type="submit"
                                    disabled={verifyingOtp}
                                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl shadow shrink-0 whitespace-nowrap"
                                >
                                    {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
                                </button>
                            </form>
                        )}
                        {otpError && <p className="text-xs text-red-400 w-full text-right">{otpError}</p>}
                    </div>
                )}

                {/* EXPIRED MEMBERSHIPS NOTIFICATION BANNER FOR ADMIN */}
                {expiredAlerts.length > 0 && (
                    <div className="bg-red-950/40 border border-red-600/60 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center gap-2 text-red-400 font-extrabold text-sm uppercase tracking-wider">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            Expired Membership Alerts ({expiredAlerts.length} Action Required)
                        </div>
                        <p className="text-xs text-zinc-300">The following members have expired plans. Automated alerts have been pushed to their member dashboards:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {expiredAlerts.map((exp, i) => (
                                <div key={i} className="p-3 bg-zinc-900/80 border border-red-900/50 rounded-xl space-y-1 text-xs">
                                    <div className="font-bold text-white">{exp.name}</div>
                                    <div className="text-zinc-400">Plan: <span className="text-red-400 font-semibold">{exp.plan_title}</span></div>
                                    <div className="text-[11px] font-mono text-zinc-500">Expired On: {exp.end_date}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 1. KPI Overview Stats Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#111215] border border-zinc-800 rounded-2xl p-5 relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Active Members</p>
                                <h3 className="text-3xl font-black text-white mt-1">{metrics.total_members}</h3>
                            </div>
                            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-3 text-xs text-zinc-400 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">+8%</span> this month
                        </div>
                    </div>

                    <div className="bg-[#111215] border border-zinc-800 rounded-2xl p-5 relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Revenue</p>
                                <h3 className="text-3xl font-black text-emerald-400 mt-1">₹{metrics.total_revenue?.toLocaleString()}</h3>
                            </div>
                            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                                <DollarSign className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-3 text-xs text-zinc-400">Collected fees year-to-date</div>
                    </div>

                    <div className="bg-[#111215] border border-zinc-800 rounded-2xl p-5 relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Pending Balances</p>
                                <h3 className="text-3xl font-black text-red-400 mt-1">₹{metrics.total_balance_due?.toLocaleString()}</h3>
                            </div>
                            <div className="p-2.5 bg-red-500/10 text-red-400 rounded-xl">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-3 text-xs text-red-400/80 font-medium">Pending collection at desk</div>
                    </div>

                    <div className="bg-[#111215] border border-zinc-800 rounded-2xl p-5 relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Upcoming Expirations</p>
                                <h3 className="text-3xl font-black text-amber-400 mt-1">{metrics.upcoming_expirations}</h3>
                            </div>
                            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
                                <Clock className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-3 text-xs text-amber-300/80 font-medium">Renewal alerts in next 14 days</div>
                    </div>
                </div>

                {/* 2. CATEGORY SPECIFIC GUIDANCE MANAGER (General Fitness, Weight Loss, Weight Gain) */}
                <div className="bg-[#111215] border border-zinc-800 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <div>
                            <h2 className="text-lg font-bold text-white">Publish Categorized Trainer Guidance</h2>
                            <p className="text-xs text-zinc-400">Provide separate specialized advice for members under General Fitness, Weight Loss, and Weight Gain.</p>
                        </div>
                    </div>

                    {guidanceSuccess && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> {guidanceSuccess}
                        </div>
                    )}

                    <form onSubmit={handleSaveCategoryGuidance} className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1">Target Category</label>
                                <select
                                    value={guidanceForm.category}
                                    onChange={e => setGuidanceForm({ ...guidanceForm, category: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:border-amber-500 outline-none"
                                >
                                    <option value="general_fitness">General Fitness</option>
                                    <option value="weight_loss">Weight Loss</option>
                                    <option value="weight_gain">Weight Gain</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-zinc-400 mb-1">Guidance Headline / Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Thermogenic Fat Loss Protocol"
                                    value={guidanceForm.title}
                                    onChange={e => setGuidanceForm({ ...guidanceForm, title: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:border-amber-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 mb-1">Detailed Guidance & Advice Text</label>
                            <textarea
                                rows={3}
                                required
                                placeholder="Detail macronutrient timing, calorie deficit/surplus, training intensity, and sleep recovery advice for this category..."
                                value={guidanceForm.guidance_text}
                                onChange={e => setGuidanceForm({ ...guidanceForm, guidance_text: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:border-amber-500 outline-none"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
                            >
                                <Send className="w-3.5 h-3.5" /> Publish Guidance to Members
                            </button>
                        </div>
                    </form>

                    {/* Active Category Guidance Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {categoryGuidanceList.map((g, i) => (
                            <div key={i} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                        {g.category.replace('_', ' ')}
                                    </span>
                                </div>
                                <h4 className="text-xs font-bold text-white">{g.title}</h4>
                                <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-3">{g.guidance_text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Instruction Scheduling (1-Day in Advance with notifications) */}
                <div className="bg-[#111215] border border-zinc-800 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Send className="w-5 h-5 text-amber-400" />
                        <div>
                            <h2 className="text-lg font-bold text-white">Schedule Trainer Instructions (1-Day Advance)</h2>
                            <p className="text-xs text-zinc-400">Post notifications and special workout or nutrition guidelines directly to members’ dashboards.</p>
                        </div>
                    </div>

                    {instructionSuccess && (
                        <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                            <Check className="w-4 h-4" /> {instructionSuccess}
                        </div>
                    )}

                    <form onSubmit={handleSendInstruction} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-zinc-400 mb-1">Instruction Title / Subject</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Tomorrow: High-Octane Leg Blast & Hydration Advisory"
                                    value={instructionForm.title}
                                    onChange={e => setInstructionForm({ ...instructionForm, title: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1">Scheduled Date (Advance Target)</label>
                                <input
                                    type="date"
                                    required
                                    value={instructionForm.scheduled_for_date}
                                    onChange={e => setInstructionForm({ ...instructionForm, scheduled_for_date: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 mb-1">Detailed Instruction Text</label>
                            <textarea
                                rows={3}
                                required
                                placeholder="Detail the equipment preparation, warm-up mobility routine, hydration targets, or nutrition timing..."
                                value={instructionForm.instruction_text}
                                onChange={e => setInstructionForm({ ...instructionForm, instruction_text: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                            />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={instructionForm.is_advance}
                                    onChange={e => setInstructionForm({ ...instructionForm, is_advance: e.target.checked })}
                                    className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                                />
                                Highlight as Priority Next-Day Advance Notice
                            </label>

                            <button
                                type="submit"
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
                            >
                                <Send className="w-3.5 h-3.5" />
                                Broadcast Instruction to Clients
                            </button>
                        </div>
                    </form>
                </div>

                {/* 4. Workout Room & Gym Gallery Management (Photos & Videos) */}
                <div className="bg-[#111215] border border-zinc-800 rounded-2xl p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Image className="w-5 h-5 text-amber-400" />
                            <div>
                                <h2 className="text-lg font-bold text-white">Workout Room & Gym Gallery Manager</h2>
                                <p className="text-xs text-zinc-400">Add, review, and manage photos & video links of the workout room, equipment, and training zones.</p>
                            </div>
                        </div>
                        <span className="text-xs px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg font-semibold">
                            {galleryItems.length} Media Items Live
                        </span>
                    </div>

                    {mediaSuccess && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                            <Check className="w-4 h-4" /> {mediaSuccess}
                        </div>
                    )}

                    {/* Upload / Add Form */}
                    <form onSubmit={handleAddMedia} className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl space-y-4">
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                            <Plus className="w-3.5 h-3.5" /> Add New Photo or Video
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1">Title / Caption</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Free Weights & Dumbbell Rack Area"
                                    value={mediaForm.title}
                                    onChange={e => setMediaForm({ ...mediaForm, title: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:border-amber-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1">Media Type</label>
                                <select
                                    value={mediaForm.media_type}
                                    onChange={e => setMediaForm({ ...mediaForm, media_type: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:border-amber-500 outline-none"
                                >
                                    <option value="photo">Photo (Image)</option>
                                    <option value="video">Video (MP4 / Web Video / YouTube)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1">Gallery Category</label>
                                <select
                                    value={mediaForm.category}
                                    onChange={e => setMediaForm({ ...mediaForm, category: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:border-amber-500 outline-none"
                                >
                                    <option value="Workout Room">Workout Room / Floor</option>
                                    <option value="Leg Equipment">Leg Equipment</option>
                                    <option value="Cardio Zone">Cardio Zone</option>
                                    <option value="Upper Body">Upper Body</option>
                                    <option value="CrossFit & Functional">CrossFit & Functional</option>
                                    <option value="General">General Gym Lounge</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                                    Media Image/Video URL or Asset Path
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="https://... or /gallery/my_workout_room.jpg"
                                    value={mediaForm.media_url}
                                    onChange={e => setMediaForm({ ...mediaForm, media_url: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:border-amber-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1">Tag / Subheading</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Strength Training, Cardio, HIIT"
                                    value={mediaForm.tag}
                                    onChange={e => setMediaForm({ ...mediaForm, tag: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:border-amber-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 mb-1">Description</label>
                            <textarea
                                rows={2}
                                placeholder="Describe the equipment, zone features, or training purpose..."
                                value={mediaForm.description}
                                onChange={e => setMediaForm({ ...mediaForm, description: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:border-amber-500 outline-none"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
                            >
                                <Upload className="w-3.5 h-3.5" /> Add to Public Gallery
                            </button>
                        </div>
                    </form>

                    {/* Live Gallery Media Cards */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Current Gallery Media</h4>
                        
                        {galleryItems.length === 0 ? (
                            <div className="p-8 text-center text-zinc-500 text-xs border border-zinc-800/80 rounded-xl">
                                No custom photos or videos added yet. Default showroom media is active on the main Gallery page.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {galleryItems.map(item => (
                                    <div
                                        key={item.id}
                                        className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between group"
                                    >
                                        <div className="relative aspect-video bg-black overflow-hidden">
                                            {item.media_type === 'video' ? (
                                                <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-amber-400">
                                                    <Video className="w-8 h-8" />
                                                </div>
                                            ) : (
                                                <img
                                                    src={item.media_url || item.file_url}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                    onError={(e) => { e.target.src = '/gallery/hack_squat_leg_press.jpg'; }}
                                                />
                                            )}
                                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-black uppercase">
                                                {item.category}
                                            </span>
                                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/80 text-zinc-300">
                                                {item.media_type}
                                            </span>
                                        </div>

                                        <div className="p-3.5 space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className="text-xs font-bold text-white leading-tight">{item.title}</h4>
                                                <button
                                                    onClick={() => handleDeleteMedia(item.id)}
                                                    className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                                                    title="Delete media"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            {item.description && (
                                                <p className="text-[11px] text-zinc-400 line-clamp-2">{item.description}</p>
                                            )}
                                            <div className="text-[10px] text-zinc-500 font-mono flex items-center justify-between pt-1 border-t border-zinc-800">
                                                <span>{item.tag || 'Workout Floor'}</span>
                                                <span>{item.uploaded_by_name}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 5. Client Data Management (Roster & Fees Update) */}
                <div className="bg-[#111215] border border-zinc-800 rounded-2xl p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-white">Client Data & Membership Management</h2>
                            <p className="text-xs text-zinc-400">View active athletes, edit subscription plans, record payments, and track balances due.</p>
                        </div>

                        <div className="relative">
                            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                            <input
                                type="text"
                                placeholder="Search member name..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-amber-500 w-full sm:w-64"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold">
                                    <th className="py-3 px-4">Member Name</th>
                                    <th className="py-3 px-4">Plan Chosen</th>
                                    <th className="py-3 px-4">Join Date</th>
                                    <th className="py-3 px-4">Total Fee</th>
                                    <th className="py-3 px-4">Paid Fee</th>
                                    <th className="py-3 px-4">Balance Due</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/60">
                                {filteredMembers.map((member) => {
                                    const mem = member.membership || {};
                                    const balance = parseFloat(mem.balance_due || 0);
                                    const isMemExpired = mem.status === 'expired' || (mem.end_date && new Date(mem.end_date) < new Date());
                                    return (
                                        <tr key={member.id} className="hover:bg-zinc-900/40 transition-colors">
                                            <td className="py-3.5 px-4 font-bold text-white">
                                                {member.first_name ? `${member.first_name} ${member.last_name || ''}` : member.username}
                                                <div className="text-[11px] font-normal text-zinc-400 font-mono">
                                                    {member.phone || member.email || `@${member.username}`}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-zinc-300">
                                                {mem.plan_title || '3 Months Pro'}
                                            </td>
                                            <td className="py-3.5 px-4 font-mono text-zinc-400">
                                                {mem.date_of_joining || '—'}
                                            </td>
                                            <td className="py-3.5 px-4 font-mono text-zinc-200">
                                                ₹{parseFloat(mem.total_fee || 0).toLocaleString()}
                                            </td>
                                            <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">
                                                ₹{parseFloat(mem.paid_fee || 0).toLocaleString()}
                                            </td>
                                            <td className="py-3.5 px-4 font-mono font-bold">
                                                <span className={`px-2 py-0.5 rounded ${balance > 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'text-emerald-400'}`}>
                                                    ₹{balance.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                    isMemExpired
                                                        ? 'bg-red-500/20 text-red-400 border border-red-500/40 font-bold'
                                                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                }`}>
                                                    {isMemExpired ? 'Expired' : (mem.status || 'Active')}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(member)}
                                                        className="px-3 py-1.5 bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-300 font-medium rounded-lg transition-colors inline-flex items-center gap-1.5"
                                                    >
                                                        <Edit3 className="w-3 h-3" /> Edit Data
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteMember(member.id, member.first_name ? `${member.first_name} ${member.last_name || ''}` : member.username)}
                                                        className="px-2.5 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/50 rounded-lg transition-colors inline-flex items-center gap-1"
                                                        title="Remove Client"
                                                    >
                                                        <Trash2 className="w-3 h-3" /> Remove
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 6. Edit Member Data Modal */}
                {editingMember && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-[#141518] border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl relative">
                            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                                <div>
                                    <h3 className="text-base font-bold text-white">
                                        Edit Client Membership
                                    </h3>
                                    <p className="text-xs text-amber-500 font-medium">
                                        {editingMember.first_name || editingMember.username}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setEditingMember(null)}
                                    className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveMembership} className="space-y-4 text-xs">
                                <div>
                                    <label className="block font-semibold text-zinc-400 mb-1">Membership Plan Title</label>
                                    <input
                                        type="text"
                                        value={formMembership.plan_title}
                                        onChange={e => setFormMembership({ ...formMembership, plan_title: e.target.value })}
                                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:border-amber-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-amber-400 mb-1 font-bold">Assigned Fitness Category (Goal)</label>
                                    <select
                                        value={formMembership.fitness_category}
                                        onChange={e => setFormMembership({ ...formMembership, fitness_category: e.target.value })}
                                        className="w-full px-3 py-2 bg-zinc-900 border border-amber-500/40 rounded-lg text-amber-300 font-bold focus:border-amber-500 outline-none"
                                    >
                                        <option value="weight_loss">Weight Loss</option>
                                        <option value="weight_gain">Weight Gain</option>
                                        <option value="general_fitness">General Fitness</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-semibold text-zinc-400 mb-1">Total Fee (₹)</label>
                                        <input
                                            type="number"
                                            value={formMembership.total_fee}
                                            onChange={e => setFormMembership({ ...formMembership, total_fee: e.target.value })}
                                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:border-amber-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-zinc-400 mb-1">Paid Fee (₹)</label>
                                        <input
                                            type="number"
                                            value={formMembership.paid_fee}
                                            onChange={e => setFormMembership({ ...formMembership, paid_fee: e.target.value })}
                                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-emerald-400 font-bold focus:border-amber-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="p-3 bg-zinc-900/90 rounded-lg border border-zinc-800 flex justify-between items-center">
                                    <span className="text-zinc-400">Calculated Balance Due:</span>
                                    <span className="font-extrabold text-amber-400 text-sm">
                                        ₹{Math.max(0, parseFloat(formMembership.total_fee || 0) - parseFloat(formMembership.paid_fee || 0)).toLocaleString()}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-semibold text-zinc-400 mb-1">Date of Joining</label>
                                        <input
                                            type="date"
                                            value={formMembership.date_of_joining}
                                            onChange={e => setFormMembership({ ...formMembership, date_of_joining: e.target.value })}
                                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:border-amber-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-zinc-400 mb-1">Membership Status</label>
                                        <select
                                            value={formMembership.status}
                                            onChange={e => setFormMembership({ ...formMembership, status: e.target.value })}
                                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:border-amber-500 outline-none"
                                        >
                                            <option value="active">Active</option>
                                            <option value="pending">Pending Renewal</option>
                                            <option value="expired">Expired</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                                    <button
                                        type="button"
                                        onClick={() => setEditingMember(null)}
                                        className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-md shadow-amber-500/20"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
