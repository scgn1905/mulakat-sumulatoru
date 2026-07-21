import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { evaluateAnswerWithAI } from '../services/aiService';

const QUESTION_TIME_LIMIT = 180;

const companyTypes = [
  {
    id: 'startup',
    name: '🚀 Start-up & Hızlı Büyüyen Şirketler',
    desc: 'Çoklu görev, hızlı çözüm üretme ve kısıtlı bütçeyle dev etki yaratma odaklı.'
  },
  {
    id: 'enterprise',
    name: '🏢 Kurumsal & Büyük Ölçekli Şirketler',
    desc: 'Bürokrasi yönetimi, prosedürler arası iletişim ve standartlara uyum odaklı.'
  },
  {
    id: 'global',
    name: '🌍 Global Şirketler (Çok Uluslu)',
    desc: 'Kültürlerarası iletişim, asenkron çalışma ve global vizyon odaklı.'
  }
];

const getRecommendations = (score) => {
  if (score >= 8.5) {
    return [
      { title: '📖 Okuma Önerisi:', desc: '"Crucial Conversations: Tools for Talking When Stakes Are High" - Kerry Patterson' },
      { title: '🎯 İleri Seviye İpucu:', desc: 'Mülakatlarda liderlik vizyonunuzu ve kriz anlarında aldığınız insiyatifi metriklerle desteklemeye devam edin.' }
    ];
  } else if (score >= 6.5) {
    return [
      { title: '📖 Okuma Önerisi:', desc: '"The First 90 Days: Proven Strategies for Getting Up to Speed Faster" - Michael D. Watkins' },
      { title: '💡 Gelişim Alanı:', desc: 'STAR Tekniğini (Situation, Task, Action, Result) yanıtlarınızda daha belirgin kullanarak hikayenizi yapılandırın.' }
    ];
  } else {
    return [
      { title: '📖 Okuma Önerisi:', desc: '"Kazanmak İsterken Yıkılmayın: Stres ve Kriz Yönetimi" - Kurumsal Rehber' },
      { title: '⚠️ Odaklanma Önerisi:', desc: 'Süre baskısı altında sakin kalmak için yanıt öncesinde 10 saniyelik taslak not çıkarın ve temel mesajınızı netleştirin.' }
    ];
  }
};

