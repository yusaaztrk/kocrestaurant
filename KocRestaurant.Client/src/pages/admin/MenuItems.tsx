import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Category {
  id: string;
  name: string;
}

interface MenuItemAttribute {
  id?: string;
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
  isPopular: boolean;
  isAvailable: boolean;
  displayOrder: number;
  attributes: MenuItemAttribute[];
  category?: Category;
}

export const MenuItems: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isDailySpecial, setIsDailySpecial] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [attributes, setAttributes] = useState<MenuItemAttribute[]>([]);
  
  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const catRes = await axios.get('/categories');
      setCategories(catRes.data);
      if (catRes.data.length > 0) {
        setCategoryId(catRes.data[0].id);
      }

      const menuRes = await axios.get('/menu');
      setItems(menuRes.data);
    } catch (err) {
      console.error('Error loading menu list data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setPrice(0);
    setImageUrl('');
    if (categories.length > 0) setCategoryId(categories[0].id);
    setIsDailySpecial(false);
    setIsPopular(false);
    setIsAvailable(true);
    setAttributes([]);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price);
    setImageUrl(item.imageUrl);
    setCategoryId(item.categoryId);
    setIsDailySpecial(item.isDailySpecial);
    setIsPopular(item.isPopular || false);
    setIsAvailable(item.isAvailable);
    setAttributes(item.attributes.map(a => ({ name: a.name, value: a.value })));
    setFormError(null);
    setIsModalOpen(true);
  };

  // Dynamic Specs/Attributes Handlers
  const addAttributeField = () => {
    setAttributes([...attributes, { name: '', value: '' }]);
  };

  const handleAttributeChange = (index: number, field: 'name' | 'value', val: string) => {
    const updated = [...attributes];
    updated[index][field] = val;
    setAttributes(updated);
  };

  const removeAttributeField = (index: number) => {
    setAttributes(attributes.filter((_, idx) => idx !== index));
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setImageUrl(response.data.url);
      showStatus('success', 'Resim başarıyla yüklendi.');
    } catch (err: any) {
      console.error('Upload error', err);
      const errorMsg = err.response?.data?.message || 'Resim yüklenirken bir hata oluştu.';
      setUploadError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  // Submit Handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0 || !categoryId) {
      setFormError('Lütfen Ad, Fiyat ve Kategori alanlarını eksiksiz doldurun.');
      return;
    }

    // Filter empty attributes
    const cleanAttributes = attributes.filter(a => a.name.trim() !== '' && a.value.trim() !== '');

    const payload = {
      id: editingItem ? editingItem.id : '00000000-0000-0000-0000-000000000000',
      categoryId,
      name,
      description,
      price,
      imageUrl,
      isDailySpecial,
      isPopular,
      isAvailable,
      displayOrder: editingItem ? editingItem.displayOrder : 0,
      attributes: cleanAttributes
    };

    try {
      if (editingItem) {
        await axios.put(`/menu/${editingItem.id}`, payload);
        showStatus('success', `"${name}" yemeği başarıyla güncellendi.`);
      } else {
        await axios.post('/menu', payload);
        showStatus('success', `"${name}" yemeği menüye eklendi.`);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      console.error('Error saving item', err);
      const msg = err.response?.data?.message || 'Veri kaydedilirken veritabanı hatası oluştu.';
      setFormError(msg);
    }
  };

  const handleDelete = async (id: string, itemName: string) => {
    if (!window.confirm(`"${itemName}" yemeğini menüden tamamen silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      await axios.delete(`/menu/${id}`);
      showStatus('success', `"${itemName}" yemeği silindi.`);
      loadData();
    } catch (err) {
      console.error('Error deleting menu item', err);
      showStatus('error', 'Yemek silinirken bir hata oluştu.');
    }
  };

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => {
      setStatusMsg({ type: null, text: '' });
    }, 3500);
  };

  return (
    <div className="animate-in fade-in duration-200">
      {/* Header */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Tüm Yemekler</h2>
          <p className="font-body-md text-on-surface-variant text-sm mt-1">Menünüzdeki tüm lezzetleri ekleyin, güncelleyin veya silin.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="w-full md:w-auto bg-primary text-on-primary font-label-md text-xs uppercase tracking-wider py-3.5 px-6 rounded-lg shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Yeni Yemek Ekle
        </button>
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
      ) : items.length === 0 ? (
        <div className="text-center py-24 bg-surface-container-lowest rounded-2xl border border-surface-container p-8">
          <span className="material-symbols-outlined text-5xl text-outline-variant">restaurant_menu</span>
          <p className="text-on-surface-variant mt-4 font-body-md">Menünüzde henüz hiçbir yemek bulunmuyor.</p>
        </div>
      ) : (
        /* Data Table */
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/60 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-surface-container text-xs text-on-surface-variant uppercase font-label-md tracking-wider">
                  <th className="p-5 font-semibold">Resim</th>
                  <th className="p-5 font-semibold">Yemek Adı</th>
                  <th className="p-5 font-semibold">Kategori</th>
                  <th className="p-5 font-semibold">Fiyat</th>
                  <th className="p-5 font-semibold text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container/60 text-sm">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="p-5">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-variant">
                        <img className="w-full h-full object-cover" alt={item.name} src={item.imageUrl || "https://images.unsplash.com/photo-1544025162-d76694265947?w=100&auto=format&fit=crop"} />
                      </div>
                    </td>
                    <td className="p-5 font-medium text-primary">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span>{item.name}</span>
                        {item.isDailySpecial && (
                          <span className="inline-block bg-secondary-fixed/50 text-on-secondary-fixed text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Günün Menüsü</span>
                        )}
                        {item.isPopular && (
                          <span className="inline-block bg-green-600/10 text-green-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border border-green-600/20">Popüler</span>
                        )}
                      </div>
                    </td>
                    <td className="p-5 text-on-surface-variant">{item.category?.name || 'Kategorisiz'}</td>
                    <td className="p-5 font-semibold text-secondary">{item.price}₺</td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(item)}
                          className="hover:bg-surface-container px-3 py-1.5 rounded-lg text-primary hover:text-secondary flex items-center gap-1 transition-all"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                          Düzenle
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id, item.name)}
                          className="hover:bg-red-50 px-3 py-1.5 rounded-lg text-red-600 hover:text-red-700 flex items-center gap-1 transition-all"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit/Add Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="bg-surface-container-lowest max-w-2xl w-full rounded-2xl shadow-2xl border border-surface-container max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="p-6 border-b border-surface-container/60 flex justify-between items-center">
              <h3 className="font-headline-md text-xl text-primary">{editingItem ? 'Yemek Düzenle' : 'Yeni Yemek Ekle'}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-primary w-8 h-8 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </header>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {formError && (
                <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg text-sm font-medium">
                  {formError}
                </div>
              )}

              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="itemName" className="font-label-md text-xs text-on-surface-variant uppercase">Yemek Adı *</label>
                  <input
                    id="itemName"
                    type="text"
                    required
                    placeholder="Izgara Antrikot"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-surface border border-outline-variant rounded-lg p-3 outline-none focus:border-secondary transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="itemPrice" className="font-label-md text-xs text-on-surface-variant uppercase">Fiyat (TL) *</label>
                  <input
                    id="itemPrice"
                    type="number"
                    required
                    min={1}
                    value={price === 0 ? '' : price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="bg-surface border border-outline-variant rounded-lg p-3 outline-none focus:border-secondary transition-colors font-semibold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="itemCategory" className="font-label-md text-xs text-on-surface-variant uppercase">Kategori *</label>
                <select
                  id="itemCategory"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="bg-surface border border-outline-variant rounded-lg p-3 outline-none focus:border-secondary transition-colors"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="itemDesc" className="font-label-md text-xs text-on-surface-variant uppercase">Açıklama</label>
                <textarea
                  id="itemDesc"
                  rows={3}
                  placeholder="Yemeğin hazırlığı ve sunum detayları..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-surface border border-outline-variant rounded-lg p-3 outline-none focus:border-secondary transition-colors resize-none"
                ></textarea>
              </div>

              {/* Photo Uploader */}
              <div className="flex flex-col gap-2">
                <span className="font-label-md text-xs text-on-surface-variant uppercase">Yemek Fotoğrafı</span>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="w-full h-28 rounded-xl bg-surface border border-dashed border-outline-variant flex items-center justify-center overflow-hidden">
                    {imageUrl ? (
                      <img className="w-full h-full object-cover" alt="Yüklenen Yemek" src={imageUrl} />
                    ) : (
                      <span className="material-symbols-outlined text-3xl text-outline-variant">image</span>
                    )}
                  </div>
                  
                  <div className="md:col-span-3 flex flex-col gap-2">
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden" 
                        id="image-file-input"
                        disabled={isUploading}
                      />
                      <label 
                        htmlFor="image-file-input" 
                        className="bg-surface hover:bg-surface-container border border-outline px-6 py-3 rounded-lg font-label-md text-xs uppercase tracking-wider text-center cursor-pointer transition-colors block select-none disabled:opacity-50"
                      >
                        {isUploading ? 'Resim Yükleniyor...' : 'Yeni Fotoğraf Yükle'}
                      </label>
                    </div>
                    {uploadError && <span className="text-xs text-red-600 font-semibold">{uploadError}</span>}
                    <input 
                      type="text" 
                      placeholder="Görsel URL (Yükleme sonrası otomatik doldurulur)"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="bg-surface border border-outline-variant rounded-lg p-2.5 outline-none focus:border-secondary text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Boolean Toggles */}
              <div className="flex flex-col sm:flex-row gap-6">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isDailySpecial}
                    onChange={(e) => setIsDailySpecial(e.target.checked)}
                    className="w-5 h-5 accent-secondary rounded border-outline-variant"
                  />
                  <span className="font-label-md text-sm text-primary">Günün Menüsü (Şefin Seçimi)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="w-5 h-5 accent-secondary rounded border-outline-variant"
                  />
                  <span className="font-label-md text-sm text-primary">Ana Sayfada Popüler Olarak Göster</span>
                </label>
              </div>

              {/* Dynamic Specifications */}
              <div className="pt-4 border-t border-surface-container/60">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-label-md text-xs text-primary uppercase tracking-wider">Yemek Özellikleri & Malzemeleri</h4>
                  <button
                    type="button"
                    onClick={addAttributeField}
                    className="text-secondary font-label-md text-xs flex items-center gap-1 hover:underline"
                  >
                    <span className="material-symbols-outlined text-base">add_circle</span>
                    Özellik Ekle
                  </button>
                </div>

                {attributes.length === 0 ? (
                  <p className="text-xs text-on-surface-variant/80 italic">Henüz hiçbir özellik eklenmemiş. Örn: "Ağırlık" -&gt; "200gr" veya "Malzeme" -&gt; "Et, domates"</p>
                ) : (
                  <div className="space-y-3">
                    {attributes.map((attr, index) => (
                      <div key={index} className="flex gap-4 items-center animate-in slide-in-from-top-2 duration-150">
                        <input
                          type="text"
                          required
                          placeholder="Özellik Başlığı (Örn: Ağırlık)"
                          value={attr.name}
                          onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                          className="flex-1 bg-surface border border-outline-variant rounded-lg p-2.5 text-xs outline-none focus:border-secondary"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Değeri (Örn: 200gr Kırmızı Et)"
                          value={attr.value}
                          onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                          className="flex-1 bg-surface border border-outline-variant rounded-lg p-2.5 text-xs outline-none focus:border-secondary"
                        />
                        <button
                          type="button"
                          onClick={() => removeAttributeField(index)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-lg bg-surface hover:bg-red-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>

            <footer className="p-6 border-t border-surface-container/60 bg-surface flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="border border-outline px-6 py-3 rounded-lg font-label-md text-xs uppercase hover:bg-surface-container-high transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="bg-primary text-on-primary px-8 py-3 rounded-lg font-label-md text-xs uppercase hover:opacity-90 active:scale-95 transition-all shadow-md"
              >
                Kaydet
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};
