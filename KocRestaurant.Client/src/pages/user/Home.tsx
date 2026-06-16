import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useSEO } from '../../hooks/useSEO';

// Component Imports
import { Footer } from '../../components/layout/Footer';
import { Hero, type HeroSlide } from '../../components/home/Hero';
import { WhyUsSection } from '../../components/home/WhyUsSection';
import { CategoriesSection } from '../../components/home/CategoriesSection';
import { PopularSection } from '../../components/home/PopularSection';
import { StatsSection } from '../../components/home/StatsSection';
import { GallerySection } from '../../components/home/GallerySection';
import { SutlacSection } from '../../components/home/SutlacSection';
import { StorySection } from '../../components/home/StorySection';
import { ContactSection } from '../../components/home/ContactSection';

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isDailySpecial: boolean;
  isAvailable: boolean;
  category?: Category;
}

interface Settings {
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

export const Home: React.FC = () => {
  const [searchParams] = useSearchParams();
  const contactSectionRef = useRef<HTMLDivElement>(null);
  const categoriesSectionRef = useRef<HTMLDivElement>(null);
  const popularSectionRef = useRef<HTMLDivElement>(null);
  const whyUsSectionRef = useRef<HTMLDivElement>(null);
  const statsSectionRef = useRef<HTMLDivElement>(null);
  const gallerySectionRef = useRef<HTMLDivElement>(null);

  // States
  const [categories, setCategories] = useState<Category[]>([]);
  const [dailySpecial, setDailySpecial] = useState<MenuItem | null>(null);
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [sutlacImageUrl, setSutlacImageUrl] = useState<string>('');
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [menuCount, setMenuCount] = useState<number>(0);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [settings, setSettings] = useState<Settings>({
    restaurantName: 'KOÇ RESTAURANT',
    address: 'Etiler, Nispetiye Cad. No: 12, İstanbul',
    phone: '+90 (212) 555 01 01',
    email: 'rezervasyon@kocrestaurant.com',
    workingHours: 'Her Gün: 12:00 - 00:00',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_9V67s22Q7fN00efDph6D7s5iT6MwtFwZjBLChNtBIxQ6vVLRd5DAGVXxhWThDlZ9iSGeAGwwBG67-In0G9tCX5-n_rNizLA_8GKLCWY_USrub3bEZh6r5-KC7VcfEIO-oGGRFlLhZ766sgmojIsdX9hzppjf7LhLvfPexccNjtaTn85c2dYsz8DPbtBCfPxbC7VNdYkh6nIbQAkFTdhiHgoGr30FBuCTO4LVF0hbdUT3I4t5_tSR4o9lW0pV1QGiZronkxxVrKMt',
    facebookUrl: '#',
    instagramUrl: '#',
    aboutTitle: '',
    aboutText: '',
    aboutImages: ''
  });

  // SEO Schema & Hook Integration
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    'name': settings.restaurantName,
    'image': settings.logoUrl || `${window.location.origin}/restaurant-hero.png`,
    'telephone': settings.phone,
    'email': settings.email,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': settings.address,
      'addressLocality': 'Samsun',
      'addressCountry': 'TR'
    },
    'url': window.location.origin,
    'openingHours': settings.workingHours,
    'servesCuisine': 'Geleneksel Türk Mutfağı, Karadeniz Lezzetleri, Fırın Sütlaç',
    'priceRange': '$$'
  };

  useSEO({
    title: `${settings.restaurantName} | Samsun - Geleneksel Karadeniz Lezzetleri`,
    description: `Samsun'un en meşhur fırın sütlacı, el yapımı fırın tatlıları, ev yapımı tereyağlı baklava ve geleneksel Karadeniz lezzetleri ${settings.restaurantName}'ta.`,
    keywords: 'samsun fırın sütlaç, koç restaurant, samsun tatlıcı, samsun pide, dereköy fırın sütlaç, en iyi sütlaç samsun',
    ogImage: settings.logoUrl || `${window.location.origin}/restaurant-hero.png`,
    schema
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load Settings
        const settingsRes = await axios.get('/settings');
        if (settingsRes.data) setSettings(settingsRes.data);

        // Load Categories
        const categoriesRes = await axios.get('/categories');
        setCategories(categoriesRes.data);

        // Load Slides
        const slidesRes = await axios.get('/heroslides');
        if (slidesRes.data) setSlides(slidesRes.data);

        // Load Gallery items
        const galleryRes = await axios.get('/gallery');
        if (galleryRes.data) setGalleryItems(galleryRes.data);

        // Load Daily Specials
        const specialsRes = await axios.get('/menu/specials');
        if (specialsRes.data && specialsRes.data.length > 0) {
          setDailySpecial(specialsRes.data[0]);
        }

        // Load Menu Items for Popular Choices & Count
        const menuRes = await axios.get('/menu');
        if (menuRes.data) {
          setMenuCount(menuRes.data.length);
          // Filter popular items (where isPopular is true)
          const populars = menuRes.data.filter((item: any) => item.isPopular);
          // Fallback to first 3 items if none are marked popular
          setPopularItems(populars.length > 0 ? populars : menuRes.data.slice(0, 3));
          
          // Find Fırın Sütlaç image dynamically from menu items
          const sutlacItem = menuRes.data.find((item: any) =>
            item.name.toLowerCase().includes('sütlaç')
          );
          if (sutlacItem && sutlacItem.imageUrl) {
            setSutlacImageUrl(sutlacItem.imageUrl);
          }
        }
      } catch (err) {
        console.error('Error fetching home page data', err);
      }
    };
    fetchData();
  }, []);

  // Handle parameter-based smooth scrolling on mount/update
  useEffect(() => {
    const scrollTarget = searchParams.get('scroll');
    if (scrollTarget) {
      const scrollToTarget = () => {
        const targetRef = 
          scrollTarget === 'categories' ? categoriesSectionRef :
          scrollTarget === 'menu' ? popularSectionRef :
          scrollTarget === 'contact' ? contactSectionRef : null;
          
        if (targetRef && targetRef.current) {
          targetRef.current.scrollIntoView({ behavior: 'auto' });
        }
      };
      
      // Scroll instantly to avoid showing the top of the page
      scrollToTarget();
      
      // Run again after a tiny timeout to capture any late layout changes
      const timer = setTimeout(scrollToTarget, 40);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Slider */}
      <Hero dailySpecial={dailySpecial} slides={slides} />

      {/* 2. Neden Koç Restaurant Section (Hakkımızdaki kısımdan) */}
      <WhyUsSection ref={whyUsSectionRef} />

      {/* 3. Menü Section */}
      <CategoriesSection categories={categories} ref={categoriesSectionRef} />

      {/* 4. Popüler Yemekler Section */}
      <PopularSection popularItems={popularItems} ref={popularSectionRef} />

      {/* 5. Rakamlarla Koç Restaurant Section */}
      <StatsSection menuCount={menuCount} ref={statsSectionRef} />

      {/* 6. Galeriden Kareler Section */}
      <GallerySection items={galleryItems} ref={gallerySectionRef} />

      {/* 7. Sütlaç Section */}
      <SutlacSection imageUrl={sutlacImageUrl} />

      {/* 8. Restoran Hikayesi Section */}
      <StorySection 
        title={settings.aboutTitle} 
        text={settings.aboutText} 
        images={settings.aboutImages} 
      />

      {/* 9. Bizimle İletişime Geçin Section */}
      <ContactSection ref={contactSectionRef} />

      <Footer 
        settings={settings}
        activePage="home"
      />
    </div>
  );
};
