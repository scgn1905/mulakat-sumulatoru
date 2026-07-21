import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const QUESTION_TIME_LIMIT = 180;

// Kategorilere Göre Sorular
const questionsByCategory = {
  ik: [
    {
      id: 1,
      category: 'İnsan Kaynakları',
      question: 'Bize kendinizden ve kariyerinizde ulaşmak istediğiniz hedeflerden bahseder misiniz?',
      hint: 'Kısa özgeçmişinizden bahsettikten sonra pozisyonla örtüşen hedeflerinize odaklanın.',
      sampleFeedback: { score: 8, strengths: 'Net hedefler.', improvements: 'Somut örnekler verilebilir.', idealAnswer: 'Hedefim bu pozisyonda değer yaratmak.' }
    },
    {
      id: 2,
      category: 'İnsan Kaynakları',
      question: 'Takım içinde bir ekip arkadaşınızla fikir ayrılığı yaşadığınız anı anlatır mısınız?',
      hint: 'STAR tekniğini kullanın.',
      sampleFeedback: { score: 9, strengths: 'İletişim odaklı yaklaşım.', improvements: 'Çıktı vurgulanabilir.', idealAnswer: 'Veriler üzerinden konuşarak ortak paydada buluşurum.' }
    }
  ],
  java: [
    {
      id: 1,
      category: 'Java & Spring Boot',
      question: 'Java\'da HashMap ve ConcurrentHashMap arasındaki temel farklar nelerdir?',
      hint: 'Thread-safety ve kilit mekanizmalarına (bucket-level locking) odaklanın.',
      sampleFeedback: { score: 8.5, strengths: 'Teknik terimler doğru kullanılmış.', improvements: 'Performance overhead konularına değinilebilir.', idealAnswer: 'ConcurrentHashMap thread-safe yapısıyla segment/bucket kilitler kullanır.' }
    },
    {
      id: 2,
      category: 'Java & Spring Boot',
      question: 'Spring Boot\'ta @Component, @Service ve @Repository anatasyonları arasındaki fark nedir?',
      hint: 'Persistence katmanındaki Exception Translation mekanizmasını hatırlayın.',
      sampleFeedback: { score: 9, strengths: 'Katmanlı mimari hakimiyeti iyi.', improvements: 'Custom stereo-typelara değinebilirsiniz.', idealAnswer: '@Repository ek olarak veritabanı hatalarını DataAccessException türüne çevirir.' }
    }
  ],
  react: [
    {
      id: 1,
      category: 'Frontend React',
      question: 'React Virtual DOM nedir ve Reconciliation (Uzlaştırma) süreci nasıl çalışır?',
      hint: 'Diffing algoritması ve render maliyetlerini düşünün.',
      sampleFeedback: { score: 8, strengths: 'Virtual DOM yapısı iyi açıklanmış.', improvements: 'Fiber mimarisine atıf yapılabilir.', idealAnswer: 'React, yapılan değişiklikleri bellek içi Virtual DOM üzerinde karşılaştırıp sadece değişen kısımları gerçek DOMa yansıtır.' }
    }
  ],
  data: [
    {
      id: 1,
      category: 'Data Science',
      question: 'Overfitting (Aşırı Öğrenme) nedir ve nasıl engellenir?',
      hint: 'Regülasyon teknikleri (L1/L2), Cross-Validation ve Dropout kavramlarını düşünün.',
      sampleFeedback: { score: 8.8, strengths: 'Çözüm yöntemleri eksiksiz ifade edilmiş.', improvements: 'Dataset genişletme teknikleri eklenebilir.', idealAnswer: 'Overfitting modelin ezberlemesidir. Cross-validation ve L1/L2 regülasyonu ile önlenir.' }
    }
  ]
};

export default function Interview() {
  const [searchParams] = useSearchParams();
  const categoryKey = searchParams.get('category') || 'ik';
  const mockQuestions = questionsByCategory[categoryKey] || questionsByCategory.ik;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [evaluations, setEvaluations] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);

  const currentQuestion = mockQuestions[currentIndex];
  const currentAnswer = answers[currentQuestion.id] || '';
  const currentEvaluation = evaluations[currentQuestion.id];

  useEffect(() => {
    if (isCompleted) return;
    setTimeLeft(QUESTION_TIME_LIMIT);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex, isCompleted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

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

  const toggleListening = () => {
    if (!recognitionRef.current) return alert('Ses tanıma desteklenmiyor.');
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleEvaluate = () => {
    if (!currentAnswer.trim()) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      setEvaluations({ ...evaluations, [currentQuestion.id]: currentQuestion.sampleFeedback });
      setIsAnalyzing(false);
    }, 1000);
  };

  const handleNext = () => {
    if (isListening) {
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
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setShowHint(false);
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  if (isCompleted) {
    const evaluatedScores = Object.values(evaluations).map((e) => e.score);
    const userAvg = evaluatedScores.length
      ? Number((evaluatedScores.reduce((a, b) => a + b, 0) / evaluatedScores.length).toFixed(1))
      : 0;

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
            📊
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">{currentQuestion.category} Mülakat Raporu</h2>
          <div className="inline-flex items-center gap-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 px-8 py-4 rounded-2xl">
            <span className="text-3xl font-black text-gray-900">{userAvg} / 10</span>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <Link to="/profile" className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl">
            Profilime Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center text-sm font-semibold">
        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">Kategori: {currentQuestion.category}</span>
        <span className={`px-3 py-1 rounded-lg ${timeLeft <= 30 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-amber-50 text-amber-700'}`}>
          ⏱️ {formatTime(timeLeft)}
        </span>
        <span>Soru {currentIndex + 1} / {mockQuestions.length}</span>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-gray-900">{currentQuestion.question}</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">Yanıtınız</label>
            <button
              onClick={toggleListening}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-700'}`}
            >
              {isListening ? '🎙️ Dinleniyor...' : '🎤 Sesle Yanıt Ver'}
            </button>
          </div>
          <textarea
            rows={5}
            value={currentAnswer}
            onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
            placeholder="Yanıtınızı buraya yazın veya mikrofonla söyleyin..."
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
          />
        </div>

        <button
          onClick={handleEvaluate}
          disabled={!currentAnswer.trim() || isAnalyzing}
          className="bg-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md"
        >
          {isAnalyzing ? 'Değerlendiriliyor...' : '⚡ Cevabımı Değerlendir'}
        </button>

        {currentEvaluation && (
          <div className="p-4 bg-slate-50 border rounded-xl text-xs space-y-2">
            <div><strong className="text-emerald-700">Güçlü Yönler:</strong> {currentEvaluation.strengths}</div>
            <div><strong className="text-amber-700">Geliştirilebilir:</strong> {currentEvaluation.improvements}</div>
          </div>
        )}

        <div className="flex justify-between pt-4 border-t border-gray-100">
          <button onClick={handlePrev} disabled={currentIndex === 0} className="px-5 py-2.5 bg-gray-100 rounded-xl text-sm font-semibold">
            Önceki
          </button>
          <button onClick={handleNext} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md">
            {currentIndex === mockQuestions.length - 1 ? 'Mülakatı Bitir' : 'Sonraki →'}
          </button>
        </div>
      </div>
    </div>
  );
}