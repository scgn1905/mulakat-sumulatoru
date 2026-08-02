import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';
import { loginUser } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !password) {
      setError('Lütfen e-posta ve şifrenizi girin.');
      return;
    }

    try {
      // Backend'e istek atıyoruz (MySQL veritabanından kontrol ediyor)
      const data = await loginUser({ email, password });
      
      const loggedUser = data.user;
      
      // Oturum bilgilerini localStorage'a kaydediyoruz
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', loggedUser.name);
      localStorage.setItem('user', JSON.stringify(loggedUser));

      setSuccess('Giriş başarılı! Yönlendiriliyorsunuz...');
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);

    } catch (err) {
      setError(err.message || 'E-posta veya şifre hatalı.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 flex items-center justify-center p-4 md:p-8">
      
      {/* ANA SARMALAYICI KART */}
      <div className="max-w-5xl w-full bg-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* SOL PANEL: GÖRSEL + AI MÜLAKAT KARTI & ÖZELLİKLER (7 Kolon) */}
        <div className="lg:col-span-7 relative p-8 md:p-12 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b lg:border-b-0 lg:border-r border-slate-800/80">
          
          {/* Arka Plan Görseli & İnce Degrade */}
          <div 
            className="absolute inset-0 z-0 opacity-20 bg-cover bg-center pointer-events-none filter contrast-125 mix-blend-luminosity" 
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80')` }} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent z-0" />

          {/* Işık Efekti (Glow) */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

          {/* ÜST LOGO / BADGE */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-3 py-1 rounded-full flex items-center gap-2">
              <Sparkles size={14} className="text-cyan-400 animate-pulse" />
              Yapay Zekâ Destekli Simülasyon
            </span>
          </div>

          {/* ORTA BÖLÜM: BAŞLIK & MÜLAKAT KARTI ÖNİZLEMESİ */}
          <div className="relative z-10 my-8 space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-slate-100 leading-tight">
              Geleceğin Mülakat <br />
              <span className="bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">
                Deneyimini Keşfet
              </span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Gerçekçi İK ve teknik senaryolarla pratik yap, yapay zekâ analizleriyle eksiklerini tamamla ve mülakat özgüvenini katla.
            </p>

            {/* AI Canlı Skor Önizleme Kartı */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 max-w-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                  <span className="text-xs font-mono text-slate-300">Canlı Analiz Motoru</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-900">STAR Metodu</span>
              </div>
              <p className="text-xs text-slate-300 italic">"Geri bildirim diliniz analitik ve çözüm odaklı. İletişim puanı: 94/100"</p>
            </div>
          </div>

          {/* ALT BÖLÜM: MADDELER / AVANTAJLAR */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-cyan-400 shrink-0" />
              <span>Anlık Ses & Metin Analizi</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-teal-400 shrink-0" />
              <span>Sektöre Özel Sorular</span>
            </div>
          </div>

        </div>

        {/* SAĞ PANEL: FORM ALANI (5 Kolon) */}
        <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-center space-y-6 bg-slate-900/90">
          
          <div className="space-y-2">
            <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl flex items-center justify-center">
              <LogIn size={20} />
            </div>
            <h1 className="text-2xl font-black text-slate-100">Giriş Yap</h1>
            <p className="text-slate-400 text-xs">Simülatöre erişmek için bilgilerinizi girin.</p>
          </div>

          {/* Hata ve Başarı Mesaj Kutuları */}
          {error && (
            <div className="p-3 text-xs text-red-400 bg-red-950/50 border border-red-800 rounded-xl">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-xs text-green-400 bg-green-950/50 border border-green-800 rounded-xl">
              {success}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* E-posta */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 ml-1">E-posta Adresi</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@mail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            {/* Şifre */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1 mr-1">
                <label className="text-xs font-medium text-slate-300">Şifre</label>
                <Link to="/forgot-password" className="text-xs text-cyan-400 hover:underline font-mono">
                  Şifremi Unuttum?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            {/* Gönder Butonu */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-500/10 cursor-pointer pt-3 mt-2"
            >
              <span>Giriş Yap ve Başla</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Kayıt Ol Linki */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Hesabınız yok mu?{' '}
              <Link to="/register" className="text-cyan-400 font-semibold hover:underline">
                Hemen Kayıt Olun
              </Link>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}