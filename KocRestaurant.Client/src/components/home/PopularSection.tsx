import React from 'react';
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

interface PopularSectionProps {
  popularItems: MenuItem[];
}

export const PopularSection = React.forwardRef<HTMLDivElement, PopularSectionProps>(
  ({ popularItems }, ref) => {
    const navigate = useNavigate();

    return (
      <section ref={ref} className="py-24 bg-surface px-margin-mobile md:px-margin-desktop w-full">
        <div className="max-w-container-max mx-auto">
          {/* Header Row */}
          <div className="flex justify-between items-center border-b border-outline-variant/30 pb-6 mb-12">
            <h2 className="font-headline-lg text-headline-lg text-primary">Popüler Yemekler ve Fiyatlar</h2>
            <button 
              onClick={() => navigate('/menu')}
              className="hidden md:flex text-secondary font-label-md text-sm font-semibold tracking-wider items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer uppercase"
            >
              TÜMÜNÜ GÖR <span className="material-symbols-outlined notranslate text-xl" translate="no">trending_flat</span>
            </button>
          </div>

          {/* Items List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            {popularItems.length === 0 ? (
              // Local fallbacks if database is empty
              <>
                <div className="flex items-center justify-between group cursor-pointer" onClick={() => navigate('/menu')}>
                  <div className="flex items-center gap-6">
                    <img 
                      alt="Dana Bonfile" 
                      className="w-20 h-20 rounded-2xl object-cover bg-surface-variant flex-shrink-0 shadow-sm" 
                      src="https://images.unsplash.com/photo-1544025162-d76694265947?w=150&auto=format&fit=crop" 
                    />
                    <div>
                      <h3 className="font-headline-md text-lg text-primary group-hover:text-secondary transition-colors font-medium">Dana Bonfile</h3>
                      <p className="text-sm text-on-surface-variant mt-1.5">
                        Ana Yemekler • Favori Seçim
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="font-headline-md text-xl text-secondary font-semibold">850₺</span>
                    <div className="w-16 h-[3px] bg-secondary mt-2 rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between group cursor-pointer" onClick={() => navigate('/menu')}>
                  <div className="flex items-center gap-6">
                    <img 
                      alt="Levrek Marin" 
                      className="w-20 h-20 rounded-2xl object-cover bg-surface-variant flex-shrink-0 shadow-sm" 
                      src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=150&auto=format&fit=crop" 
                    />
                    <div>
                      <h3 className="font-headline-md text-lg text-primary group-hover:text-secondary transition-colors font-medium">Levrek Marin</h3>
                      <p className="text-sm text-on-surface-variant mt-1.5">
                        Ara Sıcaklar • Şefin Tavsiyesi
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="font-headline-md text-xl text-secondary font-semibold">620₺</span>
                    <div className="w-16 h-[3px] bg-secondary mt-2 rounded-full"></div>
                  </div>
                </div>
              </>
            ) : (
              // Dynamic Popular Items
              popularItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between group cursor-pointer"
                  onClick={() => navigate('/menu')}
                >
                  <div className="flex items-center gap-6">
                    <img 
                      alt={item.name} 
                      className="w-20 h-20 rounded-2xl object-cover bg-surface-variant flex-shrink-0 shadow-sm" 
                      src={item.imageUrl || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=150&auto=format&fit=crop"} 
                    />
                    <div>
                      <h3 className="font-headline-md text-lg text-primary group-hover:text-secondary transition-colors font-medium animate-none">
                        {item.name}
                      </h3>
                      <p className="text-sm text-on-surface-variant mt-1.5">
                        {item.category?.name || 'Menü'} • {item.isDailySpecial ? 'Günün Menüsü' : 'Favori Seçim'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="font-headline-md text-xl text-secondary font-semibold">{item.price}₺</span>
                    <div className="w-16 h-[3px] bg-secondary mt-2 rounded-full"></div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Mobile View All Button */}
          <div className="mt-10 flex md:hidden justify-center">
            <button
              onClick={() => navigate('/menu')}
              className="w-full bg-secondary text-on-secondary py-4 px-6 rounded-xl font-label-md text-sm font-semibold tracking-wider flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer uppercase shadow-md"
            >
              TÜMÜNÜ GÖR <span className="material-symbols-outlined notranslate text-xl" translate="no">trending_flat</span>
            </button>
          </div>
        </div>
      </section>
    );
  }
);

PopularSection.displayName = 'PopularSection';
