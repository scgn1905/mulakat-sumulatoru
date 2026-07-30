import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, X, Sparkles } from 'lucide-react';

export default function AIBotAssistant() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleHelpClick = () => {
    // Eğer ana sayfada değilsek önce ana sayfaya git ve hash'e kaydır
    if (location.pathname !== '/') {
      navigate('/#contact');
    } else {
      // Ana sayfadaysak doğrudan iletişim/yardım bölümüne kaydır
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Konuşma Balonu (Hover veya Açıkken Görünür) */}
      {isOpen && (
        <div className="mb-3 w-72 bg-[#0b101d] border border-[#f97316]/40 rounded-2xl p-4 shadow-2xl animate-fade-in text-slate-100 text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#1b2436] pb-2">
            <div className="flex items-center gap-1.5 text-[#f97316] font-bold">
              <Sparkles size={14} />
              <span>AI Destek Asistanı</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-slate-300 leading-relaxed">
            Mülakat simülasyonu veya platform hakkında yardıma mı ihtiyacın var? Bana dokunarak hemen destek alabilirsin!
          </p>
          <button
            onClick={handleHelpClick}
            className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold py-2 rounded-xl transition cursor-pointer text-center shadow-md"
          >
            Yardım ve İletişime Git 🚀
          </button>
        </div>
      )}

      {/* Hareketli Hayvan / Maskot Butonu */}
      <div className="relative group">
        {/* Arkadaki Parlama Efekti */}
        <div className="absolute inset-0 bg-[#f97316] rounded-full blur-md opacity-40 animate-pulse"></div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 bg-gradient-to-tr from-[#f97316] to-amber-500 hover:from-amber-500 hover:to-[#f97316] text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 animate-bounce cursor-pointer border-2 border-white/20"
          style={{ animationDuration: '3s' }}
          title="Yardım İçin Dokun!"
        >
          {/* Sevimli Hayvan / Asistan İkonu (Baykuş / Robot) */}
          <span className="text-2xl filter drop-shadow-md">🦉</span>

          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0b101d] rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0b101d] rounded-full"></span>
        </button>
      </div>

    </div>
  );
}