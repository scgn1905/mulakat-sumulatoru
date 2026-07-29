import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('Lütfen e-posta ve şifrenizi girin.');
      return;
    }

    // Kullanıcı adı girilmediyse e-postanın başını isim yapalım
    const displayName = name.trim() !== '' ? name : email.split('@')[0];

    // OTURUM BİLGİLERİNİ LOCALSTORAGE'A KAYDEDİYORUZ
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('token', 'mock_token_' + Date.now());
    localStorage.setItem('userName', displayName);

    // Ana sayfaya veya mülakat sayfasına yönlendir
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn size={24} />
          </div>
          <h1 className="text-2xl font-black text-slate-100">Mülakat Simülatörüne Giriş</h1>
          <p className="text-slate-400 text-xs">Devam etmek için bilgilerinizi girin.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 ml-1">Adınız / Kullanıcı Adınız</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                <User size={18} />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Ahmet Yılmaz"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 ml-1">E-posta Adresi</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@mail.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 ml-1">Şifre</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500">
                <Lock size={18} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer mt-2"
          >
            <span>Giriş Yap ve Başla</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}