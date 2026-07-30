import React from 'react';
import { Sparkles, Target, Users, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto py-12 space-y-12 text-slate-200">
      <div className="text-center space-y-4">
        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-3.5 py-1.5 rounded-full inline-flex items-center gap-2">
          <Sparkles size={14} className="text-cyan-400" />
          // BİZ KİMİZ
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-slate-100">
          Mülakat Süreçlerini <span className="bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">Yapay Zekâ ile Dönüştürüyoruz</span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          MULAKAT.AI, adayların iş mülakatlarındaki heyecan ve bocalama anlarını geride bırakıp, STAR metodolojisine dayalı yapay zekâ analizleriyle kendilerini en iyi şekilde ifade etmelerini sağlamak için geliştirilmiştir.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center">
            <Target size={20} />
          </div>
          <h3 className="font-bold text-lg text-slate-100">Misyonumuz</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Adaylara gerçek mülakat ortamı hissi sunarak eksik yönlerini anında tespit etmek ve kişiselleştirilmiş geri bildirimlerle mülakat başarı oranlarını artırmak.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 bg-teal-500/10 text-teal-400 rounded-xl flex items-center justify-center">
            <Users size={20} />
          </div>
          <h3 className="font-bold text-lg text-slate-100">Vizyonumuz</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Türkiye'de ve globalde iş arayan her adayın mülakata girmeden önce kullandığı bir numaralı kariyer simülatörü ve asistanı olmak.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
            <Award size={20} />
          </div>
          <h3 className="font-bold text-lg text-slate-100">STAR Analizi</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cevapları Durum, Görev, Aksiyon ve Sonuç metriklerine ayırarak kurumsal İK standartlarında profesyonel değerlendirme sunuyoruz.
          </p>
        </div>
      </div>
    </div>
  );
}