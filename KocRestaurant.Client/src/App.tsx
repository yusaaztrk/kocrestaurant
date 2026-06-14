import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

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

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/first-setup-admin" element={<Setup />} />
          <Route path="/sutlac/:district" element={<DistrictSEO />} />

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
