import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import CaptchaBox from '../../components/CaptchaBox';
import {
    Dumbbell, Eye, EyeOff, Target, HeartPulse, User,
    Calendar, MapPin, Scale, Ruler, ShieldAlert, CreditCard,
    CheckCircle2, Sparkles, Flame, Activity, Trophy, ShieldCheck
} from 'lucide-react';

const FITNESS_GOALS = [
    {
        id: 'weight_loss',
        title: 'Weight Loss',
        subtitle: 'Fat burn & caloric deficit',
        icon: Flame,
        badge: 'High Cardio'
    },
    {
        id: 'general_fitness',
        title: 'General Fitness',
        subtitle: 'Balanced stamina & vitality',
        icon: Activity,
        badge: 'Daily Wellness'
    },
    {
        id: 'strength_training',
        title: 'Strength Training',
        subtitle: 'Power, core & heavy lifts',
        icon: Dumbbell,
        badge: 'Powerlifting'
    },
    {
        id: 'muscle_gain',
        title: 'Muscle Gain',
        subtitle: 'Hypertrophy & clean surplus',
        icon: Trophy,
        badge: 'Hypertrophy'
    },
    {
        id: 'body_transformation',
        title: 'Body Transformation',
        subtitle: 'Complete physique recomposition',
        icon: Sparkles,
        badge: 'Intensive VIP'
    },
];

const MEMBERSHIP_PLANS = [
    {
        id: '1_month',
        title: '1 Month Starter',
        durationDays: 30,
        fee: 1999,
        desc: 'Short-term starter pass'
    },
    {
        id: '3_months',
        title: '3 Months Pro',
        durationDays: 90,
        fee: 4999,
        desc: 'Most popular training cycle',
        popular: true
    },
    {
        id: '6_months',
        title: '6 Months Elite',
        durationDays: 180,
        fee: 8999,
        desc: 'Dedicated body transformation'
    },
    {
        id: '12_months',
        title: '12 Months Annual VIP',
        durationDays: 365,
        fee: 15999,
        desc: 'Maximum savings & all-access pass'
    },
];

const PAYMENT_MODES = [
    { id: 'upi', label: 'UPI (GPay / PhonePe / Paytm)', icon: '📱' },
    { id: 'card', label: 'Debit / Credit Card', icon: '💳' },
    { id: 'cash', label: 'Cash at Desk', icon: '💵' },
    { id: 'bank_transfer', label: 'Bank Transfer (NEFT / IMPS)', icon: '🏦' },
];

