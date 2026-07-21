import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// GELENEKSEL VE KURUMSAL DEPARTMAN KATEGORİLERİ (GÖRSEL ROZETLİ)
const categories = [
  {
    id: 'hr',
    title: 'İnsan Kaynakları & Kültür',
    description: 'Kariyer hedefleri, stres yönetimi, takım çalışması ve kültürel uyum soruları.',
    icon: '👥',
    glowColor: 'from-blue-500/20 to-indigo-500/10 border-blue-500/40 text-blue-400',
    badge: 'Zorunlu'
  },
  {
    id: 'sales',
    title: 'Satış & Pazarlama',
    description: 'Müşteri iknası, kampanya yönetimi, B2B/B2C stratejileri ve hedef tutturma.',
    icon: '📈',
    glowColor: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-400',
    badge: 'Popüler'
  },
  {
    id: 'finance',
    title: 'Finans & Muhasebe',
    description: 'Bütçe planlama, nakit akışı, finansal tablolar, ROI ve risk analizi.',
    icon: '💰',
    glowColor: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-400',
    badge: 'Analitik'
  },
  {
    id: 'customer',
    title: 'Müşteri İlişkileri & Destek',
    description: 'Öfkeli müşteri yönetimi, kriz anında empati, CSAT ve şikayet çözümü.',
    icon: '🎧',
    glowColor: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-400',
    badge: 'İletişim'
  },
  {
    id: 'operations',
    title: 'Operasyon & Lojistik',
    description: 'Tedarik zinciri, verimlilik artırma, stok yönetimi ve kriz eylem planları.',
    icon: '⚙️',
    glowColor: 'from-purple-500/20 to-fuchsia-500/10 border-purple-500/40 text-purple-400',
    badge: 'Süreç'
  },
  {
    id: 'management',
    title: 'Yönetim & Liderlik',
    description: 'Ekip motivasyonu, performans yönetimi, delegasyon ve vizyon belirleme.',
    icon: '👔',
    glowColor: 'from-rose-500/20 to-red-500/10 border-rose-500/40 text-rose-400',
    badge: 'Yönetici'
  },
  {
    id: 'project',
    title: 'Proje Yönetimi',
    description: 'Kapsam kayması (Scope Creep), risk yönetimi, paydaş iletişimi ve çeviklik.',
    icon: '📋',
    glowColor: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/40 text-indigo-400',
    badge: 'Planlama'
  }
];

const topicAnalytics = [
  { topic: 'Kriz Yönetimi & Soğukkanlılık', score: 85 },
  { topic: 'Müşteri İkna Kabiliyeti', score: 45 },
  { topic: 'Bütçe & Veri Odaklı Karar Alma', score: 90 },
  { topic: 'Takım İçi Çatışma Çözümü (STAR)', score: 60 },
  { topic: 'Liderlik & Ekip Motivasyonu', score: 75 },
  { topic: 'Zaman Yönetimi ve Önceliklendirme', score: 88 }
];

