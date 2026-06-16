import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Footer } from '../../components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../../hooks/useSEO';

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

export const About: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings>({
    restaurantName: 'KOÇ RESTAURANT',
    address: 'Etiler, Nispetiye Cad. No: 12, İstanbul',
    phone: '+90 (212) 555 01 01',
    email: 'rezervasyon@kocrestaurant.com',
    workingHours: 'Her Gün: 12:00 - 00:00',
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_9V67s22Q7fN00efDph6D7s5iT6MwtFwZjBLChNtBIxQ6vVLRd5DAGVXxhWThDlZ9iSGeAGwwBG67-In0G9tCX5-n_rNizLA_8GKLCWY_USrub3bEZh6r5-KC7VcfEIO-oGGRFlLhZ766sgmojIsdX9hzppjf7LhLvfPexccNjtaTn85c2dYsz8DPbtBCfPxbC7VNdYkh6nIbQAkFTdhiHgoGr30FBuCTO4LVF0hbdUT3I4t5_tSR4o9lW0pV1QGiZronkxxVrKMt',
    facebookUrl: '#',
    instagramUrl: '#'
  });

  useSEO({
    title: `Hikayemiz ve Hakkımızda | ${settings.restaurantName}`,
    description: `${settings.restaurantName} hikayesi ve mutfak prensipleri: 30 yıllık tecrübeyle taş fırında pişen sütlaçlarımız ve Karadeniz mutfağı değerlerimiz hakkında bilgi edinin.`,
    keywords: `koç restaurant hakkında, koç restaurant hikayesi, samsun fırın sütlaç tarihi, karadeniz mutfak kültürü`,
    ogImage: settings.logoUrl || `${window.location.origin}/restaurant-hero.png`
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsRes = await axios.get('/settings');
        if (settingsRes.data) {
          setSettings(settingsRes.data);
        }
      } catch (err) {
        console.error('Error loading settings on about page', err);
      }
    };
    loadSettings();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* About Header Banner */}
      <section className="pt-32 pb-16 bg-surface-container-low w-full">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <span className="text-secondary font-label-md tracking-widest uppercase mb-2 block">Lezzetin Hikayesi</span>
          <h1 className="font-display-lg text-4xl text-primary mb-6">Hakkımızda</h1>
          <div className="w-16 h-1 bg-secondary mx-auto"></div>
        </div>
      </section>

      {/* Story Section */}
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-display-lg text-3xl text-primary tracking-tight font-bold">
              {settings.aboutTitle || "Koç Restaurant Hikayesi"}
            </h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed text-sm whitespace-pre-line">
              {settings.aboutText || `Şehrin kalbinde, gastronomi meraklılarına unutulmaz anlar yaşatmak amacıyla kurulan KOÇ RESTAURANT, geleneksel mutfak kültürünü modern dokunuşlar ve yenilikçi tekniklerle yeniden yorumluyor.\n\nHer bir tabağımızda, Anadolu'nun verimli topraklarından ve Ege'nin taze sularından özenle seçilen en kaliteli malzemelerin hikayesini anlatıyoruz. Alanında uzman şeflerimiz, mutfaktaki yaratıcılıklarını her detayı titizlikle planlanmış tariflerle buluşturuyor.\n\nBizim için yemek sunumu, sadece bir servis değil; tüm duyulara hitap eden bir sanat ve misafirlerimizle kurduğumuz samimi bir bağdır. Koç Restaurant çatısı altında geçireceğiniz her anın, damaklarınızda unutulmaz izler bırakması en büyük önceliğimizdir.`}
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/menu')}
                className="bg-primary text-on-primary px-8 py-3.5 rounded-lg font-label-md text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-md text-center"
              >
                Menümüzü İnceleyin
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="bg-surface hover:bg-surface-container border border-outline px-8 py-3.5 rounded-lg font-label-md text-xs uppercase tracking-wider text-center cursor-pointer transition-all active:scale-95"
              >
                Bize Ulaşın
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            {(settings.aboutImages 
              ? settings.aboutImages.split(',').map(url => url.trim()).filter(Boolean)
              : [
                  "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&auto=format&fit=crop",
                  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop"
                ]
            ).slice(0, 2).map((imgUrl, idx) => (
              <img 
                key={idx}
                className={`w-full h-72 object-cover rounded-2xl shadow-md ${idx === 1 ? 'mt-8' : ''}`}
                alt={`Hikayemiz Görsel ${idx + 1}`}
                src={imgUrl}
              />
            ))}
          </div>
        </div>

        {/* Values Section */}
        <section className="mt-24">
          <div className="text-center mb-16">
            <span className="text-secondary font-label-md tracking-widest uppercase mb-2 block">Prensiplerimiz</span>
            <h3 className="font-display-lg text-2xl text-primary">Neden Koç Restaurant?</h3>
            <div className="w-12 h-0.5 bg-secondary mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-surface-container/60 shadow-sm text-center flex flex-col items-center">
              <span className="material-symbols-outlined notranslate text-secondary text-4xl mb-4" translate="no">temp_preferences_custom</span>
              <h4 className="font-headline-md text-base text-primary mb-2">Taze Malzemeler</h4>
              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                Her sabah yerel üreticilerden temin edilen en taze sebzeler ve güvenilir kaynaklardan sağlanan et ürünleri.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-surface-container/60 shadow-sm text-center flex flex-col items-center">
              <span className="material-symbols-outlined notranslate text-secondary text-4xl mb-4" translate="no">clean_hands</span>
              <h4 className="font-headline-md text-base text-primary mb-2">Hijyenik Ortam</h4>
              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                Mutfak hazırlığından servis aşamasına kadar uluslararası gıda güvenliği ve sanitasyon standartlarına tam uyum.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-surface-container/60 shadow-sm text-center flex flex-col items-center">
              <span className="material-symbols-outlined notranslate text-secondary text-4xl mb-4" translate="no">speed</span>
              <h4 className="font-headline-md text-base text-primary mb-2">Hızlı Servis</h4>
              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                Sıcaklığını ve tazeliğini kaybetmeden, şık sunumlarla masanıza en kısa sürede ulaştırılan siparişler.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-surface-container/60 shadow-sm text-center flex flex-col items-center">
              <span className="material-symbols-outlined notranslate text-secondary text-4xl mb-4" translate="no">sentiment_satisfied</span>
              <h4 className="font-headline-md text-base text-primary mb-2">Müşteri Memnuniyeti</h4>
              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                Her bir misafirimize kendisini özel hissettiren profesyonel, güler yüzlü ve kaliteli bir ağırlama deneyimi.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer 
        settings={settings}
        activePage="about"
      />
    </div>
  );
};

export default About;
