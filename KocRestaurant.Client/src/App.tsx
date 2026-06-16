import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';

// Public User Pages
import { Home } from './pages/user/Home';
import { Menu } from './pages/user/Menu';
import { Gallery } from './pages/user/Gallery';
import { About } from './pages/user/About';
import { Contact } from './pages/user/Contact';
import { Login } from './pages/user/Login';
import { Setup } from './pages/user/Setup';
import { DistrictSEO } from './pages/user/DistrictSEO';

// Admin Protected Pages
import { AdminLayout } from './pages/admin/Layout';
import { Dashboard } from './pages/admin/Dashboard';
import { DailyMenu } from './pages/admin/DailyMenu';
import { MenuItems } from './pages/admin/MenuItems';
import { Categories } from './pages/admin/Categories';
import { GalleryManager } from './pages/admin/GalleryManager';
import { ContactMessages } from './pages/admin/ContactMessages';
import { Settings } from './pages/admin/Settings';
import { HeroSlidesManager } from './pages/admin/HeroSlidesManager';

const defaultSettings = {
  restaurantName: 'KOÇ RESTAURANT',
  address: 'Etiler, Nispetiye Cad. No: 12, İstanbul',
  phone: '+90 (212) 555 01 01',
  email: 'rezervasyon@kocrestaurant.com',
  workingHours: 'Her Gün: 12:00 - 00:00',
  logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_9V67s22Q7fN00efDph6D7s5iT6MwtFwZjBLChNtBIxQ6vVLRd5DAGVXxhWThDlZ9iSGeAGwwBG67-In0G9tCX5-n_rNizLA_8GKLCWY_USrub3bEZh6r5-KC7VcfEIO-oGGRFlLhZ766sgmojIsdX9hzppjf7LhLvfPexccNjtaTn85c2dYsz8DPbtBCfPxbC7VNdYkh6nIbQAkFTdhiHgoGr30FBuCTO4LVF0hbdUT3I4t5_tSR4o9lW0pV1QGiZronkxxVrKMt',
  facebookUrl: '#',
  instagramUrl: '#'
};

const PublicLayout: React.FC = () => {
  const location = useLocation();
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await axios.get('/settings');
        if (response.data) {
          setSettings(response.data);
        }
      } catch (err) {
        console.error('Error loading navbar settings', err);
      }
    };

    loadSettings();
  }, []);

  const activePage = useMemo(() => {
    if (location.pathname === '/') return 'home';
    if (location.pathname.startsWith('/menu')) return 'menu';
    if (location.pathname.startsWith('/about')) return 'about';
    if (location.pathname.startsWith('/gallery')) return 'gallery';
    if (location.pathname.startsWith('/contact')) return 'contact';
    return undefined;
  }, [location.pathname]);

  return (
    <>
      <Navbar
        restaurantName={settings.restaurantName}
        logoUrl={settings.logoUrl}
        activePage={activePage}
        settings={settings}
      />
      <Outlet />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Customer Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sutlac/:district" element={<DistrictSEO />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/first-setup-admin" element={<Setup />} />

          {/* Secure Admin Dashboard Routes */}
          <Route path="/mainkocrestaurant" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="hero-slides" element={<HeroSlidesManager />} />
            <Route path="daily-menu" element={<DailyMenu />} />
            <Route path="menu-items" element={<MenuItems />} />
            <Route path="categories" element={<Categories />} />
            <Route path="gallery" element={<GalleryManager />} />
            <Route path="messages" element={<ContactMessages />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch-All Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