export default function Register() {
    const todayStr = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        // Account details
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        phone: '',
        
        // Personal details
        gender: 'M',
        date_of_birth: '1998-01-01',
        address: '',
        height: '175 cm',
        weight: '70 kg',
        
        // Health & Medical
        has_medical_condition: false,
        medical_condition_reason: '',
        injuries_surgeries: 'None',
        
        // Fitness Goal
        fitness_category: 'weight_loss',
        
        // Membership details
        plan_name: '3_months',
        plan_title: '3 Months Pro',
        date_of_joining: todayStr,
        end_date: '',
        total_fee: 4999,
        paid_fee: 4999,
        payment_mode: 'upi'
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Captcha State
    const [captchaInput, setCaptchaInput] = useState('');
    const [isCaptchaValid, setIsCaptchaValid] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    // Auto calculate End Date when Joining Date or Plan changes
    useEffect(() => {
        const selectedPlan = MEMBERSHIP_PLANS.find(p => p.id === formData.plan_name) || MEMBERSHIP_PLANS[1];
        if (formData.date_of_joining) {
            const start = new Date(formData.date_of_joining);
            if (!isNaN(start.getTime())) {
                const end = new Date(start);
                end.setDate(end.getDate() + selectedPlan.durationDays);
                const endStr = end.toISOString().split('T')[0];
                setFormData(prev => ({
                    ...prev,
                    end_date: endStr,
                    plan_title: selectedPlan.title,
                    total_fee: selectedPlan.fee,
                    paid_fee: selectedPlan.fee
                }));
            }
        }
    }, [formData.plan_name, formData.date_of_joining]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePlanSelect = (plan) => {
        setFormData(prev => ({
            ...prev,
            plan_name: plan.id,
            plan_title: plan.title,
            total_fee: plan.fee,
            paid_fee: plan.fee
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (!captchaInput.trim()) {
            setError('Please complete the CAPTCHA security challenge.');
            return;
        }

        if (!isCaptchaValid) {
            setError('Invalid CAPTCHA security code. Please check the characters and try again.');
            return;
        }

        setSubmitting(true);
        try {
            const { confirmPassword, ...submitData } = formData;
            const cleanedData = {};
            Object.keys(submitData).forEach(key => {
                if (submitData[key] !== '' && submitData[key] !== null && submitData[key] !== undefined) {
                    cleanedData[key] = submitData[key];
                }
            });

            await register(cleanedData);
            navigate('/login');
        } catch (err) {
            console.error('Registration error:', err.response?.data);
            if (err.response?.data) {
                const data = err.response.data;
                if (typeof data === 'string') {
                    setError(data);
                } else if (data.detail && typeof data.detail === 'string') {
                    setError(data.detail);
                } else if (typeof data === 'object') {
                    const messages = Object.entries(data).map(([field, errs]) => {
                        const fieldName = field.replace('_', ' ');
                        const msgText = Array.isArray(errs) ? errs.join(' ') : String(errs);
                        return `${fieldName}: ${msgText}`;
                    });
                    setError(messages.join(' | '));
                } else {
                    setError('Failed to register member. Please check all inputs.');
                }
            } else {
                setError('Failed to connect to backend server. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const balanceDue = Math.max(0, Number(formData.total_fee || 0) - Number(formData.paid_fee || 0));

    return (
        <div className="min-h-screen bg-[#070708] text-zinc-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-3xl text-center mb-6">
                <div className="inline-flex justify-center items-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-extrabold shadow-lg shadow-amber-500/20 mb-3">
                    <Dumbbell size={32} />
                </div>
                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wider bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                    Member Registration & Enrollment
                </h1>
                <p className="mt-2 text-sm text-zinc-400 max-w-xl mx-auto">
                    Fill out your personal metrics, health records, fitness objective, and choose your membership duration to join Legacy Fitness Lounge.
                </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
                <div className="bg-[#111215] py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-zinc-800 space-y-8">
                    
                    {error && (
                        <div className="bg-red-950/60 border border-red-500 text-red-200 px-4 py-3 rounded-xl text-xs flex items-center gap-2" role="alert">
                            <ShieldAlert className="w-5 h-5 shrink-0 text-red-400" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="space-y-8" onSubmit={handleSubmit}>
                        
                        {/* SECTION 1: ACCOUNT & PERSONAL DETAILS */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-amber-400 font-extrabold text-sm uppercase tracking-wide">
                                <User className="w-4 h-4" /> 1. Account & Personal Profile
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        required
                                        placeholder="e.g. Nagendra"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        required
                                        placeholder="e.g. Shaiva"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                        Username *
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        required
                                        placeholder="nagendraappu"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="member@legacygym.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        placeholder="+91 9876543210"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                        Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            required
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full px-3.5 py-2.5 pr-10 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-amber-400"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                        Confirm Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            required
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full px-3.5 py-2.5 pr-10 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-amber-400"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                        Gender *
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                                    >
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                        <option value="O">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                        Date of Birth *
                                    </label>
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        required
                                        value={formData.date_of_birth}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                        Height *
                                    </label>
                                    <input
                                        type="text"
                                        name="height"
                                        placeholder="e.g. 178 cm / 5'10"
                                        value={formData.height}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                        Weight *
                                    </label>
                                    <input
                                        type="text"
                                        name="weight"
                                        placeholder="e.g. 74 kg"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                    Residential Address *
                                </label>
                                <textarea
                                    name="address"
                                    rows={2}
                                    placeholder="Enter street, locality, city, pincode..."
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                                />
                            </div>
                        </div>

                        {/* SECTION 2: HEALTH & MEDICAL DETAILS */}
                        <div className="space-y-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                            <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-amber-400 font-extrabold text-sm uppercase tracking-wide">
                                <HeartPulse className="w-4 h-4 text-red-400" /> 2. Health & Medical Condition Record
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-2">
                                        Do you currently have any medical conditions? (Asthma, BP, Heart, Diabetes, etc.) *
                                    </label>
                                    <div className="grid grid-cols-2 gap-3 max-w-sm">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, has_medical_condition: false, medical_condition_reason: '' }))}
                                            className={`py-2 px-4 rounded-xl text-xs font-bold border transition ${
                                                !formData.has_medical_condition
                                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-sm'
                                                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                                            }`}
                                        >
                                            ✓ No Medical Condition
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, has_medical_condition: true }))}
                                            className={`py-2 px-4 rounded-xl text-xs font-bold border transition ${
                                                formData.has_medical_condition
                                                    ? 'bg-amber-500 text-black border-amber-500 font-extrabold shadow-sm'
                                                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                                            }`}
                                        >
                                            ⚠️ Yes, I Have a Condition
                                        </button>
                                    </div>
                                </div>

                                {formData.has_medical_condition && (
                                    <div className="animate-fadeIn">
                                        <label className="block text-xs font-semibold text-amber-300 mb-1">
                                            If Yes, Please Specify Medical Condition Reason / Details: *
                                        </label>
                                        <textarea
                                            name="medical_condition_reason"
                                            required={formData.has_medical_condition}
                                            rows={2}
                                            placeholder="e.g. Mild Asthma, High Blood Pressure medication, recovering from ACL sprain..."
                                            value={formData.medical_condition_reason}
                                            onChange={handleChange}
                                            className="w-full px-3.5 py-2 bg-zinc-900 border border-amber-500/50 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                        Any Previous Injuries or Surgeries (Past fractures, spinal/knee history):
                                    </label>
                                    <input
                                        type="text"
                                        name="injuries_surgeries"
                                        placeholder="e.g. Right shoulder dislocation in 2023 / None"
                                        value={formData.injuries_surgeries}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: FITNESS GOAL SELECTION */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-amber-400 font-extrabold text-sm uppercase tracking-wide">
                                <Target className="w-4 h-4" /> 3. Primary Fitness Goal
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {FITNESS_GOALS.map((goal) => {
                                    const Icon = goal.icon;
                                    const isSelected = formData.fitness_category === goal.id;
                                    return (
                                        <div
                                            key={goal.id}
                                            onClick={() => setFormData(prev => ({ ...prev, fitness_category: goal.id }))}
                                            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                                                isSelected
                                                    ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10'
                                                    : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-400' : 'text-zinc-400'}`} />
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                                    isSelected ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400'
                                                }`}>
                                                    {goal.badge}
                                                </span>
                                            </div>
                                            <div>
                                                <div className={`text-sm font-bold ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                                                    {goal.title}
                                                </div>
                                                <div className="text-[11px] text-zinc-400">
                                                    {goal.subtitle}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* SECTION 4: MEMBERSHIP DETAILS & PAYMENT */}
                        <div className="space-y-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                            <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-amber-400 font-extrabold text-sm uppercase tracking-wide">
                                <CreditCard className="w-4 h-4" /> 4. Membership Duration & Payment Details
                            </div>

                            {/* Plan Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {MEMBERSHIP_PLANS.map((plan) => {
                                    const isSelected = formData.plan_name === plan.id;
                                    return (
                                        <div
                                            key={plan.id}
                                            onClick={() => handlePlanSelect(plan)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all relative ${
                                                isSelected
                                                    ? 'bg-gradient-to-b from-amber-500/20 to-amber-600/10 border-amber-500 shadow-lg shadow-amber-500/15'
                                                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                                            }`}
                                        >
                                            {plan.popular && (
                                                <span className="absolute -top-2.5 right-3 bg-amber-500 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                                                    Popular
                                                </span>
                                            )}
                                            <div className="text-xs font-bold text-zinc-300">{plan.title}</div>
                                            <div className="text-xl font-black text-amber-400 my-1">₹{plan.fee.toLocaleString()}</div>
                                            <div className="text-[11px] text-zinc-400">{plan.desc}</div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Dates & Fees */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                        Joining Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="date_of_joining"
                                        required
                                        value={formData.date_of_joining}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                        End Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        required
                                        value={formData.end_date}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                        Total Membership Fee (₹)
                                    </label>
                                    <input
                                        type="number"
                                        name="total_fee"
                                        required
                                        value={formData.total_fee}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                                        Amount Paid (₹)
                                    </label>
                                    <input
                                        type="number"
                                        name="paid_fee"
                                        required
                                        value={formData.paid_fee}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-emerald-400 focus:outline-none focus:border-amber-500"
                                    />
                                </div>
                            </div>

                            {/* Payment Mode */}
                            <div className="pt-2">
                                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                                    Payment Mode *
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {PAYMENT_MODES.map((mode) => (
                                        <button
                                            key={mode.id}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, payment_mode: mode.id }))}
                                            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                                                formData.payment_mode === mode.id
                                                    ? 'bg-amber-500 text-black border-amber-500 shadow-md'
                                                    : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                                            }`}
                                        >
                                            <span>{mode.icon}</span>
                                            <span>{mode.id.toUpperCase()}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Fee summary badge */}
                            <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-xs">
                                <div className="text-zinc-400">
                                    Payment Status: <strong className="text-white">{formData.payment_mode.toUpperCase()}</strong>
                                </div>
                                <div className="flex gap-4">
                                    <span>Total: <strong className="text-amber-400">₹{Number(formData.total_fee).toLocaleString()}</strong></span>
                                    <span>Paid: <strong className="text-emerald-400">₹{Number(formData.paid_fee).toLocaleString()}</strong></span>
                                    <span>Balance Due: <strong className={balanceDue > 0 ? 'text-red-400' : 'text-emerald-400'}>₹{balanceDue.toLocaleString()}</strong></span>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 5: CAPTCHA VERIFICATION */}
                        <div className="space-y-2">
                            <CaptchaBox
                                value={captchaInput}
                                onChange={setCaptchaInput}
                                onValidationChange={setIsCaptchaValid}
                            />
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                {submitting ? 'Creating Member Account...' : (
                                    <>
                                        <CheckCircle2 className="w-5 h-5" />
                                        Complete Member Registration & Activate Plan
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                    
                    <div className="pt-4 border-t border-zinc-800 text-center">
                        <Link to="/login" className="text-xs text-zinc-400 hover:text-amber-400">
                            Already registered? <span className="font-bold text-amber-500">Sign in to your account</span>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
