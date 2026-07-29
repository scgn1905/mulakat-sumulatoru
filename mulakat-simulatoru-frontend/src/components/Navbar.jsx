import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(newLang);
  };

  const handleNavClick = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full bg-slate-950/80 border-b border-slate-800 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="font-black text-xl text-cyan-400 tracking-wider">
          MULAKAT.AI
        </Link>

        {/* ORTA MENÜ LİNKLERİ */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link to="/" className="hover:text-cyan-400 transition">{t('home')}</Link>
          
          <button onClick={() => handleNavClick('features')} className="hover:text-cyan-400 transition cursor-pointer">
            {t('features')}
          </button>

          <Link to="/interview" className="hover:text-cyan-400 transition">
            {t('interviews')}
          </Link>

          <button onClick={() => handleNavClick('pricing')} className="hover:text-cyan-400 transition cursor-pointer">
            {t('pricing')}
          </button>

          <button onClick={() => handleNavClick('faq')} className="hover:text-cyan-400 transition cursor-pointer">
            {t('faq')}
          </button>

          <button onClick={() => handleNavClick('contact')} className="hover:text-cyan-400 transition cursor-pointer">
            {t('contact')}
          </button>
        </nav>

        {/* SAĞ TARAF: DİL BUTONU & AUTH */}
        <div className="flex items-center gap-3">
          {/* TR / EN Dil Seçici */}
          <button 
            onClick={toggleLanguage} 
            className="flex items-center gap-1.5 text-xs font-bold bg-slate-900 border border-slate-800 hover:border-cyan-500/50 px-3 py-2 rounded-xl text-cyan-400 transition cursor-pointer mr-1"
          >
            <Globe size={15} />
            <span>{i18n.language.toUpperCase()}</span>
          </button>

          <Link 
            to="/login" 
            className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-400 font-semibold text-xs md:text-sm px-3 py-2 transition"
          >
            <LogIn size={16} />
            <span>{t('login')}</span>
          </Link>

          <Link 
            to="/register" 
            className="flex items-center gap-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs md:text-sm transition shadow-[0_0_15px_rgba(34,211,238,0.3)]"
          >
            <UserPlus size={16} />
            <span>{t('register')}</span>
          </Link>
        </div>

      </div>
    </header>
  );
}