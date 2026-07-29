import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquareCode, LogOut, ShieldCheck } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('Kullanıcı');

  useEffect(() => {
    // Hafızadan kullanıcı adını çekiyoruz
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleLogout = () => {
    // Oturum bilgilerini temizleyip login sayfasına atıyoruz
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login', { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-5 h-screen sticky top-0">
      {/* Üst Kısım: Logo ve Menüler */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl flex items-center justify-center font-bold">
            <ShieldCheck size={20} />
          </div>
          <span className="font-black text-slate-100 tracking-wide text-base">Mülakat Sim</span>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => navigate('/interview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition cursor-pointer ${
              isActive('/interview')
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MessageSquareCode size={18} />
            <span>Mülakatlar</span>
          </button>
        </nav>
      </div>

      {/* Alt Kısım: Kullanıcı Profili ve Çıkış */}
      <div className="pt-4 border-t border-slate-800 space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-sm shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-200 truncate">{userName}</p>
            <p className="text-[11px] text-cyan-400 font-mono">Aktif Oturum</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition cursor-pointer"
        >
          <LogOut size={16} />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}