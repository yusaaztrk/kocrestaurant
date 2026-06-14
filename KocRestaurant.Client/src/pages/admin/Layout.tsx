import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, role, isAuthenticated, isLoading, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Route Guarding: Protect admin routes
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Let the useEffect handle redirection
  }

  const navLinks = [
    { name: 'Dashboard', path: '/mainkocrestaurant', icon: 'dashboard' },
    { name: 'Giriş Slider', path: '/mainkocrestaurant/hero-slides', icon: 'slideshow' },
    { name: 'Günlük Menü', path: '/mainkocrestaurant/daily-menu', icon: 'today' },
    { name: 'Tüm Yemekler', path: '/mainkocrestaurant/menu-items', icon: 'restaurant_menu' },
    { name: 'Kategoriler', path: '/mainkocrestaurant/categories', icon: 'category' },
    { name: 'Galeri Yönetimi', path: '/mainkocrestaurant/gallery', icon: 'photo_library' },
    { name: 'Mesajlar', path: '/mainkocrestaurant/messages', icon: 'mail' },
    { name: 'Ayarlar', path: '/mainkocrestaurant/settings', icon: 'settings' }
  ];

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col md:flex-row">
      {/* Mobile Top Header Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-surface-container shadow-sm border-b border-outline-variant/30 flex items-center justify-between px-6 z-40">
        <div className="flex flex-col cursor-pointer select-none" onClick={() => navigate('/mainkocrestaurant')}>
          <h1 className="font-headline-sm text-base text-primary tracking-tight font-bold">KOÇ RESTAURANT</h1>
          <p className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">Yönetim Paneli</p>
        </div>
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="text-primary hover:text-secondary focus:outline-none flex items-center justify-center p-2 rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
          aria-label="Menüyü Aç"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
      </header>

      {/* Mobile Backdrop Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer (Left Slide-in) */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-surface-container shadow-2xl flex flex-col py-6 px-4 gap-4 z-50 border-r border-outline-variant/30 transition-transform duration-300 ease-in-out md:hidden ${
        isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="cursor-pointer" onClick={() => { navigate('/'); setIsDrawerOpen(false); }}>
            <h1 className="font-headline-md text-lg text-primary tracking-tight font-bold">KOÇ RESTAURANT</h1>
            <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider mt-1">Yönetim Paneli</p>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="text-on-surface-variant hover:text-primary w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto no-scrollbar">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setIsDrawerOpen(false);
                }}
                className={`flex items-center gap-3 w-full rounded-lg p-3 text-left transition-all font-label-md text-sm cursor-pointer ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-semibold scale-95'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {link.icon}
                </span>
                <span>{link.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-outline-variant/40 mt-auto flex flex-col gap-4">
          <div className="flex items-center gap-3 p-1">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary flex items-center justify-center text-white flex-shrink-0 border border-outline-variant/30">
              <img 
                alt="Yönetici Profil Resmi" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1KNnE9tWmjovehUbpZamNPUVJON55p4JFqbPc7ToYhlq93eybUvefNDasWI8-iYp_JoZuqJ1BbAijTt3q3NL9qj6cQozzfuaoFACLUdvaG1YZdQfFHr_YST4bGirTzjYNJUQDoVZTxw0TzjzpyWyrqTG8j-QYxpaTeamDdbObWNfzeDwEmXxhUpdg39RY50iMQ5aYt3HZ9spWuXhaLBw-wkk03jL8LvsYiicwxB_RbrRF4bz6Dz91nuxIYvL8VFftrlaHltrOrpdP" 
              />
            </div>
            <div className="min-w-0">
              <p className="font-label-md text-sm text-on-surface truncate">{username || 'Müdür Bey'}</p>
              <p className="text-[11px] text-on-surface-variant uppercase tracking-wider truncate">{role === 'Admin' ? 'Baş Yönetici' : role}</p>
            </div>
          </div>
          
          <button 
            onClick={() => {
              logout();
              setIsDrawerOpen(false);
            }}
            className="w-full border border-outline hover:bg-red-50 hover:border-red-200 hover:text-red-700 text-on-surface-variant font-label-md text-xs uppercase py-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            Oturumu Kapat
          </button>
        </div>
      </aside>

      {/* Desktop Permanent SideNavBar (hidden on mobile, fixed on desktop) */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-surface-container shadow-md flex-col py-6 px-4 gap-4 z-50 border-r border-outline-variant/30">
        <div className="mb-6 px-2 cursor-pointer" onClick={() => navigate('/')}>
          <h1 className="font-headline-md text-headline-md text-primary tracking-tight">KOÇ RESTAURANT</h1>
          <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider mt-1">Yönetim Paneli</p>
        </div>
        
        <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto no-scrollbar">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-3 w-full rounded-lg p-3 text-left transition-all font-label-md text-sm cursor-pointer ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-semibold scale-95'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {link.icon}
                </span>
                <span>{link.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-outline-variant/40 mt-auto flex flex-col gap-4">
          <div className="flex items-center gap-3 p-1">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary flex items-center justify-center text-white flex-shrink-0 border border-outline-variant/30">
              <img 
                alt="Yönetici Profil Resmi" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1KNnE9tWmjovehUbpZamNPUVJON55p4JFqbPc7ToYhlq93eybUvefNDasWI8-iYp_JoZuqJ1BbAijTt3q3NL9qj6cQozzfuaoFACLUdvaG1YZdQfFHr_YST4bGirTzjYNJUQDoVZTxw0TzjzpyWyrqTG8j-QYxpaTeamDdbObWNfzeDwEmXxhUpdg39RY50iMQ5aYt3HZ9spWuXhaLBw-wkk03jL8LvsYiicwxB_RbrRF4bz6Dz91nuxIYvL8VFftrlaHltrOrpdP" 
              />
            </div>
            <div className="min-w-0">
              <p className="font-label-md text-sm text-on-surface truncate">{username || 'Müdür Bey'}</p>
              <p className="text-[11px] text-on-surface-variant uppercase tracking-wider truncate">{role === 'Admin' ? 'Baş Yönetici' : role}</p>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="w-full border border-outline hover:bg-red-50 hover:border-red-200 hover:text-red-700 text-on-surface-variant font-label-md text-xs uppercase py-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            Oturumu Kapat
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-64 p-4 sm:p-6 md:p-12 pt-20 md:pt-12 overflow-x-hidden min-h-screen bg-surface">
        <Outlet />
      </main>
    </div>
  );
};

