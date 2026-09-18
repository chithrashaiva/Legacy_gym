import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { portalService } from '../../services/portalService';
import { Dumbbell, Eye, EyeOff, ShieldCheck, Phone, KeyRound, CheckCircle2 } from 'lucide-react';

export default function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loginRole, setLoginRole] = useState('member'); // 'member' or 'admin'
    
    // 2-Step Verification state for Admin
    const [step, setStep] = useState(1); // 1: Password login, 2: Phone OTP entry
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [otpDemo, setOtpDemo] = useState('');
    const [otpSentMsg, setOtpSentMsg] = useState('');
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [pendingUserData, setPendingUserData] = useState(null);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await login(credentials);
            const userRole = data?.user?.role;
            const isAdmin = userRole === 'admin' || userRole === 'super_admin' || userRole === 'trainer';

            if (isAdmin || loginRole === 'admin') {
                // Trigger 2-Step OTP Verification for Admin
                setPendingUserData(data);
                setStep(2);
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Invalid username or password. Please check your credentials.');
        }
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        if (!phoneNumber) {
            setError('Please enter your mobile phone number for 2-step verification.');
            return;
        }

        try {
            const res = await portalService.sendAdminOTP(phoneNumber, credentials.username);
            setOtpSentMsg(res.message);
            if (res.otp_demo) {
                setOtpDemo(res.otp_demo);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP to mobile phone.');
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setVerifyingOtp(true);
        try {
            const res = await portalService.verifyAdminOTP(phoneNumber, otpCode);
            if (res.verified) {
                sessionStorage.setItem('admin_2step_verified', 'true');
                navigate('/admin-portal');
            } else {
                setError(res.error || 'Invalid OTP code.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid or expired 2-step OTP code.');
        } finally {
            setVerifyingOtp(false);
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
                    {step === 1 ? 'Sign in to access Member Dashboard or Admin Portal' : 'Admin 2-Step OTP Security Verification'}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
                <div className="bg-[#111215] py-8 px-6 shadow-2xl rounded-2xl border border-zinc-800 space-y-6">
                    
                    {/* Role Toggle Switcher */}
                    {step === 1 && (
                        <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800 text-xs font-bold">
                            <button
                                type="button"
                                onClick={() => setLoginRole('member')}
                                className={`py-2 rounded-lg transition-all ${
                                    loginRole === 'member'
                                        ? 'bg-amber-500 text-black shadow'
                                        : 'text-zinc-400 hover:text-white'
                                }`}
                            >
                                Member Login
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
                    )}

                    {error && (
                        <div className="bg-red-950/50 border border-red-500/60 text-red-300 px-4 py-3 rounded-xl text-xs" role="alert">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Username & Password Login */}
                    {step === 1 && (
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

                            {loginRole === 'admin' && (
                                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                                    <span>2-Step OTP Mobile Verification will be prompted for Admin access.</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all"
                            >
                                {loginRole === 'admin' ? 'Proceed to 2-Step OTP Verification →' : 'Sign In to Dashboard'}
                            </button>
                        </form>
                    )}

                    {/* Step 2: Admin 2-Step Mobile OTP Verification */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <div className="p-3.5 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1 text-xs">
                                <div className="flex items-center justify-between text-zinc-300 font-bold">
                                    <span>Admin Security Verification</span>
                                    <span className="text-amber-400">Step 2 of 2</span>
                                </div>
                                <p className="text-zinc-400">Enter mobile number to send 2-step OTP verification code.</p>
                            </div>

                            {!otpSentMsg ? (
                                <form onSubmit={handleSendOTP} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-400 mb-1">
                                            Mobile Phone Number
                                        </label>
                                        <div className="relative">
                                            <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                                            <input
                                                type="tel"
                                                required
                                                placeholder="+91 9876543210"
                                                value={phoneNumber}
                                                onChange={e => setPhoneNumber(e.target.value)}
                                                className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow"
                                    >
                                        Send OTP to Mobile Phone
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOTP} className="space-y-4">
                                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 space-y-1">
                                        <div className="flex items-center gap-1.5 font-bold">
                                            <CheckCircle2 className="w-4 h-4" /> {otpSentMsg}
                                        </div>
                                        {otpDemo && (
                                            <div className="text-amber-300 font-mono text-[11px] pt-1 border-t border-emerald-500/20">
                                                OTP Demo Code: <strong className="text-white text-xs bg-amber-500/20 px-1.5 py-0.5 rounded">{otpDemo}</strong>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-400 mb-1">
                                            Enter 6-Digit OTP Code
                                        </label>
                                        <div className="relative">
                                            <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                                            <input
                                                type="text"
                                                required
                                                maxLength={6}
                                                placeholder="Enter 6-digit OTP"
                                                value={otpCode}
                                                onChange={e => setOtpCode(e.target.value)}
                                                className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 font-mono tracking-widest text-center focus:outline-none focus:border-amber-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => { setStep(1); setOtpSentMsg(''); }}
                                            className="w-1/3 py-2.5 px-3 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white text-xs font-medium"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={verifyingOtp}
                                            className="w-2/3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20"
                                        >
                                            {verifyingOtp ? 'Verifying...' : 'Verify OTP & Access Admin Portal'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

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
