import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Dumbbell, Eye, EyeOff, Target } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        phone: '',
        fitness_category: 'weight_loss'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

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
                    setError('Failed to register. Please check your inputs.');
                }
            } else {
                setError('Failed to connect to the backend server. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="flex justify-center items-center text-amber-500 mb-4">
                    <Dumbbell size={48} />
                </div>
                <h2 className="text-3xl font-extrabold text-white uppercase tracking-wider">
                    Join Legacy Fitness Lounge
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                    Create your member account and select your fitness category
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4">
                <div className="bg-zinc-900 py-8 px-6 shadow-2xl rounded-2xl border border-zinc-800 space-y-6">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-xl text-xs" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="first_name" className="block text-xs font-semibold text-gray-300 mb-1">
                                    First Name
                                </label>
                                <input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    required
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3.5 py-2.5 border border-zinc-700 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-sm bg-zinc-800 text-white"
                                />
                            </div>
                            <div>
                                <label htmlFor="last_name" className="block text-xs font-semibold text-gray-300 mb-1">
                                    Last Name
                                </label>
                                <input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    required
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3.5 py-2.5 border border-zinc-700 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-sm bg-zinc-800 text-white"
                                />
                            </div>
                        </div>

                        {/* FITNESS CATEGORY SELECTION */}
                        <div className="p-4 rounded-xl bg-zinc-950 border border-amber-500/30 space-y-2">
                            <label className="block text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                                <Target className="w-4 h-4" /> Select Your Fitness Category / Goal (Required)
                            </label>
                            <p className="text-[11px] text-zinc-400">
                                Your daily workout plan, meal schedules, and trainer guidance will be assigned based on this choice.
                            </p>
                            <select
                                id="fitness_category"
                                name="fitness_category"
                                value={formData.fitness_category}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-sm font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                            >
                                <option value="weight_loss">🔥 Weight Loss (Caloric deficit & fat burn)</option>
                                <option value="weight_gain">💪 Weight Gain (Surplus mass & hypertrophy)</option>
                                <option value="general_fitness">🏃 General Fitness (Balanced stamina & longevity)</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-xs font-semibold text-gray-300 mb-1">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                className="appearance-none block w-full px-3.5 py-2.5 border border-zinc-700 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-sm bg-zinc-800 text-white"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-semibold text-gray-300 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="appearance-none block w-full px-3.5 py-2.5 border border-zinc-700 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-sm bg-zinc-800 text-white"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="phone" className="block text-xs font-semibold text-gray-300 mb-1">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="+91 9876543210"
                                value={formData.phone}
                                onChange={handleChange}
                                className="appearance-none block w-full px-3.5 py-2.5 border border-zinc-700 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-sm bg-zinc-800 text-white"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="password" className="block text-xs font-semibold text-gray-300 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3.5 py-2.5 pr-10 border border-zinc-700 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-sm bg-zinc-800 text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-amber-400 focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-300 mb-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3.5 py-2.5 pr-10 border border-zinc-700 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-sm bg-zinc-800 text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-amber-400 focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-extrabold text-black bg-amber-500 hover:bg-amber-400 focus:outline-none shadow-lg shadow-amber-500/20 transition-all"
                            >
                                Complete Registration
                            </button>
                        </div>
                    </form>
                    
                    <div className="pt-4 border-t border-zinc-800 text-center">
                        <Link to="/login" className="text-xs text-gray-400 hover:text-amber-400">
                            Already registered? <span className="font-bold text-amber-500">Sign in to your account</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
