import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import CaptchaBox from '../../components/CaptchaBox';
import { Dumbbell, Eye, EyeOff, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';

export default function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loginRole, setLoginRole] = useState('member'); // 'member' or 'admin'
    
    // Captcha State
    const [captchaInput, setCaptchaInput] = useState('');
    const [isCaptchaValid, setIsCaptchaValid] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!captchaInput.trim()) {
            setError('Please enter the CAPTCHA security code before proceeding.');
            return;
        }

        if (!isCaptchaValid) {
            setError('Invalid CAPTCHA security code. Please check the code and try again.');
            return;
        }

        setSubmitting(true);
        try {
            const data = await login(credentials);
            const userRole = data?.user?.role;
            const isAdmin = userRole === 'admin' || userRole === 'super_admin' || userRole === 'trainer';

            if (isAdmin || loginRole === 'admin') {
                navigate('/admin-portal');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Invalid username or password. Please check your credentials.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="inline-flex justify-center items-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-extrabold shadow-lg shadow-amber-500/20 mb-4">
                    <Dumbbell size={32} />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-wider bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                    Legacy Lounge
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                    Sign in to access your Member Dashboard or Gym Admin Portal
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
                <div className="bg-[#111215] py-8 px-6 shadow-2xl rounded-2xl border border-zinc-800 space-y-6">
                    
                    {/* Role Toggle Switcher */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800 text-xs font-bold">
                        <button
                            type="button"
                            onClick={() => setLoginRole('member')}
                            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                                loginRole === 'member'
                                    ? 'bg-amber-500 text-black shadow'
                                    : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            <UserCheck className="w-3.5 h-3.5" /> Member Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginRole('admin')}
                            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                                loginRole === 'admin'
                                    ? 'bg-amber-500 text-black shadow'
                                    : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            <ShieldCheck className="w-3.5 h-3.5" /> Admin Portal
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-950/50 border border-red-500/60 text-red-300 px-4 py-3 rounded-xl text-xs" role="alert">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-xs font-semibold text-zinc-400 mb-1">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                placeholder="Enter your username (e.g. nagendraappu)"
                                value={credentials.username}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-semibold text-zinc-400 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2.5 pr-10 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
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

                        {/* CAPTCHA Security Verification */}
                        <CaptchaBox
                            value={captchaInput}
                            onChange={setCaptchaInput}
                            onValidationChange={setIsCaptchaValid}
                        />

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            {submitting ? 'Verifying...' : (
                                <>
                                    {loginRole === 'admin' ? 'Access Admin Portal' : 'Sign In to Dashboard'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-4 border-t border-zinc-800 text-center">
                        <Link to="/register" className="text-xs text-zinc-400 hover:text-amber-400 transition-colors">
                            Don't have an account? <span className="font-bold text-amber-500">Register as a member</span>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
