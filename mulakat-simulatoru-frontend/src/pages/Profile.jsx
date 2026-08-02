import React, { useState, useEffect } from 'react';

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

const getBadgesList = (totalInterviews, totalQuestionsSolved, overallAvg, streakCount) => [
  { id: 1, title: 'İlk Adım', desc: 'İlk mülakat simülasyonunu tamamla', icon: '🚀', unlocked: totalInterviews >= 1 },
  { id: 2, title: 'Seri Katili', desc: '5 gün üst üste günlük soru çöz', icon: '🔥', unlocked: streakCount >= 5 },
  { id: 3, title: 'Analitik Beyin', desc: 'Mülakat ortalaman 8.0 ve üzeri olsun', icon: '🧠', unlocked: parseFloat(overallAvg) >= 8.0 && totalInterviews > 0 },
  { id: 4, title: 'Kriz Yönetmeni', desc: 'Toplamda en az 10 soru çöz', icon: '⚡', unlocked: totalQuestionsSolved >= 10 },
  { id: 5, title: 'Mükemmeliyetçi', desc: 'Genel ortalamayı 9.0 üzerine çıkar', icon: '👑', unlocked: parseFloat(overallAvg) >= 9.0 && totalQuestionsSolved > 0 }
];

export default function Profile() {
  const [streakCount, setStreakCount] = useState(0);
  const [dailyAnswer, setDailyAnswer] = useState('');
  const [isDailySolved, setIsDailySolved] = useState(false);
  const [isDailyEvaluating, setIsDailyEvaluating] = useState(false);

  const [stats, setStats] = useState({ interviews: 0, totalQuestions: 0, totalScoreSum: 0 });
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

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
      // Giriş yapan aktif kullanıcıyı okuyup profile yansıtıyoruz
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.name || currentUser.email) {
        setProfileData(prev => ({
          ...prev,
          name: currentUser.name || prev.name,
          email: currentUser.email || prev.email
        }));
      }

      // Her kullanıcının kendi e-postasına özel istatistiklerini yüklüyoruz (yeni hesapsa 0 başlar)
      if (currentUser.email) {
        const userStatsKey = `interviewStats_${currentUser.email}`;
        const savedStats = JSON.parse(localStorage.getItem(userStatsKey));
        if (savedStats) {
          setStats(savedStats);
        } else {
          setStats({ interviews: 0, totalQuestions: 0, totalScoreSum: 0 });
        }

        // Kullanıcıya özel seri (streak) verisini yüklüyoruz
        const userStreakKey = `streakCount_${currentUser.email}`;
        const savedStreak = localStorage.getItem(userStreakKey);
        if (savedStreak !== null) {
          setStreakCount(parseInt(savedStreak, 10));
        } else {
          setStreakCount(1); // Yeni hesap için başlangıç serisi
        }

        const userDailySolvedKey = `daily_solved_${currentUser.email}`;
        const solved = localStorage.getItem(userDailySolvedKey);
        if (solved === 'true') {
          setIsDailySolved(true);
        }
      }
    } catch (err) {
      console.error("Veriler yüklenirken hata:", err);
    }
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (!currentUser.email) {
        setLoadingHistory(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/interview-results/${currentUser.email}`);
        if (response.ok) {
          const data = await response.json();
          setInterviewHistory(data);
        }
      } catch (err) {
        console.error("Geçmiş mülakatlar yüklenemedi:", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, []);

  const totalInterviews = stats.interviews;
  const totalQuestionsSolved = stats.totalQuestions;
  
  const overallAvg = stats.totalQuestions > 0
    ? (stats.totalScoreSum / stats.totalQuestions / 10).toFixed(1)
    : '0.0';

  const currentBadges = getBadgesList(totalInterviews, totalQuestionsSolved, overallAvg, streakCount);

  const handleSolveDaily = () => {
    if (!dailyAnswer.trim()) return;
    setIsDailyEvaluating(true);
    setTimeout(() => {
      setIsDailyEvaluating(false);
      setIsDailySolved(true);
      
      const newStreak = streakCount + 1;
      setStreakCount(newStreak);

      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.email) {
        localStorage.setItem(`streakCount_${currentUser.email}`, newStreak.toString());
        localStorage.setItem(`daily_solved_${currentUser.email}`, 'true');
      }
    }, 1200);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12 text-slate-100">
      
      {/* 1. ÜST PROFİL BANNER */}
      <div className="relative bg-[#0b101d] rounded-3xl border border-[#1e293b] shadow-2xl overflow-hidden">
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

          <div className="flex flex-wrap items-center gap-3 text-center">
            <div className="bg-[#131b2e] border border-[#222f4c] px-4 py-2.5 rounded-2xl">
              <span className="text-[10px] font-black text-cyan-400 block uppercase tracking-wider">MÜLAKATLAR</span>
              <span className="text-lg font-black text-white">{totalInterviews}</span>
            </div>

            <div className="bg-[#131b2e] border border-[#222f4c] px-4 py-2.5 rounded-2xl">
              <span className="text-[10px] font-black text-indigo-400 block uppercase tracking-wider">SORULAR</span>
              <span className="text-lg font-black text-white">{totalQuestionsSolved}</span>
            </div>

            <div className="bg-[#131b2e] border border-[#222f4c] px-4 py-2.5 rounded-2xl">
              <span className="text-[10px] font-black text-purple-400 block uppercase tracking-wider">ORTALAMA</span>
              <span className="text-lg font-black text-white">{overallAvg} / 10</span>
            </div>

            <div className="flex items-center gap-2 bg-[#1c1810] border border-amber-500/30 px-4 py-2.5 rounded-2xl">
              <span className="text-2xl animate-bounce">🔥</span>
              <div className="text-left">
                <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider block">SERİ</span>
                <span className="text-base font-black text-white">{streakCount} Gün</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 px-7 py-3 bg-[#070b14]/80 border-t border-[#1e293b] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Simülasyon Motoru Aktif • Hedef: <strong className="text-slate-200">{profileData.role}</strong></span>
          </div>
          <span className="font-mono text-[11px] text-cyan-400 hidden sm:inline">Mod: {profileData.difficulty}</span>
        </div>
      </div>

      {/* 2. DÜZENLEME FORMU */}
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
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                Değişiklikleri Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* GEÇMİŞ MÜLAKAT SONUÇLARIM */}
      <div className="bg-[#0b101d] border border-[#1e293b] p-8 rounded-3xl shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-[#1b2436] pb-4">
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">Geçmiş Mülakat Sonuçlarım</h3>
            <p className="text-xs text-slate-400 font-semibold">Veritabanına kaydedilen simülasyon geçmişiniz ve puanlarınız.</p>
          </div>
        </div>

        {loadingHistory ? (
          <p className="text-xs text-slate-400 py-4">Geçmiş yükleniyor...</p>
        ) : interviewHistory.length === 0 ? (
          <p className="text-xs text-slate-400 py-4">Henüz tamamlanmış bir mülakat simülasyonunuz bulunmuyor.</p>
        ) : (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
            {interviewHistory.map((item) => (
              <div key={item.id} className="bg-[#050811] border border-[#1b2436] p-4 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <strong className="text-white block text-sm font-bold">{item.category_title}</strong>
                  <span className="text-slate-400 text-[10px]">
                    {new Date(item.created_at).toLocaleDateString('tr-TR')} • {new Date(item.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-xl font-black text-sm">
                  %{item.score}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. KARİYER ROZETLERİ & BAŞARILAR */}
      <div className="bg-[#0b101d] p-8 rounded-3xl border border-[#1e293b] shadow-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-[#1b2436] pb-4">
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">Kariyer Rozetleri & Başarılar</h3>
            <p className="text-xs text-slate-400 font-semibold">Simülasyon sürecinde açtığın rozetler ve kilometre taşların.</p>
          </div>
          <span className="bg-amber-500/10 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-500/30">
            🏆 {currentBadges.filter(b => b.unlocked).length} / {currentBadges.length} Açıldı
          </span>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {currentBadges.map((badge) => (
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

      {/* 4. GÜNÜN SORUSU */}
      <div className="grid lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 bg-[#0b101d] p-8 rounded-3xl border border-[#1e293b] shadow-2xl space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-[#1b2436] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[11px] font-black px-3 py-1 rounded-xl shadow-lg shadow-amber-500/20">
                  <span className="animate-pulse">🔥</span>
                  <span>Günün Sorusu</span>
                </div>
                <span className="text-xs text-slate-400 font-bold">{dailyQuestion.category}</span>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-bold text-slate-100 leading-snug">
                {dailyQuestion.question}
              </h3>
              <p className="text-xs text-slate-400 mt-2 italic font-normal">
                💡 İpucu: {dailyQuestion.hint}
              </p>
            </div>
          </div>

          {!isDailySolved ? (
            <div className="space-y-3 pt-2">
              <textarea
                rows={2}
                value={dailyAnswer}
                onChange={(e) => setDailyAnswer(e.target.value)}
                placeholder="Kurumsal senaryoya yanıtınızı yazın ve serinizi koruyun..."
                className="w-full p-4 bg-[#050811] border border-[#1b2436] rounded-2xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/80 resize-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSolveDaily}
                  disabled={!dailyAnswer.trim() || isDailyEvaluating}
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  Yanıtı Gönder
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#050811] border border-emerald-500/30 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between items-center text-emerald-400 font-bold">
                <span>🎉 Tebrikler! Bugünkü serinizi tamamladınız.</span>
                <span>Puan: {dailyQuestion.feedback.score} / 10</span>
              </div>
              <p className="text-slate-300"><strong>Güçlü Yönler:</strong> {dailyQuestion.feedback.strengths}</p>
            </div>
          )}
        </div>

        <div className="bg-[#0b101d] rounded-3xl border border-[#1e293b] shadow-2xl relative overflow-hidden flex flex-col justify-end p-6 min-h-[220px]">
          <div className="relative z-10 space-y-2">
            <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
              Profesyonel Gelişim
            </span>
            <h4 className="font-black text-white text-base">Kariyerinde Bir Adım Öne Geç</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Yapay zekâ tabanlı mülakat koçu ile eksiklerini kapat.
            </p>
          </div>
        </div>
      </div>

      {/* 5. ISI HARİTASI */}
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

        <div className="grid md:grid-cols-2 gap-4">
          {topicAnalytics.map((item, idx) => (
            <div key={idx} className="p-4 bg-[#050811] rounded-2xl border border-[#1b2436] space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-200 text-[11px] truncate">{item.topic}</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-800 text-cyan-400 border border-slate-700">
                  %{item.score}
                </span>
              </div>
              <div className="w-full bg-[#1b2436] h-2 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: `${item.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}