import React, { useState, useEffect } from 'react';
import { Trophy, Award, Medal, Users, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userStats = currentUser.email ? JSON.parse(localStorage.getItem(`interviewStats_${currentUser.email}`)) : null;
      
      const userAvg = userStats && userStats.totalQuestions > 0 
        ? Math.round((userStats.totalScoreSum / userStats.totalQuestions)) 
        : 88;

      const mockLeaderboard = [
        { rank: 1, name: 'Zeynep Kaya', role: 'Senior Frontend Developer', score: 98, interviews: 14 },
        { rank: 2, name: 'Ahmet Demir', role: 'Full Stack Engineer', score: 95, interviews: 11 },
        { rank: 3, name: 'Elif Yılmaz', role: 'Product Manager', score: 92, interviews: 9 },
        { rank: 4, name: currentUser.name || 'Seçgin', role: currentUser.role || 'Full Stack Developer', score: userAvg, interviews: userStats?.interviews || 4 },
        { rank: 5, name: 'Can Çelik', role: 'Backend Developer', score: 85, interviews: 6 },
        { rank: 6, name: 'Selin Arslan', role: 'Data Analyst', score: 82, interviews: 5 }
      ];

      mockLeaderboard.sort((a, b) => b.score - a.score);
      mockLeaderboard.forEach((item, index) => { item.rank = index + 1; });

      setLeaderboardData(mockLeaderboard);
    } catch (err) {
      console.error("Liderlik tablosu yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8 text-slate-100 animate-fade-in">
      
      {/* ÜST BANNER */}
      <div className="bg-[#0b101d] border border-[#1e293b] p-8 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block font-bold">
            // GLOBAL MÜLAKAT SIRALAMASI
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
            <Trophy className="text-amber-400" size={36} />
            <span>Liderlik Tablosu</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl leading-relaxed">
            Mülakat simülasyonlarında elde edilen başarı puanlarına göre en iyi adayların global sıralaması.
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-[#131b2e] border border-[#222f4c] hover:border-amber-500/50 px-5 py-3 rounded-2xl text-xs font-semibold transition cursor-pointer shadow-lg relative z-10"
        >
          <ArrowLeft size={16} />
          <span>Ana Sayfa</span>
        </button>
      </div>

      {/* LİSTE TABLOSU */}
      <div className="bg-[#0b101d] border border-[#1e293b] rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#1b2436] pb-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-white">
            <Users size={20} className="text-cyan-400" />
            <span>Aktif Aday Sıralaması</span>
          </div>
          <span className="text-xs font-mono text-slate-400">Canlı Puan Sistemi</span>
        </div>

        {loading ? (
          <p className="text-xs text-slate-400 text-center py-12">Liderlik tablosu yükleniyor...</p>
        ) : (
          <div className="space-y-3">
            {leaderboardData.map((user) => (
              <div 
                key={user.rank}
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
                    <p className="text-[11px] text-slate-400 font-mono">{user.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-slate-400 font-mono block">TAMAMLANAN MÜLAKAT</span>
                    <span className="text-xs font-bold text-slate-200">{user.interviews} Oturum</span>
                  </div>

                  <div className="bg-[#131b2e] border border-[#222f4c] px-4 py-2 rounded-xl text-center">
                    <span className="text-[9px] text-cyan-400 font-mono block uppercase">BAŞARI</span>
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