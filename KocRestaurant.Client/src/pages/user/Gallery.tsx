import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Footer } from '../../components/layout/Footer';
import { useSEO } from '../../hooks/useSEO';

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: string;
  displayOrder: number;
}

interface Settings {
  restaurantName: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  logoUrl: string;
  facebookUrl: string;
  instagramUrl: string;
}

const categoryTranslations: { [key: string]: string } = {
  'All': 'Tümü',
  'General': 'Genel',
  'Food': 'Yemekler',
  'Interior': 'İç Mekan',
  'Events': 'Etkinlikler'
};

export const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<Settings>({
    restaurantName: 'KOÇ RESTAURANT',
    address: 'Etiler, Nispetiye Cad. No: 12, İstanbul',
    phone: '+90 (212) 555 01 01',
    email: 'rezervasyon@kocrestaurant.com',
    workingHours: 'Her Gün: 12:00 - 00:00',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_9V67s22Q7fN00efDph6D7s5iT6MwtFwZjBLChNtBIxQ6vVLRd5DAGVXxhWThDlZ9iSGeAGwwBG67-In0G9tCX5-n_rNizLA_8GKLCWY_USrub3bEZh6r5-KC7VcfEIO-oGGRFlLhZ766sgmojIsdX9hzppjf7LhLvfPexccNjtaTn85c2dYsz8DPbtBCfPxbC7VNdYkh6nIbQAkFTdhiHgoGr30FBuCTO4LVF0hbdUT3I4t5_tSR4o9lW0pV1QGiZronkxxVrKMt',
    facebookUrl: '#',
    instagramUrl: '#'
  });

  // Dynamic Category Gallery SEO Meta Integration
  const categoryName = selectedCategory === 'All' ? 'Tüm Fotoğraflar' : (categoryTranslations[selectedCategory] || selectedCategory);

  useSEO({
    title: `Fotoğraf Galerisi - ${categoryName} | ${settings.restaurantName}`,
    description: `${settings.restaurantName} fotoğraf galerisi: ${categoryName} kategorisinde yer alan taş fırın sütlaçlarımız, şık iç mekanımız ve lezzetli tabaklarımızdan en özel kareleri görün.`,
    keywords: `koç restaurant galeri, fırın sütlaç fotoğrafları, karadeniz mutfağı resimleri, ${categoryName.toLowerCase()} resimleri`,
    ogImage: items.find(item => item.category === selectedCategory)?.imageUrl || settings.logoUrl || `${window.location.origin}/restaurant-hero.png`
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const settingsRes = await axios.get('/settings');
        if (settingsRes.data) {
          setSettings(settingsRes.data);
        }

        const galleryRes = await axios.get('/gallery');
        const galleryItems: GalleryItem[] = galleryRes.data;
        // Sort items by displayOrder ascending
        galleryItems.sort((a, b) => a.displayOrder - b.displayOrder);
        setItems(galleryItems);

        // Determine unique categories
        const uniqueDbCategories = Array.from(new Set(galleryItems.map(item => item.category)));
        const finalCategories = ['All'];
        
        // Match specific ordering: General, Food, Interior, Events, then others
        const order = ['General', 'Food', 'Interior', 'Events'];
        for (const o of order) {
          if (uniqueDbCategories.includes(o)) {
            finalCategories.push(o);
          }
        }
        for (const c of uniqueDbCategories) {
          if (!order.includes(c)) {
            finalCategories.push(c);
          }
        }
        setCategories(finalCategories);
      } catch (err) {
        console.error('Error loading gallery data', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter(item => item.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Gallery Header Banner */}
      <section className="pt-32 pb-16 bg-surface-container-low w-full">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <span className="text-secondary font-label-md tracking-widest uppercase mb-2 block">Koç Restaurant Dünyası</span>
          <h1 className="font-display-lg text-4xl text-primary mb-6">Fotoğraf Galerisi</h1>
          <div className="w-16 h-1 bg-secondary mx-auto"></div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-surface py-6 w-full border-b border-surface-container-high">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex justify-center">
          <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full font-label-md text-xs uppercase tracking-wider transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-secondary text-white shadow-md'
                    : 'bg-surface-container-lowest text-on-surface border border-outline-variant hover:bg-surface-container-low hover:border-outline-variant-high'
                }`}
              >
                {categoryTranslations[cat] || cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-12">
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-24 text-on-surface-variant font-body-md">
            <span className="material-symbols-outlined notranslate text-4xl mb-4 block text-outline-variant" translate="no">photo_library</span>
            Bu kategoride henüz fotoğraf bulunmuyor.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveImage(item)}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md bg-surface-container border border-surface-container/60 transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={item.caption || 'Koç Restaurant'}
                  src={item.imageUrl}
                  loading="lazy"
                />
                
                {/* Hover overlay with glassmorphic style description */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-[10px] font-semibold text-white bg-secondary/90 backdrop-blur-sm px-2.5 py-1 rounded uppercase tracking-wider self-start mb-2">
                    {categoryTranslations[item.category] || item.category}
                  </span>
                  <p className="text-white font-body-md text-sm truncate drop-shadow-sm">
                    {item.caption || 'Koç Restaurant'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveImage(null)}
        >
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-6 right-6 text-white hover:text-secondary transition-all flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-full select-none"
          >
            <span className="material-symbols-outlined notranslate text-lg" translate="no">close</span>
            <span className="text-xs uppercase font-semibold tracking-wider font-label-md">Kapat</span>
          </button>

          <div
            className="max-w-5xl max-h-[75vh] w-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 border border-white/5"
              alt={activeImage.caption || 'Koç Restaurant'}
              src={activeImage.imageUrl}
            />
          </div>

          <div className="text-center px-4 mt-6 max-w-2xl select-none flex flex-col items-center">
            <span className="text-[10px] font-semibold text-secondary-fixed bg-secondary-fixed-dim/20 backdrop-blur-sm px-3 py-1 rounded-full uppercase tracking-widest mb-3">
              {categoryTranslations[activeImage.category] || activeImage.category}
            </span>
            {activeImage.caption && (
              <p className="text-white/90 text-sm md:text-base font-body-md max-w-xl">
                {activeImage.caption}
              </p>
            )}
          </div>
        </div>
      )}

      <Footer 
        settings={settings}
        activePage="gallery"
      />
    </div>
  );
};

export default Gallery;
