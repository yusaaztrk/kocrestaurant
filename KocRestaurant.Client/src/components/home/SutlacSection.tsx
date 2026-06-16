import React from 'react';

interface SutlacSectionProps {
  imageUrl?: string;
}

export const SutlacSection: React.FC<SutlacSectionProps> = ({ imageUrl }) => {
  const displayImage = imageUrl || "/sutlac_tatli_sunumu.png";
  return (
    <section className="bg-surface-container-lowest py-20 border-t border-surface-container/60">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-secondary font-label-md tracking-widest uppercase block">Geleneksel Tatlılarımız</span>
              <h2 className="font-display-lg text-3xl md:text-4xl text-primary leading-tight tracking-tight uppercase">
                Türkiye'nin En İyi Sütlacını Biz Yapıyoruz
              </h2>
              <div className="w-16 h-1 bg-secondary"></div>
            </div>

            <p className="font-body-lg text-on-surface-variant text-base md:text-lg leading-relaxed font-normal">
              Tartışılmaz, Türkiye'nin en iyi sütlacını biz yapıyoruz. Tamamen doğal, kendi hayvanlarımızın sütünü ve yumurtasını kullanarak yaptığımız sütlacımızı, 30 senelik tecrübemizle harmanlayarak müşterilerimizin beğenisine sunuyoruz.
            </p>

            {/* Highlight Badge */}
            <div className="inline-flex items-center gap-3 bg-secondary/10 border border-secondary/25 px-5 py-3 rounded-xl">
              <span className="material-symbols-outlined notranslate text-secondary text-2xl animate-pulse" translate="no">workspace_premium</span>
              <span className="font-headline-md text-sm text-secondary font-bold uppercase tracking-wider">
                30 Senelik Tecrübe
              </span>
            </div>

            {/* Extra Dessert Feature */}
            <div className="pt-6 border-t border-surface-container/70 mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined notranslate text-secondary text-2xl" translate="no">bakery_dining</span>
                <h3 className="font-headline-md text-lg text-primary uppercase tracking-wide">
                  Ev Yapımı Kadayıf
                </h3>
              </div>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                İçerisinde halis tereyağı ve çıtır ceviz bulunan günlük kadayıf tatlısı hazırlıyoruz. Hafif şerbeti, dengeli kıvamı ve ilk günkü tazeliğiyle bu geleneksel lezzeti misafirlerimizle buluşturuyoruz.
              </p>
            </div>
          </div>

          {/* Right Column: Image and Decorative Elements */}
          <div className="lg:col-span-5 relative group">
            {/* Background decorative glow */}
            <div className="absolute inset-0 bg-secondary/15 rounded-3xl blur-2xl -translate-x-2 translate-y-2 group-hover:scale-105 transition-transform duration-500"></div>
            
            {/* Image Wrapper */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-surface-container-high transition-transform duration-500 group-hover:-translate-y-1">
              <img 
                src={displayImage} 
                alt="Koç Restaurant Meşhur Fırın Sütlaç ve Ev Yapımı Kadayıf Sunumu"
                className="w-full h-[380px] object-cover transition-transform duration-700 group-hover:scale-103"
              />
              
              {/* Glassmorphic Overlay Tag */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/60 backdrop-blur-md border border-white/40 p-5 rounded-2xl flex justify-between items-center text-primary select-none shadow-lg">
                <div>
                  <h4 className="font-headline-md text-sm uppercase tracking-wider text-secondary font-bold">Meşhur Fırın Sütlaç</h4>
                  <p className="font-body-md text-xs text-on-surface-variant mt-1">Hakiki Taş Fırında Pişirilmiş</p>
                </div>
                <span className="material-symbols-outlined notranslate text-secondary text-3xl" translate="no">restaurant</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