const dailyQuestion = {
  id: 'daily-corp-1',
  category: 'Günün Kurumsal Sorusu • Müşteri & İletişim',
  question: 'Şirket politikasının izin vermediği bir iade talebinde bulunan sadık ve yüksek cirolu bir müşteriyi nasıl yönetirsiniz?',
  hint: 'Empati kurma, şirket kurallarını esnetmeden alternatif değer/çözüm sunma stratejisini açıklayın.',
  feedback: {
    score: 9,
    strengths: 'Müşteri memnuniyeti ile şirket kuralları arasındaki denge harika kuruldu.',
    improvements: 'Alternatif çözüm sunarken maliyet analizinden de kısaca bahsedilebilir.'
  }
};

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [streakCount, setStreakCount] = useState(5);
  const [dailyAnswer, setDailyAnswer] = useState('');
  const [isDailySolved, setIsDailySolved] = useState(false);
  const [isDailyEvaluating, setIsDailyEvaluating] = useState(false);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('interview_history') || '[]');
    setHistory(savedHistory);

    const solved = localStorage.getItem('daily_solved');
    if (solved === 'true') {
      setIsDailySolved(true);
    }
  }, []);

  const totalInterviews = history.length;
  const totalQuestionsSolved = history.reduce((acc, curr) => acc + (curr.totalQuestions || 0), 0);
  const overallAvg = totalInterviews > 0
    ? (history.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalInterviews).toFixed(1)
    : '0.0';

  const handleSolveDaily = () => {
    if (!dailyAnswer.trim()) return;
    setIsDailyEvaluating(true);
    setTimeout(() => {
      setIsDailyEvaluating(false);
      setIsDailySolved(true);
      setStreakCount((prev) => prev + 1);
      localStorage.setItem('daily_solved', 'true');
    }, 1200);
  };

  const handleStartInterview = (categoryId) => {
    navigate('/interview', { state: { categoryId } });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Profil Üst Kartı */}
      <div className="bg-[#0b101d] p-7 rounded-3xl border border-[#1e293b] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-black text-2xl rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">{user?.name || 'Kullanıcı'}</h2>
            <p className="text-xs font-semibold text-slate-400">{user?.email || 'E-posta tanımlanmadı'}</p>
          </div>
        </div>

        {/* Sayaçlar */}
        <div className="flex flex-wrap items-center gap-3 text-center">
          <div className="bg-[#131b2e] border border-[#222f4c] px-4 py-2.5 rounded-2xl">
            <span className="text-[10px] font-black text-cyan-400 block uppercase tracking-wider">Mülakatlar</span>
            <span className="text-lg font-black text-white">{totalInterviews}</span>
          </div>

          <div className="bg-[#131b2e] border border-[#222f4c] px-4 py-2.5 rounded-2xl">
            <span className="text-[10px] font-black text-indigo-400 block uppercase tracking-wider">Sorular</span>
            <span className="text-lg font-black text-white">{totalQuestionsSolved}</span>
          </div>

          <div className="bg-[#131b2e] border border-[#222f4c] px-4 py-2.5 rounded-2xl">
            <span className="text-[10px] font-black text-purple-400 block uppercase tracking-wider">Ortalama</span>
            <span className="text-lg font-black text-white">{overallAvg} / 10</span>
          </div>

          <div className="flex items-center gap-2 bg-[#1c1810] border border-amber-500/30 px-4 py-2.5 rounded-2xl">
            <span className="text-2xl animate-bounce">🔥</span>
            <div className="text-left">
              <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider block">Seri</span>
              <span className="text-base font-black text-white">{streakCount} Gün</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- GÜNÜN SORUSU VE ALEM ANIMASYONLU KART --- */}
      <div className="bg-[#0b101d] p-8 rounded-3xl border border-[#1e293b] shadow-2xl space-y-5 relative overflow-hidden group">
        {/* Arka Plan Glow Efekti */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-between items-center border-b border-[#1b2436] pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[11px] font-black px-3 py-1 rounded-xl shadow-lg shadow-amber-500/20">
              <span className="animate-pulse">🔥</span>
              <span>Günün Sorusu</span>
            </div>
            <span className="text-xs text-slate-400 font-bold">{dailyQuestion.category}</span>
          </div>
          {isDailySolved ? (
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <span>✓</span> Seri Korundu
            </span>
          ) : (
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <span className="animate-ping w-1.5 h-1.5 rounded-full bg-amber-400" />
              Çözüm Bekliyor
            </span>
          )}
        </div>

        <div className="relative z-10">
          <h3 className="text-lg font-bold text-slate-100 leading-snug">
            {dailyQuestion.question}
          </h3>
          <p className="text-xs text-slate-400 mt-2 italic font-normal">
            💡 İpucu: {dailyQuestion.hint}
          </p>
        </div>

        {!isDailySolved ? (
          <div className="space-y-3 pt-2 relative z-10">
            <textarea
              rows={3}
              value={dailyAnswer}
              onChange={(e) => setDailyAnswer(e.target.value)}
              placeholder="Kurumsal senaryoya hızlı yanıtınızı yazın ve serinizi koruyun..."
              className="w-full p-4 bg-[#050811] border border-[#1b2436] rounded-2xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/80 resize-none transition-all"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSolveDaily}
                disabled={!dailyAnswer.trim() || isDailyEvaluating}
                className={`px-6 py-3 rounded-xl text-xs font-extrabold transition-all shadow-lg flex items-center gap-2 ${
                  !dailyAnswer.trim() || isDailyEvaluating
                    ? 'bg-[#182030] text-slate-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 cursor-pointer shadow-amber-500/20'
                }`}
              >
                <span>🔥</span>
                <span>{isDailyEvaluating ? 'Analiz Ediliyor...' : 'Yanıtı Gönder & Seriyi Koru'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-[#050811] border border-emerald-500/30 rounded-2xl space-y-2 text-xs relative z-10">
            <div className="flex justify-between items-center text-emerald-400 font-bold">
              <span>🎉 Tebrikler! Bugünkü serinizi başarıyla tamamladınız.</span>
              <span>Puan: {dailyQuestion.feedback.score} / 10</span>
            </div>
            <p className="text-slate-300"><strong>Güçlü Yönler:</strong> {dailyQuestion.feedback.strengths}</p>
            <p className="text-slate-400"><strong>Geliştirilebilir:</strong> {dailyQuestion.feedback.improvements}</p>
          </div>
        )}
      </div>

      {/* Isı Haritası */}
      <div className="bg-[#0b101d] p-8 rounded-3xl border border-[#1e293b] shadow-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-[#1b2436] pb-4">
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">Yetkinlik Bazlı Başarı & Isı Haritası</h3>
            <p className="text-xs text-slate-400 font-semibold">Performans verilerinize dayalı canlı kurumsal yetkinlik oranları.</p>
          </div>
          <span className="bg-[#131b2e] text-cyan-400 text-xs font-bold px-3 py-1.5 rounded-xl border border-[#222f4c]">
            📊 Canlı İstatistikler
          </span>
        </div>

        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <span className="font-bold text-amber-300 block">Gelişime Açık Yetkinlik:</span>
              <p className="text-amber-200/80 font-semibold">Müşteri İkna Kabiliyeti — Başarı Oranı: %45</p>
            </div>
          </div>
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black px-3 py-1 rounded-lg text-[10px]">
            Odaklanılmalı
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4 pt-2">
          {topicAnalytics.map((item, idx) => {
            const isWeak = item.score < 50;
            const isMedium = item.score >= 50 && item.score < 80;
            const barColor = isWeak ? 'bg-rose-500' : isMedium ? 'bg-amber-500' : 'bg-emerald-500';
            const badgeStyle = isWeak ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : isMedium ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

            return (
              <div key={idx} className="p-4 bg-[#050811] rounded-2xl border border-[#1b2436] space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-200 text-[11px] truncate max-w-[220px]">{item.topic}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${badgeStyle}`}>
                    %{item.score}
                  </span>
                </div>
                <div className="w-full bg-[#1b2436] h-2 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${barColor}`} style={{ width: `${item.score}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mülakat Geçmişi */}
      {history.length > 0 && (
        <div className="bg-[#0b101d] p-8 rounded-3xl border border-[#1e293b] shadow-2xl space-y-4">
          <h3 className="text-xl font-black text-white tracking-tight">Tamamlanan Mülakat Geçmişiniz</h3>
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="p-4 bg-[#050811] rounded-2xl border border-[#1b2436] flex justify-between items-center text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-white text-sm block">{item.category}</span>
                  <span className="text-slate-400 font-semibold">{item.date} • {item.totalQuestions} Soru</span>
                </div>
                <span className="bg-purple-500/10 text-purple-300 font-black px-3 py-1.5 rounded-xl border border-purple-500/30">
                  {item.score} / 10
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- DEPARTMAN KARTLARI (ÖZEL NEON ROZETLİ İKONLAR) --- */}
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight">Departman Mülakatı Seçin</h3>
          <p className="text-sm text-slate-400 font-normal">Kariyer hedefiniz olan departmanı seçip kurumsal simülasyonunuza başlayın.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-6 rounded-3xl border border-[#1e293b] bg-[#0b101d] shadow-2xl hover:border-slate-700 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  {/* Neon Arka Planlı Özel İkon Rozeti */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.glowColor} border flex items-center justify-center text-2xl shadow-inner transition-transform group-hover:scale-110 duration-200`}>
                    {cat.icon}
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${cat.glowColor}`}>
                    {cat.badge}
                  </span>
                </div>
                <h4 className="font-black text-white text-base leading-snug">{cat.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">{cat.description}</p>
              </div>

              <button
                onClick={() => handleStartInterview(cat.id)}
                className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black py-3 rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/10 border border-cyan-400/20 cursor-pointer"
              >
                Lobiye Geç & Başla →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}