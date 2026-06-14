import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
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
}

export const Contact: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    title: `İletişim ve Rezervasyon | ${settings.restaurantName}`,
    description: `${settings.restaurantName} iletişim kanalları: Samsun Dereköy mevkisindeki restaurantımız için telefon, e-posta, açık adres ve harita koordinatları üzerinden bize ulaşın ya da rezervasyon formu gönderin.`,
    keywords: `koç restaurant iletişim, koç restaurant telefon, samsun fırın sütlaç rezervasyon, dereköy koç restaurant adres`,
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
        console.error('Error loading settings on contact page', err);
      }
    };
    loadSettings();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message) {
      setFormStatus({ type: 'error', text: 'Lütfen zorunlu alanları (Ad Soyad, E-posta, Mesaj) doldurun.' });
      return;
    }

    setIsSubmitting(true);
    setFormStatus({ type: null, text: '' });

    try {
      const response = await axios.post('/contact', {
        fullName,
        email,
        subject: subject || 'Genel İletişim',
        message
      });
      setFormStatus({ type: 'success', text: response.data.message || 'Mesajınız başarıyla iletildi.' });
      setFullName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.';
      setFormStatus({ type: 'error', text: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar
        restaurantName={settings.restaurantName}
        logoUrl={settings.logoUrl}
        activePage="contact"
        settings={settings}
      />

      {/* Contact Header Banner */}
      <section className="pt-32 pb-16 bg-surface-container-low w-full">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <span className="text-secondary font-label-md tracking-widest uppercase mb-2 block">Bize Ulaşın</span>
          <h1 className="font-display-lg text-4xl text-primary mb-6">İletişim</h1>
          <div className="w-16 h-1 bg-secondary mx-auto"></div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Info and Map */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-surface-container/60 shadow-sm space-y-6">
              <h2 className="font-display-lg text-2xl text-primary tracking-tight">İrtibat Bilgilerimiz</h2>
              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                Özel etkinlik talebinde bulunmak veya diğer tüm sorularınız için bize ulaşın.
              </p>

              <div className="space-y-4 pt-4 border-t border-surface-container">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined notranslate text-secondary text-xl mt-0.5" translate="no">location_on</span>
                  <div>
                    <h4 className="font-label-md text-xs uppercase tracking-wider text-primary font-semibold">Adres</h4>
                    <p className="font-body-md text-xs text-on-surface-variant mt-1 leading-relaxed">{settings.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined notranslate text-secondary text-xl mt-0.5" translate="no">call</span>
                  <div>
                    <h4 className="font-label-md text-xs uppercase tracking-wider text-primary font-semibold">Telefon</h4>
                    <p className="font-body-md text-xs text-on-surface-variant mt-1">{settings.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined notranslate text-secondary text-xl mt-0.5" translate="no">mail</span>
                  <div>
                    <h4 className="font-label-md text-xs uppercase tracking-wider text-primary font-semibold">E-Posta</h4>
                    <p className="font-body-md text-xs text-on-surface-variant mt-1">{settings.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined notranslate text-secondary text-xl mt-0.5" translate="no">schedule</span>
                  <div>
                    <h4 className="font-label-md text-xs uppercase tracking-wider text-primary font-semibold">Çalışma Saatleri</h4>
                    <p className="font-body-md text-xs text-on-surface-variant mt-1">{settings.workingHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="w-full h-80 rounded-2xl overflow-hidden shadow-sm border border-surface-container">
              <iframe
                title="Restaurant Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8452.933954279224!2d36.075274378175564!3d41.4920628953496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4088850bdebcf559%3A0x65918aa98c4a33b7!2sKo%C3%A7%20Restaurant!5e0!3m2!1str!2str!4v1781281030074!5m2!1str!2str"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-8 md:p-12 rounded-2xl shadow-sm border border-surface-container">
            <h3 className="font-display-lg text-2xl text-primary mb-2">Bize İletin</h3>
            <p className="font-body-md text-xs text-on-surface-variant mb-8">
              Geri bildirimleriniz ve tüm sorularınız için formu doldurabilirsiniz.
            </p>

            <form onSubmit={handleContactSubmit} className="gap-6 flex flex-col">
              {formStatus.text && (
                <div className={`p-4 rounded-lg text-sm font-medium ${formStatus.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                  {formStatus.text}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="fullName" className="font-label-md text-xs text-on-surface-variant uppercase">Adınız Soyadınız *</label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    placeholder="Ahmet Koç"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-surface border border-outline-variant rounded-lg p-3 text-xs outline-none focus:border-secondary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-label-md text-xs text-on-surface-variant uppercase">E-Posta Adresiniz *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="ahmet@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-surface border border-outline-variant rounded-lg p-3 text-xs outline-none focus:border-secondary transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="font-label-md text-xs text-on-surface-variant uppercase">Konu</label>
                <input
                  id="subject"
                  type="text"
                  placeholder="Teşekkür / Öneri / Genel Konular"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-surface border border-outline-variant rounded-lg p-3 text-xs outline-none focus:border-secondary transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="font-label-md text-xs text-on-surface-variant uppercase">Mesajınız *</label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  placeholder="Mesajınızı buraya yazınız..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-surface border border-outline-variant rounded-lg p-3 text-xs outline-none focus:border-secondary transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-on-primary font-label-md uppercase tracking-wider py-4 rounded-lg hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-55 cursor-pointer mt-4"
              >
                {isSubmitting ? 'Gönderiliyor...' : 'İletişim Formunu Gönder'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer
        settings={settings}
        activePage="contact"
      />
    </div>
  );
};

export default Contact;
