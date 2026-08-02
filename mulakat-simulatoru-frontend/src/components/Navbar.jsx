import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Settings, LogOut, Globe, LogIn, UserPlus, Trophy } from 'lucide-react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Kullanıcı');

  const menuRef = useRef(null);
  const langRef = useRef(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('userToken') || localStorage.getItem('access_token');
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

      if (token || storedUser.name || storedUser.email) {
        setIsLoggedIn(true);
        setUserName(storedUser.name || storedUser.username || storedUser.email?.split('@')[0] || 'seçgin');
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setProfileMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 md:px-12 py-4 bg-[#0b101d]/90 backdrop-blur-md border-b border-[#1e293b] sticky top-0 z-50">
      
      {/* LOGO */}
      <Link to="/" className="text-xl md:text-2xl font-black bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">
        MULAKAT.AI
      </Link>

      {/* ORTA MENÜ LİNKLERİ */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <Link to="/" className="hover:text-cyan-400 transition">{t('navHome', 'Ana Sayfa')}</Link>
        <Link to="/leaderboard" className="hover:text-cyan-400 transition flex items-center gap-1">
          <Trophy size={14} className="text-amber-400" />
          <span>{t('navLeaderboard', 'Liderlik')}</span>
        </Link>
        <a href="/#features" className="hover:text-cyan-400 transition">{t('navFeatures', 'Özellikler')}</a>
        <Link to="/interview" className="hover:text-cyan-400 transition">{t('navInterviews', 'Mülakatlar')}</Link>
        <a href="/#pricing" className="hover:text-cyan-400 transition">{t('navPricing', 'Fiyatlar')}</a>
        <a href="/#faq" className="hover:text-cyan-400 transition">{t('navFaq', 'SSS')}</a>
        <a href="/#contact" className="hover:text-cyan-400 transition">{t('navContact', 'İletişim')}</a>
      </div>

      {/* SAĞ KISIM: DİL SEÇİCİ + PROFİL / GİRİŞ & KAYIT */}
      <div className="flex items-center gap-3">
        
        {/* DİL DEĞİŞTİRME BUTONU */}
        <div className="relative" ref={langRef}>
          <button 
            onClick={() => setLangMenuOpen(prev => !prev)}
            className="flex items-center gap-2 bg-[#131b2e] border border-[#222f4c] hover:border-cyan-500/50 px-3 py-2 rounded-xl text-slate-200 text-xs font-bold transition cursor-pointer"
          >
            <Globe size={16} className="text-cyan-400" />
            <span className="uppercase">{i18n.language || 'tr'}</span>
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-[#131b2e] border border-[#222f4c] rounded-xl shadow-2xl py-1.5 z-50">
              <button 
                onClick={() => changeLanguage('tr')}
                className={`w-full text-left px-3 py-2 text-xs transition cursor-pointer ${i18n.language === 'tr' ? 'text-cyan-400 font-bold bg-[#1b2436]' : 'text-slate-300 hover:bg-[#1b2436]/60'}`}
              >
                Türkçe
              </button>
              <button 
                onClick={() => changeLanguage('en')}
                className={`w-full text-left px-3 py-2 text-xs transition cursor-pointer ${i18n.language === 'en' ? 'text-cyan-400 font-bold bg-[#1b2436]' : 'text-slate-300 hover:bg-[#1b2436]/60'}`}
              >
                English
              </button>
            </div>
          )}
        </div>

        {/* KOŞULLU RENDER */}
        {isLoggedIn ? (
          <div className="relative" ref={menuRef}>
            <div 
              onClick={() => setProfileMenuOpen(prev => !prev)}
              className="flex items-center gap-3 bg-[#131b2e] border border-[#222f4c] hover:border-cyan-500/50 px-4 py-2 rounded-2xl shadow-lg cursor-pointer transition select-none"
            >
              <div className="w-7 h-7 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-bold rounded-full flex items-center justify-center text-xs uppercase">
                {userName.charAt(0)}
              </div>
              <span className="text-sm font-medium text-slate-200">{userName}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); handleLogout(); }} 
                className="text-rose-400 hover:text-rose-300 transition p-1 ml-1 cursor-pointer"
                title={t('menuLogout', 'Çıkış Yap')}
              >
                <LogOut size={16} />
              </button>
            </div>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#131b2e] border border-[#222f4c] rounded-2xl shadow-2xl py-2 z-50">
                <div className="px-4 py-2 border-b border-[#222f4c] mb-1">
                  <p className="text-xs text-slate-400 font-mono">{t('accountLabel', 'Giriş yapılan hesap')}</p>
                  <p className="text-sm font-bold text-slate-200 truncate">{userName}</p>
                </div>
                
                <button 
                  onClick={() => { setProfileMenuOpen(false); navigate('/profile'); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-[#1b2436] hover:text-cyan-400 transition cursor-pointer text-left font-medium"
                >
                  <User size={16} className="text-cyan-400" />
                  <span>{t('menuProfile', 'Profilim')}</span>
                </button>

                <button 
                  onClick={() => { setProfileMenuOpen(false); navigate('/leaderboard'); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-[#1b2436] hover:text-amber-400 transition cursor-pointer text-left font-medium"
                >
                  <Trophy size={16} className="text-amber-400" />
                  <span>{t('menuLeaderboard', 'Liderlik Tablosu')}</span>
                </button>

                <button 
                  onClick={() => { setProfileMenuOpen(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-[#1b2436] hover:text-teal-400 transition cursor-pointer text-left font-medium"
                >
                  <Settings size={16} className="text-teal-400" />
                  <span>{t('menuSettings', 'Ayarlar')}</span>
                </button>

                <div className="border-t border-[#222f4c] my-1"></div>

                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-950/30 transition cursor-pointer text-left font-semibold"
                >
                  <LogOut size={16} />
                  <span>{t('menuLogout', 'Çıkış Yap')}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="flex items-center gap-1.5 bg-[#131b2e] hover:bg-[#1b2436] text-slate-200 border border-[#222f4c] px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <LogIn size={14} />
              <span>{t('navLogin', 'Giriş Yap')}</span>
            </Link>

            <Link
              to="/register"
              className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold px-3.5 py-2 rounded-xl text-xs transition shadow-md cursor-pointer"
            >
              <UserPlus size={14} />
              <span>{t('navRegister', 'Kayıt Ol')}</span>
            </Link>
          </div>
        )}

      </div>

    </nav>
  );
}