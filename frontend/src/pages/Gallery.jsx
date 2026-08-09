import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    {
      id: 1,
      category: "Equipment",
      title: "Premium Dumbbells",
      description: "Complete range of dumbbells from 5kg to 50kg"
    },
    {
      id: 2,
      category: "Equipment",
      title: "Cardio Station",
      description: "State-of-the-art treadmills and ellipticals"
    },
    {
      id: 3,
      category: "Equipment",
      title: "Weight Racks",
      description: "Professional-grade barbell racks and benches"
    },
    {
      id: 4,
      category: "Equipment",
      title: "Cable Machines",
      description: "Advanced strength training machines"
    },
    {
      id: 5,
      category: "Gym Floor",
      title: "Gym Floor",
      description: "Spacious and well-equipped training floor"
    },
    {
      id: 6,
      category: "Gym Floor",
      title: "Training Area",
      description: "Open and bright workout space"
    },
    {
      id: 7,
      category: "Facilities",
      title: "Locker Rooms",
      description: "Clean and secure locker facilities"
    },
    {
      id: 8,
      category: "Facilities",
      title: "Showers",
      description: "Modern shower and changing facilities"
    }
  ];

  const ImageCard = ({ image }) => (
    <div 
      onClick={() => setSelectedImage(image)}
      className="group cursor-pointer relative overflow-hidden rounded-lg"
    >
      <div className="aspect-square bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-lg flex flex-col items-center justify-center p-6 hover:border-amber-500/60 transition hover:bg-amber-500/25">
        <div className="w-20 h-20 rounded-full bg-amber-500/30 group-hover:bg-amber-500/50 transition flex items-center justify-center mb-4">
          <span className="text-4xl">📷</span>
        </div>
        <h3 className="text-lg font-bold text-amber-400 text-center mb-2">{image.title}</h3>
        <p className="text-gray-400 text-sm text-center">{image.description}</p>
        <p className="text-xs text-amber-500 mt-4 font-semibold">{image.category}</p>
      </div>
    </div>
  );

  const Modal = ({ image, onClose }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-amber-500/40 rounded-lg max-w-2xl w-full">
        <div className="flex justify-between items-center p-6 border-b border-amber-500/20">
          <h3 className="text-2xl font-bold text-amber-400">{image.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="aspect-video bg-gradient-to-br from-amber-500/30 to-amber-600/30 border border-amber-500/40 rounded-lg flex items-center justify-center mb-6">
            <span className="text-8xl">📷</span>
          </div>
          <div>
            <p className="text-amber-400 font-semibold mb-2">Category: {image.category}</p>
            <p className="text-gray-300 text-lg">{image.description}</p>
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
            Gallery
          </h1>
          <p className="text-xl text-gray-300">
            Explore our state-of-the-art facilities and modern equipment
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {galleryImages.map((image) => (
              <ImageCard key={image.id} image={image} />
            ))}
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/40 rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-amber-400 mb-4">Experience Our Facilities in Person</h2>
            <p className="text-gray-300 mb-8">Visit Legacy Fitness Lounge to see all our equipment and world-class amenities</p>
            <a href="/contact" className="inline-block px-8 py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition">
              Schedule a Tour
            </a>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-24 px-4 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-amber-500 mb-12">Our Facilities Overview</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-amber-500/20 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-amber-400 mb-4">🏋️ Equipment</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ Premium Dumbbells (5kg-50kg)</li>
                <li>✓ Cardio Machines</li>
                <li>✓ Weight Training Racks</li>
                <li>✓ Cable Machines</li>
                <li>✓ Olympic Platforms</li>
                <li>✓ Functional Training Zone</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-amber-500/20 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-amber-400 mb-4">🏢 Gym Facilities</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ Spacious Training Floor</li>
                <li>✓ Well-Lit Environment</li>
                <li>✓ Modern Air Conditioning</li>
                <li>✓ Safety Equipment</li>
                <li>✓ Hydration Stations</li>
                <li>✓ Motivating Atmosphere</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-amber-500/20 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-amber-400 mb-4">🚿 Amenities</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ Clean Locker Rooms</li>
                <li>✓ Hot Water Showers</li>
                <li>✓ Secure Storage</li>
                <li>✓ Changing Facilities</li>
                <li>✓ Towel Service</li>
                <li>✓ Premium Toiletries</li>
              </ul>
            </div>
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

      {/* Image Modal */}
      {selectedImage && (
        <Modal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
}
