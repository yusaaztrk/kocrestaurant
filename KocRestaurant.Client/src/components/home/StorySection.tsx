import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface StorySectionProps {
  title?: string;
  text?: string;
  images?: string;
}

export const StorySection: React.FC<StorySectionProps> = ({ title, text, images }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fallback defaults if database isn't fully configured yet
  const defaultTitle = "Koç Restaurant Hikayesi";
  const defaultText = "Şehrin kalbinde, gastronomi meraklılarına unutulmaz anlar yaşatmak amacıyla kurulan KOÇ RESTAURANT, geleneksel mutfak kültürünü modern dokunuşlar ve yenilikçi tekniklerle yeniden yorumluyor. Her bir tabağımızda, Anadolu'nun verimli topraklarından ve Ege'nin taze sularından özenle seçilen en kaliteli malzemelerin hikayesini anlatıyoruz. Alanında uzman şeflerimiz, mutfaktaki yaratıcılıklarını her detayı titizlikle planlanmış tariflerle buluşturuyor.";
  const defaultImages = [
    "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop"
  ];

  // Parse images from comma-separated string or use default list
  const imageList = images 
    ? images.split(',').map(url => url.trim()).filter(Boolean)
    : defaultImages;

  const displayTitle = title || defaultTitle;
  const displayText = text || defaultText;

  // Auto slide every 4 seconds if there are multiple images
  useEffect(() => {
    if (imageList.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % imageList.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [imageList.length]);

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % imageList.length);
  };

  const handlePrev = () => {
    setCurrentSlide(prev => (prev - 1 + imageList.length) % imageList.length);
  };

  return (
    <section className="py-24 bg-surface-container-low">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Story Description */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-secondary font-label-md tracking-widest uppercase mb-2 block">Restoranımız</span>
            <h2 className="font-display-lg text-3xl text-primary tracking-tight font-bold">{displayTitle}</h2>
            <div className="w-12 h-1 bg-secondary rounded"></div>
            
            <p className="font-body-md text-on-surface-variant leading-relaxed text-sm whitespace-pre-line">
              {displayText}
            </p>
            
            <div className="pt-4">
              <button 
                onClick={() => navigate('/about')}
                className="bg-primary text-on-primary hover:opacity-90 active:scale-95 px-8 py-3.5 rounded-lg font-label-md text-xs uppercase tracking-wider text-center cursor-pointer transition-all shadow-md flex items-center gap-2 group"
              >
                Daha Fazla Bilgi
                <span className="material-symbols-outlined notranslate text-sm group-hover:translate-x-1 transition-transform" translate="no">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Right Column: Dynamic Slider / Image Container */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] md:aspect-[16/11] w-full overflow-hidden rounded-3xl shadow-xl bg-surface-container-high border border-white/5 group-image-slider">
              
              {imageList.map((imgUrl, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <img
                    className="w-full h-full object-cover"
                    alt={`${displayTitle} Görsel - ${index + 1}`}
                    src={imgUrl}
                    loading="lazy"
                  />
                  {/* Subtle vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
              ))}

              {/* Slider Controls (Only if multiple images exist) */}
              {imageList.length > 1 && (
                <>
                  {/* Prev Button */}
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-secondary/90 transition-all flex items-center justify-center cursor-pointer active:scale-90"
                    aria-label="Önceki Görsel"
                  >
                    <span className="material-symbols-outlined notranslate" translate="no">chevron_left</span>
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-secondary/90 transition-all flex items-center justify-center cursor-pointer active:scale-90"
                    aria-label="Sonraki Görsel"
                  >
                    <span className="material-symbols-outlined notranslate" translate="no">chevron_right</span>
                  </button>

                  {/* Slider Dots Indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {imageList.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          index === currentSlide ? 'bg-secondary px-3' : 'bg-white/50 hover:bg-white'
                        }`}
                        aria-label={`Görsel ${index + 1}`}
                      ></button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
