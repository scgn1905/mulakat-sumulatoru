import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle, Award } from 'lucide-react';
import { registerUser } from '../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor!');
      return;
    }

    try {
      // Backend'e istek atıyoruz (MySQL'e kaydediyor)
      await registerUser({ name, email, password });
      
      setSuccess('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);
    } catch (err) {
      setError(err.message || 'Kayıt sırasında bir hata oluştu.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 flex items-center justify-center p-4 md:p-8">
      
      {/* ANA SARMALAYICI KART */}
      <div className="max-w-5xl w-full bg-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* SOL PANEL: GÖRSEL + AVANTAJLAR VE ROZETLER (7 Kolon) */}
        <div className="lg:col-span-7 relative p-8 md:p-12 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b lg:border-b-0 lg:border-r border-slate-800/80">
          
          {/* Arka Plan Görseli & İnce Degrade */}
          <div 
            className="absolute inset-0 z-0 opacity-20 bg-cover bg-center pointer-events-none filter contrast-125 mix-blend-luminosity" 
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80')` }} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent z-0" />

          {/* Işık Efekti (Glow) */}
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none"></div>

          {/* ÜST BADGE */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-mono text-teal-400 bg-teal-950/80 border border-teal-800/60 px-3 py-1 rounded-full flex items-center gap-2">
              <Sparkles size={14} className="text-teal-400 animate-pulse" />
              Ücretsiz Başlangıç Paketi
            </span>
          </div>

          {/* ORTA BÖLÜM: BAŞLIK & VİTRİN KARTI */}
          <div className="relative z-10 my-8 space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-slate-100 leading-tight">
              Kariyerinde Zirveye <br />
              <span className="bg-gradient-to-r from-teal-300 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Yapay Zekâ ile Adım At
              </span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Hemen ücretsiz hesap oluşturarak simülasyonlara başla, mülakat tekniklerini geliştir ve hayalindeki pozisyona bir adım daha yaklaş.
            </p>

            {/* Başarı Rozeti Önizleme Kartı */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center gap-4 max-w-sm">
              <div className="w-10 h-10 bg-cyan-500/20 text-cyan-400 rounded-xl flex items-center justify-center shrink-0">
                <Award size={22} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 block">Ayda 3 Ücretsiz Simülasyon</span>
                <span className="text-[11px] text-slate-400">Temel yetkinlik ve STAR analizi hediye!</span>
              </div>
            </div>
          </div>

          {/* ALT BÖLÜM: AVANTAJLAR */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-cyan-400 shrink-0" />
              <span>Kredi Kartı Gerekmez</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-teal-400 shrink-0" />
              <span>Anında Erişim</span>
            </div>
          </div>

        </div>

        {/* SAĞ PANEL: KAYIT FORMU (5 Kolon) */}
        <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-center space-y-6 bg-slate-900/90">
          
          <div className="space-y-2">
            <div className="w-10 h-10 bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-xl flex items-center justify-center">
              <UserPlus size={20} />
            </div>
            <h1 className="text-2xl font-black text-slate-100">Hesap Oluştur</h1>
            <p className="text-slate-400 text-xs">Mülakat simülasyonuna başlamak için kayıt olun.</p>
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

          <form onSubmit={handleRegister} className="space-y-3.5">
            
            {/* Ad Soyad */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 ml-1">Ad Soyad</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ahmet Yılmaz"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            {/* E-posta */}
            <div className="space-y-1">
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            {/* Şifre */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 ml-1">Şifre</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            {/* Şifre Tekrar */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 ml-1">Şifre Tekrar</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Şifrenizi tekrar girin"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            {/* Gönder Butonu */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-500/10 cursor-pointer pt-3 mt-2"
            >
              <span>Kayıt Ol ve Başla</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Giriş Yap Linki */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Zaten hesabınız var mı?{' '}
              <Link to="/login" className="text-cyan-400 font-semibold hover:underline">
                Giriş Yapın
              </Link>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}