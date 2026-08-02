import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function Payment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [cardData, setCardData] = useState({
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);

    // Ödeme simülasyonu (2 saniye bekleyip başarılı sayar)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 md:px-12 flex flex-col justify-center items-center">
      <div className="max-w-xl w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative">
        
        {/* Geri Dön Butonu */}
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} /> Ana Sayfaya Dön
        </button>

        {success ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-100">Ödemeniz Başarılı!</h2>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Tebrikler! Pro Pass üyeliğiniz aktifleşti. Sınırsız mülakat simülasyonlarının keyfini çıkarabilirsiniz.
            </p>
            <button
              onClick={() => navigate('/interview')}
              className="mt-6 w-full bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-extrabold py-3.5 rounded-xl shadow-lg transition cursor-pointer"
            >
              Mülakata Başla
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <span className="text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase">
                // GÜVENLİ ÖDEME
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-100 mt-1">
                Pro Pass Aboneliği
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Aylık Sınırsız Mülakat & İngilizce Analiz Paketi — <strong className="text-cyan-400">₺199 / ay</strong>
              </p>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Kart Üzerindeki İsim</label>
                <input 
                  type="text" 
                  name="cardHolder"
                  required
                  placeholder="seçgin yıldırım "
                  value={cardData.cardHolder}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Kart Numarası</label>
                <div className="relative">
                  <CreditCard size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                  <input 
                    type="text" 
                    name="cardNumber"
                    required
                    maxLength={19}
                    placeholder="4543 •••• •••• ••••"
                    value={cardData.cardNumber}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 focus:outline-none transition font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Son Kullanma Tarihi</label>
                  <input 
                    type="text" 
                    name="expiry"
                    required
                    maxLength={5}
                    placeholder="AA/YY"
                    value={cardData.expiry}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none transition font-mono text-center"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">CVV / Güvenlik Kodu</label>
                  <input 
                    type="password" 
                    name="cvv"
                    required
                    maxLength={4}
                    placeholder="CVC"
                    value={cardData.cvv}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none transition font-mono text-center"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-extrabold py-4 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.2)] transition cursor-pointer disabled:opacity-50"
                >
                  <Lock size={16} />
                  <span>{loading ? 'İşleniyor...' : '199 ₺ Güvenli Ödemeyi Tamamla'}</span>
                </button>
              </div>
            </form>

            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-500 font-mono">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>256-Bit SSL ile Güvenli Şifrelenmiş Ödeme</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}