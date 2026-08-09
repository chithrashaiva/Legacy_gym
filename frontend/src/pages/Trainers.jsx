import React from 'react';
import { MapPin, Phone, Mail, Clock, Award } from 'lucide-react';

export default function Trainers() {
  const trainers = [
    {
      name: "Nagendra Appu",
      title: "Main Trainer",
      specialty: "Clean Diet Plan & Strength Training",
      experience: "5+ years",
      availableTiming: "6 AM - 11 PM (Daily)",
      certifications: "Professional Strength & Conditioning",
      photo: "👨‍🏫"
    }
  ];

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
            Our Expert Trainers
          </h1>
          <p className="text-xl text-gray-300">
            Certified professionals dedicated to your fitness transformation
          </p>
        </div>
      </section>

      {/* Trainers Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-8">
            {trainers.map((trainer, idx) => (
              <div key={idx} className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-amber-500/20 rounded-xl overflow-hidden hover:border-amber-500/50 transition">
                <div className="grid md:grid-cols-2 gap-8 p-8">
                  {/* Trainer Photo */}
                  <div className="flex items-center justify-center">
                    <div className="w-64 h-64 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-8xl shadow-2xl">
                      {trainer.photo}
                    </div>
                  </div>

                  {/* Trainer Details */}
                  <div className="flex flex-col justify-center">
                    <h2 className="text-4xl font-black text-amber-400 mb-2">{trainer.name}</h2>
                    <p className="text-2xl text-amber-500 font-bold mb-6">{trainer.title}</p>

                    <div className="space-y-6">
                      {/* Specialization */}
                      <div>
                        <h3 className="text-amber-400 font-bold mb-2 text-lg">Specialization</h3>
                        <p className="text-gray-300 text-lg">{trainer.specialty}</p>
                      </div>

                      {/* Experience */}
                      <div>
                        <h3 className="text-amber-400 font-bold mb-2 text-lg">Experience</h3>
                        <p className="text-gray-300 text-lg flex items-center gap-2">
                          <Award className="w-5 h-5 text-amber-400" />
                          {trainer.experience}
                        </p>
                      </div>

                      {/* Certifications */}
                      <div>
                        <h3 className="text-amber-400 font-bold mb-2 text-lg">Certifications</h3>
                        <p className="text-gray-300 text-lg">{trainer.certifications}</p>
                      </div>

                      {/* Available Timing */}
                      <div>
                        <h3 className="text-amber-400 font-bold mb-2 text-lg">Available Timing</h3>
                        <p className="text-gray-300 text-lg flex items-center gap-2">
                          <Clock className="w-5 h-5 text-amber-400" />
                          {trainer.availableTiming}
                        </p>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex gap-4 pt-4">
                        <a href="/register" className="px-6 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition">
                          Book Session
                        </a>
                        <a href="/contact" className="px-6 py-3 border-2 border-amber-500 text-amber-400 font-bold rounded-lg hover:bg-amber-500/10 transition">
                          Contact Trainer
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trainer Expertise */}
      <section className="py-24 px-4 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-amber-500 mb-12">What Nagendra Offers</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-4">Personalized Training</h3>
              <ul className="space-y-3 text-gray-300">
                <li>✓ Custom workout plans</li>
                <li>✓ One-on-one sessions</li>
                <li>✓ Progress tracking</li>
                <li>✓ Form correction</li>
                <li>✓ Motivation & support</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-4">Nutrition Coaching</h3>
              <ul className="space-y-3 text-gray-300">
                <li>✓ Clean diet planning</li>
                <li>✓ Macro calculations</li>
                <li>✓ Meal prep guidance</li>
                <li>✓ Supplement advice</li>
                <li>✓ Lifestyle coaching</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-amber-400 mb-4">Ready to Transform with Expert Training?</h2>
          <p className="text-gray-300 mb-8">Get personalized coaching from Nagendra Appu today</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/register" className="px-8 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition">
              Book Session
            </a>
            <a href="/contact" className="px-8 py-3 border-2 border-amber-500 text-amber-400 font-bold rounded-lg hover:bg-amber-500/10 transition">
              Contact Trainer
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
