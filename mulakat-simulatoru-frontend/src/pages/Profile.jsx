import { useState, useEffect } from 'react';

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

const badgesList = [
  { id: 1, title: 'İlk Adım', desc: 'İlk mülakat simülasyonunu tamamla', icon: '🚀', unlocked: true },
  { id: 2, title: 'Seri Katili', desc: '5 gün üst üste günlük soru çöz', icon: '🔥', unlocked: true },
  { id: 3, title: 'Analitik Beyin', desc: 'Finans veya Veri kategorisinde 90+ puan al', icon: '🧠', unlocked: true },
  { id: 4, title: 'Kriz Yönetmeni', desc: '10 farklı senaryo sorusunu başarıyla geç', icon: '⚡', unlocked: false },
  { id: 5, title: 'Mükemmeliyetçi', desc: 'Genel ortalamayı 9.0 üzerine çıkar', icon: '👑', unlocked: false }
];

export default function Profile() {
  const [history, setHistory] = useState([]);
  const [streakCount, setStreakCount] = useState(5);
  const [dailyAnswer, setDailyAnswer] = useState('');
  const [isDailySolved, setIsDailySolved] = useState(false);
  const [isDailyEvaluating, setIsDailyEvaluating] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Seçgin',
    email: 'secgin@example.com',
    role: 'Full Stack Developer & CS Student',
    bio: 'Yapay zekâ destekli mülakat simülasyonları ile kariyerime hazırlanıyorum.',
    difficulty: 'Normal (Dengeli Kurumsal)'
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem('interview_history') || '[]');
      setHistory(savedHistory);

      const solved = localStorage.getItem('daily_solved');
      if (solved === 'true') {
        setIsDailySolved(true);
      }
    } catch (err) {
      console.error("Geçmiş yüklenirken hata:", err);
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

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Profil Üst Kartı & Konsept Görsel Banner */}
      <div className="relative bg-[#0b101d] rounded-3xl border border-[#1e293b] shadow-2xl overflow-hidden">
        {/* Arka Plan Atmosferik Görsel ve Işık Efekti */}
        <div className="absolute inset-0 z-0 opacity-15 bg-cover bg-center pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80')` }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 p-7 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-black text-2xl rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-white tracking-tight">{profileData.name}</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-1.5 bg-[#131b2e] border border-[#222f4c] hover:border-cyan-500/50 px-3 py-1 rounded-xl text-xs font-semibold text-cyan-400 transition cursor-pointer"
                >
                  <span>✏️</span>
                  <span>{isEditing ? 'İptal' : 'Düzenle'}</span>
                </button>
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">{profileData.email}</p>
              <p className="text-[11px] text-cyan-400 font-mono mt-1">{profileData.role}</p>
            </div>
          </div>

          {/* Sayaçlar */}
          <div className="flex flex-wrap items-center gap-3 text-center">
            <div className="bg-[#131b2e]/90 backdrop-blur border border-[#222f4c] px-4 py-2.5 rounded-2xl">
              <span className="text-[10px] font-black text-cyan-400 block uppercase tracking-wider">Mülakatlar</span>
              <span className="text-lg font-black text-white">{totalInterviews}</span>
            </div>

            <div className="bg-[#131b2e]/90 backdrop-blur border border-[#222f4c] px-4 py-2.5 rounded-2xl">
              <span className="text-[10px] font-black text-indigo-400 block uppercase tracking-wider">Sorular</span>
              <span className="text-lg font-black text-white">{totalQuestionsSolved}</span>
            </div>

            <div className="bg-[#131b2e]/90 backdrop-blur border border-[#222f4c] px-4 py-2.5 rounded-2xl">
              <span className="text-[10px] font-black text-purple-400 block uppercase tracking-wider">Ortalama</span>
              <span className="text-lg font-black text-white">{overallAvg} / 10</span>
            </div>

            <div className="flex items-center gap-2 bg-[#1c1810]/90 backdrop-blur border border-amber-500/30 px-4 py-2.5 rounded-2xl">
              <span className="text-2xl animate-bounce">🔥</span>
              <div className="text-left">
                <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider block">Seri</span>
                <span className="text-base font-black text-white">{streakCount} Gün</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alt Bilgi Şeridi & Görsel Vurgu */}
        <div className="relative z-10 px-7 py-3 bg-[#070b14]/80 border-t border-[#1e293b] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Simülasyon Motoru Aktif • Hedef: <strong className="text-slate-200">{profileData.role}</strong></span>
          </div>
          <span className="font-mono text-[11px] text-cyan-400 hidden sm:inline">Mod: {profileData.difficulty}</span>
        </div>
      </div>

      {/* Başarı Bildirimi */}
      {saved && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs">
          <span className="text-emerald-400 text-base font-bold">✓</span>
          <span>Profil bilgileriniz ve tercihleriniz başarıyla güncellendi!</span>
        </div>
      )}

      {/* Profil Düzenleme Paneli */}
      {isEditing && (
        <div className="bg-[#0b101d] p-8 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-4 animate-fade-in">
          <h3 className="text-lg font-black text-white">Profili ve Tercihleri Düzenle</h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Ad Soyad</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full bg-[#050811] border border-[#1b2436] rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">E-posta Adresi</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full bg-[#050811] border border-[#1b2436] rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Unvan / Hedef Pozisyon</label>
                <input
                  type="text"
                  value={profileData.role}
                  onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                  className="w-full bg-[#050811] border border-[#1b2436] rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Yapay Zekâ Zorluk Seviyesi</label>
                <select
                  value={profileData.difficulty}
                  onChange={(e) => setProfileData({ ...profileData, difficulty: e.target.value })}
                  className="w-full bg-[#050811] border border-[#1b2436] rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option>Kolay (Destekleyici & Rehber)</option>
                  <option>Normal (Dengeli Kurumsal)</option>
                  <option>Zor (Detaylı & Sorgulayıcı)</option>
                  <option>Stresli C-Level (Baskın & Agresif)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Hakkımda</label>
              <textarea
                rows={2}
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="w-full bg-[#050811] border border-[#1b2436] rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                Değişiklikleri Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 🏆 Başarı Rozetleri & Kilometre Taşları */}
      <div className="bg-[#0b101d] p-8 rounded-3xl border border-[#1e293b] shadow-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-[#1b2436] pb-4">
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">Kariyer Rozetleri & Başarılar</h3>
            <p className="text-xs text-slate-400 font-semibold">Simülasyon sürecinde açtığın rozetler ve kilometre taşların.</p>
          </div>
          <span className="bg-amber-500/10 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-500/30">
            🏆 {badgesList.filter(b => b.unlocked).length} / {badgesList.length} Açıldı
          </span>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {badgesList.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border flex flex-col items-center text-center space-y-2 transition-all ${
                badge.unlocked
                  ? 'bg-[#131b2e] border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                  : 'bg-[#050811]/60 border-[#1b2436] opacity-40 grayscale'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-2xl shadow-inner">
                {badge.icon}
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">{badge.title}</h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-tight">{badge.desc}</p>
              </div>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full mt-auto ${
                badge.unlocked ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-500'
              }`}>
                {badge.unlocked ? 'Kazanıldı' : 'Kilitli'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Günün Sorusu & Görsel Kart Dekorasyonu */}
      <div className="grid lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 bg-[#0b101d] p-8 rounded-3xl border border-[#1e293b] shadow-2xl space-y-5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div>
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

            <div className="relative z-10 mt-4">
              <h3 className="text-lg font-bold text-slate-100 leading-snug">
                {dailyQuestion.question}
              </h3>
              <p className="text-xs text-slate-400 mt-2 italic font-normal">
                💡 İpucu: {dailyQuestion.hint}
              </p>
            </div>
          </div>

          {!isDailySolved ? (
            <div className="space-y-3 pt-2 relative z-10">
              <textarea
                rows={2}
                value={dailyAnswer}
                onChange={(e) => setDailyAnswer(e.target.value)}
                placeholder="Kurumsal senaryoya yanıtınızı yazın ve serinizi koruyun..."
                className="w-full p-4 bg-[#050811] border border-[#1b2436] rounded-2xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/80 resize-none transition-all"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSolveDaily}
                  disabled={!dailyAnswer.trim() || isDailyEvaluating}
                  className={`px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-lg flex items-center gap-2 ${
                    !dailyAnswer.trim() || isDailyEvaluating
                      ? 'bg-[#182030] text-slate-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 cursor-pointer shadow-amber-500/20'
                  }`}
                >
                  <span>🔥</span>
                  <span>{isDailyEvaluating ? 'Analiz Ediliyor...' : 'Yanıtı Gönder'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#050811] border border-emerald-500/30 rounded-2xl space-y-2 text-xs relative z-10">
              <div className="flex justify-between items-center text-emerald-400 font-bold">
                <span>🎉 Tebrikler! Bugünkü serinizi tamamladınız.</span>
                <span>Puan: {dailyQuestion.feedback.score} / 10</span>
              </div>
              <p className="text-slate-300"><strong>Güçlü Yönler:</strong> {dailyQuestion.feedback.strengths}</p>
            </div>
          )}
        </div>

        {/* Sağ Taraf - Kurumsal Mülakat Atmosfer Görsel Kartı */}
        <div className="bg-[#0b101d] rounded-3xl border border-[#1e293b] shadow-2xl relative overflow-hidden flex flex-col justify-end p-6 min-h-[220px]">
          <div className="absolute inset-0 z-0 bg-cover bg-center opacity-40 transition-transform duration-700 hover:scale-105" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80')` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b101d] via-[#0b101d]/60 to-transparent z-0" />
          
          <div className="relative z-10 space-y-2">
            <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
              Profesyonel Gelişim
            </span>
            <h4 className="font-black text-white text-base">Kariyerinde Bir Adım Öne Geç</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Yapay zekâ tabanlı mülakat koçu ile eksiklerini kapat, iş teklifine giden yolu hızlandır.
            </p>
          </div>
        </div>
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
    </div>
  );
}