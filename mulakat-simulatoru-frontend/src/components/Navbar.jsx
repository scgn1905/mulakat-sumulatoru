import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, LogOut, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  // Oturum durumunu kontrol eden ve güncelleyen fonksiyon
  const checkAuthStatus = () => {
    const loginStatus = localStorage.getItem('isLoggedIn');
    const storedName = localStorage.getItem('userName');
    const token = localStorage.getItem('token');

    // Hem isLoggedIn true olmalı hem de token/name geçerli olmalı
    if ((loginStatus === 'true' || (token && token !== 'null' && token !== 'undefined')) && storedName) {
      setIsLoggedIn(true);
      setUserName(storedName);
    } else {
      setIsLoggedIn(false);
      setUserName('');
    }
  };

  useEffect(() => {
    checkAuthStatus();

    // Sekmeler arası veya localStorage güncellemelerini anlık yakalamak için event dinleyici
    window.addEventListener('storage', checkAuthStatus);
    
    // Özel bir event tetiklenirse anında yakala (Giriş sayfasından yönlenirken kullanılabilir)
    window.addEventListener('authChange', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authChange', checkAuthStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName('');
    navigate('/', { replace: true });
    window.location.reload();
  };

  // Anasayfa içi veya dışından ilgili bölüme kusursuz geçiş yapma fonksiyonu
  const handleScrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-black text-cyan-400 tracking-wider">
          MULAKAT.AI
        </Link>

        {/* Tüm Menü Linkleri */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link to="/" className="hover:text-cyan-400 transition">Ana Sayfa</Link>
          <button onClick={() => handleScrollToSection('features')} className="hover:text-cyan-400 transition cursor-pointer">Özellikler</button>
          <Link to="/interview" className="hover:text-cyan-400 transition">Mülakatlar</Link>
          <button onClick={() => handleScrollToSection('pricing')} className="hover:text-cyan-400 transition cursor-pointer">Fiyatlar</button>
          <button onClick={() => handleScrollToSection('faq')} className="hover:text-cyan-400 transition cursor-pointer">SSS</button>
          <button onClick={() => handleScrollToSection('contact')} className="hover:text-cyan-400 transition cursor-pointer">İletişim</button>
        </nav>

        {/* Sağ Taraf: Giriş Durumuna Göre Kullanıcı Bilgisi veya Butonlar */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-xs">
                {userName ? userName.charAt(0).toUpperCase() : <User size={14} />}
              </div>
              <span className="text-sm font-bold text-slate-200">{userName}</span>
              
              <button
                onClick={handleLogout}
                title="Çıkış Yap"
                className="ml-2 p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-cyan-400 px-4 py-2.5 transition cursor-pointer"
              >
                <LogIn size={16} />
                <span>Giriş Yap</span>
              </button>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 text-sm font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 px-5 py-2.5 rounded-xl transition cursor-pointer shadow-lg shadow-cyan-400/20"
              >
                <UserPlus size={16} />
                <span>Kayıt Ol</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}