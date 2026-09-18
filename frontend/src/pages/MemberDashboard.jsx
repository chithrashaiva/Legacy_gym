import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { portalService } from '../services/portalService';
import { Link } from 'react-router-dom';
import {
    Dumbbell, Calendar, Apple, Bell, ShieldAlert,
    CheckCircle2, Clock, Flame, ChevronRight, User as UserIcon,
    AlertCircle, Sparkles, Trophy, ArrowRight, Utensils, Plus,
    FileText, ShieldCheck, AlertTriangle, Activity, Target, HeartPulse
} from 'lucide-react';

const DAYS = [
    { key: 'mon', label: 'Monday', short: 'Mon' },
    { key: 'tue', label: 'Tuesday', short: 'Tue' },
    { key: 'wed', label: 'Wednesday', short: 'Wed' },
    { key: 'thu', label: 'Thursday', short: 'Thu' },
    { key: 'fri', label: 'Friday', short: 'Fri' },
    { key: 'sat', label: 'Saturday', short: 'Sat' },
];

const DIET_CATEGORIES = [
    { id: 'weight_loss', label: 'Weight Loss', desc: 'Caloric deficit, high protein, thermogenic' },
    { id: 'general_fitness', label: 'General Fitness', desc: 'Balanced nutrition for optimal vitality & recovery' },
    { id: 'weight_gain', label: 'Weight Gain', desc: 'Clean calorie surplus for mass & muscle hypertrophy' },
];

