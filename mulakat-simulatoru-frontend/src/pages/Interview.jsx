import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ArrowLeft,
  Loader2,
  Code,
  Users,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Layers,
  Award,
  AlertCircle,
  Globe
} from 'lucide-react';

export default function Interview() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  
  // Ana sayfa dil desteği state'i
  const [currentLanguage, setCurrentLanguage] = useState('tr');

  // Tüm yanıtları ve skorları saklamak için state
  const [allResponses, setAllResponses] = useState([]);
  const [interviewCompleted, setInterviewCompleted] = useState(false);

  // Dil çevirileri ve metinleri
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
      placeholder: "Yanıtınızı buraya detaylı bir şekilde yazın...",
      evaluating: "Yapay Zekâ Yanıtınızı Puanlıyor ve Eksikleri İnceliyor...",
      evaluateBtn: "Yanıta Yapay Zekâ Puanı ve Analizi Al",
      aiEvalTitle: "Yapay Zekâ Soru Değerlendirmesi",
      questionScore: "Soru Skoru",
      analysisLabel: "ANALİZ & YORUM:",
      missingLabel: "EKSİK BIRAKILAN NOKTALAR:",
      suggestionLabel: "GELİŞTİRME TAVSİYESİ:",
      nextQ: "Sonraki Soruya Geç",
      finishSim: "Simülasyonu Tamamla ve Genel Raporu Gör",
      completedTitle: "Mülakat Simülasyonu Tamamlandı!",
      completedDesc: "kategorisindeki 10 sorunun tümü yapay zekâ tarafından analiz edildi.",
      overallScore: "GENEL BAŞARI PUANI",
      excellent: "Mükemmel Seviye",
      improvable: "Geliştirilebilir",
      reportTitle: "// Soru Bazlı Yapay Zekâ Karnesi",
      otherCats: "Diğer Kategoriler",
      homeBtn: "Ana Sayfaya Dön",
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
      placeholder: "Type your detailed answer here...",
      evaluating: "AI is Scoring Your Answer & Analyzing Gaps...",
      evaluateBtn: "Get AI Score & Analysis",
      aiEvalTitle: "AI Question Evaluation",
      questionScore: "Question Score",
      analysisLabel: "ANALYSIS & COMMENT:",
      missingLabel: "MISSING POINTS:",
      suggestionLabel: "IMPROVEMENT ADVICE:",
      nextQ: "Next Question",
      finishSim: "Complete Simulation & View General Report",
      completedTitle: "Interview Simulation Completed!",
      completedDesc: "all 10 questions in the category have been analyzed by AI.",
      overallScore: "OVERALL SUCCESS SCORE",
      excellent: "Excellent Level",
      improvable: "Improvable",
      reportTitle: "// Question-Based AI Report Card",
      otherCats: "Other Categories",
      homeBtn: "Back to Home",
      langToggle: "TR"
    }
  }[currentLanguage];

  const interviewCategories = [
    {
      id: 'frontend',
      title: 'Frontend Developer (React / Web)',
      icon: <Code className="text-cyan-400" size={24} />,
      desc: 'React, performans optimizasyonları, State yönetimi ve modern web teknolojileri.',
      questions: [
        "React'te 'Virtual DOM' kavramını ve performans açısından avantajlarını detaylıca açıklar mısınız?",
        "Büyük ölçekli bir React uygulamasında state yönetimi için Redux Toolkit, Zustand veya Context API arasından seçim yaparken hangi kriterleri göz önünde bulundurursunuz?",
        "useEffect hook'unun bağımlılık dizisi (dependency array) yanlış kullanıldığında karşılaşılan yaygın memory leak (bellek sızıntısı) problemleri nelerdir?",
        "React bileşenlerinde performans optimizasyonu için useCallback, useMemo ve React.memo kullanım senaryolarını örneklerle açıklayın.",
        "Server-Side Rendering (SSR) ile Client-Side Rendering (SEO ve yükleme süreleri açısından) arasındaki temel farklar nelerdir?",
        "Web Vitals (LCP, FID, CLS) metrikleri nelerdir ve bir React uygulamasında bu metrikleri iyileştirmek için neler yaparsınız?",
        "Özel hook'lar (Custom Hooks) yazarken dikkat edilmesi gereken kurallar nelerdir? Daha önce yazdığınız karmaşık bir custom hook'u anlatır mısınız?",
        "Modern CSS mimarileri (Tailwind CSS, Styled Components, CSS Modules) arasında büyük projelerde hangisini tercih edersiniz ve neden?",
        "Frontend tarafında hata yönetimi (Error Boundaries ve try-catch yapıları) için nasıl bir strateji izlersiniz?",
        "Tarayıcı önbellekleme (Browser Caching), Service Workers ve PWA teknolojilerinin web performansına katkıları nelerdir?"
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
        "C# (.NET) ortamında Garbage Collector (GC) mekanizması nasıl çalışır ve bellek sızıntılarını önlemek için nelere dikkat edersiniz?",
        "Yüksek trafikli bir backend sisteminde veritabanı performansını artırmak için indexing, partitioning ve caching (Redis vb.) stratejileriniz nelerdır?",
        "JWT (JSON Web Token) tabanlı kimlik doğrulama mekanizmalarında güvenlik açıkları (XSS, CSRF) nasıl önlenir?",
        "SQL ve NoSQL veritabanları arasında seçim yaparken hangi mimari gereksinimleri baz alırsınız?",
        "Message broker sistemleri (RabbitMQ, Kafka vb.) hangi senaryolarda tercih edilir ve event-driven mimarinin avantajları nelerdir?",
        "Backend servislerinde rate limiting, throttling ve API güvenliği için hangi katman korumalarını uygularsınız?",
        "Clean Architecture veya Onion Architecture prensiplerinin projeye sağladığı sürdürülebilirlik avantajları nelerdir?",
        "CI/CD pipeline süreçlerinde otomatik testlerin (Unit, Integration, E2E) backend geliştirme yaşam döngüsüne katkısı nedir?"
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
        "Yapıcı olmayan veya sert bir eleştiri aldığınızda profesyonel duruşunuzu koruyarak bunu nasıl bir gelişim fırsatına dönüştürdünüz?",
        "Takım içerisindeki uyumsuz veya motivasyonu düşük bir çalışma arkadaşınızla iş birliğini artırmak için ne gibi adımlar atarsınız?",
        "Daha önce başarısızlıkla sonuçlanan bir projeniz veya kararınız oldu mu? Buradan çıkardığınız en büyük ders neydi?",
        "Şirket kültürüne ve değerlerine uyum sağlama konusunda kendi güçlü ve gelişime açık yönlerinizi nasıl tanımlarsınız?",
        "Belirsizliğin yüksek olduğu, hızlı değişen bir projede adaptasyon sürecinizi nasıl yönetirsiniz?",
        "Kendi sorumluluk alanınız dışındaki bir görevi üstlenmek zorunda kaldığınız ve inisiyatif aldığınız bir durumu paylaşır mısınız?",
        "Yoğun stres ve baskı altında çalıştığınız anlarda odaklanmanızı ve karar verme yetinizi nasıl korursunuz?",
        "Uzun vadeli kariyer hedefleriniz nelerdir ve bu pozisyon bu hedeflerin neresinde yer alıyor?"
      ]
    },
    {
      id: 'product',
      title: 'Ürün Yöneticisi (Product Owner)',
      icon: <Layers className="text-purple-400" size={24} />,
      desc: 'Ürün yaşam döngüsü, sprint planlama, backlog yönetimi ve paydaş iletişimi.',
      questions: [
        "Müşteri talepleri ile yazılım ekibinin teknik borç (technical debt) temizleme isteği çakıştığında önceliklendirmenizi (MoSCoW, RICE vb.) nasıl yaparsınız?",
        "Yeni bir ürün özelliğinin (feature) başarı métriklerini (KPI ve OKR'ler) belirlerken hangi analitik kriterleri göz önünde bulundurursunuz?",
        "Pazara hızlı çıkmak (MVP) ile kusursuz ve eksiksiz ürün sunmak arasındaki dengeyi ürün yaşam döngüsünde nasıl kurarsınız?",
        "Ürün backlog'unu yönetirken paydaşlardan gelen çelişkili talepleri ve baskıları nasıl yönetirsiniz?",
        "Kullanıcı geri bildirimlerini (user feedback, data analytics, user testing) ürün geliştirme süreçlerine nasıl entegre edersiniz?",
        "Bir özelliğin veya ürünün başarısız olduğunu veri odaklı olarak fark ettiğinizde pivot etme kararını nasıl alırsınız?",
        "Sprint planlama ve refinement süreçlerinde yazılım ekibiyle ortak bir vizyon ve efor kestirimi (estimation) nasıl oluşturursunuz?",
        "Rakip analizi ve pazar araştırması yaparken hangi metotları kullanırsınız, rekabet avantajını nasıl yakalarsınız?",
        "Cross-functional (çapraz fonksiyonele sahip) ekipler arasında iletişimi ve verimliliği artırmak için hangi agile pratikleri uygularsınız?",
        "Ürün vizyonunu üst yönetime ve yatırımcılara sunarken nasıl bir yol haritası ve hikaye anlatımı (storytelling) tercih edersiniz?"
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
        "Junior ve mid-level geliştiricilerin hızla adaptasyonu, yetenek gelişimi ve mentörlüğü için ekip içinde hangi sürdürülebilir süreçleri kurarsınız?",
        "Yazılım ekibinde tükenmişlik sendromunu (burnout) önlemek ve iş-yaşam dengesini korumak için hangi yönetim stratejilerini uygularsınız?",
        "Şirket içi teknoloji yığını (tech stack) değişimine karar verirken ekibin direncini nasıl kırar ve geçiş sürecini yönetirsiniz?",
        "Bütçe kısıtları veya kaynak yetersizliği altında projeyi zamanında teslim etmek için lider olarak nasıl bir strateji belirlersiniz?",
        "Kod inceleme (Code Review) kültürünü bir denetim mekanizmasından çıkarıp bir bilgi paylaşım ve kalite standartları aracına nasıl dönüştürürsünüz?",
        "Kritik bir sistem arızasında veya kriz anında ekibin sakin kalmasını ve etkin kriz yönetimi yapmasını nasıl koordine edersiniz?",
        "Ekip içerisindeki yetenekli ve kıdemli çalışanların şirkette kalıcılığını (retention) artırmak için hangi kariyer gelişim planlarını sunarsınız?",
        "Üst yönetim ile yazılım ekibi arasında teknik detaylar ile iş hedefleri (business goals) arasındaki köprüyü nasıl kurarsınız?"
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
        "Where do you see your professional career path in the next five years, and how do you plan to achieve your global goals?",
        "Can you explain a complex technical concept or architecture decision to a non-technical stakeholder in English clearly?",
        "Tell me about a time when you had a disagreement with a cross-cultural team member and how you resolved it professionally.",
        "What strategies do you use to keep your technical skills updated and stay ahead in the global tech industry?",
        "Describe a situation where a project failed or faced a major roadblock. What was your specific contribution to fixing it?",
        "Why are you interested in working with our global organization, and what unique value do you bring to our team?",
        "How do you prioritize your daily tasks and manage your time effectively when working across different time zones?",
        "Could you share an example of a successful mentorship or teamwork experience where you helped a colleague improve?"
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
        "Finansal bir projede risk analizi yaparken (sensitivity analysis, scenario planning) göz ardı edilmemesi gereken en kritik faktörler nelerdir?",
        "Yatırım geri dönüş süresini (ROI) ve karlılık oranlarını hesaplarken kullandığınız finansal modelleme tekniklerini açıklar mısınız?",
        "İş birimleri (business units) ile finans departmanı arasında köprü kurarak bütçe taleplerini nasıl rasyonelleştirirsiniz?",
        "Nakit akışı (cash flow) yönetimi ve likidite risklerini öngörmede hangi erken uyarı göstergelerini (KPI) takip edersiniz?",
        "Yeni bir pazar analizi veya fizibilite çalışması yaparken pazar büyüklüğü (TAM, SAM, SOM) hesaplamalarını nasıl gerçekleştirirsiniz?",
        "Finansal raporlama süreçlerinde otomasyon ve veri görselleştirme (PowerBI, Tableau vb.) araçlarını nasıl etkin kullanırsınız?",
        "Enflasyonist ortamlarda şirket fiyatlandırma stratejilerini ve maliyet kontrol mekanizmalarını nasıl güncellersiniz?",
        "Şirket birleşme ve satın alma (M&A) süreçlerinde hedef şirketin finansal sağlığını değerlendirirken hangi audit adımlarını izlersiniz?"
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
  };

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

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
          ? "Yanıtınız konu hakimiyetini net bir şekilde yansıtıyor. Argümanlarınız tutarlı ve profesyonel bir dille desteklenmiş." 
          : "Temel yaklaşım doğru ancak konunun derinliğine inmeli ve pratik örneklerle zenginleştirmelisiniz.",
        missingPoints: score > 90 
          ? "Kritik bir eksik tespit edilmedi; ancak rakamsal verilerle desteklenebilirdi." 
          : "Terimlerin pratik hayattaki yansımaları ve olası risk faktörleri eksik bırakılmış.",
        suggestion: "İlerleyen mülakatlarda konuyu somut senaryolarla bağdaştırmaya özen gösterin."
      };

      setFeedback(analysisResult);
      setAllResponses(prev => [...prev, analysisResult]);
    }, 2000);
  };

  const handleNextQuestion = () => {
    setFeedback(null);
    setUserAnswer('');
    if (currentQuestionIndex + 1 < selectedCategory.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setInterviewCompleted(true);
    }
  };

  const averageScore = allResponses.length > 0 
    ? Math.round(allResponses.reduce((acc, curr) => acc + curr.score, 0) / allResponses.length) 
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-slate-100 min-h-[80vh]">
      
      {/* Üst Başlık, Dil Değiştirici & Geri Dönüş */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">{t.badge}</span>
          <h1 className="text-3xl md:text-4xl font-black mt-1">
            {selectedCategory ? selectedCategory.title : t.selectTitle}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Ana Sayfa Dil Değiştirici Butonu */}
          <button
            onClick={() => setCurrentLanguage(prev => prev === 'tr' ? 'en' : 'tr')}
            className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 px-3 py-2.5 rounded-xl text-xs font-mono font-bold text-cyan-400 transition cursor-pointer"
            title="Dil Değiştir / Change Language"
          >
            <Globe size={16} />
            <span>{t.langToggle}</span>
          </button>

          {selectedCategory ? (
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>{t.backToCats}</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>{t.home}</span>
            </button>
          )}
        </div>
      </div>

      {/* KATEGORİ SEÇİM EKRANI */}
      {!selectedCategory ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviewCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat)}
              className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-6 transition group cursor-pointer flex flex-col justify-between hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]"
            >
              <div>
                <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-100 group-hover:text-cyan-400 transition">
                  {cat.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-cyan-400">
                <span>{cat.questions.length} {t.questionsCount}</span>
                <span>{t.start} →</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* MÜLAKAT & YAPAY ZEKA DEĞERLENDİRME AKIŞI */
        <div>
          {!interviewCompleted ? (
            <div className="space-y-8 max-w-3xl mx-auto">
              
              {/* Soru İlerleme Çubuğu */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900/80 border border-slate-800 px-5 py-3 rounded-2xl">
                <span>{t.questionProgress} {currentQuestionIndex + 1} / {selectedCategory.questions.length}</span>
                <span className="text-cyan-400 font-bold">{t.aiActive}</span>
              </div>

              {/* Soru Kartı */}
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <Briefcase size={16} />
                  <span>{t.aiInterviewer}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-100 leading-snug">
                  "{selectedCategory.questions[currentQuestionIndex]}"
                </h2>
              </div>

              {/* Yanıt Formu veya AI Geri Bildirimi */}
              {!feedback ? (
                <form onSubmit={handleSubmitAnswer} className="space-y-4">
                  <div className="relative">
                    <textarea
                      rows={5}
                      required
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder={t.placeholder}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 transition resize-none shadow-inner"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isEvaluating}
                    className="w-full bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-extrabold py-4 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(45,212,191,0.2)]"
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
                /* AI Anlık Yanıt Değerlendirme ve Eksik Analizi */
                <div className="bg-slate-900/90 border border-cyan-500/40 p-8 rounded-3xl space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold">
                      <Sparkles size={20} />
                      <span>{t.aiEvalTitle}</span>
                    </div>
                    <span className="text-xs font-mono bg-cyan-950/80 border border-cyan-800 text-cyan-300 px-3 py-1 rounded-full">
                      {t.questionScore}: {feedback.score} / 100
                    </span>
                  </div>

                  <div className="space-y-4 text-sm text-slate-300">
                    <div>
                      <strong className="text-slate-200 block text-xs font-mono mb-1 text-cyan-400">{t.analysisLabel}</strong>
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
                    className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{currentQuestionIndex + 1 < selectedCategory.questions.length ? t.nextQ : t.finishSim}</span>
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* 10 SORU BİTTİKTEN SONRA GENEL YAPAY ZEKA RAPORU VE PUANLAMA */
            <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-3xl space-y-8 animate-fadeIn">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto">
                  <Award size={36} />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-100">{t.completedTitle}</h2>
                <p className="text-slate-400 text-sm">
                  {selectedCategory.title} {t.completedDesc}
                </p>
              </div>

              {/* Genel Skor Kartı */}
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-slate-400 block mb-1">{t.overallScore}</span>
                  <span className="text-3xl md:text-4xl font-black text-cyan-400">{averageScore} / 100</span>
                </div>
                <span className={`text-xs font-mono px-3 py-1.5 rounded-full border ${
                  averageScore >= 90 ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300' : 'bg-amber-950/50 border-amber-500/40 text-amber-300'
                }`}>
                  {averageScore >= 90 ? t.excellent : t.improvable}
                </span>
              </div>

              {/* Tüm Soruların Özet Analizi ve Eksikler */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider">{t.reportTitle}</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {allResponses.map((res, idx) => (
                    <div key={idx} className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-300 font-semibold">
                        <span>{t.questionProgress} {idx + 1}: {res.question.substring(0, 50)}...</span>
                        <span className="text-cyan-400 font-mono font-bold">{res.score} Puan</span>
                      </div>
                      <p className="text-slate-400"><strong>Analiz:</strong> {res.analysis}</p>
                      <p className="text-rose-400/90"><strong>Eksik:</strong> {res.missingPoints}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-3 rounded-xl text-sm font-semibold transition cursor-pointer"
                >
                  {t.otherCats}
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 px-6 py-3 rounded-xl text-sm font-bold transition cursor-pointer"
                >
                  {t.homeBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}