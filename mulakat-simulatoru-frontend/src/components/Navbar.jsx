import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Settings, LogOut, Globe } from 'lucide-react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const langRef = useRef(null);

  // Menülerin dışına tıklandığında kapanması için
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
    navigate('/login');
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 md:px-12 py-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50">
      
      {/* LOGO */}
      <Link to="/" className="text-xl md:text-2xl font-black bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">
        MULAKAT.AI
      </Link>

      {/* ORTA MENÜ LİNKLERİ (Dil Destekli) */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <Link to="/" className="hover:text-cyan-400 transition">{t('navHome', 'Ana Sayfa')}</Link>
        <a href="/#features" className="hover:text-cyan-400 transition">{t('navFeatures', 'Özellikler')}</a>
        <Link to="/interview" className="hover:text-cyan-400 transition">{t('navInterviews', 'Mülakatlar')}</Link>
        <a href="/#pricing" className="hover:text-cyan-400 transition">{t('navPricing', 'Fiyatlar')}</a>
        <a href="/#faq" className="hover:text-cyan-400 transition">{t('navFaq', 'SSS')}</a>
        <a href="/#contact" className="hover:text-cyan-400 transition">{t('navContact', 'İletişim')}</a>
      </div>

      {/* SAĞ KISIM: DİL SEÇİCİ + KULLANICI PROFİL ALANI */}
      <div className="flex items-center gap-3">
        
        {/* DİL DEĞİŞTİRME BUTONU */}
        <div className="relative" ref={langRef}>
          <button 
            onClick={() => setLangMenuOpen(prev => !prev)}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 px-3 py-2 rounded-xl text-slate-300 text-xs font-medium transition cursor-pointer"
          >
            <Globe size={15} className="text-cyan-400" />
            <span className="uppercase">{i18n.language || 'tr'}</span>
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1.5 z-50">
              <button 
                onClick={() => changeLanguage('tr')}
                className={`w-full text-left px-3 py-2 text-xs transition cursor-pointer ${i18n.language === 'tr' ? 'text-cyan-400 font-bold bg-slate-800/50' : 'text-slate-300 hover:bg-slate-800/40'}`}
              >
                Türkçe
              </button>
              <button 
                onClick={() => changeLanguage('en')}
                className={`w-full text-left px-3 py-2 text-xs transition cursor-pointer ${i18n.language === 'en' ? 'text-cyan-400 font-bold bg-slate-800/50' : 'text-slate-300 hover:bg-slate-800/40'}`}
              >
                English
              </button>
            </div>
          )}
        </div>

        {/* KULLANICI PROFİL ALANI VE AÇILIR MENÜ */}
        <div className="relative" ref={menuRef}>
          <div 
            onClick={() => setProfileMenuOpen(prev => !prev)}
            className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 px-4 py-2 rounded-2xl shadow-lg cursor-pointer transition select-none"
          >
            <div className="w-7 h-7 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-bold rounded-full flex items-center justify-center text-xs">
              S
            </div>
            <span className="text-sm font-medium text-slate-200">seçgin</span>
            <div className="text-rose-400 hover:text-rose-300 transition p-1 ml-1">
              <LogOut size={16} />
            </div>
          </div>

          {/* Açılır Menü (Profil, Ayarlar, Çıkış Yap) */}
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-800/80 mb-1">
                <p className="text-xs text-slate-400 font-mono">{t('accountLabel', 'Giriş yapılan hesap')}</p>
                <p className="text-sm font-bold text-slate-200 truncate">seçgin</p>
              </div>
              
              <button 
                onClick={() => { setProfileMenuOpen(false); navigate('/profile'); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/60 hover:text-cyan-400 transition cursor-pointer text-left"
              >
                <User size={16} className="text-cyan-400" />
                <span>{t('menuProfile', 'Profilim')}</span>
              </button>

              <button 
                onClick={() => { setProfileMenuOpen(false); navigate('/settings'); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/60 hover:text-cyan-400 transition cursor-pointer text-left"
              >
                <Settings size={16} className="text-teal-400" />
                <span>{t('menuSettings', 'Ayarlar')}</span>
              </button>

              <div className="border-t border-slate-800/80 my-1"></div>

              <button 
                onClick={() => { setProfileMenuOpen(false); handleLogout(); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-950/30 transition cursor-pointer text-left"
              >
                <LogOut size={16} />
                <span>{t('menuLogout', 'Çıkış Yap')}</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </nav>
  );
}