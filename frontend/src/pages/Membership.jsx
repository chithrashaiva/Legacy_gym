import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

export default function Membership() {
  const [planType, setPlanType] = useState('individual');

  const individualPlans = [
    {
      duration: "Monthly",
      price: "₹1,500",
      period: "1 month",
      benefits: [
        "Unlimited gym access",
        "Access: 6 AM - 11 PM",
        "2 personal training sessions",
        "Equipment usage",
        "Locker facility"
      ],
      personalTraining: "2 sessions/month",
      accessHours: "6 AM - 11 PM"
    },
    {
      duration: "2 Month Package",
      price: "₹2,500",
      period: "2 months",
      benefits: [
        "Unlimited gym access",
        "Access: 6 AM - 11 PM",
        "4 personal training sessions",
        "Equipment usage",
        "Locker facility",
        "Nutrition consultation"
      ],
      personalTraining: "2 sessions/month",
      accessHours: "6 AM - 11 PM"
    },
    {
      duration: "Quarterly",
      price: "₹3,500",
      period: "3 months",
      benefits: [
        "Unlimited gym access",
        "Access: 6 AM - 11 PM",
        "6 personal training sessions",
        "Equipment usage",
        "Locker facility",
        "Nutrition consultation",
        "Body composition analysis"
      ],
      personalTraining: "2 sessions/month",
      accessHours: "6 AM - 11 PM"
    },
    {
      duration: "Half-Yearly",
      price: "₹5,500",
      period: "6 months",
      benefits: [
        "Unlimited gym access",
        "Access: 6 AM - 11 PM",
        "12 personal training sessions",
        "Equipment usage",
        "Locker facility",
        "Nutrition consultation",
        "Body composition analysis",
        "Progress tracking"
      ],
      personalTraining: "2 sessions/month",
      accessHours: "6 AM - 11 PM"
    },
    {
      duration: "Yearly",
      price: "₹10,000",
      period: "12 months",
      benefits: [
        "Unlimited gym access",
        "Access: 6 AM - 11 PM",
        "24 personal training sessions",
        "Equipment usage",
        "Locker facility",
        "Nutrition consultation",
        "Body composition analysis",
        "Progress tracking",
        "Free merchandise"
      ],
      personalTraining: "2 sessions/month",
      accessHours: "6 AM - 11 PM",
      popular: true
    }
  ];

  const couplePlans = [
    {
      duration: "Monthly",
      price: "₹2,500",
      period: "1 month (per couple)",
      benefits: [
        "Unlimited gym access for 2",
        "Access: 6 AM - 11 PM",
        "4 personal training sessions total",
        "Equipment usage",
        "Locker facility"
      ],
      personalTraining: "2 sessions/month combined",
      accessHours: "6 AM - 11 PM"
    },
    {
      duration: "2 Month Package",
      price: "₹4,500",
      period: "2 months (per couple)",
      benefits: [
        "Unlimited gym access for 2",
        "Access: 6 AM - 11 PM",
        "8 personal training sessions total",
        "Equipment usage",
        "Locker facility",
        "Nutrition consultation"
      ],
      personalTraining: "4 sessions/month combined",
      accessHours: "6 AM - 11 PM"
    },
    {
      duration: "Quarterly",
      price: "₹7,000",
      period: "3 months (per couple)",
      benefits: [
        "Unlimited gym access for 2",
        "Access: 6 AM - 11 PM",
        "12 personal training sessions total",
        "Equipment usage",
        "Locker facility",
        "Nutrition consultation",
        "Couple workout sessions"
      ],
      personalTraining: "4 sessions/month combined",
      accessHours: "6 AM - 11 PM"
    },
    {
      duration: "Half-Yearly",
      price: "₹13,500",
      period: "6 months (per couple)",
      benefits: [
        "Unlimited gym access for 2",
        "Access: 6 AM - 11 PM",
        "24 personal training sessions total",
        "Equipment usage",
        "Locker facility",
        "Nutrition consultation",
        "Couple workout sessions",
        "Progress tracking for both"
      ],
      personalTraining: "4 sessions/month combined",
      accessHours: "6 AM - 11 PM"
    },
    {
      duration: "Yearly",
      price: "₹16,000",
      period: "12 months (per couple)",
      benefits: [
        "Unlimited gym access for 2",
        "Access: 6 AM - 11 PM",
        "48 personal training sessions total",
        "Equipment usage",
        "Locker facility",
        "Nutrition consultation",
        "Couple workout sessions",
        "Progress tracking for both",
        "Free merchandise for both"
      ],
      personalTraining: "4 sessions/month combined",
      accessHours: "6 AM - 11 PM",
      popular: true
    }
  ];

  const plans = planType === 'individual' ? individualPlans : couplePlans;

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
            Membership Plans
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Choose the perfect plan that fits your fitness journey
          </p>
        </div>
      </section>

      {/* Plan Type Selector */}
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setPlanType('individual')}
              className={`px-8 py-3 rounded-lg font-bold transition ${
                planType === 'individual'
                  ? 'bg-amber-500 text-black'
                  : 'bg-zinc-800 text-amber-400 hover:bg-zinc-700'
              }`}
            >
              Individual Plans
            </button>
            <button
              onClick={() => setPlanType('couple')}
              className={`px-8 py-3 rounded-lg font-bold transition ${
                planType === 'couple'
                  ? 'bg-amber-500 text-black'
                  : 'bg-zinc-800 text-amber-400 hover:bg-zinc-700'
              }`}
            >
              Couple Plans
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {plans.map((plan, idx) => (
              <div 
                key={idx} 
                className={`relative rounded-xl transition transform hover:scale-105 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-amber-500/30 to-amber-600/20 border-2 border-amber-400 ring-2 ring-amber-400/30'
                    : 'bg-gradient-to-br from-zinc-800 to-zinc-900 border border-amber-500/20 hover:border-amber-500/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-amber-500 text-black px-4 py-1 rounded-full font-bold text-sm">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-amber-400 mb-2">{plan.duration}</h3>
                  <p className="text-gray-400 text-sm mb-6">{plan.period}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <p className="text-4xl font-black text-white mb-2">{plan.price}</p>
                    <p className="text-gray-400 text-sm">{plan.period}</p>
                  </div>

                  {/* Access Hours */}
                  <div className="mb-6 pb-6 border-b border-amber-500/20">
                    <p className="text-amber-400 font-semibold mb-2">Access Hours</p>
                    <p className="text-gray-300 text-sm">{plan.accessHours}</p>
                  </div>

                  {/* Personal Training */}
                  <div className="mb-6 pb-6 border-b border-amber-500/20">
                    <p className="text-amber-400 font-semibold mb-2">Personal Training</p>
                    <p className="text-gray-300 text-sm">{plan.personalTraining}</p>
                  </div>

                  {/* Benefits */}
                  <div className="mb-8">
                    <p className="text-amber-400 font-semibold mb-4">Benefits</p>
                    <ul className="space-y-3">
                      {plan.benefits.map((benefit, bidx) => (
                        <li key={bidx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <button className={`w-full py-3 rounded-lg font-bold transition ${
                    plan.popular
                      ? 'bg-amber-500 text-black hover:bg-amber-400'
                      : 'bg-zinc-700 text-amber-400 hover:bg-zinc-600'
                  }`}>
                    Choose Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-24 px-4 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-amber-500 mb-12">What's Included in All Plans?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Check className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">State-of-the-Art Equipment</h3>
                  <p className="text-gray-400">Complete range of dumbbells, cardio, and weight training equipment</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Check className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Expert Guidance</h3>
                  <p className="text-gray-400">Professional trainers available to assist with your fitness goals</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Check className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Clean Facilities</h3>
                  <p className="text-gray-400">Well-maintained locker rooms with shower facilities</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Check className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Group Classes</h3>
                  <p className="text-gray-400">Yoga, Zumba, CrossFit, and other group fitness classes</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Check className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Flexible Cancellation</h3>
                  <p className="text-gray-400">No hidden charges, flexible membership terms</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Check className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Community Support</h3>
                  <p className="text-gray-400">Join a supportive community of fitness enthusiasts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-amber-400 mb-4">Ready to Transform Your Fitness Journey?</h2>
          <p className="text-gray-300 mb-8">Join Legacy Fitness Lounge today and start your path to wellness</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/register" className="px-8 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition">
              Join Now
            </a>
            <button className="px-8 py-3 border-2 border-amber-500 text-amber-400 font-bold rounded-lg hover:bg-amber-500/10 transition">
              Book a Trial
            </button>
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
