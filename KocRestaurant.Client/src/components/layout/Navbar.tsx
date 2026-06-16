import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

interface NavbarProps {
  restaurantName: string;
  logoUrl: string;
  activePage?: 'home' | 'menu' | 'about' | 'gallery' | 'contact';
  settings?: SettingsData;
}

export const Navbar: React.FC<NavbarProps> = ({
  restaurantName,
  logoUrl,
  activePage,
  settings
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const initializeGoogleTranslate = () => {
      const translateEl = document.getElementById('google_translate_element');
      if (!translateEl) return;

      if ((window as any).google?.translate && translateEl.childElementCount === 0) {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'tr',
            includedLanguages: 'en,de,fr,ar,ru,it,es,az,ka,fa',
            autoDisplay: false
          },
          'google_translate_element'
        );
      }
    };

    const addGoogleTranslateScript = () => {
      (window as any).googleTranslateElementInit = () => {
        initializeGoogleTranslate();
      };

      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.type = 'text/javascript';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(script);
      } else if ((window as any).google && (window as any).google.translate) {
        try {
          initializeGoogleTranslate();
        } catch (e) {
          console.warn('Re-initializing google translate failed', e);
        }
      }
    };

    const timer = setTimeout(addGoogleTranslateScript, 500);
    return () => clearTimeout(timer);
  }, []);

  const navItems = [
    { label: 'Ana Sayfa', value: 'home', path: '/' },
    { label: 'Menü', value: 'menu', path: '/menu' },
    { label: 'Hakkımızda', value: 'about', path: '/about' },
    { label: 'Galeri', value: 'gallery', path: '/gallery' },
    { label: 'İletişim', value: 'contact', path: '/contact' }
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const getPhoneCallLink = () => {
    if (!settings?.phone) return '#';
    const cleanPhone = settings.phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone;
    const finalPhone = cleanPhone.startsWith('90') ? cleanPhone : '90' + formattedPhone;
    return `tel:+${finalPhone}`;
  };

  return (
    <>
      {/* Top Header Bar */}
      <nav className="fixed top-0 left-0 right-0 md:left-[15%] md:right-[15%] z-40 bg-surface rounded-none md:rounded-b-[15px] shadow-lg border-b border-white/10 md:border-x transition-all duration-300">
        <div className="flex justify-between items-center w-full px-6 md:px-8 h-20">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => handleNavigate('/')}>
            <img alt={`${restaurantName} Logo`} className="h-10 md:h-12 w-auto object-contain max-w-[150px]" src={logoUrl} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNavigate(item.path)}
                className={`font-body-md text-body-md transition-colors duration-300 cursor-pointer ${activePage === item.value
                    ? 'text-secondary font-semibold border-b-2 border-secondary pb-1'
                    : 'text-primary/75 hover:text-secondary'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Actions (Desktop: Translate Button, Mobile: Hamburger) */}
          <div className="flex items-center gap-4">
            <div className="w-[128px] md:w-[180px] shrink-0 origin-right scale-[0.72] md:scale-100">
              <div id="google_translate_element" className="google-translate-container"></div>
            </div>

            {/* Hamburger Icon */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden text-primary hover:text-secondary focus:outline-none cursor-pointer flex items-center justify-center"
              aria-label="Menüyü Aç"
            >
              <span className="material-symbols-outlined notranslate text-3xl" translate="no">menu</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer (Right to Left Slide-in) */}
      <div className={`fixed top-0 right-0 h-full w-[85vw] sm:w-[400px] bg-black/98 backdrop-blur-lg z-50 shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-between ${isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        {/* Drawer Header */}
        <div className="p-6 flex justify-between items-center border-b border-white/10">
          <div className="flex items-center">
            <img alt={`${restaurantName} Logo`} className="h-8 w-auto object-contain max-w-[120px]" src={logoUrl} />
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/75 hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined notranslate text-3xl" translate="no">close</span>
          </button>
        </div>

        {/* Drawer Content / Nav Links */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
          <div className="flex flex-col gap-5">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNavigate(item.path)}
                className={`text-left font-headline-md text-lg transition-colors py-2 border-b border-white/5 ${activePage === item.value
                    ? 'text-secondary font-semibold'
                    : 'text-white/80 hover:text-secondary'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Footer Contact Details inside Mobile Menu */}
          {settings && (
            <div className="border-t border-white/10 pt-8 mt-8 space-y-6">
              <h4 className="font-label-md text-xs uppercase tracking-widest text-secondary font-semibold">İletişim Bilgileri</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined notranslate text-secondary text-lg mt-0.5" translate="no">location_on</span>
                  <span className="font-body-md text-xs text-white/70 leading-relaxed">{settings.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined notranslate text-secondary text-lg" translate="no">call</span>
                  <span className="font-body-md text-xs text-white/70">{settings.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined notranslate text-secondary text-lg" translate="no">mail</span>
                  <span className="font-body-md text-xs text-white/70">{settings.email}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined notranslate text-secondary text-lg mt-0.5" translate="no">schedule</span>
                  <span className="font-body-md text-xs text-white/70 leading-relaxed">{settings.workingHours}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Social handles */}
        {settings && (
          <div className="p-6 border-t border-white/10 bg-white/[0.02] flex justify-between items-center text-xs opacity-60 uppercase tracking-widest">
            <span>Bizi Takip Edin</span>
            <div className="flex gap-4">
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-secondary text-white">Instagram</a>
              <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="hover:text-secondary text-white">Facebook</a>
            </div>
          </div>
        )}
      </div>

      {/* Floating Animated Contact Buttons */}
      {settings?.phone && (
        <>
          {false && (
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="hidden"
            style={{ animationDuration: '3s' }}
            title="WhatsApp ile İletişime Geçin"
          >
            <svg className="w-7 h-7 fill-current" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
            </svg>
          </a>
          )}

          {/* Phone Floating Button (Bottom Right) */}
          <a
            href={getPhoneCallLink()}
            className="fixed bottom-6 right-6 z-50 bg-[#c6a234] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center border border-white/10 group cursor-pointer animate-bounce"
            style={{ animationDuration: '3s', animationDelay: '0.5s' }}
            title="Telefon ile Arayın"
          >
            <span className="material-symbols-outlined notranslate text-3xl" translate="no">call</span>
          </a>
        </>
      )}
    </>
  );
};

