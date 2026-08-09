import React from 'react';
import { Users, Dumbbell, Clock, MapPin, Phone } from 'lucide-react';

export default function About() {
  const trainers = [
    {
      name: "Nagendra Appu",
      title: "Main Trainer",
      specialty: "Clean Diet Plan & Strength Training",
      experience: "5+ years"
    }
  ];

  const facilities = [
    {
      icon: <Dumbbell className="w-8 h-8 text-amber-500" />,
      name: "Premium Dumbbells",
      description: "Complete range from 5kg to 50kg"
    },
    {
      icon: <Dumbbell className="w-8 h-8 text-amber-500" />,
      name: "Cardio Equipment",
      description: "Treadmills, ellipticals, and stationary bikes"
    },
    {
      icon: <Dumbbell className="w-8 h-8 text-amber-500" />,
      name: "Weight Training",
      description: "Barbell racks, benches, and cable machines"
    },
    {
      icon: <Dumbbell className="w-8 h-8 text-amber-500" />,
      name: "Group Classes",
      description: "Yoga, Zumba, CrossFit, and more"
    },
    {
      icon: <Dumbbell className="w-8 h-8 text-amber-500" />,
      name: "Locker Rooms",
      description: "Secure storage with shower facilities"
    },
    {
      icon: <Dumbbell className="w-8 h-8 text-amber-500" />,
      name: "Nutrition Lab",
      description: "Personalized meal planning consultation"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-zinc-900 border-b border-amber-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 shadow-lg flex items-center justify-center overflow-hidden border-2 border-amber-300">
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
      <section className="pt-20 pb-16 px-4 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300 mb-6">
            About Legacy Fitness Lounge
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your dedicated partner in achieving fitness excellence. We've been transforming lives and building stronger communities for over a decade.
          </p>
        </div>
      </section>

      {/* Gym Introduction */}
      <section className="py-24 px-4 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-amber-500/20 rounded-xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-500 mb-6">Who We Are</h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                Legacy Fitness Lounge is more than just a gym—it's a community dedicated to helping you achieve your fitness goals. Located in the heart of Agrahara, we provide state-of-the-art facilities and expert guidance to transform your body and mind.
              </p>
              <p>
                Our mission is to create an inclusive, supportive environment where every member feels motivated and empowered to reach their potential. Whether you're a beginner or an advanced athlete, our team is here to support your journey.
              </p>
              <p>
                With over 10 years of experience, certified trainers, and modern equipment, Legacy Fitness Lounge stands as the premier fitness destination in Agrahara. Join our community today and be part of something special.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gym Timings */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-amber-500 mb-16">Operating Hours</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-amber-500/20 rounded-xl p-8 text-center hover:border-amber-500/50 transition">
              <Clock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Daily Hours</h3>
              <div className="space-y-3">
                <p className="text-4xl font-black text-amber-400">6:00 AM</p>
                <p className="text-gray-400">Opening Time</p>
                <div className="border-t border-amber-500/20 my-4"></div>
                <p className="text-4xl font-black text-amber-400">11:00 PM</p>
                <p className="text-gray-400">Closing Time</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-amber-500/20 rounded-xl p-8 text-center hover:border-amber-500/50 transition">
              <Users className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Availability</h3>
              <div className="space-y-2 text-gray-300">
                <p className="font-semibold">Open 7 Days a Week</p>
                <p>Monday - Sunday</p>
                <p className="text-amber-400 font-semibold mt-4">17 Hours Daily</p>
                <p className="text-sm">Maximum access to your fitness journey</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section className="py-24 px-4 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-amber-500 mb-4">Meet Our Expert Trainers</h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Certified professionals with years of experience dedicated to your success
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainers.map((trainer, idx) => (
              <div key={idx} className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-amber-500/20 rounded-xl p-6 hover:border-amber-500/50 transition hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2">{trainer.name}</h3>
                <p className="text-amber-400 text-center font-semibold mb-3">{trainer.title}</p>
                <p className="text-gray-400 text-center text-sm mb-2">{trainer.specialty}</p>
                <p className="text-amber-500 text-center text-sm font-semibold">{trainer.experience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-amber-500 mb-4">World-Class Facilities</h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Everything you need for an incredible fitness experience
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility, idx) => (
              <div key={idx} className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-amber-500/20 rounded-xl p-8 hover:border-amber-500/50 transition hover:transform hover:scale-105">
                <div className="flex justify-center mb-4">{facility.icon}</div>
                <h3 className="text-xl font-bold text-white text-center mb-3">{facility.name}</h3>
                <p className="text-gray-400 text-center">{facility.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 rounded-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center text-amber-400 mb-8">Ready to Join Us?</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="flex items-center gap-4">
              <MapPin className="w-8 h-8 text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-amber-400 font-semibold">Location</p>
                <p className="text-gray-300">Agrahara, Bangalore</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="w-8 h-8 text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-amber-400 font-semibold">Contact</p>
                <a href="tel:+918660521030" className="text-gray-300 hover:text-amber-400">+91 86605 21030</a>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="px-8 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-all text-center">
              Join Now
            </a>
            <button className="px-8 py-3 border-2 border-amber-500 text-amber-500 font-bold rounded-lg hover:bg-amber-500 hover:text-black transition-all">
              Book a Trial
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
