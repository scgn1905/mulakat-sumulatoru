import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Form Doğrulama Kontrolleri
    if (!email.trim() || !password.trim()) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Lütfen geçerli bir e-posta adresi girin (örn: ahmet@gmail.com).');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    // Giriş başarılı
    login(email);
    navigate('/profile');
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold text-gray-900">Giriş Yap</h2>
        <p className="text-xs text-gray-500">
          Mülakat simülasyonlarına katılmak için hesabınıza giriş yapın.
        </p>
      </div>

      {/* Hata Mesajı Kutusu */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold animate-pulse">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">E-posta Adresi</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@email.com"
            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Şifre</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-md"
        >
          Giriş Yap
        </button>
      </form>

      <p className="text-center text-xs text-gray-500">
        Hesabınız yok mu?{' '}
        <Link to="/register" className="text-blue-600 font-bold hover:underline">
          Kayıt Olun
        </Link>
      </p>
    </div>
  );
}