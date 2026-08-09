import React from 'react';
import { Dumbbell, Heart, TrendingUp, Zap, Users, Leaf } from 'lucide-react';

export default function Programs() {
  const programs = [
    {
      icon: <Leaf className="w-12 h-12 text-amber-500" />,
      name: "Weight Loss Program",
      description: "Comprehensive fat loss program combining cardio, strength training, and nutrition guidance",
      duration: "8-12 weeks",
      includes: [
        "Personalized diet plan",
        "Cardio & HIIT training",
        "Metabolism boosting exercises",
        "Weekly progress tracking",
        "Nutritionist consultation"
      ],
      price: "₹8,000 - ₹12,000"
    },
    {
      icon: <Dumbbell className="w-12 h-12 text-amber-500" />,
      name: "Muscle Building Program",
      description: "Hypertrophy-focused training program with progressive overload and nutrition plans",
      duration: "12-16 weeks",
      includes: [
        "Structured strength routine",
        "Macro-tailored meal plans",
        "Recovery protocols",
        "Supplement guidance",
        "Body composition tracking"
      ],
      price: "₹10,000 - ₹15,000"
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-amber-500" />,
      name: "Strength Training Program",
      description: "Advanced strength building with focus on compound movements and progressive loading",
      duration: "12-16 weeks",
      includes: [
        "Olympic lift training",
        "Powerlifting techniques",
        "Form perfection",
        "Periodized training plan",
        "1-on-1 coaching"
      ],
      price: "₹12,000 - ₹16,000"
    },
    {
      icon: <Heart className="w-12 h-12 text-amber-500" />,
      name: "Cardio & Endurance",
      description: "Cardiovascular fitness improvement with stamina building and fat burning",
      duration: "6-10 weeks",
      includes: [
        "HIIT workouts",
        "Running programs",
        "Interval training",
        "Heart rate optimization",
        "Endurance building"
      ],
      price: "₹6,000 - ₹9,000"
    },
    {
      icon: <Users className="w-12 h-12 text-amber-500" />,
      name: "Personal Training",
      description: "One-on-one customized training sessions tailored to your specific goals and fitness level",
      duration: "Flexible",
      includes: [
        "Custom workout design",
        "Expert form guidance",
        "Real-time adjustments",
        "Motivation & accountability",
        "Nutrition coaching"
      ],
      price: "₹500 - ₹800 per session"
    },
    {
      icon: <Zap className="w-12 h-12 text-amber-500" />,
      name: "Yoga & Zumba Classes",
      description: "Group fitness classes for flexibility, strength, and fun cardio experience",
      duration: "Ongoing classes",
      includes: [
        "Hatha & Power Yoga",
        "Zumba dance cardio",
        "Flexibility training",
        "Core strengthening",
        "Stress relief"
      ],
      price: "Included in membership"
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
            Fitness Programs
          </h1>
          <p className="text-xl text-gray-300">
            Diverse programs designed to achieve your specific fitness goals
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, idx) => (
              <div 
                key={idx} 
                className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-amber-500/20 rounded-xl p-8 hover:border-amber-500/50 hover:shadow-lg transition group"
              >
                {/* Icon */}
                <div className="mb-6 p-4 bg-amber-500/10 rounded-lg w-fit group-hover:bg-amber-500/20 transition">
                  {program.icon}
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold text-amber-400 mb-3">{program.name}</h3>
                <p className="text-gray-300 mb-6">{program.description}</p>

                {/* Duration */}
                <div className="mb-6 pb-6 border-b border-amber-500/20">
                  <p className="text-sm text-gray-400">
                    <span className="text-amber-400 font-semibold">Duration:</span> {program.duration}
                  </p>
                </div>

                {/* Includes */}
                <div className="mb-8">
                  <h4 className="text-amber-400 font-bold mb-4">What's Included:</h4>
                  <ul className="space-y-2">
                    {program.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-amber-500 mt-1">✓</span>
                        <span className="text-gray-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-amber-500/20">
                  <p className="text-amber-400 font-bold text-lg">{program.price}</p>
                </div>

                {/* CTA Button */}
                <button className="w-full py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition">
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Choose */}
      <section className="py-24 px-4 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-amber-500 mb-12">How to Choose Your Program</h2>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-amber-500 p-6 rounded">
              <h3 className="text-xl font-bold text-amber-400 mb-2">Beginner?</h3>
              <p className="text-gray-300">Start with Personal Training or Cardio & Endurance program to build a foundation and learn proper form.</p>
            </div>
            <div className="bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-amber-500 p-6 rounded">
              <h3 className="text-xl font-bold text-amber-400 mb-2">Want to Lose Weight?</h3>
              <p className="text-gray-300">Our Weight Loss Program combines targeted exercises with nutrition guidance for maximum results.</p>
            </div>
            <div className="bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-amber-500 p-6 rounded">
              <h3 className="text-xl font-bold text-amber-400 mb-2">Looking to Build Muscle?</h3>
              <p className="text-gray-300">Muscle Building Program with Nagendra's expertise in strength training and clean nutrition plans.</p>
            </div>
            <div className="bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-amber-500 p-6 rounded">
              <h3 className="text-xl font-bold text-amber-400 mb-2">Want Stress Relief?</h3>
              <p className="text-gray-300">Try our Yoga & Zumba classes for flexibility, strength, and pure fun while working out.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-amber-400 mb-4">Find Your Perfect Program</h2>
          <p className="text-gray-300 mb-8">Consult with our trainers to choose the right program for your goals</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/trainers" className="px-8 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition">
              Meet Our Trainers
            </a>
            <a href="/contact" className="px-8 py-3 border-2 border-amber-500 text-amber-400 font-bold rounded-lg hover:bg-amber-500/10 transition">
              Get Free Consultation
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
