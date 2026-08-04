import React, { useState, useEffect } from 'react';
import { Trophy, Award, Medal, Users, ArrowLeft, Globe, Flame, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // --- DİL DESTEĞİ STATE'İ ---
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem('app_lang') || 'tr'
  );

  const t = {
    tr: {
      badge: "// GERÇEK KULLANICI SIRALAMASI",
      title: "Liderlik Tablosu",
      desc: "Platformumuzda mülakat simülasyonlarını tamamlayan gerçek adayların canlı başarı sıralaması.",
      homeBtn: "Ana Sayfa",
      activeParticipants: "Aktif Katılımcılar",
      liveDb: "Canlı Veritabanı",
      loadingText: "Sıralama yükleniyor...",
      emptyTitle: "Henüz mülakat tamamlayan kayıtlı bir kullanıcı bulunmuyor.",
      emptySubtitle: "İlk mülakatı tamamlayan kişi listede 1 numarada yer alacak!",
      completedInterview: "TAMAMLANAN MÜLAKAT",
      sessions: "Oturum",
      successLabel: "BAŞARI",
      weeklyStar: "Haftanın Yıldızı 🌟"
    },
    en: {
      badge: "// REAL USER RANKING",
      title: "Leaderboard",
      desc: "Live performance ranking of real candidates who completed interview simulations on our platform.",
      homeBtn: "Home",
      activeParticipants: "Active Participants",
      liveDb: "Live Database",
      loadingText: "Loading leaderboard...",
      emptyTitle: "No registered users have completed an interview yet.",
      emptySubtitle: "The first person to complete an interview will be ranked #1!",
      completedInterview: "COMPLETED INTERVIEW",
      sessions: "Sessions",
      successLabel: "SCORE",
      weeklyStar: "Star of the Week 🌟"
    }
  }[currentLanguage];

  const categories = [
    { id: 'all', label: currentLanguage === 'tr' ? 'Tümü' : 'All' },
    { id: 'frontend', label: currentLanguage === 'tr' ? 'Yazılım & Developer' : 'Software & Developer' },
    { id: 'hr', label: currentLanguage === 'tr' ? 'İK & Yönetim' : 'HR & Management' },
    { id: 'english', label: currentLanguage === 'tr' ? 'İngilizce Mülakat' : 'English Interview' },
    { id: 'product', label: currentLanguage === 'tr' ? 'Ürün Yönetimi' : 'Product Management' }
  ];

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'tr' ? 'en' : 'tr';
    setCurrentLanguage(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        // Önce veritabanından (backend aktifse) çekmeyi deneyelim
        const url = selectedCategory === 'all' 
          ? 'http://localhost:5000/api/leaderboard' 
          : `http://localhost:5000/api/leaderboard?category=${encodeURIComponent(selectedCategory)}`;
        
        const res = await fetch(url);
        if (res.ok) {
          const dbData = await res.json();
          if (Array.isArray(dbData) && dbData.length > 0) {
            const formatted = dbData.map((item, index) => ({
              name: item.name || item.user_email.split('@')[0],
              email: item.user_email,
              role: item.category_title || 'Mülakat Adayı',
              score: item.score || 0,
              interviews: 1,
              rank: index + 1
            }));
            setLeaderboardData(formatted);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.log("Backend leaderboard çekilemedi, localStorage yedek mekanizması çalışıyor.");
      }

      // Fallback: LocalStorage tarama mekanizması
      try {
        const usersList = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('interviewStats_')) {
            const email = key.replace('interviewStats_', '');
            const stats = JSON.parse(localStorage.getItem(key) || '{}');
            
            let name = email.split('@')[0];
            name = name.charAt(0).toUpperCase() + name.slice(1);

            const totalQ = stats.totalQuestions || 0;
            const scoreSum = stats.totalScoreSum || 0;
            const avgScore = totalQ > 0 ? Math.round(scoreSum / totalQ) : (stats.interviews > 0 ? 85 : 0);

            usersList.push({
              name: name,
              email: email,
              role: 'Mulakat.ai Adayı',
              score: avgScore,
              interviews: stats.interviews || 0
            });
          }
        }

        if (usersList.length === 0) {
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          if (currentUser.email) {
            usersList.push({
              name: currentUser.name || currentUser.email.split('@')[0],
              email: currentUser.email,
              role: currentUser.role || 'Full Stack Developer',
              score: 0,
              interviews: 0
            });
          }
        }

        usersList.sort((a, b) => b.score - a.score);
        const rankedData = usersList.map((user, index) => ({
          ...user,
          rank: index + 1
        }));

        setLeaderboardData(rankedData);
      } catch (err) {
        console.error("Liderlik tablosu yüklenirken hata:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedCategory]);

  const weeklyTopUser = leaderboardData.length > 0 ? leaderboardData[0] : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8 text-slate-100 animate-fade-in">
      
      {/* ÜST BANNER */}
      <div className="bg-[#0b101d] border border-[#1e293b] p-8 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block font-bold">
            {t.badge}
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
            <Trophy className="text-amber-400" size={36} />
            <span>{t.title}</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl leading-relaxed">
            {t.desc}
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          {/* DİL DEĞİŞTİRME BUTONU */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 bg-[#131b2e] border border-[#222f4c] hover:border-amber-500/50 px-4 py-3 rounded-2xl text-xs font-mono font-bold text-amber-400 transition cursor-pointer shadow-lg"
          >
            <Globe size={16} />
            <span>{currentLanguage === 'tr' ? 'EN' : 'TR'}</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-[#131b2e] border border-[#222f4c] hover:border-amber-500/50 px-5 py-3 rounded-2xl text-xs font-semibold transition cursor-pointer shadow-lg"
          >
            <ArrowLeft size={16} />
            <span>{t.homeBtn}</span>
          </button>
        </div>
      </div>

      {/* --- HAFTANIN YILDIZI / LİDERİ ÖZET KARTI --- */}
      {weeklyTopUser && !loading && (
        <div className="relative bg-gradient-to-r from-amber-500/10 via-cyan-500/10 to-teal-500/10 border border-amber-500/30 p-6 rounded-3xl backdrop-blur-xl shadow-[0_0_30px_rgba(245,158,11,0.1)] overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-400/10 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
              <Flame size={30} className="animate-bounce" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                {t.weeklyStar}
              </span>
              <h3 className="text-lg font-black text-slate-100">
                {weeklyTopUser.name}
              </h3>
              <p className="text-xs text-slate-400">
                <strong className="text-cyan-400">{weeklyTopUser.role}</strong> {currentLanguage === 'tr' ? 'kategorisinde zirvede yer alıyor!' : 'is at the top in this category!'}
              </p>
            </div>
          </div>

          <div className="bg-[#050811] border border-[#1e293b] px-6 py-3 rounded-2xl text-center shrink-0">
            <span className="text-[10px] font-mono text-slate-400 block">{t.successLabel}</span>
            <span className="text-2xl font-black text-amber-400">%{weeklyTopUser.score}</span>
          </div>
        </div>
      )}

      {/* --- KATEGORİ / POZİSYON FİLTRELEME SEKMELERİ --- */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono mr-2 shrink-0">
          <Filter size={14} /> {currentLanguage === 'tr' ? 'Filtrele:' : 'Filter:'}
        </div>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
              selectedCategory === cat.id 
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' 
                : 'bg-[#0b101d] border border-[#1e293b] text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* LİSTE TABLOSU */}
      <div className="bg-[#0b101d] border border-[#1e293b] rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#1b2436] pb-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-white">
            <Users size={20} className="text-cyan-400" />
            <span>{t.activeParticipants}</span>
          </div>
          <span className="text-xs font-mono text-slate-400">{t.liveDb}</span>
        </div>

        {loading ? (
          <p className="text-xs text-slate-400 text-center py-12">{t.loadingText}</p>
        ) : leaderboardData.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-sm text-slate-400">{t.emptyTitle}</p>
            <p className="text-xs text-cyan-400 font-mono">{t.emptySubtitle}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboardData.map((user) => (
              <div 
                key={user.email || user.rank}
                className={`flex items-center justify-between p-4 md:p-5 rounded-2xl border transition ${
                  user.rank === 1 ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5' :
                  user.rank === 2 ? 'bg-slate-300/5 border-slate-300/30' :
                  user.rank === 3 ? 'bg-orange-500/5 border-orange-500/30' :
                  'bg-[#050811] border-[#1b2436]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                    user.rank === 1 ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30' :
                    user.rank === 2 ? 'bg-slate-300 text-slate-950' :
                    user.rank === 3 ? 'bg-orange-500 text-white' :
                    'bg-[#131b2e] text-slate-400 border border-[#222f4c]'
                  }`}>
                    {user.rank === 1 ? <Trophy size={18} /> : user.rank === 2 ? <Medal size={18} /> : user.rank === 3 ? <Award size={18} /> : `#${user.rank}`}
                  </div>

                  <div>
                    <h3 className="text-sm md:text-base font-bold text-white">{user.name}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-slate-400 font-mono block">{t.completedInterview}</span>
                    <span className="text-xs font-bold text-slate-200">{user.interviews} {t.sessions}</span>
                  </div>

                  <div className="bg-[#131b2e] border border-[#222f4c] px-4 py-2 rounded-xl text-center">
                    <span className="text-[9px] text-cyan-400 font-mono block uppercase">{t.successLabel}</span>
                    <span className="text-sm md:text-base font-black text-white">%{user.score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}