const questionsByCategory = {
  hr: [
    { id: 1, category: 'İnsan Kaynakları', question: 'Bize kendinizden ve profesyonel kariyer hedeflerinizden bahseder misiniz?', hint: 'Eğitim, tecrübe ve şirketin hedefleriyle uyumunuza odaklanın.' },
    { id: 2, category: 'İnsan Kaynakları', question: 'Bir ekip arkadaşınızla fikir ayrılığına düştüğünüz bir durumu ve nasıl çözdüğünüzü anlatın.', hint: 'STAR tekniğini (Durum, Görev, Eylem, Sonuç) kullanın.' },
    { id: 3, category: 'İnsan Kaynakları', question: 'Zamanın çok kısıtlı olduğu ve işlerin yetişmeyeceği anlaşılan bir kriz anında ne yaparsınız?', hint: 'Önceliklendirme, delegasyon ve şeffaf iletişim.' },
    { id: 4, category: 'İnsan Kaynakları', question: 'Geçmişte yaptığınız büyük bir hatayı ve bu hatadan aldığınız dersi paylaşır mısınız?', hint: 'Sorumluluk almaktan kaçınmadığınızı gösterin.' },
    { id: 5, category: 'İnsan Kaynakları', question: 'Neden bizim şirketimizde ve tam olarak bu departmanda çalışmak istiyorsunuz?', hint: 'Şirketin ürünlerini/vizyonunu araştırdığınızı gösterin.' },
    { id: 6, category: 'İnsan Kaynakları', question: 'Size verilen görev tanımının dışında, angarya olarak görebileceğiniz bir iş istendiğinde tavrınız ne olur?', hint: 'Esneklik ve ekip başarısı için inisiyatif alma kavramlarına değinin.' },
    { id: 7, category: 'İnsan Kaynakları', question: 'Geliştirmeye açık yönleriniz (zayıf yönleriniz) nelerdir ve aşmak için ne yapıyorsunuz?', hint: 'İşin özünü engellemeyen gerçek bir zayıflık ve aldığınız önlem.' }
  ],
  sales: [
    { id: 1, category: 'Satış & Pazarlama', question: 'Bize tamamen yeni ve pazarda bilinmeyen bir ürünü nasıl pazarlayacağınızı anlatın.', hint: 'Hedef kitle analizi, değer teklifi ve kanal stratejisi.' },
    { id: 2, category: 'Satış & Pazarlama', question: 'İkna etmesi çok zor, önyargılı bir müşteriyi nasıl kazandığınızı örnekle anlatır mısınız?', hint: 'Dinleme (Aktif dinleme), itiraz karşılama ve güven inşası.' },
    { id: 3, category: 'Satış & Pazarlama', question: 'Çeyrek hedeflerinizin (kota) gerisinde kaldığınızı fark ettiğinizde nasıl bir acil durum stratejisi izlersiniz?', hint: 'Pipeline analizi, cross-sell/up-sell fırsatları ve aksiyon planı.' },
    { id: 4, category: 'Satış & Pazarlama', question: 'Fiyatınızın rakiplere göre çok yüksek olduğunu söyleyen bir müşteriye nasıl cevap verirsiniz?', hint: 'Fiyattan ziyade "Değer" (ROI, kalite, destek) algısına odaklanın.' },
    { id: 5, category: 'Satış & Pazarlama', question: 'Soğuk arama (Cold Calling) yaparken ilk 30 saniyede karşı tarafın ilgisini nasıl çekersiniz?', hint: 'Doğru kanca (hook), müşterinin acı noktasına dokunma.' },
    { id: 6, category: 'Satış & Pazarlama', question: 'Başarısız olan bir pazarlama veya satış kampanyasından ne tür dersler çıkardınız?', hint: 'Veri analizi, A/B testi eksikliği veya yanlış segmentasyon.' },
    { id: 7, category: 'Satış & Pazarlama', question: 'B2B ve B2C satış stratejileri arasındaki en büyük fark nedir?', hint: 'Karar alma süresi, mantıksal vs duygusal satın alma dürtüleri.' }
  ],
  finance: [
    { id: 1, category: 'Finans & Muhasebe', question: 'Bir şirketin finansal sağlığını değerlendirmek için hangi 3 temel tabloyu incelersiniz ve neden?', hint: 'Bilanço, Gelir Tablosu ve Nakit Akış Tablosu arasındaki ilişki.' },
    { id: 2, category: 'Finans & Muhasebe', question: 'Nakit akışı tablosu (Cash Flow) ile gelir tablosu (P&L) arasındaki temel fark nedir?', hint: 'Tahakkuk esası ile gerçek nakit girişi/çıkışı arasındaki fark.' },
    { id: 3, category: 'Finans & Muhasebe', question: 'Bütçe planlaması yaparken öngörülemeyen makroekonomik krizleri nasıl yönetirsiniz?', hint: 'Senaryo analizi, esnek bütçeleme ve risk karşılıkları ayırma.' },
    { id: 4, category: 'Finans & Muhasebe', question: 'Geçmiş dönem finansal raporlamalarında büyük bir hata fark ettiğinizde izleyeceğiniz adımlar nelerdir?', hint: 'Etik kurallar, yönetime raporlama ve düzeltici beyanname.' },
    { id: 5, category: 'Finans & Muhasebe', question: 'Yeni bir projeye yatırım kararı alınırken ROI ve NPV hesaplamasını nasıl kullanırsınız?', hint: 'Paranın zaman değeri ve alternatif maliyet kavramları.' },
    { id: 6, category: 'Finans & Muhasebe', question: 'Değişen vergi mevzuatlarını şirketin finansal süreçlerine hatasız nasıl entegre edersiniz?', hint: 'Sürekli eğitim, mali müşavirlerle iletişim ve sistem güncellemeleri.' },
    { id: 7, category: 'Finans & Muhasebe', question: 'Yönetim kuruluna karmaşık finansal verileri sunarken nasıl bir dil kullanırsınız?', hint: 'Veri görselleştirme, iş hedefleriyle ilişkilendirme ve jargon azaltma.' }
  ],
  customer: [
    { id: 1, category: 'Müşteri İlişkileri', question: 'Telefonda veya yüz yüze, şirkete karşı çok öfkeli bir müşteriyi nasıl sakinleştirirsiniz?', hint: 'Empati, sessiz kalıp dinleme ve "Haklısınız" diyerek tansiyonu düşürme.' },
    { id: 2, category: 'Müşteri İlişkileri', question: 'Müşterinin talebi şirket politikalarına aykırıysa, "Hayır" demeden durumu nasıl yönetirsiniz?', hint: 'Neden yapılamadığını şeffafça açıklayıp alternatif sunma.' },
    { id: 3, category: 'Müşteri İlişkileri', question: 'Çözümünü bilmediğiniz karmaşık bir soru geldiğinde müşteriye ne cevap verirsiniz?', hint: 'Dürüstlük, araştırma için zaman isteme ve geri dönüş taahhüdü.' },
    { id: 4, category: 'Müşteri İlişkileri', question: 'Müşteri memnuniyetini artırmak için kendi inisiyatifinizle uyguladığınız bir fikri anlatır mısınız?', hint: 'Proaktif destek, kişiselleştirilmiş hizmet veya süreç iyileştirme.' },
    { id: 5, category: 'Müşteri İlişkileri', question: 'Aynı anda birden fazla acil müşteri talebi geldiğinde önceliğe nasıl karar verirsiniz?', hint: 'Etki/Aciliyet matrisi, müşteri segmenti veya problemin büyüklüğü.' },
    { id: 6, category: 'Müşteri İlişkileri', question: 'Kurumsal dili korurken, müşteriye samimi ve robotik olmayan bir yaklaşımı nasıl başarıyorsunuz?', hint: 'Kişiselleştirme, ismini kullanma ve aktif dinleme göstergeleri.' },
    { id: 7, category: 'Müşteri İlişkileri', question: 'Müşteri kaybını (Churn) önlemek adına proaktif olarak ne gibi adımlar atarsınız?', hint: 'Kullanım verilerini izleme, düzenli check-in aramaları ve anketler.' }
  ],
  operations: [
    { id: 1, category: 'Operasyon & Lojistik', question: 'Tedarik zincirinde yaşanan beklenmedik bir kesintiyi nasıl çözersiniz?', hint: 'Alternatif tedarikçi B planı, stok optimizasyonu ve paydaş bilgilendirmesi.' },
    { id: 2, category: 'Operasyon & Lojistik', question: 'Operasyonel bir süreçte darboğaz (bottleneck) tespit edip verimliliği artırdığınız bir örneği anlatın.', hint: 'Süreç analizi (Lean/Six Sigma) ve gereksiz adımların eliminasyonu.' },
    { id: 3, category: 'Operasyon & Lojistik', question: 'Hızın önemli olduğu bir operasyonda kalite standartlarının esnemediğinden nasıl emin olursunuz?', hint: 'Otomasyon araçları, rastgele denetim ve standart operasyon prosedürleri.' },
    { id: 4, category: 'Operasyon & Lojistik', question: 'Stok yönetimi yaparken arz ve talep dengesini kurmak için hangi metrikleri izlersiniz?', hint: 'JIT (Just-in-Time), güvenlik stoğu hesaplama ve FIFO kuralları.' },
    { id: 5, category: 'Operasyon & Lojistik', question: 'Fiziksel bir kriz anında (yangın, su baskını vb.) acil durum eylem planınız nedir?', hint: 'İş sürekliliği planı (BCP), personel güvenliği ve veri yedekleme.' },
    { id: 6, category: 'Operasyon & Lojistik', question: 'Üçüncü parti tedarikçilerle ilişkileri ve SLA performansını nasıl yönetirsiniz?', hint: 'Düzenli KPI toplantıları, ödül/ceza maddeleri ve kazan-kazan felsefesi.' },
    { id: 7, category: 'Operasyon & Lojistik', question: 'Manuel yapılan operasyonel bir iş sürecini nasıl dijitalleştirirsiniz?', hint: 'Süreci haritalama, doğru yazılımı seçme ve ekibi yeni sisteme adapte etme.' }
  ],
  management: [
    { id: 1, category: 'Yönetim & Liderlik', question: 'Ekibinizdeki düşük performans gösteren bir çalışanı nasıl motive eder ve geliştirirsiniz?', hint: 'Birebir görüşmeler, kök neden bulma ve Performans Gelişim Planı.' },
    { id: 2, category: 'Yönetim & Liderlik', question: 'Mikro yönetimden kaçınarak ekibinize nasıl inisiyatif ve sorumluluk verirsiniz?', hint: 'Görev değil, vizyon/hedef devretme ve hata yapma payı bırakma.' },
    { id: 3, category: 'Yönetim & Liderlik', question: 'Karar alırken veriler ile sezgileriniz çeliştiğinde nasıl hareket edersiniz?', hint: 'Veriyi derinleştirme, ekibe danışma ve hesaplanmış risk alma.' },
    { id: 4, category: 'Yönetim & Liderlik', question: 'Şirket içi büyük bir değişimi ekibinize direnç görmeden nasıl kabul ettirirsiniz?', hint: 'Değişimin "Nedenini" açıklama, erken uyum sağlayanları elçi yapma.' },
    { id: 5, category: 'Yönetim & Liderlik', question: 'Yüksek stresli ve kriz dolu bir dönemde ekibin moralini nasıl yüksek tutarsınız?', hint: 'Şeffaflık, küçük başarıları kutlama ve liderin sakin duruşu.' },
    { id: 6, category: 'Yönetim & Liderlik', question: 'Ekibiniz için Performans Değerlendirme toplantılarını nasıl yönetirsiniz?', hint: 'Sandviç metodu (İyi-Gelişmeli-İyi), somut verilere dayanma.' },
    { id: 7, category: 'Yönetim & Liderlik', question: 'Çatışan hedefleri olan iki departman arasındaki köprüyü nasıl kurarsınız?', hint: 'Ortak şirket hedefini hatırlatma, empati toplantıları ve SLA oluşturma.' }
  ],
  project: [
    { id: 1, category: 'Proje Yönetimi', question: 'Bir projenin süreç içinde sürekli yeni taleplerle büyümesini (Scope Creep) nasıl engellersiniz?', hint: 'Net kapsam dokümanı, değişiklik kontrol süreci ve paydaş onayı.' },
    { id: 2, category: 'Proje Yönetimi', question: 'Risk yönetimi planı oluştururken potansiyel riskleri nasıl tespit edersiniz?', hint: 'Risk matrisi (Olasılık x Etki), beyin fırtınası ve B planları.' },
    { id: 3, category: 'Proje Yönetimi', question: 'Kritik yol (Critical Path) analizini kaynak ataması için nasıl kullanıyorsunuz?', hint: 'Gecikmesi tüm projeyi geciktirecek görevleri belirleme.' },
    { id: 4, category: 'Proje Yönetimi', question: 'Matris bir organizasyonda proje ekibini doğrudan yöneticileri olmadan nasıl yönlendirirsiniz?', hint: 'Etkileme (Influence) yeteneği ve net sorumluluk (RACI).' },
    { id: 5, category: 'Proje Yönetimi', question: 'Bütçesi daralan ve zamanı azalan bir projede işleri zamanında nasıl tamamlarsınız?', hint: 'Kapsamı daraltma (MoSCoW), fazla mesai yönetimi veya süreçleri paralel yürütme.' },
    { id: 6, category: 'Proje Yönetimi', question: 'Agile ile Waterfall arasındaki tercihi hangi proje kriterlerine göre yaparsınız?', hint: 'Gereksinimlerin netliği, değişim sıklığı ve ürünün doğası.' },
    { id: 7, category: 'Proje Yönetimi', question: 'Proje kapandığında "Öğrenilen Dersler" toplantısını nasıl yönetirsiniz?', hint: 'Suçlama kültürü olmadan analiz yapma, dokümantasyon ve kurumsal hafıza.' }
  ]
};

