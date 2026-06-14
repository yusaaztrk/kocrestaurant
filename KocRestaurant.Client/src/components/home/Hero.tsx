import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isDailySpecial: boolean;
  isAvailable: boolean;
  category?: Category;
}

export interface HeroSlide {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
}

interface HeroProps {
  dailySpecial: MenuItem | null;
  slides: HeroSlide[];
}

export const Hero: React.FC<HeroProps> = ({ dailySpecial, slides }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  // Fallback: If no slides are defined, render standard Günün Menüsü / default hero
  if (!slides || slides.length === 0) {
    return (
      <section className="relative h-[85vh] flex items-end pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            className="w-full h-full object-cover" 
            alt="Koç Restaurant Sunumu" 
            src={dailySpecial?.imageUrl || "/restaurant-hero.png"} 
          />
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        <div className="relative w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pb-24 text-white">
          <div className="max-w-2xl">
            <span className="inline-block bg-secondary text-on-secondary px-3 py-1 rounded-sm text-label-md mb-6 uppercase tracking-widest">
              Günün Menüsü
            </span>
            <h1 className="font-display-lg text-3xl md:text-display-lg mb-6 leading-tight flex flex-wrap items-center gap-4">
              {dailySpecial?.name || "Geleneksel Dokunuş, Modern Sunum"}
              {dailySpecial && !dailySpecial.isAvailable && (
                <span className="bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded uppercase tracking-widest border border-red-500/50 shadow-md animate-pulse">
                  Tükendi
                </span>
              )}
            </h1>
            <p className="font-body-lg text-base md:text-body-lg mb-8 opacity-90">
              {dailySpecial?.description || "Şefimizin özel seçkisiyle hazırlanan, taze baharatlar ve ağır ateşte pişmiş kuzu sırtı, trüf mantarlı patates püresi eşliğinde."}
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/menu')}
                className="bg-surface text-primary px-10 py-4 font-label-md rounded-lg hover:bg-secondary-fixed-dim transition-all cursor-pointer"
              >
                Şimdi Keşfet
              </button>
              <button 
                onClick={() => navigate('/gallery')}
                className="border border-secondary-fixed text-secondary-fixed px-10 py-4 font-label-md rounded-lg hover:bg-white/10 transition-all cursor-pointer"
              >
                Galeriye Göz At
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[85vh] flex items-end pt-20 overflow-hidden bg-black">
      {/* Slides mapping */}
      {slides.map((slide, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform flex items-end ${
              isActive 
                ? 'opacity-100 scale-100 z-10 pointer-events-auto' 
                : 'opacity-0 scale-105 z-0 pointer-events-none'
            }`}
          >
            <div className="absolute inset-0 overflow-hidden">
              <img 
                className="w-full h-full object-cover" 
                alt={slide.title} 
                src={slide.imageUrl} 
              />
              <div className="absolute inset-0 hero-gradient"></div>
            </div>
            
            <div className="relative w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pb-24 text-white z-20">
              <div className="max-w-2xl">
                <h2 className="font-display-lg text-3xl md:text-display-lg mb-6 leading-tight transition-all duration-700 delay-300 transform translate-y-0 opacity-100">
                  {slide.title}
                </h2>
                <p className="font-body-lg text-base md:text-body-lg mb-8 opacity-90 transition-all duration-700 delay-500">
                  {slide.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => navigate('/menu')}
                    className="bg-surface text-primary px-10 py-4 font-label-md rounded-lg hover:bg-secondary-fixed-dim transition-all cursor-pointer shadow-md"
                  >
                    Menüyü Gör
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrow buttons */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/35 hover:bg-secondary text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer border border-white/10"
            aria-label="Önceki Slayt"
          >
            <span className="material-symbols-outlined notranslate text-2xl" translate="no">arrow_back_ios_new</span>
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/35 hover:bg-secondary text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer border border-white/10"
            aria-label="Sonraki Slayt"
          >
            <span className="material-symbols-outlined notranslate text-2xl" translate="no">arrow_forward_ios</span>
          </button>
        </>
      )}

      {/* Indicators Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex 
                  ? 'bg-secondary w-8' 
                  : 'bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Slayt ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
