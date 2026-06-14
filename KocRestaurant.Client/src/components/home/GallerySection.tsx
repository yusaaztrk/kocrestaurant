import React from 'react';
import { useNavigate } from 'react-router-dom';

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: string;
  displayOrder: number;
}

interface GallerySectionProps {
  items: GalleryItem[];
}

export const GallerySection = React.forwardRef<HTMLDivElement, GallerySectionProps>(
  ({ items }, ref) => {
    const navigate = useNavigate();

    // Standard high-quality fallbacks if the gallery is not yet populated in the database
    const fallbacks = [
      { id: 'f1', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop', caption: 'Restoranımızın İç Tasarımı', category: 'İç Mekan' },
      { id: 'f2', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop', caption: 'Nefis Izgara Çeşitlerimiz', category: 'Yemekler' },
      { id: 'f3', imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop', caption: 'Özenle Hazırlanan Masalar', category: 'İç Mekan' },
      { id: 'f4', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop', caption: 'Sıcak Ev Yemekleri', category: 'Yemekler' },
      { id: 'f5', imageUrl: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=600&auto=format&fit=crop', caption: 'Güler Yüzlü Servis Ekibimiz', category: 'Hizmet' },
      { id: 'f6', imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&auto=format&fit=crop', caption: 'Tatlı ve Sütlaç Sunumları', category: 'Tatlılar' }
    ];

    const displayItems = items.length > 0 ? items.slice(0, 6) : fallbacks;

    return (
      <section ref={ref} className="py-24 bg-surface px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-secondary font-label-md tracking-widest uppercase mb-2 block">Kareler</span>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-4">Galeriden Lezzet Esintileri</h2>
          <div className="w-16 h-1 bg-secondary"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => navigate('/gallery')}
              className="group relative aspect-square overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
            >
              <img 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt={item.caption || 'Koç Restaurant'} 
                src={item.imageUrl} 
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-secondary-fixed-dim text-xs font-semibold uppercase tracking-wider mb-1">
                  {item.category || 'Galeri'}
                </span>
                <h3 className="text-white font-headline-md text-base font-semibold">
                  {item.caption || 'Koç Restaurant Görseli'}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <button 
            onClick={() => navigate('/gallery')}
            className="bg-surface hover:bg-surface-container border border-outline px-8 py-3.5 rounded-lg font-label-md text-xs uppercase tracking-wider text-center cursor-pointer transition-all active:scale-95 shadow-sm"
          >
            Tüm Galeriyi İnceleyin
          </button>
        </div>
      </section>
    );
  }
);

GallerySection.displayName = 'GallerySection';
