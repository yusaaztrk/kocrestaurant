import React, { useState } from 'react';
import axios from 'axios';

export const ContactSection = React.forwardRef<HTMLDivElement, {}>((_, ref) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <section ref={ref} className="py-24 bg-surface px-margin-mobile md:px-margin-desktop w-full border-t border-surface-container-high">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-secondary font-label-md tracking-widest uppercase mb-2 block">İletişim</span>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-4">Bizimle İletişime Geçin</h2>
          <div className="w-16 h-1 bg-secondary"></div>
          <p className="text-on-surface-variant font-body-md mt-4 max-w-lg">
            Her türlü sorunuz, görüşünüz ve öneriniz için formu doldurarak bizimle iletişime geçebilirsiniz.
          </p>
        </div>

        <form onSubmit={handleContactSubmit} className="bg-surface-container-low p-8 md:p-12 rounded-2xl shadow-sm border border-surface-container gap-6 flex flex-col">
          {formStatus.text && (
            <div className={`p-4 rounded-lg text-sm font-medium ${
              formStatus.type === 'success' 
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
                className="bg-surface border border-outline-variant rounded-lg p-3 outline-none focus:border-secondary transition-colors"
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
                className="bg-surface border border-outline-variant rounded-lg p-3 outline-none focus:border-secondary transition-colors"
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
              className="bg-surface border border-outline-variant rounded-lg p-3 outline-none focus:border-secondary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="font-label-md text-xs text-on-surface-variant uppercase">Mesajınız *</label>
            <textarea
              id="message"
              required
              rows={5}
              placeholder="Mesajınızı buraya yazınız..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg p-3 outline-none focus:border-secondary transition-colors resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-on-primary font-label-md uppercase tracking-wider py-4 rounded-lg hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-55 cursor-pointer"
          >
            {isSubmitting ? 'Gönderiliyor...' : 'İletişim Formunu Gönder'}
          </button>
        </form>
      </div>
    </section>
  );
});

ContactSection.displayName = 'ContactSection';
