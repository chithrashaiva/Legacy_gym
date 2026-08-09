import React from 'react';
import { Dumbbell, MapPin, Phone, Star, Users, TrendingUp } from 'lucide-react';

export default function Home() {
  const highlights = [
    {
      icon: <Dumbbell className="w-8 h-8 text-amber-500" />,
      title: "State-of-the-art Equipment",
      description: "Modern fitness equipment for all workout styles"
    },
    {
      icon: <Users className="w-8 h-8 text-amber-500" />,
      title: "Expert Trainers",
      description: "Professional coaches to guide your fitness journey"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-amber-500" />,
      title: "Personalized Programs",
      description: "Customized workout plans tailored to your goals"
    }
  ];

  const reasons = [
    "World-class facilities and equipment",
    "Experienced and certified trainers",
    "Community-focused environment",
    "Flexible membership options",
    "Group classes and personal training",
    "Nutritional guidance included"
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      text: "Transformed my fitness journey at Legacy Fitness Lounge. The trainers are knowledgeable and supportive!",
      rating: 5
    },
    {
      name: "Priya Singh",
      text: "Best gym experience I've had. Amazing community and excellent facilities. Highly recommended!",
      rating: 5
    },
    {
      name: "Arun Patel",
      text: "The personalized training programs really helped me achieve my goals. Great atmosphere!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-zinc-900 border-b border-amber-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-14 h-14">
              {/* Logo Image Container */}
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
          </div>
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
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300 mb-6 tracking-tighter">
            Legacy Fitness Lounge
          </h1>
          <p className="text-2xl text-gray-300 mb-8 tracking-wide">Strength • Discipline • Community</p>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            Transform your body and mind at Legacy Fitness Lounge. Where champions are made and communities thrive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a 
              href="/register" 
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-lg rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all transform hover:scale-105 shadow-lg shadow-amber-500/50"
            >
              Join Now
            </a>
            <button 
              className="px-8 py-4 border-2 border-amber-500 text-amber-500 font-bold text-lg rounded-lg hover:bg-amber-500 hover:text-black transition-all transform hover:scale-105"
            >
              Book a Trial
            </button>
          </div>
        </div>
      </section>

      {/* Gym Highlights */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-amber-500 mb-16">Our Highlights</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((item, idx) => (
              <div key={idx} className="p-8 bg-gradient-to-br from-zinc-800 to-zinc-900 border border-amber-500/20 rounded-xl hover:border-amber-500/50 transition-all hover:transform hover:scale-105">
                <div className="mb-4 p-3 bg-amber-500/10 rounded-lg w-fit">{item.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-amber-500 mb-16">Why Choose Us?</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-4 p-6 bg-gradient-to-r from-amber-500/10 to-transparent rounded-lg border border-amber-500/20">
                <Star className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-200">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-amber-500 mb-16">What Our Members Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="p-8 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-amber-500/20">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                <p className="font-bold text-amber-500">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-amber-500/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-amber-500 mb-16">Visit Us Today</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">
            {/* Location */}
            <div className="flex flex-col items-center text-center p-8 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-amber-500/20">
              <MapPin className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Location</h3>
              <p className="text-gray-300 text-lg">
                Legacy Fitness Lounge
              </p>
              <p className="text-gray-400 text-lg">
                Agrahara
              </p>
            </div>

            {/* Contact */}
            <div className="flex flex-col items-center text-center p-8 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-amber-500/20">
              <Phone className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Get in Touch</h3>
              <p className="text-gray-300 text-lg">
                Call us for membership inquiries
              </p>
              <a href="tel:+918660521030" className="text-amber-500 font-bold text-lg hover:text-amber-400 transition">
                +91 86605 21030
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">Ready to Start Your Journey?</h2>
          <p className="text-lg text-black/80 mb-8">Join hundreds of members transforming their lives at Legacy Fitness Lounge</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/register" 
              className="px-8 py-3 bg-black text-amber-500 font-bold rounded-lg hover:bg-zinc-900 transition-all"
            >
              Join Now
            </a>
            <button 
              className="px-8 py-3 bg-white text-amber-600 font-bold rounded-lg hover:bg-gray-100 transition-all"
            >
              Book Free Trial
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-amber-500/20 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p>&copy; 2026 Legacy Fitness Lounge. All rights reserved.</p>
          <p className="mt-2">Strength • Discipline • Community</p>
        </div>
      </footer>
    </div>
  );
}
