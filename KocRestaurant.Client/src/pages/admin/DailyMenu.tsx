import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Category {
  id: string;
  name: string;
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
  displayOrder: number;
  category?: Category;
}

export const DailyMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });

  const loadMenu = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/menu');
      setMenuItems(response.data);
    } catch (err) {
      console.error('Error loading menu items', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const toggleDailySpecial = async (item: MenuItem) => {
    const updatedItem = {
      ...item,
      isDailySpecial: !item.isDailySpecial
    };

    try {
      await axios.put(`/menu/${item.id}`, updatedItem);
      setMenuItems(prev => prev.map(m => m.id === item.id ? { ...m, isDailySpecial: updatedItem.isDailySpecial } : m));
      showStatus('success', `"${item.name}" günün menüsü durumu güncellendi.`);
    } catch (err) {
      console.error('Error updating special status', err);
      showStatus('error', 'Durum güncellenirken bir hata oluştu.');
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    const updatedItem = {
      ...item,
      isAvailable: !item.isAvailable
    };

    try {
      await axios.put(`/menu/${item.id}`, updatedItem);
      setMenuItems(prev => prev.map(m => m.id === item.id ? { ...m, isAvailable: updatedItem.isAvailable } : m));
      showStatus('success', `"${item.name}" stok durumu güncellendi.`);
    } catch (err) {
      console.error('Error updating stock status', err);
      showStatus('error', 'Stok durumu güncellenirken bir hata oluştu.');
    }
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    const specials = menuItems.filter(m => m.isDailySpecial).sort((a, b) => a.displayOrder - b.displayOrder);
    
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === specials.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const item1 = specials[index];
    const item2 = specials[targetIndex];

    // Swap displayOrder
    const order1 = item1.displayOrder;
    item1.displayOrder = item2.displayOrder;
    item2.displayOrder = order1;

    try {
      await Promise.all([
        axios.put(`/menu/${item1.id}`, item1),
        axios.put(`/menu/${item2.id}`, item2)
      ]);
      
      showStatus('success', 'Sıralama başarıyla güncellendi.');
      loadMenu(); // Reload lists
    } catch (err) {
      console.error('Error updating display order', err);
      showStatus('error', 'Sıralama güncellenirken bir hata oluştu.');
    }
  };

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => {
      setStatusMsg({ type: null, text: '' });
    }, 3500);
  };

  const dailySpecials = menuItems
    .filter(m => m.isDailySpecial)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const nonSpecials = menuItems.filter(m => !m.isDailySpecial);

  return (
    <div className="animate-in fade-in duration-200">
      {/* Header */}
      <header className="mb-12">
        <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Günlük Menü Yönetimi</h2>
        <p className="font-body-md text-on-surface-variant text-sm mt-1">Günün menüsünde (şefin özel seçkisi) yer alacak yemekleri ve bunların sıralamasını buradan düzenleyin.</p>
      </header>

      {statusMsg.text && (
        <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${
          statusMsg.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {statusMsg.text}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Active specials (sorting) */}
          <div className="lg:col-span-8 bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-surface-container/60 card-elevation">
            <h3 className="font-headline-md text-xl text-primary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">star</span>
              Günün Menüsü Akışı ({dailySpecials.length})
            </h3>

            {dailySpecials.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-outline-variant/50 rounded-xl p-8">
                <span className="material-symbols-outlined text-4xl text-outline-variant">today</span>
                <p className="text-sm text-on-surface-variant mt-2 font-medium">Günün menüsünde aktif yemek bulunmuyor.</p>
                <p className="text-xs text-on-surface-variant/80 mt-1">Yandaki listeden ekleme yapabilirsiniz.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dailySpecials.map((item, index) => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-surface-container bg-surface p-4 rounded-xl shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                      {/* Sort arrows */}
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <button 
                          disabled={index === 0}
                          onClick={() => moveItem(index, 'up')}
                          className="text-on-surface-variant hover:text-secondary disabled:opacity-30 p-0.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-lg">arrow_drop_up</span>
                        </button>
                        <button 
                          disabled={index === dailySpecials.length - 1}
                          onClick={() => moveItem(index, 'down')}
                          className="text-on-surface-variant hover:text-secondary disabled:opacity-30 p-0.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-lg">arrow_drop_down</span>
                        </button>
                      </div>

                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-variant flex-shrink-0 border border-outline-variant/30">
                        <img className="w-full h-full object-cover" alt={item.name} src={item.imageUrl || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=120&auto=format&fit=crop"} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="inline-block bg-secondary-fixed/50 text-on-secondary-fixed text-[10px] font-semibold px-2 py-0.5 rounded uppercase mb-1">
                          {item.category?.name || 'Yemek'}
                        </span>
                        <h4 className="font-label-md text-sm text-primary truncate" title={item.name}>{item.name}</h4>
                        <p className="text-xs text-on-surface-variant font-medium">{item.price}₺</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end sm:justify-start gap-2 border-t border-surface-container/60 sm:border-none pt-3 sm:pt-0 w-full sm:w-auto flex-shrink-0">
                      <button
                        onClick={() => toggleAvailability(item)}
                        className={`p-2 px-3 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold uppercase cursor-pointer ${
                          item.isAvailable 
                            ? 'text-green-600 hover:bg-green-50' 
                            : 'text-amber-600 hover:bg-amber-50'
                        }`}
                        title="Stok durumunu değiştirmek için tıklayın"
                      >
                        <span className="material-symbols-outlined text-base">
                          {item.isAvailable ? 'check_circle' : 'block'}
                        </span>
                        {item.isAvailable ? 'Stokta' : 'Tükendi'}
                      </button>

                      <button 
                        onClick={() => toggleDailySpecial(item)}
                        className="text-red-600 hover:bg-red-50 p-2 px-3 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold uppercase ml-auto sm:ml-0 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">remove_circle</span>
                        Menüden Çıkar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add menu items to daily specials */}
          <div className="lg:col-span-4 bg-surface-container p-6 md:p-8 rounded-2xl border border-outline-variant/30 flex flex-col gap-6">
            <div>
              <h3 className="font-headline-md text-lg text-primary">Tüm Yemekler Listesi</h3>
              <p className="text-xs text-on-surface-variant mt-1">Günün menüsüne dahil etmek istediğiniz yemeği seçin.</p>
            </div>

            {nonSpecials.length === 0 ? (
              <p className="text-xs text-on-surface-variant">Tüm yemekler zaten günün menüsünde.</p>
            ) : (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1 no-scrollbar">
                {nonSpecials.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-surface-container-lowest border border-surface-container p-3.5 rounded-xl">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-lg overflow-hidden bg-surface-variant flex-shrink-0 border border-outline-variant/30">
                        <img className="w-full h-full object-cover" alt={item.name} src={item.imageUrl || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=120&auto=format&fit=crop"} />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-label-md text-xs text-primary truncate" title={item.name}>{item.name}</h5>
                        <p className="text-[11px] text-on-surface-variant">{item.price}₺</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleDailySpecial(item)}
                      className="bg-primary text-on-primary hover:opacity-90 active:scale-95 text-[10px] font-semibold uppercase tracking-wide px-3 py-2 rounded-lg transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      Ekle
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
