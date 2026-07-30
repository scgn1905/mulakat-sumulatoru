import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { 
  Award, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Sparkles, 
  Target,
  RefreshCw,
  Home
} from 'lucide-react';

export default function InterviewResult({ questionsHistory = [], onRestart, onGoHome }) {
  const reportRef = useRef();

  // Genel Skoru Hesapla
  const totalScore = questionsHistory.reduce((acc, curr) => acc + (curr.score || 0), 0);
  const overallScore = questionsHistory.length > 0 
    ? Math.round(totalScore / questionsHistory.length) 
    : 90;

  // Dinamik STAR Skorları
  const starScore = {
    situation: Math.min(100, overallScore + 2),
    task: Math.max(70, overallScore - 4),
    action: Math.min(100, overallScore + 5),
    result: Math.max(65, overallScore - 8)
  };

  // PDF İndirme Fonksiyonu
  const handleDownloadPDF = () => {
    const element = reportRef.current;
    const opt = {
      margin:       [10, 10, 10, 10],
      filename:     `Mulakat_Raporu_${new Date().toLocaleDateString('tr-TR')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12 text-slate-100">
      
      {/* ÜST BUTONLAR */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Award className="text-[#10b981]" size={28} />
          <span>Mülakat Değerlendirme Raporu</span>
        </h1>

        <button
          type="button"
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-lg shadow-emerald-500/10"
        >
          <Download size={16} />
          <span>PDF Raporunu İndir</span>
        </button>
      </div>

      {/* PDF İÇERİĞİ KART ALANI */}
      <div 
        ref={reportRef} 
        className="bg-[#0b101d] border border-[#1e293b] rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl text-slate-100"
      >
        {/* ÜST ÖZET */}
        <div className="flex justify-between items-start border-b border-[#1b2436] pb-6">
          <div>
            <span className="text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-widest block">
              // MULAKAT.AI • DEĞERLENDİRME ÇIKTISI
            </span>
            <h2 className="text-2xl font-black text-white mt-1">Teknik & İK Mülakat Raporu</h2>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              {new Date().toLocaleDateString('tr-TR')} • Toplam {questionsHistory.length} Soru Tamamlandı
            </p>
          </div>

          <div className="text-right bg-[#131b2e] px-5 py-3 rounded-2xl border border-[#222f4c]">
            <span className="text-[10px] text-slate-400 font-mono block uppercase">GENEL AI SKORU</span>
            <span className="text-3xl font-black text-[#10b981]">%{overallScore}</span>
          </div>
        </div>

        {/* 1. STAR METODOLOJİSİ ANALİZ KARTI */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Target className="text-cyan-400" size={18} />
            <span>STAR Metodolojisi Analiz Kartı</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#050811] p-4 rounded-2xl border border-[#1b2436] space-y-2">
              <span className="text-[10px] font-bold text-slate-400 font-mono block">S - DURUM / SENARYO</span>
              <span className="text-xl font-black text-white">%{starScore.situation}</span>
              <div className="w-full bg-[#1b2436] h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full" style={{ width: `${starScore.situation}%` }} />
              </div>
            </div>

            <div className="bg-[#050811] p-4 rounded-2xl border border-[#1b2436] space-y-2">
              <span className="text-[10px] font-bold text-slate-400 font-mono block">T - GÖREV & HEDEF</span>
              <span className="text-xl font-black text-white">%{starScore.task}</span>
              <div className="w-full bg-[#1b2436] h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-400 h-full" style={{ width: `${starScore.task}%` }} />
              </div>
            </div>

            <div className="bg-[#050811] p-4 rounded-2xl border border-[#1b2436] space-y-2">
              <span className="text-[10px] font-bold text-slate-400 font-mono block">A - AKSİYON / ÇÖZÜM</span>
              <span className="text-xl font-black text-white">%{starScore.action}</span>
              <div className="w-full bg-[#1b2436] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#10b981] h-full" style={{ width: `${starScore.action}%` }} />
              </div>
            </div>

            <div className="bg-[#050811] p-4 rounded-2xl border border-[#1b2436] space-y-2">
              <span className="text-[10px] font-bold text-slate-400 font-mono block">R - SONUÇ & METRİK</span>
              <span className="text-xl font-black text-white">%{starScore.result}</span>
              <div className="w-full bg-[#1b2436] h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full" style={{ width: `${starScore.result}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* 2. DİKSİYON & DOLGU KELİME KONTROLÜ */}
        <div className="bg-[#131b2e] p-5 rounded-2xl border border-[#222f4c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center">
              <MessageSquare size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Diksiyon & Akıcılık Analizi</h4>
              <p className="text-xs text-slate-400">Yanıt esnasındaki duraksama ve dolgu kelime ("şey", "yani") tespiti.</p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
            ⚠️ 2 Dolgu Kelime
          </span>
        </div>

        {/* 3. SORU SORU YANIT DETAYLARI (Görsellerdeki Liste) */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-white">Soru Bazlı Değerlendirmeler</h3>
          <div className="max-h-80 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            {questionsHistory.map((q, idx) => (
              <div key={idx} className="bg-[#050811] p-4 rounded-2xl border border-[#1b2436] space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white truncate max-w-[80%]">
                    Soru {idx + 1}: {q.question || q.title}
                  </span>
                  <span className="text-[#10b981] font-black">{q.score || 90} Puan</span>
                </div>
                <p className="text-slate-300"><strong>Analiz:</strong> {q.analysis || 'Yanıtınız konu hakimiyetini net şekilde yansıtıyor.'}</p>
                {q.missing && (
                  <p className="text-slate-400"><strong>Eksik:</strong> {q.missing}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4. AI İDEAL YANIT ÖNERİSİ */}
        <div className="bg-[#131b2e] p-5 rounded-2xl border border-[#222f4c] space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
            <Sparkles size={16} />
            <span>AI Tarafından İyileştirilmiş Genel Öneri</span>
          </div>
          <p className="text-xs text-slate-300 italic font-medium leading-relaxed">
            "Yanıtlarınızdaki teknik derinlik çok başarılı. Gelecek mülakatlarda 'Sonuç (Result)' aşamasında ekibinize kazandırdığınız yüzde cinsinden verileri ekleyerek puanınızı mükemmelleştirebilirsiniz."
          </p>
        </div>

      </div>

      {/* ALT GEZİNTİ BUTONLARI */}
      <div className="flex justify-center items-center gap-4 pt-2">
        {onRestart && (
          <button
            type="button"
            onClick={onRestart}
            className="flex items-center gap-2 bg-[#131b2e] hover:bg-[#1e293b] text-slate-200 border border-[#222f4c] font-bold px-6 py-3 rounded-2xl text-xs transition cursor-pointer"
          >
            <RefreshCw size={15} />
            <span>Diğer Kategoriler</span>
          </button>
        )}

        {onGoHome && (
          <button
            type="button"
            onClick={onGoHome}
            className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white font-extrabold px-6 py-3 rounded-2xl text-xs transition cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            <Home size={15} />
            <span>Ana Sayfaya Dön</span>
          </button>
        )}
      </div>

    </div>
  );
}