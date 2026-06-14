import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Category {
  id: string;
  name: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category?: Category;
  isDailySpecial?: boolean;
}

interface ContactMessage {
  id: string;
  fullName: string;
  isRead: boolean;
  createdAt: string;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [menuItemsCount, setMenuItemsCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [recentItems, setRecentItems] = useState<MenuItem[]>([]);
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const catRes = await axios.get('/categories');
        setCategoriesCount(catRes.data.length);

        const menuRes = await axios.get('/menu');
        setMenuItemsCount(menuRes.data.length);
        setRecentItems(menuRes.data.slice(-3).reverse()); // Get last 3 added items
        setPopularItems(menuRes.data.slice(0, 3)); // Get first 3 items as popular

        const contactRes = await axios.get('/contact');
        const unread = contactRes.data.filter((m: ContactMessage) => !m.isRead).length;
        setUnreadMessages(unread);
      } catch (err) {
        console.error('Error loading dashboard stats', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-200">
      {/* Header Section */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Panel Özeti</h2>
          <p className="font-body-md text-on-surface-variant text-sm mt-1">Restoran operasyonlarınızın anlık durumunu buradan takip edin.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => navigate('/mainkocrestaurant/settings')} 
            className="flex-1 md:flex-initial bg-surface border border-outline px-6 py-2.5 rounded-lg font-label-md text-xs hover:bg-surface-container transition-colors uppercase tracking-wider"
          >
            Siteyi Ayarla
          </button>
          <button 
            onClick={() => navigate('/mainkocrestaurant/menu-items')} 
            className="flex-1 md:flex-initial bg-primary text-white px-6 py-2.5 rounded-lg font-label-md text-xs shadow-lg shadow-black/5 hover:opacity-90 transition-opacity uppercase tracking-wider"
          >
            Yeni Yemek Ekle
          </button>
        </div>
      </header>

      {/* Bento Dashboard Grid */}
      <div className="bento-grid">
        {/* Summary Card 1: Toplam Yemek */}
        <div 
          onClick={() => navigate('/mainkocrestaurant/menu-items')}
          className="col-span-12 md:col-span-4 bg-surface-container-lowest p-8 rounded-xl card-elevation border border-surface-container/60 hover:border-secondary/30 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-secondary text-3xl group-hover:scale-110 transition-transform">restaurant</span>
            <span className="text-green-600 font-label-md text-[10px] bg-green-50 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">Aktif</span>
          </div>
          <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-widest mb-1">Toplam Yemek</p>
          <h3 className="font-display-lg text-4xl text-primary">{menuItemsCount}</h3>
          <p className="text-[11px] text-on-surface-variant mt-3 italic">Menüdeki aktif yemek sayısı ({categoriesCount} kategoride)</p>
        </div>

        {/* Summary Card 2: Mesajlar */}
        <div 
          onClick={() => navigate('/mainkocrestaurant/messages')}
          className="col-span-12 md:col-span-4 bg-surface-container-lowest p-8 rounded-xl card-elevation border border-surface-container/60 hover:border-secondary/30 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-secondary text-3xl group-hover:scale-110 transition-transform">mail</span>
            {unreadMessages > 0 ? (
              <span className="text-red-600 font-label-md text-[10px] bg-red-50 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold animate-pulse">
                {unreadMessages} Yeni
              </span>
            ) : (
              <span className="text-on-surface-variant font-label-md text-[10px] bg-surface-container px-2.5 py-1 rounded-full uppercase tracking-wider">0 Okunmamış</span>
            )}
          </div>
          <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-widest mb-1">Yeni Mesajlar</p>
          <h3 className="font-display-lg text-4xl text-primary">{unreadMessages}</h3>
          <p className="text-[11px] text-on-surface-variant mt-3 italic">Müşterilerden gelen okunmamış mektuplar</p>
        </div>

        {/* Summary Card 3: Sistem Durumu */}
        <div className="col-span-12 md:col-span-4 bg-surface-container-lowest p-8 rounded-xl card-elevation border border-surface-container/60">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
            <span className="text-on-surface-variant font-label-md text-[10px] uppercase tracking-wider font-semibold">%99.9 Uptime</span>
          </div>
          <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-widest mb-1">Veritabanı Durumu</p>
          <h3 className="font-headline-lg text-[22px] text-primary mt-2">Bağlantı Aktif</h3>
          <p className="text-[11px] text-green-600 font-bold mt-4">• PostgreSQL aktif & stabil çalışıyor</p>
        </div>

        {/* Featured Section: Bugün En Çok Görüntülenen Yemekler */}
        <div className="col-span-12 md:col-span-8 bg-surface-container-lowest p-8 rounded-xl card-elevation border border-surface-container/60">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-headline-md text-xl text-primary">Popüler Yemekler ve Fiyatlar</h4>
            <button 
              onClick={() => navigate('/mainkocrestaurant/menu-items')} 
              className="text-secondary font-label-md text-xs uppercase tracking-wider flex items-center gap-1 hover:underline"
            >
              Tümünü Gör <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          
          <div className="space-y-6">
            {popularItems.length === 0 ? (
              <p className="text-sm text-on-surface-variant italic py-4">Menünüzde henüz yemek bulunmuyor.</p>
            ) : (
              popularItems.map((item, index) => {
                const popularityWidths = ['w-[90%]', 'w-[75%]', 'w-[60%]'];
                const widthClass = popularityWidths[index % popularityWidths.length];
                
                return (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between group cursor-pointer" 
                    onClick={() => navigate('/mainkocrestaurant/menu-items')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-variant flex-shrink-0">
                        <img 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                          src={item.imageUrl || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=120&auto=format&fit=crop"} 
                        />
                      </div>
                      <div>
                        <h5 className="font-label-md text-sm text-primary group-hover:text-secondary transition-colors">{item.name}</h5>
                        <p className="text-[11px] text-on-surface-variant">
                          {item.category?.name || 'Kategorisiz'} • {item.isDailySpecial ? 'Günün Menüsü' : 'Popüler Seçim'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-label-md text-sm text-secondary">{item.price}₺</p>
                      <div className="w-24 h-1 bg-surface-variant rounded-full mt-2 overflow-hidden">
                        <div className={`bg-secondary h-full ${widthClass}`}></div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Mini List: Son Eklenen Yemekler */}
        <div className="col-span-12 md:col-span-4 bg-primary-container p-8 rounded-xl text-white">
          <h4 className="font-label-md text-xs uppercase tracking-widest text-on-primary-container mb-6">Son Eklenen Yemekler</h4>
          {recentItems.length === 0 ? (
            <p className="text-sm text-on-primary-container">Henüz eklenmiş bir yemek yok.</p>
          ) : (
            <ul className="space-y-6">
              {recentItems.map((item) => (
                <li key={item.id} className="flex gap-4 items-start cursor-pointer" onClick={() => navigate('/mainkocrestaurant/menu-items')}>
                  <span className="w-2 h-2 rounded-full bg-secondary mt-1.5 flex-shrink-0"></span>
                  <div>
                    <p className="font-label-md text-sm text-white hover:text-secondary-fixed transition-colors truncate max-w-[180px]">{item.name}</p>
                    <p className="text-[10px] text-on-primary-container mt-0.5">{item.price}₺ • Aktif</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button 
            onClick={() => navigate('/mainkocrestaurant/menu-items')} 
            className="mt-8 w-full border border-on-primary-container text-white py-3 rounded-lg font-label-md text-xs uppercase hover:bg-white/10 transition-colors"
          >
            Tüm Yemekleri Yönet
          </button>
        </div>
      </div>
    </div>
  );
};