export default function MemberDashboard() {
    const { user, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    // Selected states
    const [selectedWorkoutDay, setSelectedWorkoutDay] = useState('mon');
    const [selectedDietCategory, setSelectedDietCategory] = useState('weight_loss');
    const [selectedDietDay, setSelectedDietDay] = useState('mon');
    const [completedExercises, setCompletedExercises] = useState({});

    // Daily Workout Log Form State
    const [logForm, setLogForm] = useState({
        workout_name: '',
        start_time: '06:30 AM',
        end_time: '07:45 AM',
        notes: ''
    });
    const [logSuccessMsg, setLogSuccessMsg] = useState('');
    const [workoutLogsList, setWorkoutLogsList] = useState([]);

    useEffect(() => {
        const dayIdx = new Date().getDay();
        const dayKeys = ['mon', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        setSelectedWorkoutDay(dayKeys[dayIdx] || 'mon');
        setSelectedDietDay(dayKeys[dayIdx] || 'mon');

        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        try {
            setLoading(true);
            const res = await portalService.getMemberSummary();
            setData(res);
            setWorkoutLogsList(res.workout_logs || []);
        } catch (err) {
            console.error('Failed to load member dashboard summary', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleExerciseDone = (exName) => {
        setCompletedExercises(prev => ({
            ...prev,
            [exName]: !prev[exName]
        }));
    };

    const handleAddWorkoutLog = async (e) => {
        e.preventDefault();
        try {
            const newLog = await portalService.createWorkoutLog(logForm);
            setWorkoutLogsList(prev => [newLog, ...prev]);
            setLogSuccessMsg('Daily workout timing & routine logged successfully!');
            setTimeout(() => setLogSuccessMsg(''), 4000);
            setLogForm({
                workout_name: '',
                start_time: '06:30 AM',
                end_time: '07:45 AM',
                notes: ''
            });
        } catch (err) {
            console.error('Failed to add workout log', err);
            alert('Failed to log workout timing. Please check your inputs.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-amber-500">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                    <span className="text-zinc-400 font-medium tracking-wide">Loading Legacy Member Portal...</span>
                </div>
            </div>
        );
    }

    const membership = data?.membership || {};
    const workouts = data?.workouts || [];
    const dietPlans = data?.diet_plans || [];
    const instructions = data?.trainer_instructions || [];
    const categoryGuidance = data?.category_guidance || [];
    const currentUser = data?.user || user;

    const currentWorkout = workouts.find(w => w.day_of_week === selectedWorkoutDay) || workouts[0];
    const currentDiet = dietPlans.find(d => d.category === selectedDietCategory && d.day_of_week === selectedDietDay);
    const currentGuidance = categoryGuidance.find(g => g.category === selectedDietCategory);

    const balanceDueNum = parseFloat(membership.balance_due || 0);
    const isExpired = data?.is_expired || membership.status === 'expired';
    const expirationAlert = data?.expiration_alert;

    return (
        <div className="min-h-screen bg-[#0c0d0e] text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#0c0d0e]/90 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                                L
                            </div>
                            <span className="font-extrabold tracking-wider text-lg uppercase bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                                Legacy Lounge
                            </span>
                        </Link>
                        <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-zinc-800/90 text-amber-400 border border-amber-500/20">
                            Member Portal
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/admin-portal"
                            className="hidden md:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 hover:text-amber-400 border border-zinc-700/60 transition-colors"
                        >
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                            Switch to Gym Admin Portal
                        </Link>
                        
                        <div className="flex items-center gap-3 pl-2 border-l border-zinc-800">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-semibold text-zinc-200">
                                    {currentUser.first_name ? `${currentUser.first_name} ${currentUser.last_name || ''}` : currentUser.username}
                                </div>
                                <div className="text-xs text-amber-500 font-medium">VIP Tier Active</div>
                            </div>
                            <button
                                onClick={logout}
                                className="text-xs px-3 py-1.5 rounded-lg bg-red-950/40 text-red-400 border border-red-900/50 hover:bg-red-900/30 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                
                {/* EXPIRED MEMBERSHIP NOTIFICATION BANNER */}
                {isExpired && (
                    <div className="p-4 rounded-2xl bg-red-950/60 border-2 border-red-600 text-red-200 flex items-start gap-4 shadow-2xl animate-pulse">
                        <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                                MEMBERSHIP PLAN EXPIRED NOTIFICATION
                            </h3>
                            <p className="text-xs text-red-300 mt-1 leading-relaxed">
                                {expirationAlert || `Your membership plan has expired as of ${membership.end_date}. Please visit the gym reception desk or contact your admin to renew your plan.`}
                            </p>
                        </div>
                    </div>
                )}

                {/* 1. Hero & Membership Details Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Welcome Banner & Health Profile */}
                    <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 p-6 md:p-8 flex flex-col justify-between">
                        <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="relative z-10 space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                                    <Trophy className="w-3.5 h-3.5" /> Client Athletic Center
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold">
                                    <Target className="w-3.5 h-3.5 text-amber-400" />
                                    Goal: <span className="text-amber-300 capitalize">{currentUser.fitness_category_display || currentUser.fitness_category?.replace('_', ' ') || 'General Fitness'}</span>
                                </div>
                            </div>

                            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">{currentUser.first_name || currentUser.username}</span>!
                            </h1>

                            {/* Member Personal & Medical Metrics Bar */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                                <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800">
                                    <div className="text-[11px] text-zinc-400 font-semibold">Height / Weight</div>
                                    <div className="text-sm font-bold text-white mt-0.5">{currentUser.height || '—'} / {currentUser.weight || '—'}</div>
                                </div>
                                <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800">
                                    <div className="text-[11px] text-zinc-400 font-semibold">Gender / DOB</div>
                                    <div className="text-sm font-bold text-white mt-0.5">
                                        {currentUser.gender_display || currentUser.gender || '—'}
                                        {currentUser.date_of_birth && ` • ${currentUser.date_of_birth}`}
                                    </div>
                                </div>
                                <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800">
                                    <div className="text-[11px] text-zinc-400 font-semibold">Medical Record</div>
                                    <div className="text-xs font-bold mt-0.5">
                                        {currentUser.has_medical_condition ? (
                                            <span className="text-red-400 flex items-center gap-1">
                                                <HeartPulse className="w-3 h-3 text-red-500" /> Condition Alert
                                            </span>
                                        ) : (
                                            <span className="text-emerald-400">✓ Clear & Fit</span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800">
                                    <div className="text-[11px] text-zinc-400 font-semibold">Payment Mode</div>
                                    <div className="text-xs font-bold text-amber-400 mt-0.5 uppercase">
                                        {membership.payment_mode || 'UPI'}
                                    </div>
                                </div>
                            </div>

                            {currentUser.has_medical_condition && currentUser.medical_condition_reason && (
                                <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-xs text-red-300 flex items-start gap-2">
                                    <HeartPulse className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                    <div>
                                        <strong>Medical Advisory Note:</strong> {currentUser.medical_condition_reason}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Day Selector Indicator */}
                        <div className="mt-6 pt-6 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-xs text-zinc-400">
                                <Calendar className="w-4 h-4 text-amber-400" />
                                <span>Training Cycle: <strong>Monday – Saturday</strong></span>
                            </div>
                            <div className="text-xs px-3 py-1 rounded-md bg-zinc-800/80 text-zinc-300 font-mono">
                                Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </div>
                        </div>
                    </div>

                    {/* Membership Details Card */}
                    <div className="rounded-2xl bg-[#111215] border border-zinc-800 p-6 flex flex-col justify-between relative shadow-xl">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs uppercase font-bold tracking-widest text-zinc-400">Membership Details</span>
                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                                    isExpired
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/40 font-bold'
                                        : membership.status === 'active' 
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                }`}>
                                    {isExpired ? 'EXPIRED' : (membership.status || 'Active')}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-white">{membership.plan_title || '3 Months Pro'}</h3>
                                <div className="flex items-center justify-between text-xs text-zinc-400 mt-1">
                                    <span>Joined: <strong className="text-zinc-200">{membership.date_of_joining}</strong></span>
                                    <span>Expires: <strong className={isExpired ? 'text-red-400' : 'text-zinc-300'}>{membership.end_date}</strong></span>
                                </div>
                            </div>

                            {/* Dues & Fees Breakdown */}
                            <div className="bg-zinc-900/80 rounded-xl p-4 border border-zinc-800/80 space-y-2.5">
                                <div className="flex justify-between text-xs text-zinc-400">
                                    <span>Total Plan Fee</span>
                                    <span className="font-semibold text-zinc-200">₹{parseFloat(membership.total_fee || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs text-zinc-400">
                                    <span>Fees Paid</span>
                                    <span className="font-semibold text-emerald-400">₹{parseFloat(membership.paid_fee || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs text-zinc-400">
                                    <span>Payment Mode</span>
                                    <span className="font-bold text-amber-400 uppercase">{membership.payment_mode || 'UPI'}</span>
                                </div>
                                <div className="pt-2 border-t border-zinc-800 flex justify-between items-center">
                                    <span className="text-xs font-bold text-zinc-300">Balance Due</span>
                                    <span className={`text-sm font-extrabold px-2.5 py-1 rounded-lg ${
                                        balanceDueNum > 0 
                                            ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
                                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                    }`}>
                                        ₹{balanceDueNum.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {balanceDueNum > 0 ? (
                            <div className="mt-4 flex items-center gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                                <span>Outstanding balance pending at desk.</span>
                            </div>
                        ) : (
                            <div className="mt-4 flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>All subscription dues are cleared!</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Trainer Notes & Advance Instruction Alerts */}
                <div className="rounded-2xl bg-[#111215] border border-zinc-800 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-amber-400" />
                            <h2 className="text-lg font-bold text-white">Trainer Notes & Scheduled Instructions</h2>
                        </div>
                        <span className="text-xs text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-md">
                            Next-Day & Realtime Alerts
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {instructions.map((inst, idx) => (
                            <div
                                key={idx}
                                className={`rounded-xl p-4 border transition-all ${
                                    inst.is_advance
                                        ? 'bg-amber-950/20 border-amber-500/40'
                                        : 'bg-zinc-900/70 border-zinc-800'
                                }`}
                            >
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        {inst.is_advance ? (
                                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500 text-black uppercase tracking-wider">
                                                Tomorrow Plan
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-zinc-800 text-zinc-300 uppercase tracking-wider">
                                                Update
                                            </span>
                                        )}
                                        <span className="text-xs font-semibold text-zinc-400">
                                            Coach: {inst.trainer_name || 'Marcus Sterling'}
                                        </span>
                                    </div>
                                    <span className="text-xs font-mono text-zinc-500">
                                        Date: {inst.scheduled_for_date}
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-zinc-100 mb-1">{inst.title}</h4>
                                <p className="text-xs text-zinc-300 leading-relaxed">{inst.instruction_text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. MEMBER DAILY WORKOUT LOG (Timings & Workout Name Input) */}
                <div className="rounded-2xl bg-[#111215] border border-zinc-800 p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-amber-400" />
                            <div>
                                <h2 className="text-xl font-bold text-white">Daily Workout Timings & Routine Logger</h2>
                                <p className="text-xs text-zinc-400">Record your daily workout timings and custom routines performed at the lounge.</p>
                            </div>
                        </div>
                    </div>

                    {logSuccessMsg && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> {logSuccessMsg}
                        </div>
                    )}

                    {/* Form to log timing and workout name */}
                    <form onSubmit={handleAddWorkoutLog} className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1">Workout Name / Routine</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Chest & Triceps Hypertrophy"
                                    value={logForm.workout_name}
                                    onChange={e => setLogForm({ ...logForm, workout_name: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:border-amber-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1">Start Time</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="06:30 AM"
                                    value={logForm.start_time}
                                    onChange={e => setLogForm({ ...logForm, start_time: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:border-amber-500 outline-none font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 mb-1">End Time</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="07:45 AM"
                                    value={logForm.end_time}
                                    onChange={e => setLogForm({ ...logForm, end_time: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:border-amber-500 outline-none font-mono"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 mb-1">Workout Notes / Weights Lifted (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. Completed 4 sets barbell bench @ 80kg + 15 mins treadmill cool down"
                                value={logForm.notes}
                                onChange={e => setLogForm({ ...logForm, notes: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:border-amber-500 outline-none"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
                            >
                                <Plus className="w-4 h-4" /> Log Daily Workout & Timing
                            </button>
                        </div>
                    </form>

                    {/* Workout Logs History List */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Your Recent Logged Workouts</h4>
                        {workoutLogsList.length === 0 ? (
                            <div className="p-6 text-center text-zinc-500 text-xs border border-zinc-800 rounded-xl">
                                No workout logs recorded yet. Use the form above to log today's workout timings!
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {workoutLogsList.map((log, idx) => (
                                    <div key={idx} className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-amber-400">{log.workout_name}</span>
                                            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">{log.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                                            <span>{log.start_time} – {log.end_time}</span>
                                        </div>
                                        {log.notes && (
                                            <p className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-800">{log.notes}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. Daily Workouts: Calendar View (Monday–Saturday) */}
                <div className="rounded-2xl bg-[#111215] border border-zinc-800 p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <Dumbbell className="w-5 h-5 text-amber-400" />
                                <h2 className="text-xl font-bold text-white">Daily Workout Schedule</h2>
                            </div>
                            <p className="text-xs text-zinc-400 mt-1">
                                Tailored regimen uploaded by your dedicated coach. Select a day to view prescribed sets & reps.
                            </p>
                        </div>

                        {/* Mon-Sat Day Selector Tabs */}
                        <div className="flex items-center gap-1.5 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800 overflow-x-auto">
                            {DAYS.map(day => (
                                <button
                                    key={day.key}
                                    onClick={() => setSelectedWorkoutDay(day.key)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                        selectedWorkoutDay === day.key
                                            ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                                    }`}
                                >
                                    {day.short}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Workout Details Card */}
                    {currentWorkout ? (
                        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-5 md:p-6 space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                                <div>
                                    <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">
                                        {DAYS.find(d => d.key === selectedWorkoutDay)?.label} Focus
                                    </span>
                                    <h3 className="text-2xl font-black text-white mt-1">{currentWorkout.title}</h3>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400">
                                        <span className="flex items-center gap-1">
                                            <Flame className="w-3.5 h-3.5 text-amber-500" />
                                            Target: <strong className="text-zinc-200 ml-1">{currentWorkout.focus_muscle}</strong>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                                            Est. Duration: <strong className="text-zinc-200 ml-1">{currentWorkout.duration_minutes} mins</strong>
                                        </span>
                                    </div>
                                </div>

                                {currentWorkout.trainer_notes && (
                                    <div className="md:max-w-md bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-300">
                                        <strong className="block text-amber-400 mb-1">Coach Note:</strong>
                                        {currentWorkout.trainer_notes}
                                    </div>
                                )}
                            </div>

                            {/* Exercise Table / List */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Prescribed Exercises</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {(currentWorkout.exercises || []).map((ex, i) => {
                                        const isDone = !!completedExercises[ex.name];
                                        return (
                                            <div
                                                key={i}
                                                onClick={() => toggleExerciseDone(ex.name)}
                                                className={`cursor-pointer p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                                                    isDone
                                                        ? 'bg-emerald-950/20 border-emerald-800/40 text-zinc-400'
                                                        : 'bg-[#141518] border-zinc-800/90 hover:border-zinc-700 text-zinc-200'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                                                        isDone
                                                            ? 'bg-emerald-500 border-emerald-400 text-black'
                                                            : 'border-zinc-600 text-zinc-400'
                                                    }`}>
                                                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                                                    </div>
                                                    <div>
                                                        <div className={`text-sm font-bold ${isDone ? 'line-through text-zinc-500' : 'text-white'}`}>
                                                            {ex.name}
                                                        </div>
                                                        {ex.notes && (
                                                            <div className="text-xs text-zinc-400 mt-0.5">{ex.notes}</div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 text-xs shrink-0">
                                                    <div className="px-2.5 py-1 bg-zinc-800/80 rounded-md font-mono text-zinc-300">
                                                        <span className="text-zinc-500 mr-1">Sets:</span>{ex.sets}
                                                    </div>
                                                    <div className="px-2.5 py-1 bg-zinc-800/80 rounded-md font-mono text-amber-400">
                                                        <span className="text-zinc-500 mr-1">Reps:</span>{ex.reps}
                                                    </div>
                                                    <div className="hidden sm:block px-2.5 py-1 bg-zinc-800/80 rounded-md font-mono text-zinc-400">
                                                        <span className="text-zinc-500 mr-1">Rest:</span>{ex.rest}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-zinc-500 text-sm">
                            Rest day or no workout logged for this day.
                        </div>
                    )}
                </div>

                {/* 5. Diet Plans & CATEGORY SPECIFIC TRAINER GUIDANCE */}
                <div className="rounded-2xl bg-[#111215] border border-zinc-800 p-6 space-y-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <Utensils className="w-5 h-5 text-amber-400" />
                                <h2 className="text-xl font-bold text-white">Diet Protocols & Categorized Guidance</h2>
                            </div>
                            <p className="text-xs text-zinc-400 mt-1">
                                Select your fitness goal to view specific meal structures and admin guidance.
                            </p>
                        </div>

                        {/* Goal Filter (Weight Loss / Weight Gain / General Fitness) */}
                        <div className="flex items-center gap-2 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800">
                            {DIET_CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedDietCategory(cat.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        selectedDietCategory === cat.id
                                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold shadow'
                                            : 'text-zinc-400 hover:text-white'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CATEGORY SPECIFIC GUIDANCE CARD */}
                    {currentGuidance && (
                        <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-900 border border-amber-500/30 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4" /> Admin Guidance for {DIET_CATEGORIES.find(c => c.id === selectedDietCategory)?.label}
                                </span>
                                <span className="text-[10px] text-zinc-400">Coach: {currentGuidance.created_by_name || 'Admin Marcus'}</span>
                            </div>
                            <h4 className="text-sm font-bold text-white">{currentGuidance.title}</h4>
                            <p className="text-xs text-zinc-300 leading-relaxed">{currentGuidance.guidance_text}</p>
                        </div>
                    )}

                    {/* Day selector for Diet */}
                    <div className="flex items-center gap-2 border-b border-zinc-800 pb-4 overflow-x-auto">
                        <span className="text-xs font-semibold text-zinc-400 uppercase mr-2">Select Day:</span>
                        {DAYS.map(day => (
                            <button
                                key={day.key}
                                onClick={() => setSelectedDietDay(day.key)}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                                    selectedDietDay === day.key
                                        ? 'bg-zinc-800 text-amber-400 border border-amber-500/40 font-bold'
                                        : 'text-zinc-400 hover:text-zinc-200'
                                }`}
                            >
                                {day.label}
                            </button>
                        ))}
                    </div>

                    {/* Diet Plan Breakdown */}
                    {currentDiet ? (
                        <div className="space-y-6">
                            {/* Nutrition Stats Header */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3.5">
                                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Target Calorie</span>
                                    <div className="text-xl font-black text-amber-400 mt-0.5">{currentDiet.daily_calories} kcal</div>
                                </div>
                                <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3.5">
                                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Protein Target</span>
                                    <div className="text-xl font-black text-white mt-0.5">{currentDiet.macros?.protein || '150g'}</div>
                                </div>
                                <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3.5">
                                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Carbohydrates</span>
                                    <div className="text-xl font-black text-white mt-0.5">{currentDiet.macros?.carbs || '200g'}</div>
                                </div>
                                <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3.5">
                                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Healthy Fats</span>
                                    <div className="text-xl font-black text-white mt-0.5">{currentDiet.macros?.fats || '55g'}</div>
                                </div>
                            </div>

                            {/* Meals Timeline */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Day Meal Protocol</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {(currentDiet.meals || []).map((meal, idx) => (
                                        <div
                                            key={idx}
                                            className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/90 hover:border-zinc-700 transition-colors flex flex-col justify-between space-y-2"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                                                    {meal.title}
                                                </span>
                                                <span className="text-[11px] font-mono text-zinc-400 px-2 py-0.5 bg-zinc-800 rounded">
                                                    {meal.time}
                                                </span>
                                            </div>
                                            <p className="text-xs text-zinc-200 font-medium leading-relaxed">
                                                {meal.items}
                                            </p>
                                            <div className="text-right text-[11px] font-mono text-zinc-500">
                                                {meal.cals}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-zinc-500 text-sm">
                            No diet plan uploaded for this day and category combination.
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
