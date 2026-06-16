import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toSlug } from '../../utils/slugify';
import { Footer } from '../../components/layout/Footer';
import { useSEO } from '../../hooks/useSEO';

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface MenuItemAttribute {
  id: string;
  name: string;
  value: string;
}

interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isDailySpecial: boolean;
  isAvailable: boolean;
  attributes: MenuItemAttribute[];
}

export const Menu: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    restaurantName: 'KOÇ RESTAURANT',
    address: 'Etiler, Nispetiye Cad. No: 12, İstanbul',
    phone: '+90 (212) 555 01 01',
    email: 'rezervasyon@kocrestaurant.com',
    workingHours: 'Her Gün: 12:00 - 00:00',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_9V67s22Q7fN00efDph6D7s5iT6MwtFwZjBLChNtBIxQ6vVLRd5DAGVXxhWThDlZ9iSGeAGwwBG67-In0G9tCX5-n_rNizLA_8GKLCWY_USrub3bEZh6r5-KC7VcfEIO-oGGRFlLhZ766sgmojIsdX9hzppjf7LhLvfPexccNjtaTn85c2dYsz8DPbtBCfPxbC7VNdYkh6nIbQAkFTdhiHgoGr30FBuCTO4LVF0hbdUT3I4t5_tSR4o9lW0pV1QGiZronkxxVrKMt',
    facebookUrl: '#',
    instagramUrl: '#'
  });

  // Dynamic Category SEO Meta Integration
  const visibleCategories = useMemo(() => categories.filter(category =>
    menuItems.some(item => item.categoryId === category.id)
  ), [categories, menuItems]);
  const currentCategoryObj = visibleCategories.find(c => c.id === selectedCategory);
  const categoryName = currentCategoryObj ? currentCategoryObj.name : 'Günün Lezzetleri';

  useSEO({
    title: `${categoryName} Menüsü | ${settings.restaurantName}`,
    description: `${settings.restaurantName} zengin menüsü: ${categoryName} kategorisindeki meşhur fırın sütlaçlarımız, geleneksel Türk yemeklerimiz ve tatlı çeşitlerimizi inceleyin.`,
    keywords: `koç restaurant menü, ${categoryName.toLowerCase()} menüsü, fırın sütlaç fiyatı, samsun yöresel yemekler`,
    ogImage: currentCategoryObj?.imageUrl || settings.logoUrl || `${window.location.origin}/restaurant-hero.png`
  });

  // Read category from URL query parameters (slug style)
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (!catParam) {
      setSelectedCategory('all');
      return;
    }

    if (categories.length > 0 && menuItems.length > 0) {
      const matchedCategory = visibleCategories.find(c => toSlug(c.name) === catParam);
      if (matchedCategory) {
        setSelectedCategory(matchedCategory.id);
      } else {
        // If query param is invalid/not found, delete it to keep URL clean and safe
        setSelectedCategory('all');
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('category');
        setSearchParams(nextParams);
      }
    }
  }, [searchParams, categories, menuItems, visibleCategories, setSearchParams]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const settingsRes = await axios.get('/settings');
        if (settingsRes.data) setSettings(settingsRes.data);

        const catRes = await axios.get('/categories');
        setCategories(catRes.data);

        const menuRes = await axios.get('/menu/specials');
        setMenuItems(menuRes.data);
      } catch (err) {
        console.error('Error loading menu page data', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        searchParams.set('category', toSlug(category.name));
      } else {
        searchParams.delete('category');
      }
    }
    setSearchParams(searchParams);
  };

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.categoryId === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Menu Header banner */}
      <section className="pt-32 pb-16 bg-surface-container-low w-full">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <span className="text-secondary font-label-md tracking-widest uppercase mb-2 block">Gastronomi Seçkisi</span>
          <h1 className="font-display-lg text-4xl text-primary mb-6">Restaurant Menümüz</h1>
          <div className="w-16 h-1 bg-secondary mx-auto"></div>
        </div>
      </section>

      {/* Categories Horizontal Navigation Bar (Horizontal Scroll Layout) */}
      <section className="bg-surface py-8 w-full border-b border-surface-container-high">
        <div className="max-w-container-max mx-auto">
          <div className="flex gap-4 overflow-x-auto pb-2 px-margin-mobile md:px-margin-desktop no-scrollbar justify-start md:justify-center w-full">
            {/* "Tüm Yemekler" Box */}
            <button
              onClick={() => handleCategorySelect('all')}
              className={`flex-shrink-0 w-32 sm:w-36 flex flex-col items-center rounded-2xl border transition-all duration-300 active:scale-98 cursor-pointer overflow-hidden p-0 pb-3 ${
                selectedCategory === 'all'
                  ? 'border-secondary bg-surface-container-low shadow-sm'
                  : 'border-outline-variant/30 bg-surface-container-lowest hover:bg-surface-container-low hover:border-outline-variant/60'
              }`}
            >
              <div className="w-full aspect-square overflow-hidden bg-surface-container mb-2.5">
                <img
                  src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=300&auto=format&fit=crop"
                  alt="Tüm Yemekler"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-center leading-tight px-2 ${
                selectedCategory === 'all' ? 'text-secondary' : 'text-on-surface-variant'
              }`}>
                Tüm Yemekler
              </span>
            </button>

            {/* Dynamic Categories Boxes */}
            {visibleCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`flex-shrink-0 w-32 sm:w-36 flex flex-col items-center rounded-2xl border transition-all duration-300 active:scale-98 cursor-pointer overflow-hidden p-0 pb-3 ${
                  selectedCategory === category.id
                    ? 'border-secondary bg-surface-container-low shadow-sm'
                    : 'border-outline-variant/30 bg-surface-container-lowest hover:bg-surface-container-low hover:border-outline-variant/60'
                }`}
              >
                <div className="w-full h-28 sm:h-32 overflow-hidden bg-surface-container mb-2.5 flex items-center justify-center">
                  <img
                    src={category.imageUrl || "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop"}
                    alt={category.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-center leading-tight px-2 w-full whitespace-normal break-words ${
                  selectedCategory === category.id ? 'text-secondary' : 'text-on-surface-variant'
                }`} title={category.name}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Grid Items */}
      <main className="flex-1 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 w-full">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-24">
            <span className="material-symbols-outlined notranslate text-5xl text-outline-variant" translate="no">restaurant_menu</span>
            <p className="text-on-surface-variant mt-4 font-body-md">Bugünün menüsünde bu kategori için aktif yemek bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                onClick={() => item.isAvailable && setSelectedItem(item)}
                className={`bg-surface-container-lowest border border-surface-container rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative ${
                  !item.isAvailable ? 'opacity-65 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div className="aspect-[4/3] overflow-hidden relative bg-surface-container">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt={item.name} 
                    src={item.imageUrl || "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop"} 
                  />
                  {item.isDailySpecial && (
                    <span className="absolute top-4 left-4 bg-secondary text-on-secondary px-3 py-1 rounded-sm text-[10px] uppercase font-label-md tracking-wider">
                      Şefin Seçimi
                    </span>
                  )}
                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="bg-red-600/90 text-white font-headline-md font-bold px-4 py-2 rounded-sm text-sm uppercase tracking-widest border border-red-500/50 shadow-md">
                        TÜKENDİ
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-baseline mb-2 gap-4">
                      <h3 className="font-headline-md text-lg text-primary group-hover:text-secondary transition-colors truncate">{item.name}</h3>
                      <span className="font-headline-md text-lg text-secondary flex-shrink-0">{item.price}₺</span>
                    </div>
                    <p className="text-on-surface-variant font-body-md text-sm mb-4 leading-relaxed">{item.description}</p>
                  </div>
                  
                  {/* Dynamic Attributes Chips */}
                  {item.attributes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-surface-container/50">
                      {item.attributes.slice(0, 3).map((attr) => (
                        <span key={attr.id} className="bg-surface-container-low text-on-surface-variant text-[11px] font-medium px-2 py-0.5 rounded-full">
                          {attr.name}: {attr.value}
                        </span>
                      ))}
                      {item.attributes.length > 3 && (
                        <span className="text-on-surface-variant text-[11px] font-semibold px-2 py-0.5">
                          +{item.attributes.length - 3} daha
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="bg-surface-container-lowest max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl border border-surface-container animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-[16/9] relative bg-surface-container">
              <img className="w-full h-full object-cover" alt={selectedItem.name} src={selectedItem.imageUrl || "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop"} />
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-md"
              >
                <span className="material-symbols-outlined notranslate text-lg" translate="no">close</span>
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-baseline mb-4 gap-4">
                <h2 className="font-headline-lg text-2xl text-primary">{selectedItem.name}</h2>
                <span className="font-headline-md text-2xl text-secondary">{selectedItem.price}₺</span>
              </div>
              
              <p className="text-on-surface-variant font-body-md text-base leading-relaxed mb-6">{selectedItem.description}</p>
              
              {selectedItem.attributes.length > 0 && (
                <div>
                  <h4 className="font-label-md text-xs text-primary uppercase tracking-wider mb-3">Yemek Özellikleri & Malzemeler</h4>
                  <div className="bg-surface-container-low rounded-xl p-4 border border-surface-container/60 space-y-2.5">
                    {selectedItem.attributes.map((attr) => (
                      <div key={attr.id} className="flex justify-between text-sm">
                        <span className="font-medium text-on-surface-variant">{attr.name}</span>
                        <span className="font-semibold text-primary text-right pl-4">{attr.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <button 
                onClick={() => setSelectedItem(null)}
                className="mt-8 w-full bg-primary text-on-primary font-label-md py-4 rounded-lg hover:opacity-90 active:scale-95 transition-all"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer 
        settings={settings}
        activePage="menu"
      />
    </div>
  );
};
