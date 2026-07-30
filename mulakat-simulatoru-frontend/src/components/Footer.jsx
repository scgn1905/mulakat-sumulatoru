import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, Mail, Globe } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 pt-16 pb-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* ÜST KISIM: LOGO VE KOLONLAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/60">
          
          {/* 1. KOLON: LOGO & AÇIKLAMA */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent inline-block">
              MULAKAT.AI
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Yapay zekâ destekli gerçekçi mülakat simülasyonları, STAR yöntemi analizleri ve kişiselleştirilmiş geri bildirimlerle kariyerine yön ver.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-800/50 px-3 py-1.5 rounded-xl w-fit">
              <Sparkles size={14} className="animate-pulse" />
              <span>{t('footerAiTag', 'AI Version 2.0 Live')}</span>
            </div>
          </div>

          {/* 2. KOLON: PLATFORM */}
          <div className="space-y-3">
            <h4 className="text-slate-100 font-bold text-xs uppercase font-mono tracking-wider">{t('footerPlatform', 'Platform')}</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/#features" className="hover:text-cyan-400 transition">Nasıl Çalışır?</Link></li>
              <li><Link to="/interview" className="hover:text-cyan-400 transition">Mülakat Senaryoları</Link></li>
              <li><Link to="/#pricing" className="hover:text-cyan-400 transition">Fiyatlar</Link></li>
              <li><Link to="/settings" className="hover:text-cyan-400 transition">AI Mülakatör Ayarları</Link></li>
            </ul>
          </div>

          {/* 3. KOLON: ŞİRKET & KAYNAKLAR */}
          <div className="space-y-3">
            <h4 className="text-slate-100 font-bold text-xs uppercase font-mono tracking-wider">{t('footerCompany', 'Şirket & Kaynaklar')}</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/#faq" className="hover:text-cyan-400 transition">SSS</Link></li>
              <li><Link to="/#contact" className="hover:text-cyan-400 transition">İletişim</Link></li>
              <li><Link to="/about" className="hover:text-cyan-400 transition">Hakkımızda</Link></li>
              <li><Link to="/about" className="hover:text-cyan-400 transition">Kariyer</Link></li>
            </ul>
          </div>

          {/* 4. KOLON: YASAL */}
          <div className="space-y-3">
            <h4 className="text-slate-100 font-bold text-xs uppercase font-mono tracking-wider">{t('footerLegal', 'Yasal')}</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/privacy" className="hover:text-cyan-400 transition">Gizlilik Politikası</Link></li>
              <li><Link to="/terms" className="hover:text-cyan-400 transition">Kullanım Şartları</Link></li>
              <li><Link to="/privacy" className="hover:text-cyan-400 transition">Çerez Politikası</Link></li>
              <li><Link to="/privacy" className="hover:text-cyan-400 transition">KVKK Aydınlatma Metni</Link></li>
            </ul>
          </div>

        </div>

        {/* ALT KISIM: TELİF HAKKI VE SOSYAL MEDYA */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 MULAKAT.AI. Tüm hakları saklıdır.</p>

          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-cyan-400 transition p-1" title="Website"><Globe size={16} /></Link>
            <a href="mailto:destek@mulakat.ai" className="hover:text-cyan-400 transition p-1" title="E-Posta"><Mail size={16} /></a>
          </div>
        </div>

      </div>
    </footer>
  );
}