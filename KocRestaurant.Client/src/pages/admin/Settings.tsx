import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Settings {
  id: string;
  restaurantName: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  logoUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  aboutTitle?: string;
  aboutText?: string;
  aboutImages?: string;
}

export const Settings: React.FC = () => {
  const [id, setId] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutText, setAboutText] = useState('');
  const [aboutImages, setAboutImages] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/settings');
        if (response.data) {
          const s: Settings = response.data;
          setId(s.id);
          setRestaurantName(s.restaurantName);
          setAddress(s.address);
          setPhone(s.phone);
          setEmail(s.email);
          setWorkingHours(s.workingHours);
          setLogoUrl(s.logoUrl);
          setFacebookUrl(s.facebookUrl);
          setInstagramUrl(s.instagramUrl);
          setAboutTitle(s.aboutTitle || '');
          setAboutText(s.aboutText || '');
          setAboutImages(s.aboutImages || '');
        }
      } catch (err) {
        console.error('Error loading settings', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setLogoUrl(response.data.url);
      showStatus('success', 'Restoran logosu yüklendi.');
    } catch (err: any) {
      console.error('Logo upload error', err);
      const errorMsg = err.response?.data?.message || 'Logo yüklenirken hata oluştu.';
      setUploadError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantName.trim()) {
      showStatus('error', 'Restoran adı boş bırakılamaz.');
      return;
    }

    const payload = {
      id,
      restaurantName: restaurantName.trim(),
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
      workingHours: workingHours.trim(),
      logoUrl: logoUrl.trim(),
      facebookUrl: facebookUrl.trim(),
      instagramUrl: instagramUrl.trim(),
      aboutTitle: aboutTitle.trim(),
      aboutText: aboutText.trim(),
      aboutImages: aboutImages.trim()
    };

    try {
      await axios.put('/settings', payload);
      showStatus('success', 'Restoran ayarları başarıyla kaydedildi.');
    } catch (err) {
      console.error('Error saving settings', err);
      showStatus('error', 'Ayarlar kaydedilirken hata oluştu.');
    }
  };

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => {
      setStatusMsg({ type: null, text: '' });
    }, 3500);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-200">
      {/* Header */}
      <header className="mb-12">
        <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Genel Ayarlar</h2>
        <p className="font-body-md text-on-surface-variant text-sm mt-1">İletişim bilgilerini, çalışma saatlerini, logosunu ve sosyal medya bağlantılarını yönetin.</p>
      </header>

      {statusMsg.text && (
        <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${
          statusMsg.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-surface-container/60 card-elevation space-y-8 max-w-3xl">
        
        {/* Restaurant Brand Identity */}
        <div>
          <h3 className="font-headline-md text-base text-primary mb-4 pb-1.5 border-b border-surface-container">Kurumsal Kimlik</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="flex flex-col gap-2">
              <label htmlFor="resName" className="font-label-md text-xs text-on-surface-variant uppercase">Restoran Adı *</label>
              <input
                id="resName"
                type="text"
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="bg-surface border border-outline-variant rounded-lg p-3 text-sm outline-none focus:border-secondary transition-colors"
              />
            </div>

            {/* Logo Image Uploader */}
            <div className="flex flex-col gap-2">
              <span className="font-label-md text-xs text-on-surface-variant uppercase">Logo Görseli</span>
              <div className="flex items-center gap-4">
                <div className="w-32 h-12 rounded-xl bg-surface border border-outline-variant flex items-center justify-center overflow-hidden flex-shrink-0 p-1">
                  {logoUrl ? (
                    <img className="w-full h-full object-contain" alt="Logo" src={logoUrl} />
                  ) : (
                    <span className="material-symbols-outlined text-2xl text-outline-variant">image</span>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden" 
                      id="logo-file-input"
                      disabled={isUploading}
                    />
                    <label 
                      htmlFor="logo-file-input" 
                      className="bg-surface hover:bg-surface-container border border-outline px-4 py-2.5 rounded-lg font-label-md text-xs uppercase tracking-wider text-center cursor-pointer transition-colors block select-none disabled:opacity-50"
                    >
                      {isUploading ? 'Yükleniyor...' : 'Logo Yükle'}
                    </label>
                  </div>
                  {uploadError && <span className="text-xs text-red-600 font-semibold">{uploadError}</span>}
                </div>
              </div>
              <input
                type="text"
                placeholder="Logo URL"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="bg-surface border border-outline-variant rounded-lg p-2 text-xs mt-2 outline-none focus:border-secondary"
              />
            </div>
          </div>
        </div>

        {/* Contact info coordinates */}
        <div>
          <h3 className="font-headline-md text-base text-primary mb-4 pb-1.5 border-b border-surface-container">İletişim & Koordinat Bilgileri</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="resPhone" className="font-label-md text-xs text-on-surface-variant uppercase">Telefon Numarası</label>
              <input
                id="resPhone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-surface border border-outline-variant rounded-lg p-3 text-sm outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="resEmail" className="font-label-md text-xs text-on-surface-variant uppercase">E-Posta Adresi</label>
              <input
                id="resEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-surface border border-outline-variant rounded-lg p-3 text-sm outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="resHours" className="font-label-md text-xs text-on-surface-variant uppercase">Çalışma Saatleri</label>
              <input
                id="resHours"
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="bg-surface border border-outline-variant rounded-lg p-3 text-sm outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="resAddress" className="font-label-md text-xs text-on-surface-variant uppercase">Açık Adres</label>
              <textarea
                id="resAddress"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-surface border border-outline-variant rounded-lg p-3 text-sm outline-none focus:border-secondary transition-colors resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Social networks links */}
        <div>
          <h3 className="font-headline-md text-base text-primary mb-4 pb-1.5 border-b border-surface-container">Sosyal Medya Bağlantıları</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="resInsta" className="font-label-md text-xs text-on-surface-variant uppercase">Instagram</label>
              <input
                id="resInsta"
                type="text"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="bg-surface border border-outline-variant rounded-lg p-3 text-sm outline-none focus:border-secondary transition-colors"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="resFb" className="font-label-md text-xs text-on-surface-variant uppercase">Facebook</label>
              <input
                id="resFb"
                type="text"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                className="bg-surface border border-outline-variant rounded-lg p-3 text-sm outline-none focus:border-secondary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Hakkımızda Hikayesi Yönetimi */}
        <div>
          <h3 className="font-headline-md text-base text-primary mb-4 pb-1.5 border-b border-surface-container">Hakkımızda Hikayesi Yönetimi</h3>
          
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="aboutTitle" className="font-label-md text-xs text-on-surface-variant uppercase">Hikaye Başlığı</label>
              <input
                id="aboutTitle"
                type="text"
                value={aboutTitle}
                onChange={(e) => setAboutTitle(e.target.value)}
                className="bg-surface border border-outline-variant rounded-lg p-3 text-sm outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="aboutText" className="font-label-md text-xs text-on-surface-variant uppercase">Hikaye Açıklama Metni</label>
              <textarea
                id="aboutText"
                rows={5}
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                className="bg-surface border border-outline-variant rounded-lg p-3 text-sm outline-none focus:border-secondary transition-colors resize-y"
              ></textarea>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-label-md text-xs text-on-surface-variant uppercase">Hikaye Görselleri (Virgülle Ayrılmış URL Listesi)</span>
              <textarea
                id="aboutImages"
                rows={2}
                value={aboutImages}
                onChange={(e) => setAboutImages(e.target.value)}
                className="bg-surface border border-outline-variant rounded-lg p-3 text-xs outline-none focus:border-secondary transition-colors"
                placeholder="Örn: http://localhost:5188/uploads/gorsel1.png, http://localhost:5188/uploads/gorsel2.png"
              ></textarea>
              <div className="flex items-center gap-4 mt-2">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setIsUploading(true);
                    setUploadError(null);
                    const formData = new FormData();
                    formData.append('file', file);
                    try {
                      const response = await axios.post('/upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                      });
                      const newUrl = response.data.url;
                      setAboutImages(prev => prev ? `${prev},${newUrl}` : newUrl);
                      showStatus('success', 'Görsel yüklendi ve listeye eklendi.');
                    } catch (err: any) {
                      setUploadError(err.response?.data?.message || 'Görsel yüklenirken hata oluştu.');
                    } finally {
                      setIsUploading(false);
                    }
                  }}
                  className="hidden" 
                  id="about-file-input"
                  disabled={isUploading}
                />
                <label 
                  htmlFor="about-file-input" 
                  className="bg-surface hover:bg-surface-container border border-outline px-4 py-2.5 rounded-lg font-label-md text-xs uppercase tracking-wider text-center cursor-pointer transition-colors block select-none"
                >
                  {isUploading ? 'Yükleniyor...' : 'Görsel Yükle ve Ekle'}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-surface-container flex justify-end">
          <button
            type="submit"
            className="bg-primary text-on-primary font-label-md text-xs uppercase tracking-wider py-4 px-10 rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-md"
          >
            Tüm Değişiklikleri Kaydet
          </button>
        </div>
      </form>
    </div>
  );
};
