import React, { useState } from 'react';
import { X, ZoomIn, Dumbbell } from 'lucide-react';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const galleryImages = [
    {
      id: 1,
      category: "Leg Equipment",
      title: "Leg Press & Hack Squat Machine",
      description: "Heavy-duty plate-loaded hack squat & leg press machine with adjustable footplate and ergonomic back support.",
      src: "/gallery/hack_squat_leg_press.jpg",
      tag: "Strength Training"
    },
    {
      id: 2,
      category: "Cardio Zone",
      title: "Focus Fitness Treadmill Console",
      description: "Commercial Focus Fitness treadmill equipped with incline settings, speed telemetry dashboard, and emergency safety control.",
      src: "/gallery/treadmill_console.jpg",
      tag: "Cardio & Endurance"
    },
    {
      id: 3,
      category: "Cardio Zone",
      title: "Cardio & Endurance Station",
      description: "Spacious cardio deck featuring dual motorized treadmills, elliptical trainers, and upright stationary bikes.",
      src: "/gallery/cardio_workout_zone.jpg",
      tag: "Cardio & Endurance"
    },
    {
      id: 4,
      category: "Leg Equipment",
      title: "Seated Leg Extension Machine",
      description: "Targeted quad isolation machine featuring padded leg rollers, stack weight selection, and adjustable seating position.",
      src: "/gallery/leg_extension_machine.jpg",
      tag: "Strength Training"
    },
    {
      id: 5,
      category: "Upper Body",
      title: "Pec Fly & Rear Delt Machine",
      description: "Dual-function chest fly and rear deltoid machine with rubber matting floor for upper body conditioning.",
      src: "/gallery/pec_fly_chest_press.jpg",
      tag: "Upper Body Isolation"
    }
  ];

  const categories = ["All", "Leg Equipment", "Cardio Zone", "Upper Body"];

  const filteredImages = activeCategory === "All"
    ? galleryImages
    : galleryImages.filter(img => img.category === activeCategory);

  const ImageCard = ({ image }) => (
    <div 
      onClick={() => setSelectedImage(image)}
      className="group cursor-pointer relative overflow-hidden rounded-xl border border-amber-500/30 hover:border-amber-400 transition-all duration-300 bg-zinc-900 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between"
    >
      <div className="aspect-[4/3] overflow-hidden relative bg-black">
        <img 
          src={image.src} 
          alt={image.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-40 transition" />
        
        <span className="absolute top-3 left-3 px-3 py-1 text-xs font-bold bg-amber-500 text-black rounded-full shadow-md">
          {image.category}
        </span>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/40">
          <div className="p-3 bg-amber-500 text-black rounded-full shadow-lg transform group-hover:scale-110 transition duration-300">
            <ZoomIn className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col justify-between flex-1 bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div>
          <h3 className="text-xl font-bold text-amber-400 group-hover:text-amber-300 transition mb-2">
            {image.title}
          </h3>
          <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
            {image.description}
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-amber-500/10 flex items-center justify-between text-xs text-amber-400 font-medium">
          <span>{image.tag}</span>
          <span className="underline group-hover:text-amber-300">View Full Photo →</span>
        </div>
      </div>
    </div>
  );

  const Modal = ({ image, onClose }) => (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 border border-amber-500/50 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-amber-500/20 bg-zinc-950">
          <div>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">{image.category}</span>
            <h3 className="text-2xl font-bold text-white">{image.title}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-white rounded-full bg-zinc-800 hover:bg-zinc-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="max-h-[65vh] overflow-hidden rounded-xl bg-black flex items-center justify-center mb-5 border border-zinc-800">
            <img 
              src={image.src} 
              alt={image.title} 
              className="max-h-[65vh] w-full object-contain rounded-xl"
            />
          </div>
          <div className="bg-zinc-950/80 p-4 rounded-xl border border-amber-500/20">
            <p className="text-gray-200 text-base leading-relaxed">{image.description}</p>
          </div>
        </div>
      </div>
    </div>
  );

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
            <a href="/trainers" className="px-3 py-2 text-sm text-amber-500 hover:text-amber-400 transition">Trainers</a>
            <a href="/programs" className="px-3 py-2 text-sm text-amber-500 hover:text-amber-400 transition">Programs</a>
            <a href="/gallery" className="px-3 py-2 text-sm text-amber-400 font-bold border-b-2 border-amber-400 transition">Gallery</a>
            <a href="/membership" className="px-3 py-2 text-sm text-amber-500 hover:text-amber-400 transition">Membership</a>
            <a href="/contact" className="px-3 py-2 text-sm text-amber-500 hover:text-amber-400 transition">Contact</a>
            <a href="/login" className="px-3 py-2 text-sm text-amber-500 hover:text-amber-400 transition">Sign In</a>
            <a href="/register" className="px-3 py-2 bg-amber-500 text-black font-bold rounded hover:bg-amber-400 transition text-sm">Join Now</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm font-semibold mb-6">
            <Dumbbell className="w-4 h-4" /> Gym Equipment & Facilities Showcase
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
            Gym Gallery
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Take a visual tour of Legacy Fitness Lounge. Premium machines, dedicated cardio stations, and top-tier workout environment.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        {/* Category Filters */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 scale-105'
                  : 'bg-zinc-900 text-gray-300 hover:bg-zinc-800 border border-amber-500/20 hover:border-amber-500/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredImages.map((image) => (
            <ImageCard key={image.id} image={image} />
          ))}
        </div>

        {/* Call to Action Banner */}
        <div className="bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-amber-500/20 border border-amber-500/40 rounded-2xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-amber-400 mb-4">Experience Legacy Fitness in Person</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto text-lg">
              Visit our gym to test our premium machines and talk with our expert trainers today.
            </p>
            <a 
              href="/contact" 
              className="inline-block px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black rounded-xl hover:from-amber-400 hover:to-amber-300 transition-all transform hover:scale-105 shadow-lg shadow-amber-500/40"
            >
              Schedule a Free Gym Tour
            </a>
          </div>
        </div>
      </section>

      {/* Facilities Overview */}
      <section className="py-20 px-4 bg-zinc-950 border-t border-amber-500/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-amber-500 mb-12">Our High-Spec Equipment Highlights</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-amber-500/20 rounded-xl p-8 hover:border-amber-500/40 transition">
              <h3 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">🏋️ Strength & Legs</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-center gap-2">✓ Heavy-Duty Hack Squats & Leg Press</li>
                <li className="flex items-center gap-2">✓ Seated & Lying Leg Extension / Curl</li>
                <li className="flex items-center gap-2">✓ Plate-Loaded Leg Press Stations</li>
                <li className="flex items-center gap-2">✓ Olympic Squat Racks & Barbell Platforms</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-amber-500/20 rounded-xl p-8 hover:border-amber-500/40 transition">
              <h3 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">🏃 Cardio Suite</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-center gap-2">✓ Commercial Focus Fitness Treadmills</li>
                <li className="flex items-center gap-2">✓ Elliptical Cross Trainers & Cycles</li>
                <li className="flex items-center gap-2">✓ Digital Telemetry & Pulse Monitors</li>
                <li className="flex items-center gap-2">✓ High-Endurance Training Area</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-amber-500/20 rounded-xl p-8 hover:border-amber-500/40 transition">
              <h3 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">💪 Upper Body Isolation</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-center gap-2">✓ Dual Pec Fly & Rear Delt Machine</li>
                <li className="flex items-center gap-2">✓ Cable Crossover & Pulldown Racks</li>
                <li className="flex items-center gap-2">✓ Complete Dumbbell Sets (5kg–50kg)</li>
                <li className="flex items-center gap-2">✓ Rubberized Heavy Lifting Flooring</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-amber-500/20 py-8 px-4 bg-zinc-950">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p className="mb-2">© 2026 Legacy Fitness Lounge. All rights reserved.</p>
          <p className="text-amber-500 font-semibold">Strength • Discipline • Community</p>
        </div>
      </footer>

      {/* Image Modal Lightbox */}
      {selectedImage && (
        <Modal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
}
