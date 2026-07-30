import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Contact from '../components/Contact';
import { 
  Briefcase, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Play, 
  Layers, 
  MessageSquare,
  Sparkles,
  Flame,
  UserCheck,
  RefreshCw,
  CheckCircle2,
  Terminal,
  Cpu,
  Zap
} from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [currentScenario, setCurrentScenario] = useState(0);

  // Terminal animasyonu için simüle edilmiş AI akış metinleri
  const terminalLines = [
    "AI Mülakat Motoru başlatılıyor...",
    "Kullanıcı profil analizi tamamlandı: Full Stack Developer",
    "STAR Metodolojisi ve Diksiyon modülü aktif...",
    "Yüksek performanslı kurumsal mülakat simülasyonuna hazırsınız."
  ];

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let timeout;
    if (currentLineIndex < terminalLines.length) {
      const targetText = terminalLines[currentLineIndex];
      let charIndex = 0;

      const interval = setInterval(() => {
        if (charIndex <= targetText.length) {
          setDisplayedText(targetText.substring(0, charIndex));
          charIndex++;
        } else {
          clearInterval(interval);
          timeout = setTimeout(() => {
            setCurrentLineIndex(prev => prev + 1);
          }, 1500);
        }
      }, 40);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      const resetTimeout = setTimeout(() => {
        setCurrentLineIndex(0);
      }, 3000);
      return () => clearTimeout(resetTimeout);
    }
  }, [currentLineIndex]);

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
      role: t('scenario1Role', 'KİDEMLİ İK YÖNETİCİSİ (AI)'),
      question: t('scenario1Q', 'Geçmiş tecrübelerinizde ekibinizle ciddi bir fikir ayrılığı yaşadığınız kriz anını ve bunu nasıl çözdüğünüzü anlatır mısınız?'),
      answer: t('scenario1A', 'Proje teslim tarihine az kala öncelikler konusunda bir anlaşmazlık çıkmıştı. Veriye dayalı analiz hazırlayıp ortak bir kriz toplantısıyla süreci yönettim.'),
      score: t('scenario1Score', '92/100 — Problem çözme yetkinliği ve iletişim dili çok başarılı!'),
      tag: t('scenario1Tag', 'Kriz Yönetimi & İK')
    },
    {
      role: t('scenario2Role', 'TEKNİK LİDER (AI)'),
      question: t('scenario2Q', 'Önemli bir projenin canlıya çıkışında beklenmedik bir sistem kesintisi yaşansaydı, ilk 15 dakikadaki kriz aksiyon planınız ne olurdu?'),
      answer: t('scenario2A', 'Öncelikle etki alanını izole edip geri dönme (rollback) prosedürünü başlatırdım. Eş zamanlı olarak paydaşlara şeffaf durum bilgilendirmesi yapardım.'),
      score: t('scenario2Score', '96/100 — Sistemik düşünme ve risk yönetimi harika!'),
      tag: t('scenario2Tag', 'Teknik Liderlik')
    },
    {
      role: t('scenario3Role', 'ÜRÜN YÖNETİCİSİ / PRODUCT OWNER (AI)'),
      question: t('scenario3Q', 'Müşteri talepleri ile yazılım ekibinin teknik borç (technical debt) temizleme isteği çakıştığında önceliklendirmenizi nasıl yaparsınız?'),
      answer: t('scenario3A', 'Teknik borcun sürdürülebilirliğe etkisini ölçümler, ürün yol haritasında dengeli bir sprint dağılımı oluştururdum.'),
      score: t('scenario3Score', '90/100 — Analitik önceliklendirme ve denge odaklı.'),
      tag: t('scenario3Tag', 'Ürün Yönetimi')
    },
    {
      role: t('scenario4Role', 'GLOBAL TALENT ACQUISITION (AI)'),
      question: t('scenario4Q', 'Could you describe a challenging project where you had to quickly adapt to a technology or methodology you weren\'t familiar with?'),
      answer: t('scenario4A', 'In my previous role, we had to migrate our stack unexpectedly. I scheduled intensive self-study blocks and successfully led the transition in two weeks.'),
      score: t('scenario4Score', '95/100 — Excellent English fluency & adaptability!'),
      tag: t('scenario4Tag', 'İngilizce Mülakat')
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScenario((prev) => (prev + 1) % scenarios.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [scenarios.length]);

  useEffect(() => {
    if (window.location.hash) {
      const element = document.getElementById(window.location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // GENİŞLETİLMİŞ SSS LİSTESİ
  const faqs = [
    {
      q: t('faq1Q', 'Şirket mülakat simülatörü yanıtlarımı nasıl analiz ediyor?'),
      a: t('faq1A', 'Yapay zekâ modelimiz, yanıtlarınızı STAR (Senaryo, Görev, Aksiyon, Sonuç) metodolojisi, kriz yönetimi beceriniz, teknik terim hakimiyetiniz ve anlatım netliğiniz açısından analiz eder.')
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
    },
    {
      q: t('faq5Q', 'Mülakat esnasında sesli yanıt verme seçeneği var mı?'),
      a: t('faq5A', 'Evet! Simülasyon sırasında yanıtlarınızı klavyeden yazabileceğiniz gibi, mikrofonunuzu kullanarak sesli olarak da iletebilirsiniz.')
    },
    {
      q: t('faq6Q', 'Kendi CV/Özgeçmişime uygun özel sorular sorulabilir mi?'),
      a: t('faq6A', 'Evet, profilinize CV bilgilerinizi girdiğinizde yapay zekâ geçmiş tecrübelerinizi analiz eder ve doğrudan sizin kariyer geçmişinize özel sorular yöneltir.')
    },
    {
      q: t('faq7Q', 'Farklı dillerde mülakat pratiği yapabilir miyim?'),
      a: t('faq7A', 'Platformumuz şu anda Türkçe ve İngilizce mülakat simülasyonlarını desteklemektedir. Yabancı dildeki mülakat özgüveninizi geliştirmek için İngilizce modunu seçebilirsiniz.')
    },
    {
      q: t('faq8Q', 'Kişisel verilerim ve ses kayıtlarım güvende mi?'),
      a: t('faq8A', 'Gizliliğiniz bizim için esastır. Tüm verileriniz ve yanıtlarınız şifrelenmiş sunucularda saklanır, asla üçüncü taraflarla paylaşılmaz.')
    }
  ];

  const active = scenarios[currentScenario];

  return (
    <div className="space-y-36 pb-20 text-slate-900 dark:text-slate-100 relative">

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-12 flex flex-col items-center px-4 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-slate-100/80 dark:bg-slate-950 transition-colors">
        
        {/* ANIMASYONLU ROBOT KARAKTER */}
        <div className="absolute top-4 left-6 z-20 flex items-center gap-2">
          <div className="relative w-8 h-8 flex items-center justify-center bg-cyan-500/10 border border-cyan-500/30 rounded-xl animate-bounce" style={{ animationDuration: '2s' }}>
            <span className="text-base">🤖</span>
            <div className="absolute inset-0 rounded-xl border border-cyan-400 animate-ping opacity-40"></div>
          </div>
          <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-widest hidden sm:inline-block animate-pulse">
            AI Active
          </span>
        </div>

        {/* Görsel ve Degradeler */}
        <div 
          className="absolute inset-0 z-0 opacity-15 dark:opacity-35 bg-cover bg-center pointer-events-none rounded-3xl mix-blend-luminosity filter contrast-125" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80')` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-100 via-slate-100/80 to-transparent dark:from-[#0b101d] dark:via-[#0b101d]/80 dark:to-transparent z-0" />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-cyan-400/20 dark:bg-cyan-500/20 blur-[140px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center max-w-4xl w-full mx-auto text-center">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/95 border border-slate-300 dark:border-slate-700 text-cyan-600 dark:text-cyan-400 text-xs font-semibold mb-8 shadow-md backdrop-blur-md">
            <Flame size={14} className="text-amber-500 dark:text-amber-400 animate-bounce" />
            <span>{t('heroBadge', 'MULAKAT.AI v2.0 Live')}</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-none max-w-4xl">
            <span className="text-slate-900 dark:text-transparent dark:bg-gradient-to-r dark:from-teal-300 dark:via-cyan-400 dark:to-indigo-400 dark:bg-clip-text">
              {t('heroTitle', 'Şirket Mülakatlarına Yapay Zekâ ile Hazırlanın')}
            </span>
          </h1>

          <p className="mt-6 text-slate-700 dark:text-slate-300 text-base md:text-lg max-w-2xl leading-relaxed font-medium">
            {t('heroDesc', 'Zorlu İK soruları veya teknik senaryolar karşısında bocalama. Gerçekçi mülakat simülasyonlarıyla tecrübe kazan, özgüvenini katla.')}
          </p>

          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={handleStartInterview}
              className="flex items-center gap-3 bg-cyan-600 hover:bg-cyan-700 dark:bg-gradient-to-r dark:from-cyan-400 dark:to-teal-400 dark:hover:from-cyan-300 dark:hover:to-teal-300 text-white dark:text-slate-950 font-extrabold px-8 py-4 rounded-2xl shadow-lg transition transform hover:-translate-y-1 cursor-pointer"
            >
              <Play size={18} className="fill-current" />
              <span>{t('startInterview', 'Mülakatı Başlat')}</span>
            </button>
          </div>
        </div>

        {/* CANLI TERMINAL / AI AKIŞ ANİMASYONU */}
        <div className="mt-12 w-[90%] max-w-4xl bg-white/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-3xl p-5 shadow-xl dark:shadow-2xl backdrop-blur-2xl relative overflow-hidden mx-auto z-10 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
              <Terminal size={14} className="text-cyan-600 dark:text-cyan-400" />
              <span>mulakat-ai-core.sh</span>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl h-28 flex flex-col justify-between font-mono text-xs shadow-inner">
            <div className="space-y-1">
              <div className="text-slate-400 dark:text-slate-500 text-[11px]">// Yapay Zekâ Aktif Oturum Logları</div>
              <div className="text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <span>❯</span>
                <span className="text-slate-800 dark:text-slate-200">{displayedText}</span>
                <span className="w-2 h-3.5 bg-cyan-600 dark:text-cyan-400 animate-pulse" />
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400">
                <Cpu size={12} /> Model: GPT-Enterprise
              </span>
              <span className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20 font-bold font-mono">
                CANLI & GÜVENLİ
              </span>
            </div>
          </div>
        </div>

        {/* DEMO KARTI */}
        <div className="mt-8 w-[90%] max-w-4xl bg-white/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 rounded-3xl p-4 md:p-6 shadow-xl dark:shadow-2xl backdrop-blur-2xl relative overflow-hidden mx-auto z-10 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              <span className="ml-2 text-xs font-mono text-slate-500 dark:text-slate-400">live-simulation.ai</span>
            </div>

            <span className="text-xs bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-800/60 px-2.5 py-1 rounded-md font-mono flex items-center gap-1.5 font-bold">
              <RefreshCw size={12} className="animate-spin text-cyan-600 dark:text-cyan-400" />
              {active.tag}
            </span>

          </div>

          <div className="space-y-4 text-xs md:text-sm min-h-[190px] flex flex-col justify-between">
            <div className="bg-slate-100 dark:bg-slate-950/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-cyan-300 flex items-start gap-3">
              <Briefcase size={18} className="text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 block text-[10px] font-mono mb-1 font-semibold">{active.role}</span>
                <span className="font-semibold dark:font-normal">"{active.question}"</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/95 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 ml-2 md:ml-6 flex items-start gap-3">
              <MessageSquare size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 block text-[10px] font-mono mb-1 font-semibold">{t('answerTag', 'YANIT')}</span>
                <span className="font-medium dark:font-normal">"{active.answer}"</span>
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between font-semibold">
              <span className="flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" /> AI Skor: <strong>{active.score}</strong>
              </span>
              <span className="text-[10px] bg-emerald-200 dark:bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-800 dark:text-emerald-400 font-mono hidden md:inline">
                STAR Uyumlu
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-200 dark:border-slate-800/60">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{t('autoFlow', 'Otomatik Senaryo Akışı')}</span>
            <div className="flex items-center gap-2">
              {scenarios.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentScenario(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentScenario === idx ? 'w-6 bg-cyan-600 dark:bg-cyan-400' : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ÖZELLİKLER SECTION (6 PROFESYONEL ÖZELLİK KARTI) */}
      <section id="features" className="scroll-mt-24 px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-cyan-600 dark:text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase">
              {t('featTechTag', '// KURUMSAL MÜLAKAT TEKNOLOJİSİ')}
            </span>
            <h2 className="text-3xl md:text-5xl font-black mt-2 text-slate-900 dark:text-white">{t('featuresTitle', 'Özellikler')}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-cyan-500/40 transition group shadow-sm dark:shadow-none">
            <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition">
              <UserCheck size={26} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{t('feat1Title', 'Davranışsal Analiz')}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{t('feat1Desc', 'Sorulara verdiğiniz tepkiler STAR metoduna uyum seviyenize göre değerlendirilir.')}</p>
          </div>

          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-teal-500/40 transition group shadow-sm dark:shadow-none">
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-400/10 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition">
              <Layers size={26} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{t('feat2Title', 'Pozisyona Özel Senaryolar')}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{t('feat2Desc', 'Yöneticilik, İK veya Mühendislik rolleri için özelleştirilmiş senaryolar.')}</p>
          </div>

          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-indigo-500/40 transition group shadow-sm dark:shadow-none">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition">
              <ShieldCheck size={26} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{t('feat3Title', 'Gelişim Raporu')}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{t('feat3Desc', 'İletişim diliniz ve güçlü yönleriniz detaylı raporlarla sunulur.')}</p>
          </div>

          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-amber-500/40 transition group shadow-sm dark:shadow-none">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition">
              <MessageSquare size={26} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Sesli Yanıt & Diksiyon</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Mikrofonunuzu kullanarak sesli yanıt verin; yapay zekâ ses tonunuzu ve akıcılığınızı anında analiz etsin.</p>
          </div>

          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-emerald-500/40 transition group shadow-sm dark:shadow-none">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition">
              <Sparkles size={26} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">PDF Mülakat Raporu</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Tamamladığınız mülakatların tüm detaylı analiz karnesini tek tıkla profesyonel PDF formatında indirin.</p>
          </div>

          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:border-purple-500/40 transition group shadow-sm dark:shadow-none">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-400/10 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition">
              <Flame size={26} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Türkçe & İngilizce Mod</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">İster uluslararası küresel mülakatlar için İngilizce, ister ana dilinizde Türkçe simülasyonlar gerçekleştirin.</p>
          </div>
        </div>
      </section>

      {/* FİYATLANDIRMA SECTION */}
      <section id="pricing" className="scroll-mt-24 px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">{t('pricingTitle', 'Fiyatlar')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* STARTER PASS */}
          <div className="bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 flex flex-col justify-between shadow-sm dark:shadow-none">
            <div>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-transparent px-3 py-1 rounded-full">
                {t('planStarterTag', 'TEMEL BAŞLANGIÇ')}
              </span>
              <h3 className="text-2xl font-bold mt-4 text-slate-900 dark:text-white">Starter Pass</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-black text-slate-900 dark:text-white">₺0</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
                <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-cyan-600 dark:text-cyan-400" /> {t('starterFeat1', 'Ayda 3 Şirket Mülakatı Simülasyonu')}</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-cyan-600 dark:text-cyan-400" /> {t('starterFeat2', 'Temel Yetkinlik Puanlaması')}</li>
              </ul>
            </div>
            <Link to="/register" className="mt-8 text-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold py-3.5 rounded-xl text-sm transition border border-slate-200 dark:border-transparent">
              {t('register', 'Kayıt Ol')}
            </Link>
          </div>

          {/* PRO PASS */}
          <div className="bg-white dark:bg-slate-900 border-2 border-cyan-500/60 rounded-3xl p-8 flex flex-col justify-between relative shadow-lg dark:shadow-[0_0_35px_rgba(34,211,238,0.1)]">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-800/60 px-3 py-1 rounded-full">
                {t('planProTag', 'KARİYER PAKETİ')}
              </span>
              <h3 className="text-2xl font-bold mt-4 text-slate-900 dark:text-white">Pro Pass</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-black text-cyan-600 dark:text-cyan-400">₺199</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
                <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-cyan-600 dark:text-cyan-400" /> {t('proFeat1', 'Sınırsız Mülakat Simülasyonu')}</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-cyan-600 dark:text-cyan-400" /> {t('proFeat2', 'İngilizce Mülakat & Akıcılık Analizi')}</li>
              </ul>
            </div>
            <Link to="/register" className="mt-8 text-center bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-400 dark:hover:bg-cyan-300 text-white dark:text-slate-950 font-bold py-3.5 rounded-xl transition shadow-md">
              {t('upgradePro', "Pro'ya Geç")}
            </Link>
          </div>
        </div>
      </section>

      {/* SSS SECTION */}
      <section id="faq" className="scroll-mt-24 max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">{t('faqTitle', 'SSS')}</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition shadow-sm dark:shadow-none"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className={`w-full flex items-center justify-between p-5 text-left font-bold transition cursor-pointer ${
                    isOpen 
                      ? 'text-cyan-600 dark:text-cyan-400' 
                      : 'text-slate-900 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400'
                  }`}
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <Minus size={18} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                  ) : (
                    <Plus size={18} className="text-slate-500 dark:text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-3 font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* İLETİŞİM SECTION */}
      <Contact />

    </div>
  );
}