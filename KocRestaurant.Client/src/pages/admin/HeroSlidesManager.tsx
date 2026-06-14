import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { type HeroSlide } from '../../components/home/Hero';

export const HeroSlidesManager: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);

  // Upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });

  const loadSlides = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/heroslides');
      setSlides(response.data);
      if (response.data.length > 0 && !editingId) {
        // Find max display order and add 1
        const maxOrder = Math.max(...response.data.map((s: HeroSlide) => s.displayOrder), 0);
        setDisplayOrder(maxOrder + 1);
      } else if (response.data.length === 0) {
        setDisplayOrder(1);
      }
    } catch (err) {
      console.error('Error loading hero slides', err);
      showStatus('error', 'Slaytlar yüklenirken hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl) {
      setFormError('Lütfen bir görsel yükleyin veya URL girin.');
      return;
    }
    if (!title.trim()) {
      setFormError('Lütfen bir başlık yazın.');
      return;
    }
    if (!description.trim()) {
      setFormError('Lütfen bir açıklama yazın.');
      return;
    }

    setFormError(null);

    const payload = {
      id: editingId || '00000000-0000-0000-0000-000000000000',
      title: title.trim(),
      description: description.trim(),
      imageUrl,
      displayOrder
    };

    try {
      if (editingId) {
        await axios.put(`/heroslides/${editingId}`, payload);
        showStatus('success', 'Slayt başarıyla güncellendi.');
      } else {
        await axios.post('/heroslides', payload);
        showStatus('success', 'Yeni slayt başarıyla eklendi.');
      }
      resetForm();
      setIsModalOpen(false);
      loadSlides();
    } catch (err) {
      console.error('Error saving slide', err);
      setFormError('Slayt kaydedilirken sunucu hatası oluştu.');
    }
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingId(slide.id);
    setTitle(slide.title);
    setDescription(slide.description);
    setImageUrl(slide.imageUrl);
    setDisplayOrder(slide.displayOrder);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu slaytı silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      await axios.delete(`/heroslides/${id}`);
      showStatus('success', 'Slayt silindi.');
      if (editingId === id) {
        resetForm();
        setIsModalOpen(false);
      }
      loadSlides();
    } catch (err) {
      console.error('Error deleting slide', err);
      showStatus('error', 'Slayt silinirken bir hata oluştu.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
    // Auto-calculate displayOrder for next slide based on current slides list
    const maxOrder = Math.max(...slides.map((s) => s.displayOrder), 0);
    setDisplayOrder(maxOrder + 1);
    setFormError(null);
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
          <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Giriş Slider Yönetimi</h2>
          <p className="font-body-md text-on-surface-variant text-sm mt-1">
            Anasayfa giriş ekranında dönen başlık, açıklama ve görselleri yönetin.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="w-full md:w-auto bg-primary text-on-primary font-label-md text-xs uppercase tracking-wider py-3.5 px-6 rounded-lg shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Yeni Slayt Ekle
        </button>
      </header>

      {statusMsg.text && (
        <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${
          statusMsg.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {statusMsg.text}
        </div>
      )}

      {/* List Panel */}
      <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-surface-container card-elevation">
        <h3 className="font-headline-md text-xl text-primary mb-6">Mevcut Slaytlar ({slides.length})</h3>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
          </div>
        ) : slides.length === 0 ? (
          <p className="text-sm text-on-surface-variant text-center py-12">Henüz herhangi bir slayt eklenmemiş. Anasayfada varsayılan arka plan gösterilecektir.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {slides.map((slide) => (
              <div 
                key={slide.id} 
                className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-outline-variant/60 bg-surface hover:shadow-md transition-all"
              >
                {/* Slide Thumbnail */}
                <div className="w-full md:w-36 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-outline-variant/50">
                  <img className="w-full h-full object-cover" alt={slide.title} src={slide.imageUrl} />
                </div>

                {/* Content Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-primary-container text-on-primary-container text-[10px] font-bold px-2 py-0.5 rounded-md">
                        Sıra: {slide.displayOrder}
                      </span>
                      <h4 className="font-title-sm text-sm text-on-surface truncate font-semibold">
                        {slide.title}
                      </h4>
                    </div>
                    <p className="text-xs text-on-surface-variant line-clamp-2">
                      {slide.description}
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 mt-3 md:mt-0">
                    <button
                      onClick={() => handleEdit(slide)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline text-on-surface-variant hover:bg-surface-container text-xs transition-colors cursor-pointer"
                      title="Slaytı Düzenle"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(slide.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs transition-colors cursor-pointer"
                      title="Slaytı Sil"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit/Add Dialog Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto cursor-pointer"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-surface-container-lowest max-w-lg w-full rounded-2xl shadow-2xl border border-surface-container max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="p-6 border-b border-surface-container/60 flex justify-between items-center">
              <h3 className="font-headline-md text-xl text-primary">
                {editingId ? 'Slaytı Güncelle' : 'Yeni Slayt Ekle'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-primary w-8 h-8 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </header>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {formError && (
                <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg text-xs font-medium">
                  {formError}
                </div>
              )}

              {/* Visual Upload Area */}
              <div className="flex flex-col gap-2">
                <span className="font-label-md text-xs text-on-surface-variant uppercase">Slayt Arka Planı *</span>
                <div className="w-full h-36 rounded-xl bg-surface border border-dashed border-outline-variant flex items-center justify-center overflow-hidden">
                  {imageUrl ? (
                    <img className="w-full h-full object-cover" alt="Yüklenen Arka Plan" src={imageUrl} />
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
                    id="slide-file-input"
                    disabled={isUploading}
                  />
                  <label 
                    htmlFor="slide-file-input" 
                    className="bg-surface hover:bg-surface-container border border-outline px-4 py-2.5 rounded-lg font-label-md text-xs uppercase tracking-wider text-center cursor-pointer transition-colors block select-none disabled:opacity-50"
                  >
                    {isUploading ? 'Görsel Yükleniyor...' : 'Görsel Seç ve Yükle'}
                  </label>
                </div>
                {uploadError && <span className="text-xs text-red-600 font-semibold">{uploadError}</span>}
              </div>

              {/* Image URL Input */}
              <div className="flex flex-col gap-2">
                <label htmlFor="slideUrl" className="font-label-md text-xs text-on-surface-variant uppercase">Görsel URL</label>
                <input
                  id="slideUrl"
                  type="text"
                  placeholder="Yükleme sonrası otomatik veya manuel URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="bg-surface border border-outline-variant rounded-lg p-2.5 text-xs outline-none focus:border-secondary"
                />
              </div>

              {/* Title Input */}
              <div className="flex flex-col gap-2">
                <label htmlFor="slideTitle" className="font-label-md text-xs text-on-surface-variant uppercase">Başlık *</label>
                <input
                  id="slideTitle"
                  type="text"
                  maxLength={100}
                  placeholder="Örn: Lezzetli Izgaralarımız"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-surface border border-outline-variant rounded-lg p-2.5 text-xs outline-none focus:border-secondary"
                />
              </div>

              {/* Description Input */}
              <div className="flex flex-col gap-2">
                <label htmlFor="slideDesc" className="font-label-md text-xs text-on-surface-variant uppercase">Açıklama *</label>
                <textarea
                  id="slideDesc"
                  rows={3}
                  maxLength={300}
                  placeholder="Müşteriye slayt hakkında kısa bir bilgi sunun..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-surface border border-outline-variant rounded-lg p-2.5 text-xs outline-none focus:border-secondary resize-none"
                />
              </div>

              {/* Display Order */}
              <div className="flex flex-col gap-2">
                <label htmlFor="slideOrder" className="font-label-md text-xs text-on-surface-variant uppercase">Görüntüleme Sırası</label>
                <input
                  id="slideOrder"
                  type="number"
                  min={0}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="bg-surface border border-outline-variant rounded-lg p-2.5 text-xs outline-none focus:border-secondary font-semibold"
                />
              </div>
            </form>

            <footer className="p-6 border-t border-surface-container/60 bg-surface flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="border border-outline px-6 py-3 rounded-lg font-label-md text-xs uppercase hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="bg-primary text-on-primary px-8 py-3 rounded-lg font-label-md text-xs uppercase hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                {editingId ? 'Güncelle' : 'Slayt Ekle'}
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

