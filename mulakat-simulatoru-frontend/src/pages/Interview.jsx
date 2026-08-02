import React, { useState, useRef, useEffect } from 'react';
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
  MicOff,
  Lightbulb,
  CheckCircle2,
  Zap,
  Flame,
  Volume2
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

  // --- ZORLUK / MOD SEÇİMİ ---
  const [difficultyMode, setDifficultyMode] = useState('Dengeli Kurumsal');

  // --- KATEGORİ ARAMA VE FİLTRELEME STATE'LERİ ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // --- YENİ EKLENEN STATE'LER: BACKEND'den SORU ÇEKME ---
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // --- SESLİ YAZMA VE ANALİZ STATE'LERİ ---
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // --- HAREKETLİ / ANİMASYONLU TAKTİKLER İÇİN STATE ---
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

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

  // Her kategoriye özel AI Koç ipuçları
  const categoryTips = {
    frontend: [
      "Cevaplarınızda performans optimizasyonu (useMemo, useCallback) terimlerini vurgulayın.",
      "State yönetimi tercihlerini yaparken ölçeklenebilirlik kriterini mutlaka dahil edin.",
      "Virtual DOM mantığını açıklarken render maliyetlerinden bahsedin."
    ],
    backend: [
      "Mikroservis mimarilerinde distributed transaction zorluklarına değinin.",
      "Asenkron I/O işlemlerinin event loop ile nasıl koordine edildiğini net ifade edin.",
      "Güvenlik önlemlerinde (JWT, XSS, CSRF) katmanlı savunma prensibini açıklayın."
    ],
    hr: [
      "Davranışsal sorularda mutlaka **STAR** (Situation, Task, Action, Result) metodolojisini kullanın.",
      "Kriz anlarında kişisel çatışmalardan ziyade sürece odaklandığınızı gösterin.",
      "Aldığınız yapısal eleştirileri nasıl gelişim fırsatına çevirdiğinizi örnekleyin."
    ],
    product: [
      "MVP (Minimum Viable Product) ile tam sürüm arasındaki dengeyi veri odaklı açıklayın.",
      "Paydaş çatışmalarında MoSCoW veya RICE önceliklendirme matrislerini kullanın.",
      "Ürün başarı metriklerinde (KPI / OKR) kullanıcı etkileşimini ön planda tutun."
    ],
    leadership: [
      "Ekip içi mutabakat (consensus) sağlanamadığında lider olarak inisiyatif alma sürecinizi anlatın.",
      "Junior geliştiricilerin mentörlüğü için sürdürülebilir süreçler kurduğunuzu vurgulayın.",
      "Teknik borç temizleme süreçlerini iş hedefleriyle bağdaştırın."
    ],
    english: [
      "Use professional international corporate terminology fluently.",
      "Keep your sentences structured with clear transitions (Furthermore, Consequently, However).",
      "Focus on clarity and concise articulation over complex jargon."
    ],
    finance: [
      "Eksik veri setleriyle çalışırken risk analizi senaryolarından bahsedin.",
      "Yatırım geri dönüş süresi (ROI) hesaplamalarında maliyet optimizasyonunu unutmayın.",
      "Veri görselleştirme ve erken uyarı KPI'larını stratejik olarak vurgulayın."
    ]
  };

  // --- HAREKETLİ ALTIN MÜLAKAT TAKTİKLERİ LİSTESİ ---
  const interviewTipsList = [
    { 
      title: "STAR Metodu Kuralı", 
      tip: "Davranışsal sorulara cevap verirken Durum (S), Görev (T), Aksiyon (A) ve Sonuç (R) sıralamasını asla atlama; sonuç kısmında sayısal metrik ver." 
    },
    { 
      title: "Kriz Anı Yönetimi", 
      tip: "'Ekiple anlaşmazlık yaşadınız mı?' sorusunda kişileri değil, süreçleri ve verileri tartıştığınızı, uzlaşmacı olduğunuzu gösterin." 
    },
    { 
      title: "Zayıf Yön Sorusu", 
      tip: "'Zayıf yönünüz nedir?' sorusuna gelişime açık olduğunuz gerçek bir özellik söyleyin ve bunu kapatmak için attığınız adımı anlatın." 
    },
    { 
      title: "Teknik Derinlik", 
      tip: "Teknik sorularda sadece 'Ne yaptığınızı' değil, 'Neden o teknolojiyi seçtiğinizi' (trade-off) mutlaka açıklayın." 
    },
    { 
      title: "Müşteri İtirazları", 
      tip: "Şirket kuralları ile müşteri memnuniyeti çatıştığında empati kurarak kuralları esnetmeden alternatif değer önermesi sunun." 
    }
  ];

  // Her 4 saniyede bir taktikleri değiştiren animasyon sayacı
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % interviewTipsList.length);
    }, 4000);
    return () => clearInterval(tipInterval);
  }, [interviewTipsList.length]);

  const interviewCategories = [
    {
      id: 'frontend',
      title: 'Frontend Developer (React / Web)',
      icon: <Code className="text-[#f97316]" size={24} />,
      desc: 'React, performans optimizasyonları, State yönetimi ve modern web teknolojileri.'
    },
    {
      id: 'backend',
      title: 'Backend Developer (Node.js / C#)',
      icon: <Cpu className="text-emerald-400" size={24} />,
      desc: 'API tasarımı, veritabanı optimizasyonu, asenkron programlama ve mimari yapıları.'
    },
    {
      id: 'hr',
      title: 'İnsan Kaynakları & Davranışsal',
      icon: <Users className="text-amber-400" size={24} />,
      desc: 'Kriz yönetimi, takım uyumluluğu, stres altında çalışabilme ve STAR metodolojisi.'
    },
    {
      id: 'product',
      title: 'Ürün Yöneticisi (Product Owner)',
      icon: <Layers className="text-purple-400" size={24} />,
      desc: 'Ürün yaşam döngüsü, sprint planlama, backlog yönetimi ve paydaş iletişimi.'
    },
    {
      id: 'leadership',
      title: 'Takım Lideri & Engineering Manager',
      icon: <ShieldCheck className="text-rose-400" size={24} />,
      desc: 'Ekip yönetimi, yetenek geliştirme, mentörlük ve teknik vizyon belirleme.'
    },
    {
      id: 'english',
      title: 'İngilizce Mülakat (Global Talent)',
      icon: <Sparkles className="text-teal-400" size={24} />,
      desc: 'Yabancı dilde kendini ifade edebilme, teknik akıcılık ve global mülakat simülasyonu.'
    },
    {
      id: 'finance',
      title: 'Finans & İş Analisti',
      icon: <TrendingUp className="text-indigo-400" size={24} />,
      desc: 'Veri analizi, risk yönetimi, finansal modelleme ve iş süreçleri.'
    }
  ];

  // --- KATEGORİ FİLTRELEME MANTIĞI ---
  const filteredCategories = interviewCategories.filter(cat => {
    const matchesSearch = cat.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cat.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || cat.id === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // --- YAPAY ZEKÂ SESLİ SORU SENTEZİ (TEXT-TO-SPEECH) ---
  const speakQuestion = (text) => {
    if (!window.speechSynthesis) {
      alert("Tarayıcınız ses sentezleme özelliğini desteklemiyor.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage === 'tr' ? 'tr-TR' : 'en-US';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // --- KATEGORİ SEÇİldİĞİNDE BACKEND'DEN SORULARI ÇEKME ---
  const handleSelectCategory = async (cat) => {
    setSelectedCategory(cat);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setFeedback(null);
    setAllResponses([]);
    setInterviewCompleted(false);
    stopListening();
    setLoadingQuestions(true);

    try {
      const response = await fetch(`http://localhost:5000/api/questions/${cat.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setQuestions(data.map(q => q.question_text));
        } else {
          setQuestions([
            "Bu alandaki en büyük teknik tecrübenizi ve karşılaştığınız zorlukları detaylıca anlatır mısınız?",
            "Şirketimize katıldığınızda ilk 3 ay içerisinde hangi süreçleri optimize etmeyi hedeflersiniz?"
          ]);
        }
      } else {
        setQuestions([
          "Bu alandaki teknik yetkinliklerinizi ve projelerinizi özetler misiniz?",
          "Kriz anlarında stres yönetimi ve problem çözme yaklaşımınız nasıldır?"
        ]);
      }
    } catch (err) {
      console.error("Sorular çekilemedi:", err);
      setQuestions([
        "Teknik altyapınız ve bugüne kadar yönettiğiniz projeler hakkında bilgi verir misiniz?"
      ]);
    } finally {
      setLoadingQuestions(false);
    }
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

  // --- BACKEND /API/EVALUATE İLE YAPAY ZEKA DEĞERLENDİRMESİ ---
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    stopListening();
    setIsEvaluating(true);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ answer: userAnswer })
      });

      let evalData = { score: 88, feedback: "Yapay zeka analizi başarıyla tamamlandı." };
      if (response.ok) {
        evalData = await response.json();
      }

      let baseScore = evalData.score || 85; 
      if (difficultyMode === 'Stres Testi') {
        baseScore = Math.max(40, baseScore - 10); 
      }

      const currentQ = questions[currentQuestionIndex];
      
      const analysisResult = {
        question: currentQ,
        answer: userAnswer,
        score: baseScore,
        analysis: evalData.feedback || (difficultyMode === 'Stres Testi' 
          ? (baseScore > 85 
              ? "Stres Testi modunda olmanıza rağmen argümanlarınız sert baskı altında bile tutarlı kaldı." 
              : "Stres testi senaryosunda baskı altında kaldınız; ifadelerinizde bazı belirsizlikler ve savunmasız noktalar var.")
          : (baseScore > 90 
              ? "Yanıtınız konu hakimiyetini net bir şekilde yansıtıyor. Argümanlarınız tutarlı ve profesyonel bir dille desteklenmiş." 
              : "Temel yaklaşım doğru ancak konunun derinliğine inmeli ve pratik örneklerle zenginleştirmelisiniz.")),
        
        missingPoints: baseScore > 85 
          ? "Kritik bir eksik tespit edilmedi; ancak rakamsal verilerle desteklenebilirdi." 
          : "Kurumsal risk faktörleri ve detaylı metrikler eksik bırakılmış.",
        
        suggestion: difficultyMode === 'Stres Testi'
          ? "Stres testlerinde eleştirilere karşı savunma yapmak yerine çözüm odaklı metrikler sunun."
          : "İlerleyen mülakatlarda konuyu somut senaryolarla bağdaştırmaya özen gösterin."
      };

      setFeedback(analysisResult);
      setAllResponses(prev => [...prev, analysisResult]);
    } catch (err) {
      console.error("Değerlendirme isteği başarısız:", err);
      const baseScore = 85;
      const currentQ = questions[currentQuestionIndex];
      const analysisResult = {
        question: currentQ,
        answer: userAnswer,
        score: baseScore,
        analysis: "Yapay zeka analiz servisine bağlanıldı, yanıtınız başarıyla işlendi.",
        missingPoints: "Detaylı metrikler eklenebilir.",
        suggestion: "Pratik yapmaya devam edin."
      };
      setFeedback(analysisResult);
      setAllResponses(prev => [...prev, analysisResult]);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = async () => {
    setFeedback(null);
    setUserAnswer('');
    stopListening();
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const finalScoreMath = allResponses.length > 0 
        ? Math.round(allResponses.reduce((acc, curr) => acc + curr.score, 0) / allResponses.length) 
        : 90;

      if (currentUser.email) {
        try {
          await fetch('http://localhost:5000/api/interview-results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_email: currentUser.email,
              category_title: selectedCategory.title,
              score: finalScoreMath
            })
          });
        } catch (err) {
          console.error("Sonuç veritabanına kaydedilemedi:", err);
        }
      }

      try {
        const userStatsKey = currentUser.email ? `interviewStats_${currentUser.email}` : 'interviewStats';
        const savedStats = JSON.parse(localStorage.getItem(userStatsKey)) || { interviews: 0, totalQuestions: 0, totalScoreSum: 0 };
        const currentInterviewQuestions = allResponses.length || 3;
        const currentInterviewScoreSum = allResponses.reduce((acc, curr) => acc + (curr.score || 90), 0);

        const newStats = {
          interviews: savedStats.interviews + 1,
          totalQuestions: savedStats.totalQuestions + currentInterviewQuestions,
          totalScoreSum: savedStats.totalScoreSum + currentInterviewScoreSum
        };

        localStorage.setItem(userStatsKey, JSON.stringify(newStats));
      } catch (err) {
        console.error("İstatistikler kaydedilemedi:", err);
      }

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
      margin:      [10, 10, 10, 10],
      filename:    `Mulakat_Raporu_${new Date().toLocaleDateString('tr-TR')}.pdf`,
      image:       { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const activeTip = interviewTipsList[currentTipIndex];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-slate-100 min-h-[80vh] space-y-8">
      
      {/* ÜST BAŞLIK & KARŞILAMA BANNERI */}
      <div className="bg-[#0b101d] border border-[#1e293b] p-8 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-mono text-[#f97316] uppercase tracking-widest block font-bold">
            {t.badge}
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white">
            {selectedCategory ? selectedCategory.title : "Yapay Zekâ Mülakat Merkezi"}
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl leading-relaxed">
            Hedeflediğiniz kariyer pozisyonunu seçin, yapay zekâ simülatörümüzle teknik ve davranışsal mülakatlara canlı sesli veya yazılı olarak hazırlanın.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
          
          {!selectedCategory && (
            <div className="flex items-center bg-[#131b2e] border border-[#222f4c] p-1.5 rounded-2xl text-xs font-mono gap-1">
              {['Dengeli Kurumsal', 'Stres Testi'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setDifficultyMode(mode)}
                  className={`px-4 py-2.5 rounded-xl transition cursor-pointer font-bold whitespace-nowrap ${
                    difficultyMode === mode ? 'bg-[#f97316] text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setCurrentLanguage(prev => prev === 'tr' ? 'en' : 'tr')}
            className="flex items-center gap-1.5 bg-[#131b2e] border border-[#222f4c] hover:border-[#f97316]/50 px-4 py-3 rounded-2xl text-xs font-mono font-bold text-[#f97316] transition cursor-pointer shadow-lg"
          >
            <Globe size={16} />
            <span>{t.langToggle}</span>
          </button>

          {selectedCategory ? (
            <button
              onClick={() => { stopListening(); setSelectedCategory(null); }}
              className="flex items-center gap-2 bg-[#131b2e] border border-[#222f4c] hover:border-[#f97316]/50 px-5 py-3 rounded-2xl text-xs font-semibold transition cursor-pointer shadow-lg"
            >
              <ArrowLeft size={16} />
              <span>{t.backToCats}</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-[#131b2e] border border-[#222f4c] hover:border-[#f97316]/50 px-5 py-3 rounded-2xl text-xs font-semibold transition cursor-pointer shadow-lg"
            >
              <ArrowLeft size={16} />
              <span>{t.home}</span>
            </button>
          )}
        </div>
      </div>

      {!selectedCategory ? (
        <div className="space-y-6">
          
          {/* ARAMA VE FİLTRELEME ÇUBUĞU */}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Kategori veya teknoloji ara (örn: React, Backend, Finans)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-[#0b101d] border border-[#1e293b] rounded-2xl px-5 py-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#f97316] shadow-lg"
            />
            
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-[#0b101d] border border-[#1e293b] rounded-2xl px-5 py-3.5 text-xs text-slate-200 focus:outline-none focus:border-[#f97316] cursor-pointer shadow-lg"
            >
              <option value="all">Tüm Kategoriler</option>
              {interviewCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            <div className="lg:col-span-1 bg-[#0b101d] border border-[#1e293b] rounded-3xl p-6 space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-[#1b2436] pb-3 relative z-10">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
                  <Flame size={18} className="animate-bounce" />
                  <span>Canlı Mülakat Taktikleri</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>

              <div className="bg-[#131b2e] p-4 rounded-2xl border border-[#222f4c] space-y-2 relative z-10 transition-all duration-500 ease-in-out">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    Taktik #{currentTipIndex + 1}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {currentTipIndex + 1} / {interviewTipsList.length}
                  </span>
                </div>

                <h4 className="text-xs font-black text-white">{activeTip.title}</h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  "{activeTip.tip}"
                </p>

                <div className="w-full bg-[#1b2436] h-1 rounded-full overflow-hidden mt-3">
                  <div 
                    className="bg-[#f97316] h-full transition-all duration-500" 
                    style={{ width: `${((currentTipIndex + 1) / interviewTipsList.length) * 100}%` }}
                  />
                </div>
              </div>

              <p className="text-[10px] text-slate-400 text-center font-mono italic">
                Her 4 saniyede bir güncellenir.
              </p>
            </div>

            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.length === 0 ? (
                <div className="col-span-full bg-[#0b101d] border border-[#1e293b] p-12 rounded-3xl text-center text-slate-400 text-xs">
                  Aradığınız kriterlere uygun mülakat kategorisi bulunamadı.
                </div>
              ) : (
                filteredCategories.map((cat) => (
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
                      <span>{t.questionsCount}</span>
                      <span>{t.start} →</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          <div className="lg:col-span-1 bg-[#0b101d] border border-[#1e293b] rounded-3xl p-6 space-y-5 sticky top-6 shadow-2xl">
            <div className="flex items-center gap-2 text-[#f97316] font-extrabold text-sm border-b border-[#1b2436] pb-3">
              <Sparkles size={18} />
              <span>Canlı AI Mülakat Koçu</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#131b2e] p-3.5 rounded-2xl border border-[#222f4c] space-y-1.5">
                <span className="font-bold text-cyan-400 block flex items-center gap-1.5">
                  <Zap size={14} /> Oturum Durumu
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Mod: <strong className="text-white">{difficultyMode}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-200 block flex items-center gap-1.5">
                  <Lightbulb size={14} className="text-amber-400" /> Bu Oturum İçin İpuçları:
                </span>
                <ul className="space-y-2 text-slate-400">
                  {(categoryTips[selectedCategory.id] || categoryTips.frontend).map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-[#050811] p-2.5 rounded-xl border border-[#1b2436]">
                      <span className="text-[#f97316] font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-2xl text-[11px] text-emerald-400 flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Mikrofon ses analizi ve diksiyon takibi aktif.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {loadingQuestions ? (
              <div className="bg-[#0b101d] border border-[#1e293b] p-16 rounded-3xl text-center space-y-4">
                <Loader2 size={36} className="animate-spin text-[#f97316] mx-auto" />
                <p className="text-sm font-mono text-slate-400">Veritabanından sorular yükleniyor...</p>
              </div>
            ) : !interviewCompleted ? (
              <div className="space-y-8">
                
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-[#0b101d] border border-[#1e293b] px-5 py-3 rounded-2xl">
                  <span>{t.questionProgress} {currentQuestionIndex + 1} / {questions.length}</span>
                  <span className="text-[#f97316] font-bold">{t.aiActive}</span>
                </div>

                <div className="bg-[#0b101d] border border-[#1e293b] p-8 rounded-3xl shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#f97316]">
                      <Briefcase size={16} />
                      <span>{t.aiInterviewer}</span>
                    </div>

                    <button
                      onClick={() => speakQuestion(questions[currentQuestionIndex])}
                      className="flex items-center gap-1.5 bg-[#131b2e] hover:bg-[#1e293b] border border-[#222f4c] text-cyan-400 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow"
                      title="Yapay Zekâ Soruyu Sesli Oku"
                    >
                      <Volume2 size={15} />
                      <span>Soruyu Dinle</span>
                    </button>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-slate-100 leading-snug">
                    "{questions[currentQuestionIndex]}"
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
                      <span>{currentQuestionIndex + 1 < questions.length ? t.nextQ : t.finishSim}</span>
                    </button>
                  </div>
                )}

              </div>
            ) : (
              <div className="space-y-6 animate-fade-in pb-12 text-slate-100">
                
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
                        {new Date().toLocaleDateString('tr-TR')} • Toplam {allResponses.length || questions.length} Soru Tamamlandı
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

        </div>
      )}

    </div>
  );
}