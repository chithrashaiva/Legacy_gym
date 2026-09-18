import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { portalService } from '../services/portalService';
import { Link } from 'react-router-dom';
import {
    Users, DollarSign, Calendar, Dumbbell, Utensils, Send,
    Edit3, Check, X, Search, ShieldCheck, AlertTriangle,
    Clock, ArrowUpRight, TrendingUp, Sparkles, ChevronRight,
    Image, Video, Upload, Trash2, Plus, KeyRound, Lock, Shield,
    Bell, FileText, CheckCircle2, HeartPulse, UserPlus, Eye,
    CreditCard, Activity, Flame, Trophy, MapPin, Scale, Ruler
} from 'lucide-react';

const FITNESS_GOALS = [
    { id: 'weight_loss', label: 'Weight Loss' },
    { id: 'general_fitness', label: 'General Fitness' },
    { id: 'strength_training', label: 'Strength Training' },
    { id: 'muscle_gain', label: 'Muscle Gain' },
    { id: 'body_transformation', label: 'Body Transformation' },
];

const PLAN_PRESETS = [
    { id: '1_month', title: '1 Month Starter', days: 30, fee: 1999 },
    { id: '3_months', title: '3 Months Pro', days: 90, fee: 4999 },
    { id: '6_months', title: '6 Months Elite', days: 180, fee: 8999 },
    { id: '12_months', title: '12 Months Annual VIP', days: 365, fee: 15999 },
];

const PAYMENT_MODES = [
    { id: 'upi', label: 'UPI' },
    { id: 'card', label: 'Card' },
    { id: 'cash', label: 'Cash' },
    { id: 'bank_transfer', label: 'Bank Transfer' },
];

