import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Örnek giriş simülasyonu
    localStorage.setItem('token', 'dummy_token_123');
    navigate('/interview');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl text-slate-900">
        <h2 className="text-3xl font-black text-center text-slate-900 mb-2">Giriş Yap</h2>
        <p className="text-sm text-center text-slate-500 mb-6">
          Kaldığınız yerden devam etmek için oturum açın.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">E-posta Adresi</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ornek@email.com"
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Şifre</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg mt-2 cursor-pointer"
          >
            Giriş Yap
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Hesabınız yok mu?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Ücretsiz Kayıt Olun
          </Link>
        </p>
      </div>
    </div>
  );
}