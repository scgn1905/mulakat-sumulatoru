import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Interview from './pages/Interview';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function Home() {
  const { user } = useAuth();

  return (
    <div className="space-y-12 animate-fade-in pb-8">
      {/* ANA HERO ALANI (GÖRSEL DESTEKLİ) */}
      <div className="relative overflow-hidden max-w-5xl mx-auto mt-4 p-8 md:p-12 bg-[#0c1017] rounded-3xl border border-[#1e293b] shadow-2xl grid md:grid-cols-2 gap-8 items-center">
        {/* Arka Plan Işık Efektleri */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Sol Taraf: Metin ve Aksiyon */}
        <div className="space-y-6 text-left z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#161f2e] border border-[#26334d] rounded-full text-cyan-400 text-[11px] font-black tracking-widest uppercase shadow-inner">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            AI-Powered Interview Simulator
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Kariyerinizdeki Büyük Adıma <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Usta Seviyesinde Hazırlanın
            </span>
          </h1>

          <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-normal">
            Kurumsal departmanlar ve yönetim mülakatlarında zaman baskısı altında pratik yapın, yapay zekâ analizleriyle eksiklerinizi anında kapatın.
          </p>

          <div className="pt-2">
            <Link
              to={user ? "/profile" : "/login"}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black py-3.5 px-8 rounded-2xl shadow-xl shadow-cyan-500/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-xs md:text-sm border border-cyan-400/30"
            >
              {user ? "Simülasyonu Başlat →" : "Mülakatlara Katılmak İçin Giriş Yap"}
            </Link>
          </div>
        </div>

        {/* Sağ Taraf: Canlı Mülakat Görseli / Card Mockup */}
        <div className="relative z-10 group">
          <div className="relative rounded-2xl overflow-hidden border border-[#26334d] shadow-2xl shadow-cyan-500/10">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
              alt="Mülakat Simülasyonu"
              className="w-full h-64 md:h-80 object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
            />
            {/* Görsel Üzerindeki Overlay Karartma */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c1017] via-transparent to-transparent opacity-80" />
            
            {/* Görsel Üzerindeki Canlı Rozet */}
            <div className="absolute bottom-4 left-4 right-4 p-3 bg-[#050811]/90 backdrop-blur-md rounded-xl border border-[#1e293b] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-slate-200">Canlı Yapay Zekâ Analizi</span>
              </div>
              <span className="text-cyan-400 font-black">9.2 / 10 Skor</span>
            </div>
          </div>
        </div>
      </div>

      {/* ÖNE ÇIKAN ÖZELLİKLER (GÖRSEL KARTLAR) */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="p-6 bg-[#0c1017] rounded-3xl border border-[#1e293b] space-y-3 text-left">
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-2xl">
            ⏱️
          </div>
          <h3 className="font-bold text-white text-base">Zaman Baskılı Süreç</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Soru başına 3 dakikalık sayaç ile gerçek mülakat stresini ve zaman yönetimini birebir tecrübe edin.
          </p>
        </div>

        <div className="p-6 bg-[#0c1017] rounded-3xl border border-[#1e293b] space-y-3 text-left">
          <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center text-2xl">
            📊
          </div>
          <h3 className="font-bold text-white text-base">Kişiselleştirilmiş Isı Haritası</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hangi yetkinliklerde güçlü, hangi alanlarda gelişime açık olduğunuzu canlı analiz paneli ile izleyin.
          </p>
        </div>

        <div className="p-6 bg-[#0c1017] rounded-3xl border border-[#1e293b] space-y-3 text-left">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-2xl">
            🔥
          </div>
          <h3 className="font-bold text-white text-base">Günün Sorusu & Seri (Streak)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Her gün yenilenen kurumsal soruları yanıtlayarak günlük seri puanınızı koruyun ve alışkanlık kazanın.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#04070d] text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-slate-950">
      {/* Header */}
      <header className="bg-[#080d1a] border-b border-[#1b2436] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link to="/" className="text-xl font-black tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-slate-950 font-black text-base shadow-lg shadow-cyan-500/20">
              🎯
            </span>
            <span className="text-white">Mülakat<span className="text-cyan-400">Simülatörü</span></span>
          </Link>

          <nav className="flex items-center gap-6 text-sm font-bold">
            <Link to="/" className="text-slate-300 hover:text-cyan-400 transition-colors">Ana Sayfa</Link>
            {user && (
              <Link to="/profile" className="text-slate-300 hover:text-cyan-400 transition-colors">Profil & Departmanlar</Link>
            )}
            
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-[#1b2436]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#131b2e] text-cyan-400 border border-[#222f4c] rounded-xl flex items-center justify-center font-black text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-slate-200 font-bold text-xs">{user.name}</span>
                </div>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="text-xs text-rose-400 hover:text-rose-300 font-bold transition-colors"
                >
                  Çıkış
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-slate-300 hover:text-white px-3 py-2 rounded-xl transition-colors">Giriş Yap</Link>
                <Link to="/register" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/20 transition-all text-xs">Kayıt Ol</Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/interview" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}