import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Setup: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler uyuşmuyor.');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/setup/create-admin', {
        username: username.trim(),
        email: email.trim(),
        password: password
      });
      
      setSuccess(response.data.message || 'Yönetici hesabı başarıyla oluşturuldu!');
      
      // Auto-redirect after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Hesap oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-md w-full bg-surface-container-lowest p-8 md:p-10 rounded-2xl shadow-xl border border-surface-container/50 relative z-10">
        <div className="text-center mb-10">
          <img 
            alt="Koç Restaurant Logo" 
            className="h-16 w-16 mx-auto mb-4 object-contain" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_9V67s22Q7fN00efDph6D7s5iT6MwtFwZjBLChNtBIxQ6vVLRd5DAGVXxhWThDlZ9iSGeAGwwBG67-In0G9tCX5-n_rNizLA_8GKLCWY_USrub3bEZh6r5-KC7VcfEIO-oGGRFlLhZ766sgmojIsdX9hzppjf7LhLvfPexccNjtaTn85c2dYsz8DPbtBCfPxbC7VNdYkh6nIbQAkFTdhiHgoGr30FBuCTO4LVF0hbdUT3I4t5_tSR4o9lW0pV1QGiZronkxxVrKMt" 
          />
          <h1 className="font-headline-md text-2xl text-primary tracking-tight">İLK KURULUM SİHİRBAZI</h1>
          <p className="text-xs text-on-surface-variant uppercase tracking-wider mt-1">Yönetici Hesabı Oluşturma</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-800 border border-green-200 rounded-lg text-sm font-medium flex flex-col gap-2">
            <span>{success}</span>
            <span className="text-xs opacity-75">3 saniye içinde giriş sayfasına yönlendiriliyorsunuz...</span>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="font-label-md text-xs text-on-surface-variant uppercase">Kullanıcı Adı</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined notranslate absolute left-3 text-on-surface-variant/70 text-lg" translate="no">person</span>
                <input
                  id="username"
                  type="text"
                  required
                  placeholder="Yönetici kullanıcı adı örn: admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg py-3 pl-10 pr-4 outline-none focus:border-secondary transition-colors font-body-md text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="font-label-md text-xs text-on-surface-variant uppercase">E-Posta</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined notranslate absolute left-3 text-on-surface-variant/70 text-lg" translate="no">mail</span>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="örn: yonetici@kocrestaurant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg py-3 pl-10 pr-4 outline-none focus:border-secondary transition-colors font-body-md text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="font-label-md text-xs text-on-surface-variant uppercase">Şifre</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined notranslate absolute left-3 text-on-surface-variant/70 text-lg" translate="no">lock</span>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="En az 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg py-3 pl-10 pr-4 outline-none focus:border-secondary transition-colors font-body-md text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="font-label-md text-xs text-on-surface-variant uppercase">Şifre Tekrarı</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined notranslate absolute left-3 text-on-surface-variant/70 text-lg" translate="no">lock_reset</span>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  placeholder="Şifrenizi tekrar girin"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg py-3 pl-10 pr-4 outline-none focus:border-secondary transition-colors font-body-md text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full bg-primary text-on-primary font-label-md uppercase py-4 rounded-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-55 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Hesap Oluşturuluyor...</span>
                </>
              ) : (
                <span>Kurulumu Tamamla ve Kaydet</span>
              )}
            </button>
          </form>
        )}

        <button 
          onClick={() => navigate('/login')}
          className="mt-6 text-center text-xs text-on-surface-variant hover:text-secondary block w-full transition-colors underline cursor-pointer"
        >
          Giriş Sayfasına Git
        </button>
      </div>
    </div>
  );
};
