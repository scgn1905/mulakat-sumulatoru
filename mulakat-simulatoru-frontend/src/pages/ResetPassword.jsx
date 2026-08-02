import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Geçersiz veya eksik sıfırlama token'ı.");
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Şifre sıfırlanamadı.");

      setMessage(data.message);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <Link to="/login" className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition mb-6">
          <ArrowLeft size={16} /> Giriş Sayfasına Dön
        </Link>

        <h2 className="text-2xl font-black text-white mb-2">Yeni Şifre Belirleme</h2>
        <p className="text-sm text-slate-400 mb-6">
          Lütfen hesabınız için yeni şifrenizi girin.
        </p>

        {message && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm flex items-center gap-3">
            <CheckCircle2 size={20} className="shrink-0" />
            <span>{message} Giriş sayfasına yönlendiriliyorsunuz...</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">Yeni Şifre</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 focus:outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || message}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold py-3.5 rounded-xl transition shadow-lg cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
          </button>
        </form>
      </div>
    </div>
  );
}