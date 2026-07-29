import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Code, 
  Briefcase, 
  Users, 
  TrendingUp, 
  Globe, 
  ShieldCheck, 
  ArrowRight,
  Bot,
  User,
  Send,
  ArrowLeft
} from 'lucide-react';

export default function Interview() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  // KESİN GİRİŞ KONTROLÜ: Gerçek bir oturum verisi yoksa asla içeri alma
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('token');

    // Eğer oturum bayrağı true değilse VEYA geçerli bir token/user yoksa direkt login'e fırlat
    if (isLoggedIn !== 'true' || !token || token === 'null' || token === 'undefined' || token.trim() === '') {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Render öncesi güvenlik kontrolü
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const token = localStorage.getItem('token');

  if (isLoggedIn !== 'true' || !token || token === 'null' || token === 'undefined' || token.trim() === '') {
    return null; // Oturum yoksa ekranda hiçbir şey gösterilmez
  }

  // Mülakat Kategorileri (6-7 Adet Mülakat Yeri)
  const categories = [
    {
      id: 'frontend',
      title: 'Frontend Developer',
      icon: <Code className="text-cyan-400" size={24} />,
      desc: 'React, Vue, JavaScript, CSS ve modern web teknolojileri üzerine mülakat pratiği.',
      tag: 'Teknik'
    },
    {
      id: 'backend',
      title: 'Backend Developer',
      icon: <Code className="text-indigo-400" size={24} />,
      desc: 'Node.js, C#, Mikroservisler, Veritabanı mimarileri ve API tasarımı.',
      tag: 'Teknik'
    },
    {
      id: 'hr',
      title: 'İnsan Kaynakları & Davranışsal',
      icon: <Users className="text-emerald-400" size={24} />,
      desc: 'STAR metodu ile kriz yönetimi, takım çalışması ve liderlik soruları.',
      tag: 'Davranışsal'
    },
    {
      id: 'product',
      title: 'Product Owner / PM',
      icon: <Briefcase className="text-amber-400" size={24} />,
      desc: 'Ürün yol haritası, önceliklendirme, backlog yönetimi ve Agile/Scrum.',
      tag: 'Yönetim'
    },
    {
      id: 'english',
      title: 'English Business Interview',
      icon: <Globe className="text-rose-400" size={24} />,
      desc: 'Practice fluency, professional vocabulary, and global interview standards.',
      tag: 'Dil & Global'
    },
    {
      id: 'devops',
      title: 'DevOps & System Architecture',
      icon: <ShieldCheck className="text-teal-400" size={24} />,
      desc: 'CI/CD süreçleri, Docker, Kubernetes, Cloud (AWS/Azure) ve güvenlik.',
      tag: 'Teknik'
    },
    {
      id: 'data',
      title: 'Data & Analytics',
      icon: <TrendingUp className="text-purple-400" size={24} />,
      desc: 'SQL, veri analizi, makine öğrenmesi temel kavramları ve vaka analizleri.',
      tag: 'Analitik'
    }
  ];

  const handleSelectCategory = (cat) => {
    const currentLogin = localStorage.getItem('isLoggedIn');
    const currentToken = localStorage.getItem('token');

    if (currentLogin !== 'true' || !currentToken) {
      navigate('/login', { replace: true });
      return;
    }

    setSelectedCategory(cat);
    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: `Hoş geldiniz! ${cat.title} pozisyonu için mülakat simülasyonumuz başladı. Hazırsanız ilk sorunuz: Kendinizden ve bu alandaki son tecrübelerinizden bahseder misiniz?`
      }
    ]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMessages = [
      ...messages,
      { id: Date.now(), sender: 'user', text: userInput }
    ];
    setMessages(newMessages);
    setUserInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: 'Harika bir yanıt! Peki bu rolünüzde karşılaştığınız en büyük teknik veya operasyonel zorluk neydi ve bunu nasıl çözdünüz?'
        }
      ]);
    }, 1200);
  };

  // EKRAN 1: MÜLAKAT KATEGORİLERİ (6-7 SEÇENEK)
  if (!selectedCategory) {
    return (
      <div className="max-w-6xl mx-auto py-6 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-100">Mülakat Kategorisi Seçin</h1>
          <p className="text-slate-400 text-sm mt-1">
            Pratik yapmak istediğiniz alanı seçerek yapay zekâ simülasyonunu başlatın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat)}
              className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-6 flex flex-col justify-between transition cursor-pointer group hover:-translate-y-1 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 group-hover:scale-110 transition">
                    {cat.icon}
                  </div>
                  <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-2.5 py-1 rounded-full">
                    {cat.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition">
                  {cat.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed mt-2">
                  {cat.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-cyan-400">
                <span>Mülakata Başla</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // EKRAN 2: SOHBET EKRANI
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Kategorilere Dön</span>
        </button>

        <span className="text-xs bg-cyan-950 text-cyan-400 border border-cyan-800 px-3 py-1 rounded-full font-mono">
          {selectedCategory.title}
        </span>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 min-h-[480px] flex flex-col justify-between space-y-4">
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'ai'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                }`}
              >
                {msg.sender === 'ai' ? <Bot size={20} /> : <User size={20} />}
              </div>

              <div
                className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                  msg.sender === 'ai'
                    ? 'bg-slate-900 border border-slate-800 text-slate-200'
                    : 'bg-cyan-400 text-slate-950 font-medium'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t border-slate-800">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Yanıtınızı buraya yazın..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400 text-slate-100 transition"
          />
          <button
            type="submit"
            className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-5 py-3 rounded-xl flex items-center gap-2 transition cursor-pointer"
          >
            <Send size={16} />
            <span>Gönder</span>
          </button>
        </form>
      </div>
    </div>
  );
}