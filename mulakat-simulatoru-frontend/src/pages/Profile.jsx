import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const mockHistory = [
  { id: 1, date: '18 Temmuz 2026', category: 'İnsan Kaynakları', score: 8.2, totalQuestions: 5 },
  { id: 2, date: '15 Temmuz 2026', category: 'Java & Spring Boot', score: 7.4, totalQuestions: 5 },
  { id: 3, date: '10 Temmuz 2026', category: 'Frontend React', score: 6.8, totalQuestions: 5 },
];

export default function Profile() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('ik');

  const categories = [
    { id: 'ik', title: 'İnsan Kaynakları (İK)', desc: 'Davranışsal ve yetkinlik bazlı mülakat soruları.', icon: '👥' },
    { id: 'java', title: 'Java & Spring Boot', desc: 'OOP, Collection Framework, Spring Annotations, ORM.', icon: '☕' },
    { id: 'react', title: 'Frontend React', desc: 'Hooks, Virtual DOM, State Management, Performance.', icon: '⚛️' },
    { id: 'data', title: 'Data Science & Python', desc: 'Pandas, NumPy, ML algoritmaları ve istatistik.', icon: '📊' },
  ];

  const avgScore = (mockHistory.reduce((a, b) => a + b.score, 0) / mockHistory.length).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profil Üst Bilgi Panel */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">{user?.name || 'Aday Kullanıcı'}</h2>
            <p className="text-xs text-gray-500">{user?.email || 'kullanici@email.com'}</p>
          </div>
        </div>

        <div className="flex gap-4 text-center">
          <div className="bg-blue-50 border border-blue-100 px-5 py-3 rounded-2xl">
            <span className="text-xs font-semibold text-blue-600 block">Tamamlanan</span>
            <span className="text-xl font-black text-gray-900">{mockHistory.length} Mülakat</span>
          </div>
          <div className="bg-purple-50 border border-purple-100 px-5 py-3 rounded-2xl">
            <span className="text-xs font-semibold text-purple-600 block">Ortalama Puan</span>
            <span className="text-xl font-black text-gray-900">{avgScore} / 10</span>
          </div>
        </div>
      </div>

      {/* KATEGORİ SEÇİMİ */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Mülakat Kategorisi Seçin</h3>
          <p className="text-xs text-gray-500">Katılmak istediğiniz teknik veya davranışsal simülasyonu seçin.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-4 ${
                selectedCategory === cat.id
                  ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                  : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}
            >
              <span className="text-3xl">{cat.icon}</span>
              <div className="space-y-1">
                <h4 className="font-bold text-gray-900 text-sm">{cat.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <Link
            to={`/interview?category=${selectedCategory}`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-all text-sm"
          >
            Seçili Mülakatı Başlat →
          </Link>
        </div>
      </div>

      {/* GEÇMİŞ RAPORLAR */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Geçmiş Mülakat Raporları</h3>

        <div className="space-y-3">
          {mockHistory.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center text-xs"
            >
              <div className="space-y-1">
                <span className="font-bold text-gray-900 text-sm block">{item.category}</span>
                <span className="text-gray-400">{item.date} • {item.totalQuestions} Soru</span>
              </div>
              <span className="bg-purple-100 text-purple-800 font-extrabold px-3 py-1.5 rounded-xl">
                {item.score} / 10
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}