export default function Interview() {
  const location = useLocation();
  const categoryId = location.state?.categoryId || 'hr';
  const mockQuestions = questionsByCategory[categoryId] || questionsByCategory.hr;

  const [selectedCompany, setSelectedCompany] = useState('enterprise');
  const [isLobbyAccepted, setIsLobbyAccepted] = useState(false);
  const [isRulesChecked, setIsRulesChecked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [evaluations, setEvaluations] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState(false);
  const recognitionRef = useRef(null);

  const currentQuestion = mockQuestions[currentIndex];
  const currentAnswer = answers[currentQuestion.id] || '';
  const currentEvaluation = evaluations[currentQuestion.id];

  useEffect(() => {
    if (isCompleted) {
      const evaluatedScores = Object.values(evaluations).map((e) => e.score);
      const userAvg = evaluatedScores.length
        ? Number((evaluatedScores.reduce((a, b) => a + b, 0) / evaluatedScores.length).toFixed(1))
        : 0;

      const compObj = companyTypes.find((c) => c.id === selectedCompany);

      const newResult = {
        id: Date.now(),
        category: `${mockQuestions[0]?.category} (${compObj?.name.split(' ')[1] || 'Kurumsal'})`,
        score: userAvg,
        totalQuestions: mockQuestions.length,
        date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
      };

      const existingHistory = JSON.parse(localStorage.getItem('interview_history') || '[]');
      const isAlreadySaved = existingHistory.some((item) => item.id === newResult.id);
      if (!isAlreadySaved) {
        const updatedHistory = [newResult, ...existingHistory];
        localStorage.setItem('interview_history', JSON.stringify(updatedHistory));
      }
    }
  }, [isCompleted, evaluations, mockQuestions, selectedCompany]);

  useEffect(() => {
    if (!isLobbyAccepted || isCompleted || isTimeoutModalOpen) return;
    setTimeLeft(QUESTION_TIME_LIMIT);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeoutModalOpen(true);
          setTimeout(() => {
            setIsTimeoutModalOpen(false);
            handleNext();
          }, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isCompleted, isLobbyAccepted]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'tr-TR';
      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: prev[currentQuestion.id] ? `${prev[currentQuestion.id]} ${transcript}` : transcript
        }));
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [currentQuestion.id]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return alert('Ses tanıma desteklenmiyor. Chrome kullanmanız önerilir.');
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // --- CANLI YAPAY ZEKÂ DEĞERLENDİRME FONKSİYONU ---
  const handleEvaluate = async () => {
    if (!currentAnswer.trim()) return;
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsAnalyzing(true);

    try {
      // Gerçek Yapay Zekâ Servis Çağrısı
      const aiFeedback = await evaluateAnswerWithAI(
        currentQuestion.category,
        currentQuestion.question,
        currentAnswer
      );

      setEvaluations((prev) => ({
        ...prev,
        [currentQuestion.id]: aiFeedback
      }));
    } catch (err) {
      console.error('AI hatası:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNext = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setShowHint(false);
    if (currentIndex < mockQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setShowHint(false);
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  if (!isLobbyAccepted) {
    return (
      <div className="max-w-3xl mx-auto my-8 bg-[#0b101d] p-8 rounded-3xl border border-[#1e293b] shadow-2xl space-y-6 animate-fade-in text-white">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-lg shadow-cyan-500/20">
            🎯
          </div>
          <h2 className="text-2xl font-black text-white">Kurumsal Mülakat Odası</h2>
          <p className="text-xs text-slate-400">
            Seçilen Departman: <strong className="text-cyan-400">{mockQuestions[0]?.category}</strong>
          </p>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-black text-slate-300 uppercase tracking-wider">
            1. Hedef Şirket Kültürünü Seçin:
          </label>
          <div className="grid md:grid-cols-3 gap-3">
            {companyTypes.map((comp) => (
              <div
                key={comp.id}
                onClick={() => setSelectedCompany(comp.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
                  selectedCompany === comp.id
                    ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                    : 'border-[#1e293b] bg-[#050811] hover:border-slate-700'
                }`}
              >
                <h4 className="font-bold text-white text-xs">{comp.name}</h4>
                <p className="text-[10px] text-slate-400 leading-normal">{comp.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 bg-[#050811] rounded-2xl border border-[#1b2436] text-xs space-y-3 leading-relaxed">
          <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
            📋 Mülakat Kuralları:
          </h4>
          <ul className="space-y-2 text-slate-400 list-disc list-inside">
            <li>Bu simülasyonda toplam <strong>7 durumsal soru</strong> yer almaktadır.</li>
            <li>Her soru için verilen maksimum yanıt süresi <strong>3 dakikadır (180 sn)</strong>.</li>
            <li>Süre dolduğunda yanıtınız otomatik kaydedilir ve sistem <strong>sonraki soruya geçer</strong>.</li>
            <li>Yanıtlarınızı klavyeden yazabilir veya 🎤 <strong>Sesle Yanıt Ver</strong> butonunu kullanabilirsiniz.</li>
          </ul>
        </div>

        <div className="flex items-center gap-3 p-4 bg-[#131b2e] border border-[#222f4c] rounded-2xl">
          <input
            type="checkbox"
            id="acceptRules"
            checked={isRulesChecked}
            onChange={(e) => setIsRulesChecked(e.target.checked)}
            className="w-4 h-4 text-cyan-500 bg-[#050811] border-slate-700 rounded focus:ring-cyan-500 cursor-pointer"
          />
          <label htmlFor="acceptRules" className="text-xs font-semibold text-slate-300 cursor-pointer select-none">
            Yönergeleri ve süre kurallarını okudum, kabul ediyorum.
          </label>
        </div>

        <div className="flex justify-between items-center pt-2">
          <Link to="/profile" className="text-xs font-semibold text-slate-500 hover:text-slate-300">
            ← Departmanlara Dön
          </Link>
          <button
            onClick={() => setIsLobbyAccepted(true)}
            disabled={!isRulesChecked}
            className={`px-8 py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${
              isRulesChecked ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer shadow-cyan-500/20' : 'bg-[#182030] text-slate-600 cursor-not-allowed'
            }`}
          >
            Mülakatı Başlat →
          </button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const evaluatedScores = Object.values(evaluations).map((e) => e.score);
    const userAvg = evaluatedScores.length
      ? Number((evaluatedScores.reduce((a, b) => a + b, 0) / evaluatedScores.length).toFixed(1))
      : 0;

    const compName = companyTypes.find((c) => c.id === selectedCompany)?.name;
    const recommendations = getRecommendations(userAvg);

    let badgeConfig = {
      title: '🌟 Altın Mülakat Rozeti',
      desc: 'Tebrikler! Üst düzey yetkinlik gösterdiniz, doğrudan işe alım teklifine hazırsınız.',
      color: 'from-amber-500/20 via-orange-500/10 to-amber-500/20 border-amber-500/50 text-amber-300',
      icon: '🌟'
    };

    if (userAvg < 6.5) {
      badgeConfig = {
        title: '🥉 Bronz Mülakat Rozeti',
        desc: 'Süreç tamamlandı. Yanıtlarınızı yapılandırmak ve pratik yapmak faydalı olacaktır.',
        color: 'from-orange-800/20 via-amber-900/10 to-orange-800/20 border-orange-700/50 text-orange-400',
        icon: '🥉'
      };
    } else if (userAvg < 8.5) {
      badgeConfig = {
        title: '🥈 Gümüş Mülakat Rozeti',
        desc: 'Başarılı bir performans! Küçük noktaları geliştirerek ideal aday olabilirsiniz.',
        color: 'from-slate-400/20 via-slate-600/10 to-slate-400/20 border-slate-400/50 text-slate-200',
        icon: '🥈'
      };
    }

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
        <div className="bg-[#0b101d] p-8 rounded-3xl border border-[#1e293b] shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-lg shadow-cyan-500/20">
            📊
          </div>
          <h2 className="text-3xl font-black text-white">{currentQuestion.category} Performans Karnesi</h2>
          <p className="text-xs text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/30 px-4 py-1.5 rounded-full inline-block">
            Hedef Şirket Kültürü: {compName}
          </p>

          <div className="inline-flex items-center gap-6 bg-[#050811] border border-[#1b2436] px-8 py-4 rounded-2xl">
            <div className="text-left">
              <span className="text-xs font-black text-cyan-400 uppercase block">Genel Puanınız</span>
              <span className="text-3xl font-black text-white">{userAvg} / 10</span>
            </div>
            <div className="h-10 w-px bg-[#1b2436]"></div>
            <div className="text-left text-xs space-y-1">
              <p className="text-slate-400"><strong>Toplam Soru:</strong> 7</p>
              <p className="text-slate-400"><strong>Değerlendirilen:</strong> {evaluatedScores.length}</p>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border bg-gradient-to-r ${badgeConfig.color} max-w-lg mx-auto space-y-2 text-center shadow-lg`}>
            <span className="text-3xl block">{badgeConfig.icon}</span>
            <h3 className="font-black text-base">{badgeConfig.title}</h3>
            <p className="text-xs opacity-90 leading-relaxed font-medium">{badgeConfig.desc}</p>
          </div>
        </div>

        <div className="bg-[#0b101d] p-6 rounded-3xl border border-[#1e293b] shadow-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1b2436] pb-3">
            <span className="text-xl">📚</span>
            <h3 className="font-black text-white text-base">Gelişim Tavsiyeleri & Önerilen Kaynaklar</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="p-4 bg-[#050811] border border-[#1b2436] rounded-2xl space-y-1.5">
                <span className="font-bold text-cyan-400 block">{rec.title}</span>
                <p className="text-slate-300 leading-relaxed">{rec.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-black text-white px-2">Yetkinlik Analizleri</h3>
          {mockQuestions.map((q, idx) => {
            const userAnswer = answers[q.id];
            const evaluation = evaluations[q.id];

            return (
              <div key={q.id} className="bg-[#0b101d] p-6 rounded-2xl border border-[#1e293b] shadow-xl space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-md">
                      Soru {idx + 1} / 7
                    </span>
                    <h4 className="text-base font-bold text-white pt-1">{q.question}</h4>
                  </div>
                  {evaluation ? (
                    <span className="bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-black px-3 py-1.5 rounded-xl whitespace-nowrap">
                      {evaluation.score} / 10
                    </span>
                  ) : (
                    <span className="bg-[#182030] text-slate-500 text-xs font-bold px-3 py-1 rounded-xl whitespace-nowrap">
                      Değerlendirilmedi
                    </span>
                  )}
                </div>

                <div className="p-4 bg-[#050811] rounded-xl border border-[#1b2436] text-xs">
                  <span className="font-bold text-slate-400 block mb-1">Verdiğiniz Yanıt:</span>
                  <p className="text-slate-300 italic">{userAnswer ? `"${userAnswer}"` : 'Yanıt girilmedi.'}</p>
                </div>

                {evaluation && (
                  <div className="grid md:grid-cols-2 gap-4 text-xs pt-1">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                      <span className="font-bold text-emerald-400 block mb-1">👍 Güçlü Yönler</span>
                      <p className="text-emerald-100/70">{evaluation.strengths}</p>
                    </div>
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                      <span className="font-bold text-amber-400 block mb-1">💡 Geliştirilebilir Alanlar</span>
                      <p className="text-amber-100/70">{evaluation.improvements}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center items-center gap-4 pt-4">
          <Link to="/profile" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3 px-8 rounded-xl text-sm shadow-lg shadow-cyan-500/20 transition-all">
            Profilime Dön & İstatistikleri Gör
          </Link>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / mockQuestions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 relative text-white">
      {isTimeoutModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in p-4">
          <div className="bg-[#0b101d] p-8 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl border border-rose-500/30">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 text-3xl font-extrabold rounded-full flex items-center justify-center mx-auto animate-bounce border border-rose-500/30">
              ⏰
            </div>
            <h3 className="text-xl font-black text-white">Süreniz Doldu!</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              3 dakikalık süreniz tamamlandı. Yanıtınız kaydedilip otomatik olarak sonraki soruya yönlendiriliyorsunuz...
            </p>
            <div className="w-full bg-[#1b2436] h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full animate-pulse w-full"></div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#0b101d] p-6 rounded-2xl border border-[#1e293b] shadow-xl space-y-3">
        <div className="flex justify-between items-center text-sm font-bold text-slate-300">
          <span className="bg-[#131b2e] border border-[#222f4c] text-cyan-400 px-3 py-1 rounded-lg">Kategori: {currentQuestion.category}</span>
          <span className={`px-3 py-1 rounded-lg border ${timeLeft <= 30 ? 'bg-rose-500/10 border-rose-500/50 text-rose-400 animate-pulse' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
            ⏱️ {formatTime(timeLeft)}
          </span>
          <span>Soru {currentIndex + 1} / 7</span>
        </div>
        <div className="w-full bg-[#1b2436] h-2.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="bg-[#0b101d] p-8 rounded-2xl border border-[#1e293b] shadow-xl space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white leading-snug">{currentQuestion.question}</h3>
          <button onClick={() => setShowHint(!showHint)} className="mt-3 text-xs font-black text-cyan-400 hover:text-cyan-300 transition-colors">
            {showHint ? 'İpucunu Gizle' : '💡 Stratejik İpucu Göster'}
          </button>
          {showHint && (
            <div className="mt-3 p-4 bg-amber-500/10 border border-amber-500/30 text-amber-200/90 rounded-xl text-xs">
              {currentQuestion.hint}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-black text-slate-300">Yanıtınız</label>
            <button
              type="button"
              onClick={toggleListening}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                isListening ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse' : 'bg-[#131b2e] border-[#222f4c] text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{isListening ? '🎙️' : '🎤'}</span>
              {isListening ? 'Dinleniyor... (Durdur)' : 'Sesle Yanıt Ver'}
            </button>
          </div>

          <textarea
            rows={5}
            value={currentAnswer}
            onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
            placeholder={isListening ? 'Sizi dinliyorum...' : 'Cevabınızı buraya yazın veya sesle söyleyin...'}
            className="w-full p-4 bg-[#050811] border border-[#1b2436] text-slate-100 rounded-xl focus:ring-2 focus:ring-cyan-500/80 outline-none text-sm resize-none"
          />
        </div>

        <button
          onClick={handleEvaluate}
          disabled={!currentAnswer.trim() || isAnalyzing}
          className={`px-5 py-3 rounded-xl font-black text-sm transition-all shadow-lg ${
            !currentAnswer.trim() || isAnalyzing
              ? 'bg-[#182030] text-slate-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/20'
          }`}
        >
          {isAnalyzing ? 'Canlı Yapay Zekâ Analiz Ediyor...' : '⚡ Yanıtı Yapay Zekâ ile Değerlendir'}
        </button>

        {currentEvaluation && (
          <div className="p-5 bg-[#050811] border border-purple-500/30 rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between items-center border-b border-[#1b2436] pb-2">
              <h4 className="font-bold text-white">🎯 Canlı Yapay Zeka Analizi</h4>
              <span className="bg-purple-500/20 text-purple-400 border border-purple-500/40 font-black px-3 py-1 rounded-full">
                Skor: {currentEvaluation.score} / 10
              </span>
            </div>
            <p><strong className="text-emerald-400">👍 Güçlü Yönler: </strong><span className="text-slate-300">{currentEvaluation.strengths}</span></p>
            <p><strong className="text-amber-400">💡 Geliştirilebilir: </strong><span className="text-slate-300">{currentEvaluation.improvements}</span></p>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-[#1b2436]">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm border ${
              currentIndex === 0 ? 'bg-[#050811] border-[#1b2436] text-slate-600 cursor-not-allowed' : 'bg-[#131b2e] border-[#222f4c] text-slate-300 hover:bg-slate-800'
            }`}
          >
            Önceki Soru
          </button>
          <button
            onClick={handleNext}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-sm shadow-lg shadow-cyan-500/20 transition-all"
          >
            {currentIndex === mockQuestions.length - 1 ? 'Mülakatı Bitir ve Raporu Gör' : 'Sonraki Soru →'}
          </button>
        </div>
      </div>
    </div>
  );
}