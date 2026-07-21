import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Interview from './pages/Interview';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';

// Korumalı Rota Bileşeni: Kullanıcı yoksa doğrudan Login'e atar
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
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-sm border border-gray-100 text-center space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900">Mülakat Simülatörüne Hoş Geldiniz</h1>
      <p className="text-gray-600 leading-relaxed">
        İnsan kaynakları ve teknik pozisyon mülakatlarına hazırlanmak için hemen kategori seçin.
      </p>
      <div className="pt-2">
        <Link
          to={user ? "/profile" : "/login"}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-all"
        >
          {user ? "Mülakat Kategorisi Seç & Başla" : "Mülakatlara Katılmak İçin Giriş Yap"}
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-600 tracking-tight">
            Mülakat<span className="text-gray-900">Simülatörü</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="text-gray-600 hover:text-blue-600">Ana Sayfa</Link>
            {user && (
              <Link to="/profile" className="text-gray-600 hover:text-blue-600">Profil & Kategoriler</Link>
            )}
            
            {user ? (
              <>
                <span className="text-gray-400">|</span>
                <span className="text-gray-700 font-semibold">{user.name}</span>
                <button onClick={() => { logout(); navigate('/'); }} className="text-red-600 hover:text-red-700">
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600">Giriş Yap</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Kayıt Ol</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* SADECE GİRİŞ YAPANLARIN ERİŞEBİLECEĞİ SAYFALAR */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <Interview />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}