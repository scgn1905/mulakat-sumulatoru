import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Mail, 
  User, 
  Send, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  HelpCircle,
  Globe
} from 'lucide-react';

export default function Contact() {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'general', message: '' });
      
      setTimeout(() => setSubmitted(false), 4000);
    }, 1000);
  };

  return (
    <section id="contact" className="w-full py-16 px-4 md:px-12">
      <div className="max-w-6xl mx-auto bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 md:p-12 shadow-2xl backdrop-blur-xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          
          {/* SOL KISIM: İLETİŞİM BİLGİLERİ VE SOSYAL MEDYA */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <span className="text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase">
                {t('contactTag', '// İLETİŞİME GEÇİN')}
              </span>
              <h2 className="text-3xl font-black text-slate-100 mt-2">
                {t('contactTitle', 'Sorularınız mı var?')}
              </h2>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                {t('contactDesc', 'Mülakat simülatörümüz, kurumsal iş birlikleri veya önerileriniz için bize mesaj gönderebilirsiniz.')}
              </p>
            </div>

            {/* İletişim Kartları */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4 p-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl">
                <div className="w-10 h-10 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <span className="text-xs font-mono text-slate-400 block">E-posta Adresi</span>
                  <a href="mailto:yildirimsecgin123@mulakat.ai" className="text-sm font-semibold text-slate-200 hover:text-cyan-400 transition">
                    yildirimsecgin123@mulakat.ai
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl">
                <div className="w-10 h-10 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <span className="text-xs font-mono text-slate-400 block">Ortalama Yanıt Süresi</span>
                  <span className="text-sm font-semibold text-slate-200">24 Saat İçinde</span>
                </div>
              </div>
            </div>

            {/* Sosyal Medya İkonları */}
            <div className="pt-4">
              <span className="text-xs font-mono text-slate-400 block mb-3">Bizi Takip Edin</span>
              <div className="flex items-center gap-3">
                <a href="#" className="p-3 bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 rounded-xl transition cursor-pointer" title="Website">
                  <Globe size={18} />
                </a>
                <a href="#" className="p-3 bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 rounded-xl transition cursor-pointer" title="GitHub">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </a>
                <a href="#" className="p-3 bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 rounded-xl transition cursor-pointer" title="LinkedIn">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.262-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* SAĞ KISIM: İLETİŞİM FORMU */}
          <div className="lg:col-span-3">
            
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center p-8 bg-emerald-950/30 border border-emerald-500/40 rounded-3xl text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-bold text-slate-100">Mesajınız Alındı!</h3>
                <p className="text-sm text-slate-300 max-w-md">
                  Bizimle iletişime geçtiğiniz için teşekkür ederiz. En kısa sürede e-posta adresiniz üzerinden geri dönüş yapacağız.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">Ad Soyad</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                      <input 
                        type="text" 
                        name="name"
                        required
                        placeholder="Örn: Seçgin Yıldırım"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">E-posta Adresi</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                      <input 
                        type="email" 
                        name="email"
                        required
                        placeholder="ornek@mail.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">İletişim Konusu</label>
                  <div className="relative">
                    <HelpCircle size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 focus:outline-none transition cursor-pointer appearance-none"
                    >
                      <option value="general">Genel Soru & Bilgi</option>
                      <option value="support">Teknik Destek & Hata Bildirimi</option>
                      <option value="business">Kurumsal İş Birliği & Sponsorluk</option>
                      <option value="feedback">Öneri & Geri Bildirim</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Mesajınız</label>
                  <div className="relative">
                    <MessageSquare size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                    <textarea 
                      name="message"
                      required
                      rows={4}
                      placeholder="Sorunuzu veya mesajınızı detaylıca belirtin..."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 focus:outline-none transition resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-extrabold py-3.5 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.2)] transition cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Gönderiliyor...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Mesajı Gönder</span>
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}