import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SettingsData {
  restaurantName: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  logoUrl: string;
  facebookUrl: string;
  instagramUrl: string;
}

interface FooterProps {
  settings: SettingsData;
  activePage?: string;
}

export const Footer: React.FC<FooterProps> = ({
  settings
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleContactClick = () => {
    navigate('/contact');
  };

  const handleHomeLogoClick = () => {
    navigate('/');
  };

  return (
    <footer className="bg-primary-container dark:bg-surface-container-lowest text-on-primary-container dark:text-on-surface mt-auto">
      <div className="w-full py-12 px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-gutter max-w-container-max mx-auto">
        <div className="space-y-6">
          <div className="flex items-center gap-4 cursor-pointer" onClick={handleHomeLogoClick}>
            <img 
              alt={`${settings.restaurantName} Logo`} 
              className="h-10 w-10 filter brightness-0 invert opacity-60" 
              src={settings.logoUrl} 
            />
            <span className="font-headline-md text-headline-md text-white dark:text-primary">{settings.restaurantName}</span>
          </div>
          <p className="font-body-md text-body-md opacity-80 max-w-xs">
            Şehrin en seçkin gastronomik deneyimini sunan Koç Restaurant, geleneksel lezzetleri modern tekniklerle harmanlıyor.
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <h4 className="font-label-md text-label-md uppercase tracking-widest text-secondary-fixed">Hızlı Erişim</h4>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => navigate('/')} 
              className="text-left font-body-md text-body-md text-on-primary-container dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors cursor-pointer"
            >
              Ana Sayfa
            </button>
            <button 
              onClick={() => navigate('/menu')} 
              className="text-left font-body-md text-body-md text-on-primary-container dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors cursor-pointer"
            >
              Menü
            </button>
            <button 
              onClick={() => navigate('/gallery')} 
              className="text-left font-body-md text-body-md text-on-primary-container dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors cursor-pointer"
            >
              Galeri
            </button>
            <button 
              onClick={handleContactClick} 
              className="text-left font-body-md text-body-md text-on-primary-container dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors cursor-pointer"
            >
              İletişim
            </button>
            <button 
              onClick={() => navigate(isAuthenticated ? '/mainkocrestaurant' : '/login')} 
              className="text-left font-body-md text-body-md text-on-primary-container dark:text-on-surface-variant hover:text-secondary-fixed-dim transition-colors cursor-pointer"
            >
              Yönetici Girişi
            </button>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <h4 className="font-label-md text-label-md uppercase tracking-widest text-secondary-fixed">Bize Ulaşın</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed text-lg">location_on</span>
              <span className="font-body-md text-sm md:text-body-md">{settings.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed text-lg">call</span>
              <span className="font-body-md">{settings.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed text-lg">mail</span>
              <span className="font-body-md">{settings.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed text-lg">schedule</span>
              <span className="font-body-md">{settings.workingHours}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* SEO Regional Links */}
      <div className="border-t border-white/10 w-full py-6 bg-black/10 text-on-primary-container dark:text-on-surface">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <p className="text-[10px] opacity-40 uppercase tracking-wider font-semibold mb-3">Lezzet Duraklarımız & Hizmet Bölgelerimiz</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] opacity-60">
            <button onClick={() => navigate('/sutlac/derekoy-sutlac')} className="hover:text-secondary-fixed transition-colors text-left cursor-pointer">Dereköy Fırın Sütlaç</button>
            <span className="opacity-30">|</span>
            <button onClick={() => navigate('/sutlac/taflan-sutlac')} className="hover:text-secondary-fixed transition-colors text-left cursor-pointer">Taflan Fırın Sütlaç</button>
            <span className="opacity-30">|</span>
            <button onClick={() => navigate('/sutlac/ondokuzmayis-sutlac')} className="hover:text-secondary-fixed transition-colors text-left cursor-pointer">19 Mayıs Fırın Sütlaç</button>
            <span className="opacity-30">|</span>
            <button onClick={() => navigate('/sutlac/engiz-sutlac')} className="hover:text-secondary-fixed transition-colors text-left cursor-pointer">Engiz Fırın Sütlaç</button>
            <span className="opacity-30">|</span>
            <button onClick={() => navigate('/sutlac/yorukler-sutlac')} className="hover:text-secondary-fixed transition-colors text-left cursor-pointer">Yörükler Fırın Sütlaç</button>
            <span className="opacity-30">|</span>
            <button onClick={() => navigate('/sutlac/incesu-sutlac')} className="hover:text-secondary-fixed transition-colors text-left cursor-pointer">İncesu Fırın Sütlaç</button>
            <span className="opacity-30">|</span>
            <button onClick={() => navigate('/sutlac/atakum-sutlac')} className="hover:text-secondary-fixed transition-colors text-left cursor-pointer">Atakum Fırın Sütlaç</button>
            <span className="opacity-30">|</span>
            <button onClick={() => navigate('/sutlac/bafra-sutlac')} className="hover:text-secondary-fixed transition-colors text-left cursor-pointer">Bafra Fırın Sütlaç</button>
            <span className="opacity-30">|</span>
            <button onClick={() => navigate('/sutlac/ballica-sutlac')} className="hover:text-secondary-fixed transition-colors text-left cursor-pointer">Ballıca Fırın Sütlaç</button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 w-full">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 flex flex-col md:flex-row justify-between items-center text-xs opacity-50 uppercase tracking-widest gap-4">
          <span>© 2026 {settings.restaurantName}. Tüm Hakları Saklıdır.</span>
          <div className="flex gap-4">
            <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-secondary-fixed">Instagram</a>
            <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="hover:text-secondary-fixed">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
