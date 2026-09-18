import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, ShieldCheck, Volume2, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

export default function CaptchaBox({ value, onChange, onValidationChange }) {
    const [captchaCode, setCaptchaCode] = useState('');
    const [loading, setLoading] = useState(false);
    const canvasRef = useRef(null);

    const generateCaptcha = async () => {
        setLoading(true);
        try {
            const data = await authService.getCaptcha();
            const code = data?.captcha_code || generateRandomCode();
            setCaptchaCode(code);
            drawCaptcha(code);
        } catch (e) {
            const code = generateRandomCode();
            setCaptchaCode(code);
            drawCaptcha(code);
        } finally {
            setLoading(false);
        }
    };

    const generateRandomCode = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let res = '';
        for (let i = 0; i < 6; i++) {
            res += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return res;
    };

    const drawCaptcha = (code) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Background
        ctx.fillStyle = '#18181b';
        ctx.fillRect(0, 0, width, height);

        // Grid / noise lines
        for (let i = 0; i < 6; i++) {
            ctx.strokeStyle = i % 2 === 0 ? 'rgba(245, 158, 11, 0.25)' : 'rgba(217, 119, 6, 0.2)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(Math.random() * width, Math.random() * height);
            ctx.bezierCurveTo(
                Math.random() * width, Math.random() * height,
                Math.random() * width, Math.random() * height,
                Math.random() * width, Math.random() * height
            );
            ctx.stroke();
        }

        // Noise dots
        for (let i = 0; i < 40; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255, 255, 255, 0.2)';
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw characters with distinct rotations, colors & fonts
        const charArray = code.split('');
        const charWidth = width / (charArray.length + 1);

        charArray.forEach((char, index) => {
            ctx.save();
            const x = (index + 0.8) * charWidth;
            const y = height / 2 + (Math.random() * 8 - 4);
            const angle = (Math.random() - 0.5) * 0.45;

            ctx.translate(x, y);
            ctx.rotate(angle);

            const fontSizes = [22, 24, 26, 23];
            const size = fontSizes[index % fontSizes.length];
            ctx.font = `bold ${size}px 'Courier New', monospace`;
            
            // Alternating gold and amber tones
            const colors = ['#fbbf24', '#f59e0b', '#d97706', '#fef08a', '#fcd34d'];
            ctx.fillStyle = colors[index % colors.length];
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(char, 0, 0);
            ctx.restore();
        });
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    useEffect(() => {
        if (captchaCode) {
            drawCaptcha(captchaCode);
            const isMatch = value && value.trim().toUpperCase() === captchaCode.toUpperCase();
            if (onValidationChange) {
                onValidationChange(!!isMatch);
            }
        }
    }, [captchaCode, value]);

    const playAudio = () => {
        if ('speechSynthesis' in window && captchaCode) {
            const letters = captchaCode.split('').join(' ');
            const utterance = new SpeechSynthesisUtterance(`Security code is ${letters}`);
            utterance.rate = 0.85;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    };

    const isMatch = value && captchaCode && value.trim().toUpperCase() === captchaCode.toUpperCase();
    const hasEntered = value && value.trim().length > 0;

    return (
        <div className="space-y-2 p-3.5 bg-zinc-950 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    Security Verification (CAPTCHA)
                </span>
                <span className="text-[11px] text-zinc-500">Case-insensitive</span>
            </div>

            {/* Captcha Canvas & Actions */}
            <div className="flex items-center gap-2">
                <div className="relative rounded-lg overflow-hidden border border-amber-500/30 bg-zinc-900 shadow-inner">
                    <canvas
                        ref={canvasRef}
                        width={180}
                        height={46}
                        className="block select-none"
                    />
                </div>

                <button
                    type="button"
                    onClick={generateCaptcha}
                    title="Refresh CAPTCHA code"
                    disabled={loading}
                    className="p-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-amber-400 border border-zinc-700 transition"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-500' : ''}`} />
                </button>

                <button
                    type="button"
                    onClick={playAudio}
                    title="Audio CAPTCHA"
                    className="p-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-amber-400 border border-zinc-700 transition"
                >
                    <Volume2 className="w-4 h-4" />
                </button>
            </div>

            {/* User Entry Field */}
            <div className="relative">
                <input
                    type="text"
                    required
                    maxLength={8}
                    placeholder="Enter the 6-character code above"
                    value={value}
                    onChange={(e) => onChange(e.target.value.toUpperCase())}
                    className={`w-full px-3.5 py-2 bg-zinc-900 border rounded-xl text-sm font-mono tracking-widest text-zinc-100 placeholder-zinc-500 uppercase focus:outline-none transition ${
                        hasEntered
                            ? isMatch
                                ? 'border-emerald-500 focus:border-emerald-400 ring-1 ring-emerald-500/30'
                                : 'border-red-500 focus:border-red-400 ring-1 ring-red-500/30'
                            : 'border-zinc-800 focus:border-amber-500'
                    }`}
                />
                {hasEntered && (
                    <div className="absolute right-3 top-2.5">
                        {isMatch ? (
                            <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                                <CheckCircle2 className="w-4 h-4" /> Verified
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-red-400 text-xs font-semibold">
                                <AlertCircle className="w-4 h-4" /> Incorrect
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
