import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: string;
  displayOrder: number;
}

export const GalleryManager: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // New Photo fields
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('General');
  const [displayOrder, setDisplayOrder] = useState(0);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });

  const loadGallery = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/gallery');
      setItems(response.data);
      setDisplayOrder(response.data.length);
    } catch (err) {
      console.error('Error loading gallery items', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

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
      showStatus('success', 'Görsel başarıyla yüklendi.');
    } catch (err: any) {
      console.error('Upload error', err);
      const errorMsg = err.response?.data?.message || 'Resim yüklenirken hata oluştu.';
      setUploadError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setFormError('Lütfen bir görsel seçin veya URL girin.');
      return;
    }

    setFormError(null);

    const payload = {
      imageUrl,
      caption: caption.trim() || 'Koç Restaurant',
      category,
      displayOrder
    };

    try {
      await axios.post('/gallery', payload);
      setImageUrl('');
      setCaption('');
      setCategory('General');
      showStatus('success', 'Yeni fotoğraf galeriye eklendi.');
      loadGallery();
    } catch (err) {
      console.error('Error saving gallery item', err);
      setFormError('Veritabanına kaydedilirken bir hata oluştu.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu fotoğrafı galeriden silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      await axios.delete(`/gallery/${id}`);
      showStatus('success', 'Görsel silindi.');
      loadGallery();
    } catch (err) {
      console.error('Error deleting item', err);
      showStatus('error', 'Görsel silinirken bir hata oluştu.');
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
      <header className="mb-12">
        <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Galeri Yönetimi</h2>
        <p className="font-body-md text-on-surface-variant text-sm mt-1">Müşterilerinize restoranınızdan, hazırlık aşamalarından ve enfes sunumlardan kesitler sergileyin.</p>
      </header>

      {statusMsg.text && (
        <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${
          statusMsg.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {statusMsg.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload panel */}
        <div className="lg:col-span-4 bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-surface-container card-elevation flex flex-col gap-6">
          <div>
            <h3 className="font-headline-md text-lg text-primary">Yeni Fotoğraf Yükle</h3>
            <p className="text-xs text-on-surface-variant mt-1">Galeriye eklemek üzere yeni bir resim yükleyin.</p>
          </div>

          {formError && (
            <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg text-xs font-medium">
              {formError}
            </div>
          )}

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="flex flex-col gap-2">
              <span className="font-label-md text-xs text-on-surface-variant uppercase">Fotoğraf Seç *</span>
              <div className="w-full h-36 rounded-xl bg-surface border border-dashed border-outline-variant flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <img className="w-full h-full object-cover" alt="Yüklenen Görsel" src={imageUrl} />
                ) : (
                  <span className="material-symbols-outlined text-3xl text-outline-variant">image</span>
                )}
              </div>
              <div className="relative mt-2">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden" 
                  id="gallery-file-input"
                  disabled={isUploading}
                />
                <label 
                  htmlFor="gallery-file-input" 
                  className="bg-surface hover:bg-surface-container border border-outline px-4 py-2.5 rounded-lg font-label-md text-xs uppercase tracking-wider text-center cursor-pointer transition-colors block select-none disabled:opacity-50"
                >
                  {isUploading ? 'Görsel Yükleniyor...' : 'Görsel Seç ve Yükle'}
                </label>
              </div>
              {uploadError && <span className="text-xs text-red-600 font-semibold">{uploadError}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="galUrl" className="font-label-md text-xs text-on-surface-variant uppercase">Görsel URL</label>
              <input
                id="galUrl"
                type="text"
                placeholder="Yükleme sonrası otomatik veya manuel URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="bg-surface border border-outline-variant rounded-lg p-2.5 text-xs outline-none focus:border-secondary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="galCaption" className="font-label-md text-xs text-on-surface-variant uppercase">Başlık / Açıklama</label>
              <input
                id="galCaption"
                type="text"
                placeholder="Örn: Restoranımızın İç Tasarımı"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="bg-surface border border-outline-variant rounded-lg p-2.5 text-xs outline-none focus:border-secondary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="galCat" className="font-label-md text-xs text-on-surface-variant uppercase">Kategori</label>
                <select
                  id="galCat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-surface border border-outline-variant rounded-lg p-2.5 text-xs outline-none focus:border-secondary"
                >
                  <option value="General">Genel</option>
                  <option value="Food">Yemekler</option>
                  <option value="Interior">İç Mekan</option>
                  <option value="Events">Etkinlikler</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="galOrder" className="font-label-md text-xs text-on-surface-variant uppercase">Sıra No</label>
                <input
                  id="galOrder"
                  type="number"
                  min={0}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="bg-surface border border-outline-variant rounded-lg p-2.5 text-xs outline-none focus:border-secondary font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-on-primary font-label-md text-xs uppercase tracking-wider py-3.5 rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-md mt-4"
            >
              Galeriye Ekle
            </button>
          </form>
        </div>

        {/* Gallery Grid */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-surface-container card-elevation">
          <h3 className="font-headline-md text-xl text-primary mb-6">Mevcut Fotoğraflar ({items.length})</h3>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
            </div>
          ) : items.length === 0 ? (
            <p className="text-sm text-on-surface-variant text-center py-12">Galerinizde henüz fotoğraf bulunmuyor.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden bg-surface-container group shadow-sm border border-surface-container/60">
                  <img className="w-full h-full object-cover" alt={item.caption} src={item.imageUrl} />
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                    <span className="text-white text-[10px] font-semibold bg-secondary px-2 py-0.5 rounded uppercase self-start">
                      {item.category}
                    </span>
                    
                    <div className="flex justify-between items-center w-full">
                      <p className="text-white text-[11px] truncate max-w-[120px]">{item.caption}</p>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 bg-white hover:bg-red-50 p-1.5 rounded-full transition-colors flex items-center justify-center shadow-md"
                        title="Fotoğrafı Sil"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
