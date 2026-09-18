import React, { useState, useEffect } from 'react';
import { X, ZoomIn, Dumbbell, Video, Play, Sparkles } from 'lucide-react';
import { portalService } from '../services/portalService';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [customMedia, setCustomMedia] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  const defaultGalleryImages = [
    {
      id: 'default-1',
      category: "Leg Equipment",
      title: "Leg Press & Hack Squat Machine",
      description: "Heavy-duty plate-loaded hack squat & leg press machine with adjustable footplate and ergonomic back support.",
      src: "/gallery/hack_squat_leg_press.jpg",
      tag: "Strength Training",
      media_type: "photo"
    },
    {
      id: 'default-2',
      category: "Cardio Zone",
      title: "Focus Fitness Treadmill Console",
      description: "Commercial Focus Fitness treadmill equipped with incline settings, speed telemetry dashboard, and emergency safety control.",
      src: "/gallery/treadmill_console.jpg",
      tag: "Cardio & Endurance",
      media_type: "photo"
    },
    {
      id: 'default-3',
      category: "Cardio Zone",
      title: "Cardio & Endurance Station",
      description: "Spacious cardio deck featuring dual motorized treadmills, elliptical trainers, and upright stationary bikes.",
      src: "/gallery/cardio_workout_zone.jpg",
      tag: "Cardio & Endurance",
      media_type: "photo"
    },
    {
      id: 'default-4',
      category: "Leg Equipment",
      title: "Seated Leg Extension Machine",
      description: "Targeted quad isolation machine featuring padded leg rollers, stack weight selection, and adjustable seating position.",
      src: "/gallery/leg_extension_machine.jpg",
      tag: "Strength Training",
      media_type: "photo"
    },
    {
      id: 'default-5',
      category: "Upper Body",
      title: "Pec Fly & Rear Delt Machine",
      description: "Dual-function chest fly and rear deltoid machine with rubber matting floor for upper body conditioning.",
      src: "/gallery/pec_fly_chest_press.jpg",
      tag: "Upper Body Isolation",
      media_type: "photo"
    }
  ];

  useEffect(() => {
    fetchLiveGallery();
  }, []);

  const fetchLiveGallery = async () => {
    try {
      setLoadingMedia(true);
      const items = await portalService.getGalleryMedia();
      if (items && Array.isArray(items)) {
        const formatted = items.map(item => ({
          id: `custom-${item.id}`,
          category: item.category || 'Workout Room',
          title: item.title,
          description: item.description || 'Workout room photo/video uploaded by Legacy Gym Admin.',
          src: item.media_url || item.file_url || '/gallery/hack_squat_leg_press.jpg',
          tag: item.tag || 'Coach Upload',
          media_type: item.media_type || 'photo',
          isCustom: true
        }));
        setCustomMedia(formatted);
      }
    } catch (err) {
      console.error('Failed to load dynamic gallery media', err);
    } finally {
      setLoadingMedia(false);
    }
  };

  const allGalleryItems = [...customMedia, ...defaultGalleryImages];

  const categories = ["All", "Workout Room", "Leg Equipment", "Cardio Zone", "Upper Body", "CrossFit & Functional"];

  const filteredImages = activeCategory === "All"
    ? allGalleryItems
    : allGalleryItems.filter(img => img.category.toLowerCase().includes(activeCategory.toLowerCase()));

  const ImageCard = ({ image }) => (
    <div 
      onClick={() => setSelectedImage(image)}
      className="group cursor-pointer relative overflow-hidden rounded-xl border border-amber-500/30 hover:border-amber-400 transition-all duration-300 bg-zinc-900 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between"
    >
      <div className="aspect-[4/3] overflow-hidden relative bg-black">
        {image.media_type === 'video' ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-amber-400 p-4 text-center space-y-2">
            <Video className="w-12 h-12 text-amber-500 animate-pulse" />
            <span className="text-xs font-bold text-zinc-300">Workout Video Stream</span>
          </div>
        ) : (
          <img 
            src={image.src} 
            alt={image.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            onError={(e) => { e.target.src = '/gallery/hack_squat_leg_press.jpg'; }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-40 transition" />
        
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-3 py-1 text-xs font-bold bg-amber-500 text-black rounded-full shadow-md">
            {image.category}
          </span>
          {image.isCustom && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Coach Media
            </span>
          )}
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/40">
          <div className="p-3 bg-amber-500 text-black rounded-full shadow-lg transform group-hover:scale-110 transition duration-300">
            {image.media_type === 'video' ? <Play className="w-6 h-6 fill-black" /> : <ZoomIn className="w-6 h-6" />}
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
          <span className="underline group-hover:text-amber-300">
            {image.media_type === 'video' ? 'Play Video →' : 'View Full Photo →'}
          </span>
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
        className="relative max-w-4xl w-full bg-zinc-900 border border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-amber-500 hover:text-black text-amber-400 rounded-full transition duration-300"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="max-h-[70vh] overflow-hidden bg-black flex items-center justify-center">
          {image.media_type === 'video' ? (
            <div className="w-full p-8 text-center space-y-4">
              <Video className="w-16 h-16 text-amber-500 mx-auto" />
              <h3 className="text-xl font-bold text-white">{image.title}</h3>
              <p className="text-sm text-zinc-400">{image.description}</p>
              <a
                href={image.src}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition"
              >
                <Play className="w-4 h-4 fill-black" /> Open Video Link / Stream
              </a>
            </div>
          ) : (
            <img 
              src={image.src} 
              alt={image.title} 
              className="max-h-[70vh] w-auto object-contain"
              onError={(e) => { e.target.src = '/gallery/hack_squat_leg_press.jpg'; }}
            />
          )}
        </div>

        <div className="p-6 bg-zinc-900 border-t border-amber-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="px-3 py-1 text-xs font-bold bg-amber-500 text-black rounded-full">
              {image.category}
            </span>
            <span className="text-xs font-medium text-amber-400">
              {image.tag}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{image.title}</h2>
          <p className="text-gray-300 text-sm leading-relaxed">{image.description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="relative py-20 bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-black border-b border-amber-500/20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0,transparent_100%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-widest mb-4">
            <Dumbbell className="w-4 h-4" /> World-Class Equipment Showcase
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-6">
            WORKOUT ROOM & <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">GYM GALLERY</span>
          </h1>

          <p className="max-w-2xl mx-auto text-gray-400 text-base sm:text-lg leading-relaxed">
            Explore our state-of-the-art strength machinery, cardio deck, leg isolation stations, and free weight training zones uploaded by our coaching staff.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-amber-500 text-black shadow-lg shadow-amber-500/25 scale-105"
                    : "bg-zinc-900 text-gray-400 hover:text-white border border-zinc-800 hover:border-amber-500/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredImages.map((img) => (
            <ImageCard key={img.id} image={img} />
          ))}
        </div>
      </main>

      {selectedImage && (
        <Modal image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
}
