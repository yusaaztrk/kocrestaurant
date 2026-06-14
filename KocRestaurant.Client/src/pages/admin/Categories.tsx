import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
}

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);

  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error loading categories', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImageUrl('');
    setDisplayOrder(categories.length);
    setFormError(null);
    setUploadError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setImageUrl(cat.imageUrl);
    setDisplayOrder(cat.displayOrder);
    setFormError(null);
    setUploadError(null);
    setIsModalOpen(true);
  };

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
      showStatus('success', 'Kategori görseli yüklendi.');
    } catch (err: any) {
      console.error('Category image upload error', err);
      const errorMsg = err.response?.data?.message || 'Görsel yüklenirken hata oluştu.';
      setUploadError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Kategori adı zorunludur.');
      return;
    }

    const payload = {
      id: editingCategory ? editingCategory.id : '00000000-0000-0000-0000-000000000000',
      name: name.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      displayOrder
    };

    try {
      if (editingCategory) {
        await axios.put(`/categories/${editingCategory.id}`, payload);
        showStatus('success', `"${name}" kategorisi güncellendi.`);
      } else {
        await axios.post('/categories', payload);
        showStatus('success', `"${name}" kategorisi başarıyla oluşturuldu.`);
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err: any) {
      console.error('Error saving category', err);
      const msg = err.response?.data?.message || 'Kategori kaydedilirken veritabanı hatası oluştu.';
      setFormError(msg);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!window.confirm(`"${catName}" kategorisini silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      await axios.delete(`/categories/${id}`);
      showStatus('success', `"${catName}" kategorisi silindi.`);
      loadCategories();
    } catch (err: any) {
      console.error('Error deleting category', err);
      const msg = err.response?.data?.message || 'Kategori silinirken bir hata oluştu.';
      showStatus('error', msg);
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
          <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Kategoriler</h2>
          <p className="font-body-md text-on-surface-variant text-sm mt-1">Yemeklerinizin bağlı olduğu ana grupları oluşturun ve resim ekleyin.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="w-full md:w-auto bg-primary text-on-primary font-label-md text-xs uppercase tracking-wider py-3.5 px-6 rounded-lg shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Yeni Kategori Ekle
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
      ) : categories.length === 0 ? (
        <div className="text-center py-24 bg-surface-container-lowest rounded-2xl border border-surface-container p-8">
          <span className="material-symbols-outlined text-5xl text-outline-variant">category</span>
          <p className="text-on-surface-variant mt-4 font-body-md">Sistemde henüz hiçbir kategori bulunmuyor.</p>
        </div>
      ) : (
        /* Category Grid layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-surface-container-lowest rounded-2xl border border-surface-container overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between p-6 group">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-variant flex-shrink-0">
                  <img className="w-full h-full object-cover" alt={cat.name} src={cat.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100"} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-headline-md text-base text-primary truncate">{cat.name}</h4>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">{cat.description || 'Kategori Açıklaması'}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-surface-container/50">
                <span className="text-xs font-semibold text-on-surface-variant bg-surface-container px-2.5 py-1 rounded">Sıra: {cat.displayOrder}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(cat)}
                    className="hover:bg-surface-container px-3 py-1.5 rounded-lg text-primary hover:text-secondary flex items-center gap-1 transition-all text-xs font-semibold uppercase"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                    Düzenle
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="hover:bg-red-50 px-3 py-1.5 rounded-lg text-red-600 hover:text-red-700 flex items-center gap-1 transition-all text-xs font-semibold uppercase"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Add Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="bg-surface-container-lowest max-w-lg w-full rounded-2xl shadow-2xl border border-surface-container animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="p-6 border-b border-surface-container/60 flex justify-between items-center">
              <h3 className="font-headline-md text-lg text-primary">{editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-primary w-8 h-8 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </header>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              {formError && (
                <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg text-xs font-medium">
                  {formError}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label htmlFor="catName" className="font-label-md text-xs text-on-surface-variant uppercase">Kategori Adı *</label>
                <input
                  id="catName"
                  type="text"
                  required
                  placeholder="Izgaralar / Mezeler"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-surface border border-outline-variant rounded-lg p-3 text-sm outline-none focus:border-secondary transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="catDesc" className="font-label-md text-xs text-on-surface-variant uppercase">Kısa Açıklama</label>
                <input
                  id="catDesc"
                  type="text"
                  placeholder="Geleneksel lezzetler ve mezeler..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-surface border border-outline-variant rounded-lg p-3 text-sm outline-none focus:border-secondary transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="catOrder" className="font-label-md text-xs text-on-surface-variant uppercase">Görüntüleme Sırası</label>
                  <input
                    id="catOrder"
                    type="number"
                    min={0}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="bg-surface border border-outline-variant rounded-lg p-3 text-sm outline-none focus:border-secondary transition-colors font-semibold"
                  />
                </div>
              </div>

              {/* Photo Uploader */}
              <div className="flex flex-col gap-2">
                <span className="font-label-md text-xs text-on-surface-variant uppercase">Kategori Görseli</span>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="w-full h-20 rounded-xl bg-surface border border-dashed border-outline-variant flex items-center justify-center overflow-hidden">
                    {imageUrl ? (
                      <img className="w-full h-full object-cover" alt="Kategori Görsel" src={imageUrl} />
                    ) : (
                      <span className="material-symbols-outlined text-2xl text-outline-variant">image</span>
                    )}
                  </div>
                  
                  <div className="md:col-span-3 flex flex-col gap-2">
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden" 
                        id="cat-image-file-input"
                        disabled={isUploading}
                      />
                      <label 
                        htmlFor="cat-image-file-input" 
                        className="bg-surface hover:bg-surface-container border border-outline px-4 py-2.5 rounded-lg font-label-md text-xs uppercase tracking-wider text-center cursor-pointer transition-colors block select-none disabled:opacity-50"
                      >
                        {isUploading ? 'Yükleniyor...' : 'Görsel Seç'}
                      </label>
                    </div>
                    {uploadError && <span className="text-xs text-red-600 font-semibold">{uploadError}</span>}
                    <input 
                      type="text" 
                      placeholder="Görsel URL"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="bg-surface border border-outline-variant rounded-lg p-2 text-xs outline-none focus:border-secondary"
                    />
                  </div>
                </div>
              </div>

              <footer className="pt-4 border-t border-surface-container/60 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="border border-outline px-6 py-2.5 rounded-lg font-label-md text-xs uppercase hover:bg-surface-container-high transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-primary text-on-primary px-8 py-2.5 rounded-lg font-label-md text-xs uppercase hover:opacity-90 active:scale-95 transition-all shadow-md"
                >
                  Kaydet
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
