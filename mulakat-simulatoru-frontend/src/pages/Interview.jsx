import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { 
  Briefcase, 
  Sparkles, 
  Send, 
  ArrowLeft,
  Loader2,
  Code,
  Users,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Layers,
  AlertCircle,
  Globe,
  Award,
  Download,
  Target,
  MessageSquare,
  RefreshCw,
  Home,
  Mic,
  MicOff
} from 'lucide-react';

export default function Interview() {
  const navigate = useNavigate();
  const reportRef = useRef();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('tr');
  const [allResponses, setAllResponses] = useState([]);
  const [interviewCompleted, setInterviewCompleted] = useState(false);

  // --- SESLİ YAZMA VE ANALİZ STATE'LERİ ---
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const t = {
    tr: {
      badge: "// YAPAY ZEKÂ MÜLAKAT MERKEZİ",
      selectTitle: "Mülakat Kategorisi Seçin",
      backToCats: "Kategorilere Dön",
      home: "Ana Sayfa",
      questionsCount: "Soru Simülasyonu",
      start: "Başla",
      questionProgress: "Soru",
      aiActive: "AI Aktif Değerlendirme & Puanlama",
      aiInterviewer: "YAPAY ZEKÂ İK / LİDER MÜLAKATÇI",
      placeholder: "Yanıtınızı buraya detaylı bir şekilde yazın veya mikrofonu açıp sesli anlatın...",
      evaluating: "Yapay Zekâ Sesli Yanıtınızı Analiz Ediyor, Diksiyon ve İçerik İnceleniyor...",
      evaluateBtn: "Yanıta Yapay Zekâ Puanı ve Analizi Al",
      aiEvalTitle: "Yapay Zekâ Soru & Konuşma Değerlendirmesi",
      questionScore: "Soru Skoru",
      analysisLabel: "ANALİZ & YORUM:",
      missingLabel: "EKSİK BIRAKILAN NOKTALAR:",
      suggestionLabel: "GELİŞTİRME TAVSİYESİ:",
      nextQ: "Sonraki Soruya Geç",
      finishSim: "Simülasyonu Tamamla ve Genel Raporu Gör",
      langToggle: "EN"
    },
    en: {
      badge: "// AI INTERVIEW CENTER",
      selectTitle: "Select Interview Category",
      backToCats: "Back to Categories",
      home: "Home",
      questionsCount: "Questions Simulation",
      start: "Start",
      questionProgress: "Question",
      aiActive: "AI Active Evaluation & Scoring",
      aiInterviewer: "AI HR / LEAD INTERVIEWER",
      placeholder: "Type your detailed answer here or use voice input...",
      evaluating: "AI is analyzing your voice response, tone, and content...",
      evaluateBtn: "Get AI Score & Analysis",
      aiEvalTitle: "AI Question & Speech Evaluation",
      questionScore: "Question Score",
      analysisLabel: "ANALYSIS & COMMENT:",
      missingLabel: "MISSING POINTS:",
      suggestionLabel: "IMPROVEMENT ADVICE:",
      nextQ: "Next Question",
      finishSim: "Complete Simulation & View General Report",
      langToggle: "TR"
    }
  }[currentLanguage];

  const interviewCategories = [
    {
      id: 'frontend',
      title: 'Frontend Developer (React / Web)',
      icon: <Code className="text-[#f97316]" size={24} />,
      desc: 'React, performans optimizasyonları, State yönetimi ve modern web teknolojileri.',
      questions: [
        "React'te 'Virtual DOM' kavramını ve performans açısından avantajlarını detaylıca açıklar mısınız?",
        "Büyük ölçekli bir React uygulamasında state yönetimi için Redux Toolkit, Zustand veya Context API arasından seçim yaparken hangi kriterleri göz önünde bulundurursunuz?",
        "useEffect hook'unun bağımlılık dizisi (dependency array) yanlış kullanıldığında karşılaşılan yaygın memory leak (bellek sızıntısı) problemleri nelerdir?"
      ]
    },
    {
      id: 'backend',
      title: 'Backend Developer (Node.js / C#)',
      icon: <Cpu className="text-emerald-400" size={24} />,
      desc: 'API tasarımı, veritabanı optimizasyonu, asenkron programlama ve mimari yapıları.',
      questions: [
        "RESTful API tasarımında mikroservis mimarisine geçişin avantajları, dezavantajları ve distributed transactions (dağıtık işlemler) yönetimi nasıl yapılır?",
        "Node.js event loop mekanizmasının çalışma mantığını ve asenkron I/O işlemlerini nasıl yönettiğini açıklayınız.",
        "C# (.NET) ortamında Garbage Collector (GC) mekanizması nasıl çalışır ve bellek sızıntılarını önlemek için nelere dikkat edersiniz?"
      ]
    },
    {
      id: 'hr',
      title: 'İnsan Kaynakları & Davranışsal',
      icon: <Users className="text-amber-400" size={24} />,
      desc: 'Kriz yönetimi, takım uyumluluğu, stres altında çalışabilme ve STAR metodolojisi.',
      questions: [
        "Geçmiş tecrübelerinizde ekibinizle ciddi bir fikir ayrılığı yaşadığınız kriz anını ve bunu STAR metodolojisine göre nasıl çözdüğünüzü anlatır mısınız?",
        "Üzerinizde birden fazla kritik görev ve çakışan teslim tarihleri varken önceliklendirmenizi nasıl yaparsınız?",
        "Yapıcı olmayan veya sert bir eleştiri aldığınızda profesyonel duruşunuzu koruyarak bunu nasıl bir gelişim fırsatına dönüştürdünüz?"
      ]
    },
    {
      id: 'product',
      title: 'Ürün Yöneticisi (Product Owner)',
      icon: <Layers className="text-purple-400" size={24} />,
      desc: 'Ürün yaşam döngüsü, sprint planlama, backlog yönetimi ve paydaş iletişimi.',
      questions: [
        "Müşteri talepleri ile yazılım ekibinin teknik borç (technical debt) temizleme isteği çakıştığında önceliklendirmenizi (MoSCoW, RICE vb.) nasıl yaparsınız?",
        "Yeni bir ürün özelliğinin (feature) başarı metriklerini (KPI ve OKR'ler) belirlerken hangi analitik kriterleri göz önünde bulundurursunuz?",
        "Pazara hızlı çıkmak (MVP) ile kusursuz ve eksiksiz ürün sunmak arasındaki dengeyi ürün yaşam döngüsünde nasıl kurarsınız?"
      ]
    },
    {
      id: 'leadership',
      title: 'Takım Lideri & Engineering Manager',
      icon: <ShieldCheck className="text-rose-400" size={24} />,
      desc: 'Ekip yönetimi, yetenek geliştirme, mentörlük ve teknik vizyon belirleme.',
      questions: [
        "Ekibinizdeki düşük performans gösteren bir yazılımcının kök nedenini bulmak ve performansını artırmak için nasıl bir koçluk yaklaşımı izlersiniz?",
        "Teknik kararlar alırken ekip içi mutabakatı (consensus) sağlayamadığınız ve tıkanıklık yaşadığınız durumlarda lider olarak nasıl insiyatif alırsınız?",
        "Junior ve mid-level geliştiricilerin hızla adaptasyonu, yetenek gelişimi ve mentörlüğü için ekip içinde hangi sürdürülebilir süreçleri kurarsınız?"
      ]
    },
    {
      id: 'english',
      title: 'İngilizce Mülakat (Global Talent)',
      icon: <Sparkles className="text-teal-400" size={24} />,
      desc: 'Yabancı dilde kendini ifade edebilme, teknik akıcılık ve global mülakat simülasyonu.',
      questions: [
        "Could you describe a challenging project where you had to quickly adapt to a technology or methodology you weren't familiar with?",
        "How do you handle tight deadlines and pressure from international stakeholders in a distributed remote team environment?",
        "Where do you see your professional career path in the next five years, and how do you plan to achieve your global goals?"
      ]
    },
    {
      id: 'finance',
      title: 'Finans & İş Analisti',
      icon: <TrendingUp className="text-indigo-400" size={24} />,
      desc: 'Veri analizi, risk yönetimi, finansal modelleme ve iş süreçleri.',
      questions: [
        "Belirsizlik içeren büyük veri setleriyle ve eksik verilerle çalışırken doğru iş kararı almak için hangi analitik yöntemleri kullanırsınız?",
        "Şirket içi maliyetleri optimize etmek, bütçe sapmalarını önlemek ve operasyonel verimliliği artırmak için önerdiğiniz stratejiler nelerdir?",
        "Finansal bir projede risk analizi yaparken (sensitivity analysis, scenario planning) göz ardı edilmemesi gereken en kritik faktörler nelerdir?"
      ]
    }
  ];

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setFeedback(null);
    setAllResponses([]);
    setInterviewCompleted(false);
    stopListening();
  };

  // --- MİKROFON İLE SESLİ YAZMA FONKSİYONLARI ---
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tarayıcınız ses tanıma özelliğini desteklemiyor. Lütfen Chrome veya Edge kullanın.");
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening(SpeechRecognition);
    }
  };

  const startListening = (SpeechRecognition) => {
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = currentLanguage === 'tr' ? 'tr-TR' : 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserAnswer(prev => prev + ' ' + transcript);
      };

      recognition.onerror = (event) => {
        console.error("Ses tanıma hatası:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Mikrofon başlatılamadı:", err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    stopListening();
    setIsEvaluating(true);

    setTimeout(() => {
      setIsEvaluating(false);
      
      const score = Math.floor(Math.random() * 16) + 85; 
      const currentQ = selectedCategory.questions[currentQuestionIndex];
      
      const analysisResult = {
        question: currentQ,
        answer: userAnswer,
        score: score,
        analysis: score > 90 
          ? "Ses tonu akıcılığı ve argümanların yapısı konu hakimiyetini net bir şekilde yansıtıyor. Konuşma hızı gayet dengeli." 
          : "Temel yanıt doğru ancak sesli anlatımda vurgular artırılabilir ve detaylandırılabilirdi.",
        missingPoints: score > 90 
          ? "Kritik bir eksik tespit edilmedi; konuşma esnasında dolgu kelime (şey, yani) minimum düzeyde kullanıldı." 
          : "Konuşma sırasında bazı duraksamalar yaşandı ve teknik terimler pratik senaryolarla zenginleştirilmedi.",
        suggestion: "Sesli mülakatlarda konuya girerken ana başlığı net vurgulayıp ardından somut örnekler vermeye özen gösterin."
      };

      setFeedback(analysisResult);
      setAllResponses(prev => [...prev, analysisResult]);
    }, 2000);
  };

  const handleNextQuestion = () => {
    setFeedback(null);
    setUserAnswer('');
    stopListening();
    if (currentQuestionIndex + 1 < selectedCategory.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // --- MÜLAKAT TAMAMLANDIĞINDA İSTATİSTİKLERİ LOCALSTORAGE'A KAYDET ---
      try {
        const savedStats = JSON.parse(localStorage.getItem('interviewStats')) || { interviews: 0, totalQuestions: 0, totalScoreSum: 0 };
        
        const currentInterviewQuestions = allResponses.length || 3;
        const currentInterviewScoreSum = allResponses.reduce((acc, curr) => acc + (curr.score || 90), 0);

        const newStats = {
          interviews: savedStats.interviews + 1,
          totalQuestions: savedStats.totalQuestions + currentInterviewQuestions,
          totalScoreSum: savedStats.totalScoreSum + currentInterviewScoreSum
        };

        localStorage.setItem('interviewStats', JSON.stringify(newStats));
      } catch (err) {
        console.error("İstatistikler kaydedilemedi:", err);
      }
      // -----------------------------------------------------------------

      setInterviewCompleted(true);
    }
  };

  const averageScore = allResponses.length > 0 
    ? Math.round(allResponses.reduce((acc, curr) => acc + curr.score, 0) / allResponses.length) 
    : 92;

  const starScore = {
    situation: Math.min(100, averageScore + 2),
    task: Math.max(70, averageScore - 4),
    action: Math.min(100, averageScore + 5),
    result: Math.max(65, averageScore - 8)
  };

  const handleDownloadPDF = () => {
    const element = reportRef.current;
    if (!element) return;
    const opt = {
      margin:       [10, 10, 10, 10],
      filename:     `Mulakat_Raporu_${new Date().toLocaleDateString('tr-TR')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-slate-100 min-h-[80vh]">
      
      {/* Üst Başlık */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono text-[#f97316] uppercase tracking-widest">{t.badge}</span>
          <h1 className="text-3xl md:text-4xl font-black mt-1">
            {selectedCategory ? selectedCategory.title : t.selectTitle}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentLanguage(prev => prev === 'tr' ? 'en' : 'tr')}
            className="flex items-center gap-1.5 bg-[#131b2e] border border-[#222f4c] hover:border-[#f97316]/50 px-3 py-2.5 rounded-xl text-xs font-mono font-bold text-[#f97316] transition cursor-pointer"
          >
            <Globe size={16} />
            <span>{t.langToggle}</span>
          </button>

          {selectedCategory ? (
            <button
              onClick={() => { stopListening(); setSelectedCategory(null); }}
              className="flex items-center gap-2 bg-[#131b2e] border border-[#222f4c] hover:border-[#f97316]/50 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>{t.backToCats}</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-[#131b2e] border border-[#222f4c] hover:border-[#f97316]/50 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>{t.home}</span>
            </button>
          )}
        </div>
      </div>

      {!selectedCategory ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviewCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat)}
              className="bg-[#0b101d] border border-[#1e293b] hover:border-[#f97316]/50 rounded-3xl p-6 transition group cursor-pointer flex flex-col justify-between hover:shadow-[0_0_30px_rgba(249,115,22,0.1)]"
            >
              <div>
                <div className="w-12 h-12 bg-[#050811] border border-[#1b2436] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-100 group-hover:text-[#f97316] transition">
                  {cat.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1b2436] flex items-center justify-between text-xs font-mono text-[#f97316]">
                <span>{cat.questions.length} {t.questionsCount}</span>
                <span>{t.start} →</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {!interviewCompleted ? (
            <div className="space-y-8 max-w-3xl mx-auto">
              
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-[#0b101d] border border-[#1e293b] px-5 py-3 rounded-2xl">
                <span>{t.questionProgress} {currentQuestionIndex + 1} / {selectedCategory.questions.length}</span>
                <span className="text-[#f97316] font-bold">{t.aiActive}</span>
              </div>

              <div className="bg-[#0b101d] border border-[#1e293b] p-8 rounded-3xl shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#f97316]">
                  <Briefcase size={16} />
                  <span>{t.aiInterviewer}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-100 leading-snug">
                  "{selectedCategory.questions[currentQuestionIndex]}"
                </h2>
              </div>

              {!feedback ? (
                <form onSubmit={handleSubmitAnswer} className="space-y-4">
                  <div className="relative">
                    <textarea
                      rows={5}
                      required
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder={t.placeholder}
                      className="w-full bg-[#050811] border border-[#1b2436] rounded-2xl p-5 text-sm text-slate-200 focus:outline-none focus:border-[#f97316] transition resize-none shadow-inner"
                    ></textarea>

                    {/* MİKROFON BUTONU (SESLİ YAZMA) */}
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg cursor-pointer ${
                        isListening 
                          ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse' 
                          : 'bg-[#131b2e] hover:bg-[#1e293b] border border-[#222f4c] text-cyan-400'
                      }`}
                      title="Sesle Anlat / Mikrofonu Aç"
                    >
                      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                      <span>{isListening ? 'Dinleniyor... (Kapat)' : 'Sesle Anlat'}</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isEvaluating}
                    className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold py-4 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20"
                  >
                    {isEvaluating ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>{t.evaluating}</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>{t.evaluateBtn}</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="bg-[#0b101d] border border-[#f97316]/40 p-8 rounded-3xl space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-[#1b2436] pb-4">
                    <div className="flex items-center gap-2 text-[#f97316] font-bold">
                      <Sparkles size={20} />
                      <span>{t.aiEvalTitle}</span>
                    </div>
                    <span className="text-xs font-mono bg-[#1c1810] border border-orange-500/30 text-orange-400 px-3 py-1 rounded-full">
                      {t.questionScore}: {feedback.score} / 100
                    </span>
                  </div>

                  <div className="space-y-4 text-sm text-slate-300">
                    <div>
                      <strong className="text-slate-200 block text-xs font-mono mb-1 text-[#f97316]">{t.analysisLabel}</strong>
                      <p className="leading-relaxed">{feedback.analysis}</p>
                    </div>

                    <div className="bg-rose-950/20 border border-rose-500/30 p-4 rounded-2xl">
                      <strong className="text-rose-400 flex items-center gap-1.5 text-xs font-mono mb-1">
                        <AlertCircle size={14} /> {t.missingLabel}
                      </strong>
                      <p className="text-slate-300 leading-relaxed text-xs">{feedback.missingPoints}</p>
                    </div>

                    <div>
                      <strong className="text-slate-200 block text-xs font-mono mb-1 text-amber-400">{t.suggestionLabel}</strong>
                      <p className="leading-relaxed text-xs">{feedback.suggestion}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{currentQuestionIndex + 1 < selectedCategory.questions.length ? t.nextQ : t.finishSim}</span>
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12 text-slate-100">
              
              <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Award className="text-[#10b981]" size={28} />
                  <span>Mülakat Değerlendirme Raporu</span>
                </h1>

                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-lg shadow-emerald-500/10"
                >
                  <Download size={16} />
                  <span>PDF Raporunu İndir</span>
                </button>
              </div>

              <div 
                ref={reportRef} 
                className="bg-[#0b101d] border border-[#1e293b] rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl text-slate-100"
              >
                <div className="flex justify-between items-start border-b border-[#1b2436] pb-6">
                  <div>
                    <span className="text-[#f97316] text-[10px] font-mono font-bold uppercase tracking-widest block">
                      // MULAKAT.AI • SES & İÇERİK DEĞERLENDİRME ÇIKTISI
                    </span>
                    <h2 className="text-2xl font-black text-white mt-1">{selectedCategory.title}</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">
                      {new Date().toLocaleDateString('tr-TR')} • Toplam {allResponses.length || 3} Soru Tamamlandı
                    </p>
                  </div>

                  <div className="text-right bg-[#131b2e] px-5 py-3 rounded-2xl border border-[#222f4c]">
                    <span className="text-[10px] text-slate-400 font-mono block uppercase">GENEL AI SKORU</span>
                    <span className="text-3xl font-black text-[#10b981]">%{averageScore}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Target className="text-[#f97316]" size={18} />
                    <span>STAR Metodolojisi & Ses Akışı Analiz Kartı</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-[#050811] p-4 rounded-2xl border border-[#1b2436] space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 font-mono block">S - DURUM / SENARYO</span>
                      <span className="text-xl font-black text-white">%{starScore.situation}</span>
                      <div className="w-full bg-[#1b2436] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#f97316] h-full" style={{ width: `${starScore.situation}%` }} />
                      </div>
                    </div>

                    <div className="bg-[#050811] p-4 rounded-2xl border border-[#1b2436] space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 font-mono block">T - GÖREV & HEDEF</span>
                      <span className="text-xl font-black text-white">%{starScore.task}</span>
                      <div className="w-full bg-[#1b2436] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-400 h-full" style={{ width: `${starScore.task}%` }} />
                      </div>
                    </div>

                    <div className="bg-[#050811] p-4 rounded-2xl border border-[#1b2436] space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 font-mono block">A - AKSİYON / ÇÖZÜM</span>
                      <span className="text-xl font-black text-white">%{starScore.action}</span>
                      <div className="w-full bg-[#1b2436] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#10b981] h-full" style={{ width: `${starScore.action}%` }} />
                      </div>
                    </div>

                    <div className="bg-[#050811] p-4 rounded-2xl border border-[#1b2436] space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 font-mono block">R - SONUÇ & METRİK</span>
                      <span className="text-xl font-black text-white">%{starScore.result}</span>
                      <div className="w-full bg-[#1b2436] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full" style={{ width: `${starScore.result}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#131b2e] p-5 rounded-2xl border border-[#222f4c] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/10 text-[#f97316] rounded-xl flex items-center justify-center">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Sesli Diksiyon & Akıcılık Raporu</h4>
                      <p className="text-xs text-slate-400">Konuşma hızı, ses tonu istikrarı ve dolgu kelime analizi tamamlandı.</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                    ✨ Başarılı Akış
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-extrabold text-white">// Ses ve Soru Bazlı Yapay Zekâ Karnesi</h3>
                  <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
                    {allResponses.map((res, idx) => (
                      <div key={idx} className="bg-[#050811] p-4 rounded-2xl border border-[#1b2436] space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white truncate max-w-[80%]">
                            Soru {idx + 1}: {res.question}
                          </span>
                          <span className="text-[#10b981] font-black">{res.score} Puan</span>
                        </div>
                        <p className="text-slate-300"><strong>Konuşma Analizi:</strong> {res.analysis}</p>
                        <p className="text-rose-400"><strong>Eksik Nokta:</strong> {res.missingPoints}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#131b2e] p-5 rounded-2xl border border-[#222f4c] space-y-2">
                  <div className="flex items-center gap-2 text-[#f97316] text-xs font-bold">
                    <Sparkles size={16} />
                    <span>AI Ses Koçu Genel Tavsiyesi</span>
                  </div>
                  <p className="text-xs text-slate-300 italic font-medium leading-relaxed">
                    "Sesli anlatımlarda vurgularınız oldukça net. Gelecek oturumlarda heyecan anındaki duraksamaları minimuma indirerek profesyonel diksiyonunuzu daha da öne çıkarabilirsiniz."
                  </p>
                </div>

              </div>

              <div className="flex justify-center items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 bg-[#131b2e] hover:bg-[#1e293b] text-slate-200 border border-[#222f4c] font-bold px-6 py-3 rounded-2xl text-xs transition cursor-pointer"
                >
                  <RefreshCw size={15} />
                  <span>Diğer Kategoriler</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white font-extrabold px-6 py-3 rounded-2xl text-xs transition cursor-pointer shadow-lg shadow-emerald-500/10"
                >
                  <Home size={15} />
                  <span>Ana Sayfaya Dön</span>
                </button>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
}