import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Briefcase, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Play, 
  Layers, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  Sparkles,
  Flame,
  UserCheck,
  RefreshCw
} from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(0);

  // Mülakatı Başlat Buton Kontrolü (Giriş yapılmamışsa Login'e yönlendirir)
  const handleStartInterview = () => {
    const token = localStorage.getItem('token');
    const isValidToken = token && token !== 'null' && token !== 'undefined' && token.trim() !== '';

    if (isValidToken) {
      navigate('/interview');
    } else {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const scenarios = [
    {
      role: "KİDEMLİ İK YÖNETİCİSİ (AI)",
      question: "Geçmiş tecrübelerinizde ekibinizle ciddi bir fikir ayrılığı yaşadığınız kriz anını ve bunu nasıl çözdüğünüzü anlatır mısınız?",
      answer: "Proje teslim tarihine az kala öncelikler konusunda bir anlaşmazlık çıkmıştı. Veriye dayalı analiz hazırlayıp ortak bir kriz toplantısıyla süreci yönettim.",
      score: "92/100 — Problem çözme yetkinliği ve iletişim dili çok başarılı!",
      tag: "Kriz Yönetimi & İK"
    },
    {
      role: "TEKNİK LİDER (AI)",
      question: "Önemli bir projenin canlıya çıkışında beklenmedik bir sistem kesintisi yaşansaydı, ilk 15 dakikadaki kriz aksiyon planınız ne olurdu?",
      answer: "Öncelikle etki alanını izole edip geri dönme (rollback) prosedürünü başlatırdım. Eş zamanlı olarak paydaşlara şeffaf durum bilgilendirmesi yapardım.",
      score: "96/100 — Sistemik düşünme ve risk yönetimi harika!",
      tag: "Teknik Liderlik"
    },
    {
      role: "ÜRÜN YÖNETİCİSİ / PRODUCT OWNER (AI)",
      question: "Müşteri talepleri ile yazılım ekibinin teknik borç (technical debt) temizleme isteği çakıştığında önceliklendirmenizi nasıl yaparsınız?",
      answer: "Teknik borcun sistem sürdürülebilirliğine ve gelecekteki hızımıza maliyetini ölçümler, ürün yol haritasında dengeli bir sprint dağılımı oluştururdum.",
      score: "90/100 — Analitik önceliklendirme ve denge odaklı.",
      tag: "Ürün Yönetimi"
    },
    {
      role: "GLOBAL TALENT ACQUISITION (AI)",
      question: "Could you describe a challenging project where you had to quickly adapt to a technology or methodology you weren't familiar with?",
      answer: "In my previous role, we had to migrate our stack unexpectedly. I scheduled intensive self-study blocks and successfully led the transition in two weeks.",
      score: "95/100 — Excellent English fluency & adaptability!",
      tag: "İngilizce Mülakat"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScenario((prev) => (prev + 1) % scenarios.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [scenarios.length]);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 4000);
    }
  };

  const faqs = [
    {
      q: t('faq1Q', 'Şirket mülakat simülatörü yanıtlarımı nasıl analiz ediyor?'),
      a: t('faq1A', 'Yapay zekâ modelimiz, yanıtlarınızı STAR metodolojisi, kriz yönetimi beceriniz ve anlatım netliğiniz açısından analiz eder.')
    },
    {
      q: t('faq2Q', 'Hangi pozisyon ve departmanlar için mülakat pratiği var?'),
      a: t('faq2A', 'Yazılım, İK Yönetimi, Pazarlama, Proje & Ürün Yönetimi, Finans ve Müşteri İlişkileri gibi pek çok farklı departmana özel kurumsal senaryolar mevcuttur.')
    },
    {
      q: t('faq3Q', 'Şirketlerin güncel mülakat soruları nasıl belirleniyor?'),
      a: t('faq3A', 'Soru havuzumuz; global ve yerel şirketlerin güncel mülakat süreçleri ve İK beklentileri referans alınarak sürekli güncellenir.')
    },
    {
      q: t('faq4Q', 'Ücretsiz sürümde kısıtlama var mı?'),
      a: t('faq4A', 'Ücretsiz planda her ay 3 tam mülakat simülasyonu hakkınız bulunur. İngilizce mülakat simülasyonları ve PDF raporları Pro pakete dahildir.')
    }
  ];

  const active = scenarios[currentScenario];

  return (
    <div className="space-y-36 pb-20 text-slate-100">

      {/* HERO SECTION */}
      <section className="relative pt-8 flex flex-col items-center">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/15 blur-[160px] rounded-full pointer-events-none"></div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-semibold mb-8">
          <Flame size={14} className="text-amber-400 animate-bounce" />
          <span>MULAKAT.AI v2.0 Live</span>
        </div>

        <h1 className="text-4xl md:text-7xl font-black text-center tracking-tight leading-none max-w-4xl">
          <span className="bg-gradient-to-r from-teal-300 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            {t('heroTitle', 'Şirket Mülakatlarına Yapay Zekâ ile Hazırlanın')}
          </span>
        </h1>

        <p className="mt-6 text-center text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed">
          {t('heroDesc', 'Zorlu İK soruları veya teknik senaryolar karşısında bocalama. Gerçekçi mülakat simülasyonlarıyla tecrübe kazan, özgüvenini katla.')}
        </p>

        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleStartInterview}
            className="flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-extrabold px-8 py-4 rounded-2xl shadow-[0_0_30px_rgba(45,212,191,0.3)] transition transform hover:-translate-y-1 cursor-pointer"
          >
            <Play size={18} className="fill-slate-950" />
            <span>{t('startInterview', 'Mülakatı Başlat')}</span>
          </button>
        </div>

        {/* DEMO KARTI */}
        <div className="mt-14 w-full max-w-4xl bg-slate-900/80 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              <span className="ml-2 text-xs font-mono text-slate-500">live-simulation.ai</span>
            </div>

            <span className="text-xs bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-2.5 py-1 rounded-md font-mono flex items-center gap-1.5">
              <RefreshCw size={12} className="animate-spin text-cyan-400" />
              {active.tag}
            </span>
          </div>

          <div className="space-y-4 text-xs md:text-sm min-h-[190px] flex flex-col justify-between">
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 text-cyan-300 flex items-start gap-3">
              <Briefcase size={18} className="text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 block text-[10px] font-mono mb-1">{active.role}</span>
                "{active.question}"
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-slate-300 ml-6 flex items-start gap-3">
              <MessageSquare size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 block text-[10px] font-mono mb-1">{t('answerTag', 'YANIT')}</span>
                "{active.answer}"
              </div>
            </div>

            <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-400" /> AI Skor: <strong>{active.score}</strong>
              </span>
              <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-400 font-mono hidden md:inline">
                STAR Uyumlu
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-800/60">
            <span className="text-[11px] text-slate-500 font-mono">{t('autoFlow', 'Otomatik Senaryo Akışı')}</span>
            <div className="flex items-center gap-2">
              {scenarios.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentScenario(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentScenario === idx ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ÖZELLİKLER SECTION */}
      <section id="features" className="scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase">
              {t('featTechTag', '// KURUMSAL MÜLAKAT TEKNOLOJİSİ')}
            </span>
            <h2 className="text-3xl md:text-5xl font-black mt-2">{t('features', 'Özellikler')}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 hover:border-cyan-500/40 transition group">
            <div className="w-12 h-12 bg-cyan-400/10 text-cyan-400 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition">
              <UserCheck size={26} />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('feat1Title', 'Davranışsal Analiz')}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{t('feat1Desc', 'Sorulara verdiğiniz tepkiler STAR metoduna uyum seviyenize göre değerlendirilir.')}</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 hover:border-teal-500/40 transition group">
            <div className="w-12 h-12 bg-teal-400/10 text-teal-400 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition">
              <Layers size={26} />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('feat2Title', 'Pozisyona Özel Senaryolar')}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{t('feat2Desc', 'Yöneticilik, İK veya Mühendislik rolleri için özelleştirilmiş senaryolar.')}</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 hover:border-indigo-500/40 transition group">
            <div className="w-12 h-12 bg-indigo-400/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition">
              <ShieldCheck size={26} />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('feat3Title', 'Gelişim Raporu')}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{t('feat3Desc', 'İletişim diliniz ve güçlü yönleriniz detaylı raporlarla sunulur.')}</p>
          </div>
        </div>
      </section>

      {/* FİYATLANDIRMA SECTION */}
      <section id="pricing" className="scroll-mt-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black">{t('pricing', 'Fiyatlar')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-full">{t('planStarterTag', 'TEMEL BAŞLANGIÇ')}</span>
              <h3 className="text-2xl font-bold mt-4">Starter Pass</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-black">₺0</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-cyan-400" /> {t('starterFeat1', 'Ayda 3 Şirket Mülakatı Simülasyonu')}</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-cyan-400" /> {t('starterFeat2', 'Temel Yetkinlik Puanlaması')}</li>
              </ul>
            </div>
            <Link to="/register" className="mt-8 text-center bg-slate-800 hover:bg-slate-700 py-3.5 rounded-xl text-sm font-semibold transition">
              {t('register', 'Kayıt Ol')}
            </Link>
          </div>

          <div className="bg-slate-900 border-2 border-cyan-500/60 rounded-3xl p-8 flex flex-col justify-between relative shadow-[0_0_35px_rgba(34,211,238,0.1)]">
            <div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-3 py-1 rounded-full">{t('planProTag', 'KARIYER PAKETİ')}</span>
              <h3 className="text-2xl font-bold mt-4 text-white">Pro Pass</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-black text-cyan-400">₺199</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-cyan-400" /> {t('proFeat1', 'Sınırsız Mülakat Simülasyonu')}</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-cyan-400" /> {t('proFeat2', 'İngilizce Mülakat & Akıcılık Analizi')}</li>
              </ul>
            </div>
            <Link to="/register" className="mt-8 text-center bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-3.5 rounded-xl transition shadow-lg">
              {t('upgradePro', "Pro'ya Geç")}
            </Link>
          </div>
        </div>
      </section>

      {/* SSS SECTION */}
      <section id="faq" className="scroll-mt-24 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black">{t('faq', 'SSS')}</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-200 hover:text-cyan-400 transition cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaq === index ? <Minus size={18} className="text-cyan-400 shrink-0" /> : <Plus size={18} className="text-slate-500 shrink-0" />}
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* İLETİŞİM SECTION */}
      <section id="contact" className="scroll-mt-24 max-w-4xl mx-auto bg-slate-900/40 border border-slate-800 p-8 md:p-12 rounded-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-black mb-3">{t('contact', 'İletişim')}</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">{t('contactDesc', 'Sorularınız ve iş birlikleri için bize ulaşabilirsiniz.')}</p>
          </div>

          <div>
            {submitted ? (
              <div className="bg-emerald-950/40 border border-emerald-500/30 p-6 rounded-2xl text-center">
                <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-2" />
                <h4 className="font-bold text-slate-200">{t('msgSent', 'Mesajınız İletildi!')}</h4>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('fullName', 'Ad Soyad')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400 transition"
                />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t('email', 'E-posta Adresi')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400 transition"
                />
                <textarea
                  rows={3}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t('messagePlaceholder', 'Mesajınız...')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400 transition resize-none"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Send size={15} />
                  <span>{t('sendBtn', 'Gönder')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}