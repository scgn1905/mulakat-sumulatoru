import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Mülakat Kategorileri
const categories = [
  {
    id: 'hr',
    title: 'İnsan Kaynakları & Davranışsal',
    description: 'Kariyer hedefleri, takım çalışması, kriz ve stres yönetimi odaklı sorular.',
    icon: '👥',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    badge: 'Genel'
  },
  {
    id: 'backend',
    title: 'Java & Backend Mimari',
    description: 'Nesne yönelimli programlama, Spring Boot, ORM, REST API ve mikroservisler.',
    icon: '☕',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    badge: 'Popüler'
  },
  {
    id: 'frontend',
    title: 'Frontend & React Development',
    description: 'JavaScript ES6+, React Hooks, State Management, DOM optimizasyonu ve CSS.',
    icon: '⚛️',
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    badge: 'Teknik'
  },
  {
    id: 'data',
    title: 'Veri Bilimi & Python / R',
    description: 'Veri işleme, istatistiksel analizler, Makine Öğrenmesi (ML) ve Pandas/NumPy.',
    icon: '📊',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badge: 'Analitik'
  },
  {
    id: 'devops',
    title: 'DevOps & Bulut Mimarisi',
    description: 'Docker, Kubernetes, CI/CD süreçleri, Linux yönetimi ve AWS/Azure temel ilkeleri.',
    icon: '☁️',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    badge: 'İleri Seviye'
  },
  {
    id: 'cyber',
    title: 'Siber Güvenlik & Ağ Yönetimi',
    description: 'Web zafiyetleri (OWASP Top 10), ağ protokolleri, sızma testleri ve şifreleme.',
    icon: '🛡️',
    color: 'bg-red-50 text-red-700 border-red-200',
    badge: 'Güvenlik'
  },
  {
    id: 'product',
    title: 'Ürün Yönetimi (Product / Agile)',
    description: 'Scrum/Kanban metodolojileri, ürün yaşam döngüsü, kullanıcı hikayeleri ve KPI’lar.',
    icon: '🎯',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badge: 'Yönetim'
  }
];

// Isı Haritası / Konu Başarı Analizi Örnek Verileri
const topicAnalytics = [
  { topic: 'Java Collection Framework & Data Structures', score: 45, status: 'weak' },
  { topic: 'Spring Boot & Dependency Injection', score: 85, status: 'strong' },
  { topic: 'REST API & HTTP Status Codes', score: 90, status: 'strong' },
  { topic: 'React Virtual DOM & Reconciliation', score: 60, status: 'medium' },
  { topic: 'Veritabanı ACID Prensipleri & SQL', score: 75, status: 'medium' },
  { topic: 'STAR Tekniği ile Davranışsal Yanıtlar', score: 88, status: 'strong' }
];

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('hr');

  const handleStartInterview = (categoryId) => {
    navigate('/interview', { state: { categoryId } });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Kullanıcı Profil Bilgisi Kartı */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 text-white font-extrabold text-xl rounded-2xl flex items-center justify-center shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name || 'Kullanıcı'}</h2>
            <p className="text-xs text-gray-500">{user?.email || 'E-posta tanımlanmadı'}</p>
          </div>
        </div>
        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full">
          ● Aktif Oturum
        </span>
      </div>

      {/* --- ZAYIF NOKTA ISI HARİTASI & İSTATİSTİKİ ANALİZ PANENLİ --- */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">Konu Bazlı Başarı & Isı Haritası</h3>
            <p className="text-xs text-gray-500">Geçmiş mülakat yanıtlarınızın yapay zeka analizlerine dayalı başarı oranları.</p>
          </div>
          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-xl">
            📊 Canlı İstatistikler
          </span>
        </div>

        {/* En Çok Zorlanılan Alan Vurgu Kutusu */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <span className="font-bold text-amber-900 block">En Çok Zorlandığınız Alan:</span>
              <p className="text-amber-800 font-semibold">Java Collection Framework — Başarı Oranı: %45</p>
            </div>
          </div>
          <span className="bg-amber-200 text-amber-900 font-bold px-3 py-1 rounded-lg text-[11px]">
            Geliştirilmeli
          </span>
        </div>

        {/* Konu Başarı Çubukları (Isı Haritası Görünümü) */}
        <div className="grid md:grid-cols-2 gap-4 pt-2">
          {topicAnalytics.map((item, idx) => {
            const isWeak = item.score < 50;
            const isMedium = item.score >= 50 && item.score < 80;

            const barColor = isWeak ? 'bg-red-500' : isMedium ? 'bg-amber-500' : 'bg-emerald-500';
            const badgeBg = isWeak ? 'bg-red-50 text-red-700' : isMedium ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700';

            return (
              <div key={idx} className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-gray-800 text-[11px] truncate max-w-[220px]">{item.topic}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] ${badgeBg}`}>
                    %{item.score}
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mülakat Kategorileri Seçimi */}
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-extrabold text-gray-900">Mülakat Kategorisi Seçin</h3>
          <p className="text-sm text-gray-500">
            Pratik yapmak istediğiniz uzmanlık alanını seçip lobi alanına geçebilirsiniz.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                selectedCategory === cat.id
                  ? 'border-blue-600 bg-white shadow-md scale-[1.01]'
                  : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-3xl">{cat.icon}</span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border ${cat.color}`}>
                    {cat.badge}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 text-base leading-snug">{cat.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{cat.description}</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartInterview(cat.id);
                }}
                className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selectedCategory === cat.id ? 'Lobiye Geç & Başla →' : 'Kategoriyi Seç'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}