import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MapPinIcon, Share2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-zinc-900 border-b border-amber-500/20 sticky top-0 z-50">
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
            <a href="/trainers" className="px-3 py-2 text-sm text-amber-500 hover:text-amber-400 transition">Trainers</a>
            <a href="/programs" className="px-3 py-2 text-sm text-amber-500 hover:text-amber-400 transition">Programs</a>
            <a href="/gallery" className="px-3 py-2 text-sm text-amber-500 hover:text-amber-400 transition">Gallery</a>
            <a href="/membership" className="px-3 py-2 text-sm text-amber-500 hover:text-amber-400 transition">Membership</a>
            <a href="/contact" className="px-3 py-2 text-sm text-amber-500 hover:text-amber-400 transition">Contact</a>
            <a href="/login" className="px-3 py-2 text-sm text-amber-500 hover:text-amber-400 transition">Sign In</a>
            <a href="/register" className="px-3 py-2 bg-amber-500 text-black font-bold rounded hover:bg-amber-400 transition text-sm">Join Now</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300">
            Get in touch with Legacy Fitness Lounge
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6 mb-12">
          {/* Location */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-amber-500/20 rounded-xl p-8 text-center hover:border-amber-500/50 transition">
            <MapPin className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-amber-400 mb-3">Location</h3>
            <p className="text-gray-300">Agrahara, Bangalore</p>
            <p className="text-gray-400 text-sm mt-2">Visit us for a tour and free assessment</p>
          </div>

          {/* Phone */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-amber-500/20 rounded-xl p-8 text-center hover:border-amber-500/50 transition">
            <Phone className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-amber-400 mb-3">Phone</h3>
            <a href="tel:+918660521030" className="text-gray-300 hover:text-amber-400 transition">
              +91 86605 21030
            </a>
            <p className="text-gray-400 text-sm mt-2">Available 6 AM - 11 PM daily</p>
          </div>

          {/* Email */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-amber-500/20 rounded-xl p-8 text-center hover:border-amber-500/50 transition">
            <Mail className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-amber-400 mb-3">Email</h3>
            <a href="mailto:Nagendraappu26@gmail.com" className="text-gray-300 hover:text-amber-400 transition text-sm break-all">
              Nagendraappu26@gmail.com
            </a>
            <p className="text-gray-400 text-sm mt-2">We'll respond within 24 hours</p>
          </div>

          {/* Hours */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-amber-500/20 rounded-xl p-8 text-center hover:border-amber-500/50 transition">
            <Clock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-amber-400 mb-3">Hours</h3>
            <p className="text-gray-300">6:00 AM - 11:00 PM</p>
            <p className="text-gray-400 text-sm mt-2">Open 7 days a week</p>
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-24 px-4 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-amber-500/20 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-amber-400 mb-6">Send us a Message</h2>
            
            {submitted && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg">
                <p className="text-green-400">Thank you! Your message has been sent successfully. We'll get back to you soon!</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-amber-400 font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-zinc-700 border border-amber-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-amber-400 font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-zinc-700 border border-amber-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
                  placeholder="your@email.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-amber-400 font-semibold mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-700 border border-amber-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
                  placeholder="+91 90000 00000"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-amber-400 font-semibold mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 bg-zinc-700 border border-amber-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition resize-none"
                  placeholder="Tell us about your fitness goals..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>

          {/* Map & Social Media */}
          <div className="space-y-8">
            {/* Map */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-amber-500/20 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                <MapPinIcon className="w-6 h-6" />
                Find Us on Map
              </h3>
              <a 
                href="https://maps.google.com/?q=Agrahara+Bangalore" 
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-64 bg-zinc-700 border border-amber-500/20 rounded-lg flex items-center justify-center hover:border-amber-500/50 transition"
              >
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                  <p className="text-amber-400 font-semibold">Open Google Maps</p>
                  <p className="text-gray-400 text-sm mt-2">Click to view location</p>
                </div>
              </a>
              <p className="text-gray-300 mt-4 text-sm">
                Located in Agrahara, Bangalore - Easy access from major areas
              </p>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-amber-500/20 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-amber-400 mb-6">Follow Us</h3>
              <div className="space-y-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-zinc-700 rounded-lg hover:bg-zinc-600 hover:border-amber-500/50 border border-amber-500/20 transition"
                >
                  <span className="text-2xl">f</span>
                  <span className="text-white font-semibold">Facebook</span>
                </a>
                <a 
                  href="https://www.instagram.com/legacy_fitness_lounge?igsh=NmxheXFua2FndTRi" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-zinc-700 rounded-lg hover:bg-zinc-600 hover:border-amber-500/50 border border-amber-500/20 transition"
                >
                  <span className="text-2xl">📷</span>
                  <span className="text-white font-semibold">Instagram</span>
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-zinc-700 rounded-lg hover:bg-zinc-600 hover:border-amber-500/50 border border-amber-500/20 transition"
                >
                  <span className="text-2xl">𝕏</span>
                  <span className="text-white font-semibold">Twitter</span>
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-zinc-700 rounded-lg hover:bg-zinc-600 hover:border-amber-500/50 border border-amber-500/20 transition"
                >
                  <span className="text-2xl">in</span>
                  <span className="text-white font-semibold">LinkedIn</span>
                </a>
              </div>
              <p className="text-gray-400 text-sm mt-6">
                Connect with us on social media for updates, tips, and community engagement!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-amber-400 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-8">Book a free consultation or join our community today</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/register" className="px-8 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition">
              Join Now
            </a>
            <a href="/membership" className="px-8 py-3 border-2 border-amber-500 text-amber-400 font-bold rounded-lg hover:bg-amber-500/10 transition">
              View Plans
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-amber-500/20 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p className="mb-2">© 2026 Legacy Fitness Lounge. All rights reserved.</p>
          <p className="text-amber-500 font-semibold">Strength • Discipline • Community</p>
        </div>
      </footer>
    </div>
  );
}