export default function AdminPortal() {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategoryTab, setSelectedCategoryTab] = useState('all');

    // Editing member modal / state
    const [editingMember, setEditingMember] = useState(null);
    const [viewingMember, setViewingMember] = useState(null);
    const [formMembership, setFormMembership] = useState({
        // User fields
        phone: '',
        gender: 'M',
        address: '',
        height: '',
        weight: '',
        has_medical_condition: false,
        medical_condition_reason: '',
        injuries_surgeries: '',
        fitness_category: 'weight_loss',

        // Membership fields
        plan_name: '3_months',
        plan_title: '3 Months Pro',
        total_fee: 4999,
        paid_fee: 4999,
        payment_mode: 'upi',
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

    // Category Guidance Form State
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
            const saved = await portalService.saveCategoryGuidance(guidanceForm);
            setCategoryGuidanceList(prev => {
                const idx = prev.findIndex(g => g.category === saved.category);
                if (idx >= 0) {
                    const copy = [...prev];
                    copy[idx] = saved;
                    return copy;
                }
                return [...prev, saved];
            });
            setGuidanceSuccess(`Guidance for ${guidanceForm.category.replace('_', ' ')} saved and published to all category members!`);
            setTimeout(() => setGuidanceSuccess(''), 4000);
        } catch (err) {
            console.error('Failed to save guidance', err);
            alert('Failed to save guidance advice');
        }
    };

    const handleEditClick = (member) => {
        setEditingMember(member);
        const mem = member.membership || {};
        setFormMembership({
            phone: member.phone || '',
            gender: member.gender || 'M',
            address: member.address || '',
            height: member.height || '',
            weight: member.weight || '',
            has_medical_condition: member.has_medical_condition || false,
            medical_condition_reason: member.medical_condition_reason || '',
            injuries_surgeries: member.injuries_surgeries || 'None',
            fitness_category: member.fitness_category || mem.fitness_category || 'general_fitness',

            plan_name: mem.plan_name || '3_months',
            plan_title: mem.plan_title || '3 Months Pro',
            total_fee: mem.total_fee || 4999,
            paid_fee: mem.paid_fee || 4999,
            payment_mode: mem.payment_mode || 'upi',
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
        const phone = (m.phone || '').toLowerCase();
        const category = (m.fitness_category_display || m.fitness_category || '').toLowerCase();
        const plan = (m.membership?.plan_title || '').toLowerCase();
        const address = (m.address || '').toLowerCase();
        return fullName.includes(query) || username.includes(query) || phone.includes(query) || category.includes(query) || plan.includes(query) || address.includes(query);
    });

    const displayedCategoryMembers = filteredMembers.filter(m => {
        if (selectedCategoryTab === 'all') return true;
        return (m.fitness_category || '').toLowerCase() === selectedCategoryTab.toLowerCase();
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

                    <div className="flex items-center gap-3">
                        <Link
                            to="/register"
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400 shadow transition-colors"
                        >
                            <UserPlus className="w-3.5 h-3.5" /> Enroll Member
                        </Link>
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-colors"
                        >
                            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                            Member View
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* EXPIRED MEMBERSHIPS NOTIFICATION BANNER FOR ADMIN */}
                {expiredAlerts.length > 0 && (
                    <div className="bg-red-950/40 border border-red-600/60 rounded-2xl p-5 space-y-3 shadow-lg">
                        <div className="flex items-center gap-2 text-red-400 font-extrabold text-sm uppercase tracking-wider">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            Expired Membership Alerts ({expiredAlerts.length} Action Required)
                        </div>
                        <p className="text-xs text-zinc-300">The following members have expired plans. Automated renewal notifications are displayed on their member dashboards:</p>
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
                    <div className="bg-[#111215] border border-zinc-800 rounded-2xl p-5 relative overflow-hidden shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Registered Members</p>
                                <h3 className="text-3xl font-black text-white mt-1">{metrics.total_members}</h3>
                            </div>
                            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-3 text-xs text-zinc-400 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Active Roster</span>
                        </div>
                    </div>

                    <div className="bg-[#111215] border border-zinc-800 rounded-2xl p-5 relative overflow-hidden shadow">
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

                    <div className="bg-[#111215] border border-zinc-800 rounded-2xl p-5 relative overflow-hidden shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Pending Balances</p>
                                <h3 className="text-3xl font-black text-red-400 mt-1">₹{metrics.total_balance_due?.toLocaleString()}</h3>
                            </div>
                            <div className="p-2.5 bg-red-500/10 text-red-400 rounded-xl">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-3 text-xs text-red-400/80 font-medium">Pending desk collections</div>
                    </div>

                    <div className="bg-[#111215] border border-zinc-800 rounded-2xl p-5 relative overflow-hidden shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Upcoming Expirations</p>
                                <h3 className="text-3xl font-black text-amber-400 mt-1">{metrics.upcoming_expirations}</h3>
                            </div>
                            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
                                <Clock className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mt-3 text-xs text-amber-400/80">Next 14 days</div>
                    </div>
                </div>

                {/* 2. Client Roster & Membership Data Management */}
                <div className="bg-[#111215] border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-xl">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-black text-white flex items-center gap-2">
                                <Users className="w-6 h-6 text-amber-500" />
                                All Members & Category-wise Roster
                            </h2>
                            <p className="text-xs text-zinc-400 mt-1">
                                Complete information displayed in rows & columns for every fitness category (General Fitness, Strength Training, Weight Loss, Muscle Gain, Body Transformation).
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            <div className="relative">
                                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                                <input
                                    type="text"
                                    placeholder="Search name, phone, email, goal..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-amber-500 w-full sm:w-64"
                                />
                            </div>
                            <Link
                                to="/register"
                                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
                            >
                                <Plus className="w-4 h-4" /> Enroll New Member
                            </Link>
                        </div>
                    </div>

                    {/* Category Filter Tabs & Member Counts */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800/80">
                        <button
                            type="button"
                            onClick={() => setSelectedCategoryTab('all')}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                selectedCategoryTab === 'all'
                                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                            }`}
                        >
                            <span>All Members</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${selectedCategoryTab === 'all' ? 'bg-black text-amber-400' : 'bg-zinc-800 text-zinc-300'}`}>
                                {members.length}
                            </span>
                        </button>

                        {FITNESS_GOALS.map((cat) => {
                            const count = members.filter(m => (m.fitness_category || '').toLowerCase() === cat.id.toLowerCase()).length;
                            const isSelected = selectedCategoryTab === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setSelectedCategoryTab(cat.id)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                        isSelected
                                            ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                                            : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                                    }`}
                                >
                                    <span>{cat.label}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isSelected ? 'bg-black text-amber-400' : 'bg-zinc-800 text-zinc-300'}`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#0d0e10]">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-zinc-900/90 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-bold text-[11px]">
                                    <th className="py-3.5 px-4"># Member Details</th>
                                    <th className="py-3.5 px-4">Category / Goal</th>
                                    <th className="py-3.5 px-4">Contact (Phone & Email)</th>
                                    <th className="py-3.5 px-4">Metrics & Gender</th>
                                    <th className="py-3.5 px-4">Address</th>
                                    <th className="py-3.5 px-4">Medical Record</th>
                                    <th className="py-3.5 px-4">Plan & Duration</th>
                                    <th className="py-3.5 px-4">Joining & End Date</th>
                                    <th className="py-3.5 px-4">Payment</th>
                                    <th className="py-3.5 px-4">Fees & Balance</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/60">
                                {displayedCategoryMembers.length === 0 ? (
                                    <tr>
                                        <td colSpan={12} className="py-12 text-center text-zinc-500">
                                            No members found matching the selected category or search filter.
                                        </td>
                                    </tr>
                                ) : (
                                    displayedCategoryMembers.map((member, index) => {
                                        const mem = member.membership || {};
                                        const balance = parseFloat(mem.balance_due || 0);
                                        const isMemExpired = mem.status === 'expired' || (mem.end_date && new Date(mem.end_date) < new Date());
                                        const hasMed = member.has_medical_condition;

                                        // Category badge color
                                        const getCategoryBadgeClass = (cat) => {
                                            switch (cat) {
                                                case 'weight_loss': return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
                                                case 'general_fitness': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
                                                case 'strength_training': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
                                                case 'muscle_gain': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
                                                case 'body_transformation': return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
                                                default: return 'bg-zinc-800 text-zinc-300 border-zinc-700';
                                            }
                                        };

                                        return (
                                            <tr key={member.id} className="hover:bg-zinc-900/50 transition-colors">
                                                {/* Col 1: Member Info */}
                                                <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/30 border border-amber-500/30 flex items-center justify-center font-extrabold text-amber-400 text-xs shrink-0">
                                                            {(member.first_name ? member.first_name[0] : member.username[0]).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="text-white text-xs font-bold leading-tight">
                                                                {member.first_name ? `${member.first_name} ${member.last_name || ''}` : member.username}
                                                            </div>
                                                            <div className="text-[11px] font-mono text-zinc-400">
                                                                @{member.username}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Col 2: Category / Fitness Goal */}
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${getCategoryBadgeClass(member.fitness_category)}`}>
                                                        {member.fitness_category_display || member.fitness_category?.replace('_', ' ') || 'General Fitness'}
                                                    </span>
                                                </td>

                                                {/* Col 3: Contact */}
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <div className="font-mono text-zinc-200 text-xs font-semibold">{member.phone || '—'}</div>
                                                    <div className="text-[11px] text-zinc-500">{member.email || '—'}</div>
                                                </td>

                                                {/* Col 4: Metrics & Gender */}
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <div className="text-zinc-200 font-semibold text-xs">
                                                        {member.gender_display || member.gender || '—'}
                                                        {member.date_of_birth && ` • ${member.date_of_birth}`}
                                                    </div>
                                                    <div className="text-[11px] text-zinc-400 font-mono">
                                                        H: {member.height || '—'} | W: {member.weight || '—'}
                                                    </div>
                                                </td>

                                                {/* Col 5: Address */}
                                                <td className="py-3.5 px-4 max-w-xs">
                                                    <div className="text-zinc-300 text-xs line-clamp-2" title={member.address}>
                                                        {member.address || '—'}
                                                    </div>
                                                </td>

                                                {/* Col 6: Medical Record */}
                                                <td className="py-3.5 px-4">
                                                    {hasMed ? (
                                                        <div className="space-y-1">
                                                            <span
                                                                className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40 inline-flex items-center gap-1 cursor-pointer"
                                                                title={member.medical_condition_reason || 'Medical Condition Recorded'}
                                                                onClick={() => setViewingMember(member)}
                                                            >
                                                                <HeartPulse className="w-3 h-3 text-red-400" /> Condition Alert
                                                            </span>
                                                            {member.medical_condition_reason && (
                                                                <div className="text-[10px] text-red-300 max-w-xs truncate" title={member.medical_condition_reason}>
                                                                    {member.medical_condition_reason}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                            ✓ Clear & Fit
                                                        </span>
                                                    )}
                                                    {member.injuries_surgeries && member.injuries_surgeries.toLowerCase() !== 'none' && (
                                                        <div className="text-[10px] text-zinc-500 max-w-xs truncate mt-0.5" title={`Injuries: ${member.injuries_surgeries}`}>
                                                            Inj: {member.injuries_surgeries}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Col 7: Plan & Duration */}
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <div className="font-bold text-white text-xs">{mem.plan_title || '3 Months Pro'}</div>
                                                    <div className="text-[10px] text-zinc-400 font-mono">
                                                        Duration: {mem.plan_name?.replace('_', ' ').toUpperCase() || '3 MONTHS'}
                                                    </div>
                                                </td>

                                                {/* Col 8: Joining & End Date */}
                                                <td className="py-3.5 px-4 whitespace-nowrap font-mono text-xs">
                                                    <div className="text-zinc-300">{mem.date_of_joining || '—'}</div>
                                                    <div className={`text-[11px] ${isMemExpired ? 'text-red-400 font-bold' : 'text-zinc-500'}`}>
                                                        Exp: {mem.end_date || '—'}
                                                    </div>
                                                </td>

                                                {/* Col 9: Payment Mode */}
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-zinc-800 text-amber-300 border border-zinc-700">
                                                        {mem.payment_mode || 'UPI'}
                                                    </span>
                                                </td>

                                                {/* Col 10: Fees & Balance */}
                                                <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                                                    <div className="text-zinc-300 text-xs">Total: ₹{parseFloat(mem.total_fee || 0).toLocaleString()}</div>
                                                    <div className="text-emerald-400 text-[11px] font-semibold">Paid: ₹{parseFloat(mem.paid_fee || 0).toLocaleString()}</div>
                                                    <div className={`text-[11px] font-bold ${balance > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                        Bal: ₹{balance.toLocaleString()}
                                                    </div>
                                                </td>

                                                {/* Col 11: Status */}
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                                                        isMemExpired
                                                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    }`}>
                                                        {isMemExpired ? 'Expired' : (mem.status || 'Active')}
                                                    </span>
                                                </td>

                                                {/* Col 12: Actions */}
                                                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            onClick={() => setViewingMember(member)}
                                                            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition"
                                                            title="Inspect Full Sheet"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditClick(member)}
                                                            className="px-2.5 py-1.5 bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-300 font-bold rounded-lg transition inline-flex items-center gap-1 text-[11px]"
                                                        >
                                                            <Edit3 className="w-3 h-3" /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteMember(member.id, member.first_name ? `${member.first_name} ${member.last_name || ''}` : member.username)}
                                                            className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/50 rounded-lg transition"
                                                            title="Remove Client"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. Category Specific Guidance Protocol Section */}
                <div className="bg-[#111215] border border-zinc-800 rounded-2xl p-6 space-y-5 shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-amber-500" />
                                Broadcast Guidance Protocols by Fitness Goal
                            </h2>
                            <p className="text-xs text-zinc-400">
                                Send category-wide guidelines for Weight Loss, General Fitness, Strength Training, Muscle Gain, or Body Transformation.
                            </p>
                        </div>
                    </div>

                    {guidanceSuccess && (
                        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> {guidanceSuccess}
                        </div>
                    )}

                    <form onSubmit={handleSaveCategoryGuidance} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold text-zinc-300 mb-1">Target Fitness Goal</label>
                                <select
                                    value={guidanceForm.category}
                                    onChange={e => setGuidanceForm({ ...guidanceForm, category: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-amber-400 font-bold focus:border-amber-500 outline-none"
                                >
                                    {FITNESS_GOALS.map(g => (
                                        <option key={g.id} value={g.id}>{g.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-zinc-300 mb-1">Guidance Directive Title</label>
                                <input
                                    type="text"
                                    required
                                    value={guidanceForm.title}
                                    onChange={e => setGuidanceForm({ ...guidanceForm, title: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:border-amber-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-semibold text-zinc-300 mb-1">Guidance Protocol Text & Training / Nutrition Advice</label>
                            <textarea
                                required
                                rows={3}
                                value={guidanceForm.guidance_text}
                                onChange={e => setGuidanceForm({ ...guidanceForm, guidance_text: e.target.value })}
                                className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:border-amber-500 outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl shadow-lg shadow-amber-500/20"
                        >
                            Publish Guidance Protocol
                        </button>
                    </form>
                </div>

                {/* 4. Workout Room & Equipment Gallery Media Management */}
                <div className="bg-[#111215] border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Image className="w-5 h-5 text-amber-500" />
                                Workout Room & Equipment Media Gallery
                            </h2>
                            <p className="text-xs text-zinc-400">
                                Upload and curate equipment photos and workout demonstration videos displayed on the public Gallery page.
                            </p>
                        </div>
                    </div>

                    {mediaSuccess && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> {mediaSuccess}
                        </div>
                    )}

                    <form onSubmit={handleAddMedia} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                        <div>
                            <label className="block font-semibold text-zinc-400 mb-1">Media Title *</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Olympic Squat Rack Station"
                                value={mediaForm.title}
                                onChange={e => setMediaForm({ ...mediaForm, title: e.target.value })}
                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:border-amber-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-zinc-400 mb-1">Category</label>
                            <select
                                value={mediaForm.category}
                                onChange={e => setMediaForm({ ...mediaForm, category: e.target.value })}
                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:border-amber-500 outline-none"
                            >
                                <option value="Workout Room">Workout Room</option>
                                <option value="Leg Equipment">Leg Equipment</option>
                                <option value="Cardio Zone">Cardio Zone</option>
                                <option value="Upper Body">Upper Body</option>
                                <option value="CrossFit & Functional">CrossFit & Functional</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold text-zinc-400 mb-1">Media Type</label>
                            <select
                                value={mediaForm.media_type}
                                onChange={e => setMediaForm({ ...mediaForm, media_type: e.target.value })}
                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:border-amber-500 outline-none"
                            >
                                <option value="photo">Photo (Image URL)</option>
                                <option value="video">Video (Stream URL)</option>
                            </select>
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block font-semibold text-zinc-400 mb-1">Media URL (Web link or local path) *</label>
                            <input
                                type="text"
                                required
                                placeholder="https://... or /gallery/image.jpg"
                                value={mediaForm.media_url}
                                onChange={e => setMediaForm({ ...mediaForm, media_url: e.target.value })}
                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:border-amber-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold text-zinc-400 mb-1">Highlight Tag</label>
                            <input
                                type="text"
                                placeholder="e.g. Strength Isolation"
                                value={mediaForm.tag}
                                onChange={e => setMediaForm({ ...mediaForm, tag: e.target.value })}
                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:border-amber-500 outline-none"
                            />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3">
                            <label className="block font-semibold text-zinc-400 mb-1">Description / Machine Specifications</label>
                            <textarea
                                rows={2}
                                placeholder="Details about muscle targeted, machine ergonomics, features..."
                                value={mediaForm.description}
                                onChange={e => setMediaForm({ ...mediaForm, description: e.target.value })}
                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:border-amber-500 outline-none"
                            />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3">
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl shadow-md"
                            >
                                Add Media to Gallery
                            </button>
                        </div>
                    </form>

                    {/* Gallery Items Grid */}
                    <div className="pt-4 border-t border-zinc-800">
                        {galleryItems.length === 0 ? (
                            <p className="text-xs text-zinc-500">No custom gallery items uploaded yet.</p>
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

                {/* 5. Direct Trainer Instruction Scheduler */}
                <div className="bg-[#111215] border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Send className="w-5 h-5 text-amber-500" />
                                Advance Trainer Instructions & Routine Broadcast
                            </h2>
                            <p className="text-xs text-zinc-400">Push advance instructions scheduled for tomorrow or specific dates directly into members' dashboards.</p>
                        </div>
                    </div>

                    {instructionSuccess && (
                        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> {instructionSuccess}
                        </div>
                    )}

                    <form onSubmit={handleSendInstruction} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold text-zinc-300 mb-1">Instruction Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Leg Day Warmup & Progressive Overload Protocol"
                                    value={instructionForm.title}
                                    onChange={e => setInstructionForm({ ...instructionForm, title: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:border-amber-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-zinc-300 mb-1">Scheduled Date</label>
                                <input
                                    type="date"
                                    required
                                    value={instructionForm.scheduled_for_date}
                                    onChange={e => setInstructionForm({ ...instructionForm, scheduled_for_date: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:border-amber-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-semibold text-zinc-300 mb-1">Instruction Details</label>
                            <textarea
                                required
                                rows={3}
                                placeholder="Enter specific instructions (e.g. hydrate with 1L water, perform 10 mins dynamic stretching, avoid maxing out on squats without spotter)..."
                                value={instructionForm.instruction_text}
                                onChange={e => setInstructionForm({ ...instructionForm, instruction_text: e.target.value })}
                                className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:border-amber-500 outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl shadow-md"
                        >
                            Broadcast Instruction
                        </button>
                    </form>
                </div>

                {/* MODAL 1: VIEW FULL MEMBER HEALTH & PROFILE SHEET */}
                {viewingMember && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
                        <div className="bg-[#141518] border border-zinc-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl relative">
                            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                                <div>
                                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                                        <Users className="w-4 h-4 text-amber-500" />
                                        {viewingMember.first_name ? `${viewingMember.first_name} ${viewingMember.last_name || ''}` : viewingMember.username}
                                    </h3>
                                    <p className="text-xs text-amber-400 font-mono">@{viewingMember.username}</p>
                                </div>
                                <button
                                    onClick={() => setViewingMember(null)}
                                    className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4 text-xs">
                                {/* Personal info card */}
                                <div className="p-3.5 bg-zinc-900/90 rounded-xl border border-zinc-800 space-y-2">
                                    <div className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">Personal Metrics</div>
                                    <div className="grid grid-cols-2 gap-2 text-zinc-300">
                                        <div>Gender: <strong className="text-white">{viewingMember.gender_display || viewingMember.gender || '—'}</strong></div>
                                        <div>DOB: <strong className="text-white">{viewingMember.date_of_birth || '—'}</strong></div>
                                        <div>Height: <strong className="text-white">{viewingMember.height || '—'}</strong></div>
                                        <div>Weight: <strong className="text-white">{viewingMember.weight || '—'}</strong></div>
                                        <div>Phone: <strong className="text-white font-mono">{viewingMember.phone || '—'}</strong></div>
                                        <div>Email: <strong className="text-white">{viewingMember.email || '—'}</strong></div>
                                    </div>
                                    {viewingMember.address && (
                                        <div className="pt-1 text-zinc-400 border-t border-zinc-800/80">
                                            Address: <span className="text-zinc-200">{viewingMember.address}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Health & Medical record */}
                                <div className="p-3.5 bg-zinc-900/90 rounded-xl border border-zinc-800 space-y-2">
                                    <div className="font-bold text-red-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                                        <HeartPulse className="w-3.5 h-3.5" /> Health & Medical Condition Record
                                    </div>
                                    <div>
                                        Has Medical Condition: <strong className={viewingMember.has_medical_condition ? 'text-red-400' : 'text-emerald-400'}>
                                            {viewingMember.has_medical_condition ? 'YES' : 'NO'}
                                        </strong>
                                    </div>
                                    {viewingMember.has_medical_condition && (
                                        <div className="p-2.5 bg-red-950/40 border border-red-900/60 rounded-lg text-red-300">
                                            <strong>Condition Details / Reason:</strong> {viewingMember.medical_condition_reason || 'Not specified'}
                                        </div>
                                    )}
                                    <div className="text-zinc-400">
                                        Injuries / Surgeries History: <span className="text-zinc-200">{viewingMember.injuries_surgeries || 'None'}</span>
                                    </div>
                                </div>

                                {/* Membership & Goal */}
                                <div className="p-3.5 bg-zinc-900/90 rounded-xl border border-zinc-800 space-y-2">
                                    <div className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">Membership & Payment</div>
                                    <div className="grid grid-cols-2 gap-2 text-zinc-300">
                                        <div>Goal: <strong className="text-amber-400">{viewingMember.fitness_category_display || viewingMember.fitness_category}</strong></div>
                                        <div>Plan: <strong className="text-white">{viewingMember.membership?.plan_title || '—'}</strong></div>
                                        <div>Joining: <strong className="text-white">{viewingMember.membership?.date_of_joining || '—'}</strong></div>
                                        <div>End Date: <strong className="text-white">{viewingMember.membership?.end_date || '—'}</strong></div>
                                        <div>Mode: <strong className="text-white uppercase">{viewingMember.membership?.payment_mode || 'UPI'}</strong></div>
                                        <div>Status: <strong className="text-emerald-400 uppercase">{viewingMember.membership?.status || 'Active'}</strong></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                                <button
                                    onClick={() => {
                                        const m = viewingMember;
                                        setViewingMember(null);
                                        handleEditClick(m);
                                    }}
                                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs flex items-center gap-1.5"
                                >
                                    <Edit3 className="w-3.5 h-3.5" /> Edit Member Data
                                </button>
                                <button
                                    onClick={() => setViewingMember(null)}
                                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl text-xs"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL 2: EDIT MEMBER DATA MODAL */}
                {editingMember && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
                        <div className="bg-[#141518] border border-zinc-800 rounded-2xl w-full max-w-xl p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                                <div>
                                    <h3 className="text-base font-bold text-white">
                                        Edit Client Information & Membership
                                    </h3>
                                    <p className="text-xs text-amber-500 font-medium">
                                        {editingMember.first_name || editingMember.username} (@{editingMember.username})
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
                                
                                {/* Section: Personal & Health Info */}
                                <div className="p-3.5 bg-zinc-900 rounded-xl border border-zinc-800 space-y-3">
                                    <div className="font-bold text-amber-400 uppercase tracking-wide text-[11px]">1. Profile & Health Records</div>
                                    
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block font-semibold text-zinc-400 mb-1">Phone Number</label>
                                            <input
                                                type="text"
                                                value={formMembership.phone}
                                                onChange={e => setFormMembership({ ...formMembership, phone: e.target.value })}
                                                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:border-amber-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-zinc-400 mb-1">Gender</label>
                                            <select
                                                value={formMembership.gender}
                                                onChange={e => setFormMembership({ ...formMembership, gender: e.target.value })}
                                                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:border-amber-500 outline-none"
                                            >
                                                <option value="M">Male</option>
                                                <option value="F">Female</option>
                                                <option value="O">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-amber-400 mb-1 font-bold">Fitness Goal</label>
                                            <select
                                                value={formMembership.fitness_category}
                                                onChange={e => setFormMembership({ ...formMembership, fitness_category: e.target.value })}
                                                className="w-full px-3 py-2 bg-zinc-950 border border-amber-500/40 rounded-lg text-amber-300 font-bold focus:border-amber-500 outline-none"
                                            >
                                                {FITNESS_GOALS.map(g => (
                                                    <option key={g.id} value={g.id}>{g.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-semibold text-zinc-400 mb-1">Height</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. 178 cm"
                                                value={formMembership.height}
                                                onChange={e => setFormMembership({ ...formMembership, height: e.target.value })}
                                                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:border-amber-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-zinc-400 mb-1">Weight</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. 74 kg"
                                                value={formMembership.weight}
                                                onChange={e => setFormMembership({ ...formMembership, weight: e.target.value })}
                                                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:border-amber-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-zinc-400 mb-1">Address</label>
                                        <input
                                            type="text"
                                            value={formMembership.address}
                                            onChange={e => setFormMembership({ ...formMembership, address: e.target.value })}
                                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:border-amber-500 outline-none"
                                        />
                                    </div>

                                    {/* Medical Conditions */}
                                    <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-zinc-300">Has Medical Condition?</span>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormMembership({ ...formMembership, has_medical_condition: false, medical_condition_reason: '' })}
                                                    className={`px-3 py-1 rounded-lg text-[11px] font-bold ${!formMembership.has_medical_condition ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}
                                                >
                                                    No
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormMembership({ ...formMembership, has_medical_condition: true })}
                                                    className={`px-3 py-1 rounded-lg text-[11px] font-bold ${formMembership.has_medical_condition ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                                                >
                                                    Yes
                                                </button>
                                            </div>
                                        </div>

                                        {formMembership.has_medical_condition && (
                                            <div>
                                                <label className="block font-semibold text-red-300 mb-1">Medical Condition Reason</label>
                                                <input
                                                    type="text"
                                                    value={formMembership.medical_condition_reason}
                                                    onChange={e => setFormMembership({ ...formMembership, medical_condition_reason: e.target.value })}
                                                    className="w-full px-3 py-2 bg-zinc-950 border border-red-500/40 rounded-lg text-white focus:border-red-400 outline-none"
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <label className="block font-semibold text-zinc-400 mb-1">Injuries / Surgeries History</label>
                                            <input
                                                type="text"
                                                value={formMembership.injuries_surgeries}
                                                onChange={e => setFormMembership({ ...formMembership, injuries_surgeries: e.target.value })}
                                                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:border-amber-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Membership & Financial Details */}
                                <div className="p-3.5 bg-zinc-900 rounded-xl border border-zinc-800 space-y-3">
                                    <div className="font-bold text-amber-400 uppercase tracking-wide text-[11px]">2. Membership Plan & Financials</div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-semibold text-zinc-400 mb-1">Plan Duration</label>
                                            <select
                                                value={formMembership.plan_name}
                                                onChange={e => {
                                                    const p = PLAN_PRESETS.find(pr => pr.id === e.target.value);
                                                    setFormMembership({
                                                        ...formMembership,
                                                        plan_name: e.target.value,
                                                        plan_title: p?.title || formMembership.plan_title,
                                                        total_fee: p?.fee || formMembership.total_fee
                                                    });
                                                }}
                                                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:border-amber-500 outline-none"
                                            >
                                                {PLAN_PRESETS.map(p => (
                                                    <option key={p.id} value={p.id}>{p.title} (₹{p.fee.toLocaleString()})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-zinc-400 mb-1">Payment Mode</label>
                                            <select
                                                value={formMembership.payment_mode}
                                                onChange={e => setFormMembership({ ...formMembership, payment_mode: e.target.value })}
                                                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white uppercase focus:border-amber-500 outline-none"
                                            >
                                                {PAYMENT_MODES.map(pm => (
                                                    <option key={pm.id} value={pm.id}>{pm.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-semibold text-zinc-400 mb-1">Total Fee (₹)</label>
                                            <input
                                                type="number"
                                                value={formMembership.total_fee}
                                                onChange={e => setFormMembership({ ...formMembership, total_fee: e.target.value })}
                                                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:border-amber-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-zinc-400 mb-1">Paid Fee (₹)</label>
                                            <input
                                                type="number"
                                                value={formMembership.paid_fee}
                                                onChange={e => setFormMembership({ ...formMembership, paid_fee: e.target.value })}
                                                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-emerald-400 font-bold focus:border-amber-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 flex justify-between items-center">
                                        <span className="text-zinc-400">Calculated Balance Due:</span>
                                        <span className="font-extrabold text-amber-400 text-sm font-mono">
                                            ₹{Math.max(0, parseFloat(formMembership.total_fee || 0) - parseFloat(formMembership.paid_fee || 0)).toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block font-semibold text-zinc-400 mb-1">Date of Joining</label>
                                            <input
                                                type="date"
                                                value={formMembership.date_of_joining}
                                                onChange={e => setFormMembership({ ...formMembership, date_of_joining: e.target.value })}
                                                className="w-full px-2.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:border-amber-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-zinc-400 mb-1">End Date</label>
                                            <input
                                                type="date"
                                                value={formMembership.end_date}
                                                onChange={e => setFormMembership({ ...formMembership, end_date: e.target.value })}
                                                className="w-full px-2.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:border-amber-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-zinc-400 mb-1">Status</label>
                                            <select
                                                value={formMembership.status}
                                                onChange={e => setFormMembership({ ...formMembership, status: e.target.value })}
                                                className="w-full px-2.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:border-amber-500 outline-none"
                                            >
                                                <option value="active">Active</option>
                                                <option value="pending">Pending Renewal</option>
                                                <option value="expired">Expired</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                                    <button
                                        type="button"
                                        onClick={() => setEditingMember(null)}
                                        className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold shadow-md shadow-amber-500/20"
                                    >
                                        Save All Changes
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
