import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const ContactMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });

  const decodeHtmlEntities = (value: string) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = value;
    return textarea.value;
  };

  const normalizeMessage = (msg: ContactMessage): ContactMessage => ({
    ...msg,
    fullName: decodeHtmlEntities(msg.fullName),
    subject: decodeHtmlEntities(msg.subject),
    message: decodeHtmlEntities(msg.message)
  });

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/contact');
      setMessages(response.data.map(normalizeMessage));
    } catch (err) {
      console.error('Error loading messages', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleOpenMessage = async (msg: ContactMessage) => {
    setSelectedMessage(normalizeMessage(msg));

    if (!msg.isRead) {
      try {
        await axios.put(`/contact/${msg.id}/read`);
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
      } catch (err) {
        console.error('Error marking message as read', err);
      }
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`"${name}" tarafından gönderilen mesajı silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      await axios.delete(`/contact/${id}`);
      showStatus('success', 'Mesaj başarıyla silindi.');
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      loadMessages();
    } catch (err) {
      console.error('Error deleting message', err);
      showStatus('error', 'Mesaj silinirken bir hata oluştu.');
    }
  };

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => {
      setStatusMsg({ type: null, text: '' });
    }, 3500);
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="animate-in fade-in duration-200">
      {/* Header */}
      <header className="mb-12">
        <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Mesaj Kutusu</h2>
        <p className="font-body-md text-on-surface-variant text-sm mt-1">İletişim ve rezervasyon formundan gönderilen müşteri mektuplarını okuyun ve yönetin.</p>
      </header>

      {statusMsg.text && (
        <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${
          statusMsg.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {statusMsg.text}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Messages List */}
          <div className="lg:col-span-5 bg-surface-container-lowest p-6 rounded-2xl border border-surface-container card-elevation">
            <h3 className="font-headline-md text-lg text-primary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">inbox</span>
              Gelen Mesajlar ({messages.length})
            </h3>

            {messages.length === 0 ? (
              <p className="text-sm text-on-surface-variant text-center py-12">Gelen kutunuz boş.</p>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 no-scrollbar">
                {messages.map((msg) => (
                  <div 
                    key={msg.id}
                    onClick={() => handleOpenMessage(msg)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${
                      selectedMessage?.id === msg.id 
                        ? 'border-secondary bg-surface' 
                        : msg.isRead 
                          ? 'border-surface-container bg-surface-container-low/50' 
                          : 'border-outline-variant bg-surface-container-low font-bold shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <span className="text-xs text-primary truncate max-w-[150px]">{msg.fullName}</span>
                      <span className="text-[10px] text-on-surface-variant font-normal">{formatDate(msg.createdAt)}</span>
                    </div>
                    <h4 className="text-xs text-secondary truncate mb-1">{msg.subject}</h4>
                    <p className="text-xs text-on-surface-variant line-clamp-1 font-normal">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Content Detail view */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-surface-container card-elevation min-h-[40vh] flex flex-col justify-between">
            {selectedMessage ? (
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-start border-b border-surface-container pb-4 mb-6">
                    <div>
                      <h3 className="font-headline-md text-lg text-primary">{selectedMessage.fullName}</h3>
                      <p className="text-xs text-on-surface-variant mt-1">{selectedMessage.email}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-on-surface-variant block">{formatDate(selectedMessage.createdAt)}</span>
                      <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded uppercase mt-2 ${
                        selectedMessage.isRead ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {selectedMessage.isRead ? 'Okundu' : 'Yeni'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold block mb-2">Konu</span>
                    <h4 className="font-headline-md text-base text-secondary">{selectedMessage.subject}</h4>
                  </div>

                  <div>
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold block mb-2">Mesaj</span>
                    <p className="bg-surface border border-surface-container p-5 rounded-xl text-sm leading-relaxed text-primary whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-surface-container">
                  <a 
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md text-xs uppercase hover:opacity-90 active:scale-95 transition-all flex items-center gap-1 shadow"
                  >
                    <span className="material-symbols-outlined text-sm">reply</span>
                    Cevapla
                  </a>
                  <button 
                    onClick={() => handleDelete(selectedMessage.id, selectedMessage.fullName)}
                    className="border border-red-200 hover:bg-red-50 text-red-600 px-6 py-2.5 rounded-lg font-label-md text-xs uppercase hover:text-red-700 active:scale-95 transition-all flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Sil
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-5xl text-outline-variant">mail_outline</span>
                <p className="mt-4 font-body-md text-sm">Detayları okumak için gelen kutusundan bir mesaj seçin.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
