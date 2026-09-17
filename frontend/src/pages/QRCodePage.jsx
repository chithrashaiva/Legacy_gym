import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Download, Printer, Copy, Check, ExternalLink, Sparkles, Smartphone, ShieldCheck } from 'lucide-react';

export default function QRCodePage() {
  // Default to window.location.origin or Render URL placeholder
  const defaultUrl = typeof window !== 'undefined' ? window.location.origin : 'https://legacy-gym-frontend.onrender.com';
  const [websiteUrl, setWebsiteUrl] = useState(defaultUrl);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(websiteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const svgElement = qrRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 600;
      canvas.height = 600;
      if (ctx) {
        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 50, 50, 500, 500);
        
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `legacy_gym_qr_code.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-zinc-900 border-b border-amber-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 shadow-lg flex items-center justify-center overflow-hidden border-2 border-amber-300 group-hover:shadow-xl transition-shadow">
                <img 
                  src="/logo.png" 
                  alt="Legacy Fitness Lounge" 
                  className="w-12 h-12 object-contain drop-shadow-lg"
                  onError={(e) => { e.style.display = 'none'; }}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-base font-bold text-amber-400 leading-tight">LEGACY</p>
              <p className="text-xs font-semibold text-amber-300">FITNESS LOUNGE</p>
            </div>
          </a>
          <div className="flex gap-2 flex-wrap justify-end">
            <a href="/" className="px-3 py-2 text-sm text-amber-500 hover:text-amber-400 transition">Home</a>
            <a href="/about" className="px-3 py-2 text-sm text-amber-500 hover:text-amber-400 transition">About</a>
            <a href="/gallery" className="px-3 py-2 text-sm text-amber-500 hover:text-amber-400 transition">Gallery</a>
            <a href="/membership" className="px-3 py-2 text-sm text-amber-500 hover:text-amber-400 transition">Membership</a>
            <a href="/qr" className="px-3 py-2 text-sm text-amber-400 font-bold border-b-2 border-amber-400 transition flex items-center gap-1">
              <QrCode className="w-4 h-4" /> QR Scanner
            </a>
            <a href="/contact" className="px-3 py-2 text-sm text-amber-500 hover:text-amber-400 transition">Contact</a>
            <a href="/register" className="px-3 py-2 bg-amber-500 text-black font-bold rounded hover:bg-amber-400 transition text-sm">Join Now</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" /> Instant Mobile Website Scanner
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 mb-3">
            Legacy Gym QR Code
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Scan this QR code with any mobile phone camera to instantly open the Legacy Fitness Lounge website!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* QR Code Card */}
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border-2 border-amber-500/40 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
            
            <div className="relative z-10 flex flex-col items-center">
              {/* QR Code Box with Amber Border */}
              <div 
                ref={qrRef}
                className="p-5 bg-zinc-950 border-4 border-amber-500 rounded-2xl shadow-2xl mb-6 relative group cursor-pointer hover:border-amber-400 transition duration-300"
              >
                <QRCodeSVG 
                  value={websiteUrl} 
                  size={240}
                  bgColor="#09090b"
                  fgColor="#f59e0b"
                  level="H"
                  includeMargin={true}
                />
                <div className="mt-3 flex items-center justify-center gap-2 text-amber-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" /> OFFICIAL LEGACY GYM QR
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 w-full">
                <button
                  onClick={handleDownload}
                  className="flex-1 min-w-[140px] px-4 py-3 bg-amber-500 text-black font-extrabold rounded-xl hover:bg-amber-400 transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Download className="w-5 h-5" /> Download Image
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-3 bg-zinc-800 border border-amber-500/30 text-amber-400 font-bold rounded-xl hover:bg-zinc-700 transition flex items-center justify-center gap-2"
                >
                  <Printer className="w-5 h-5" /> Print Poster
                </button>
              </div>
            </div>
          </div>

          {/* Settings & Instructions */}
          <div className="space-y-6">
            {/* Target URL Settings */}
            <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-2 flex items-center gap-2">
                🌐 Website URL for Scanner
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                When deployed on <strong>Render.com</strong>, paste your live URL (e.g. <code className="text-amber-300">https://legacy-gym.onrender.com</code>) here so scanning redirects to your live site!
              </p>
              
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://legacy-gym.onrender.com"
                  className="flex-1 bg-black border border-zinc-700 focus:border-amber-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-3 bg-zinc-800 border border-amber-500/30 text-amber-400 rounded-xl hover:bg-zinc-700 transition flex items-center gap-1 text-sm font-semibold"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* How to Use Box */}
            <div className="bg-zinc-900 border border-amber-500/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-400" /> How to Scan & Test:
              </h3>
              <ol className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-xs shrink-0">1</span>
                  <span>Open your Smartphone Camera (iOS Camera or Android Lens).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-xs shrink-0">2</span>
                  <span>Point your camera directly at the QR Code on screen or printout.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-xs shrink-0">3</span>
                  <span>Tap the notification popup banner to open the website instantly!</span>
                </li>
              </ol>
            </div>

            {/* Render Deployment Note */}
            <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/40 rounded-2xl p-6">
              <h4 className="text-amber-400 font-bold mb-1 flex items-center gap-2">
                <ExternalLink className="w-4 h-4" /> Render Deployment Guide
              </h4>
              <p className="text-gray-300 text-sm">
                Deploy your site on <strong>Render.com</strong> using our pre-configured build steps. Once deployed, update the QR URL above and print the scanner badge for your gym front desk!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
