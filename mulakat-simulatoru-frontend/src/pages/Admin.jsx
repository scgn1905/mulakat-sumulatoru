import React, { useEffect, useState } from 'react';
import { Mail, User, Clock, MessageSquare, ShieldCheck, Users, PlusCircle, AlertTriangle, Trash2, BarChart3, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [messages, setMessages] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [questionsList, setQuestionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(true);

  // Yeni soru form state'i
  const [newQuestion, setNewQuestion] = useState({ category_id: 'frontend', question_text: '' });
  const [selectedCategory, setSelectedCategory] = useState('frontend');

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Mesajları çek
      const msgRes = await fetch('http://localhost:5000/api/admin/messages', { headers });
      if (msgRes.status === 403 || msgRes.status === 401) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }
      const msgData = await msgRes.json();
      setMessages(msgData);

      // Kullanıcıları çek
      const userRes = await fetch('http://localhost:5000/api/admin/users', { headers });
      if (userRes.ok) {
        const userData = await userRes.json();
        setUsersList(userData);
      }

      // Soruları çek
      const qRes = await fetch(`http://localhost:5000/api/questions/${selectedCategory}`);
      if (qRes.ok) {
        const qData = await qRes.json();
        setQuestionsList(qData);
      }

    } catch (err) {
      setError("Veriler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  // Soru Ekleme
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newQuestion)
      });
      if (res.ok) {
        alert("Soru başarıyla eklendi!");
        setNewQuestion({ category_id: 'frontend', question_text: '' });
        fetchData();
      } else {
        alert("Soru eklenirken hata oluştu.");
      }
    } catch (err) {
      alert("Sunucu bağlantı hatası.");
    }
  };

  // Soru Silme
  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/questions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setQuestionsList(questionsList.filter(q => q.id !== id));
      } else {
        alert("Soru silinemedi.");
      }
    } catch (err) {
      alert("Bağlantı hatası.");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-rose-500/30 p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle size={32} />
          </div>
          <h1 className="text-xl font-black text-slate-100">Erişim Reddedildi</h1>
          <p className="text-sm text-slate-400">Bu sayfayı görüntüleme yetkiniz yalnızca süper yöneticiye aittir.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl transition cursor-pointer text-sm"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Başlık Kartı & Sekmeler */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black">Süper Admin Paneli</h1>
              <p className="text-xs text-slate-400">Tüm sistemi ve verileri buradan yönetin</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 flex-wrap justify-center">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'dashboard' ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              İstatistikler
            </button>
            <button 
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'messages' ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Mesajlar ({messages.length})
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'users' ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Kullanıcılar ({usersList.length})
            </button>
            <button 
              onClick={() => setActiveTab('questions')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'questions' ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Soru Yönetimi
            </button>
          </div>
        </div>

        {/* İçerik Alanı */}
        {loading ? (
          <div className="text-center py-12 text-slate-400">Yükleniyor...</div>
        ) : error ? (
          <div className="text-center py-12 text-rose-400 font-medium">{error}</div>
        ) : (
          <>
            {/* 1. SEKME: İSTATİSTİKLER (DASHBOARD) */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-14 h-14 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center">
                      <Users size={28} />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-slate-400">Toplam Kullanıcı</p>
                      <h3 className="text-3xl font-black text-slate-100">{usersList.length}</h3>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-14 h-14 bg-teal-500/10 text-teal-400 rounded-2xl flex items-center justify-center">
                      <Mail size={28} />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-slate-400">Gelen Mesajlar</p>
                      <h3 className="text-3xl font-black text-slate-100">{messages.length}</h3>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center">
                      <Database size={28} />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-slate-400">Sistem Durumu</p>
                      <h3 className="text-lg font-black text-emerald-400 flex items-center gap-2 mt-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span> Aktif & Güvenli
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-800/80 p-8 rounded-3xl text-center space-y-3">
                  <BarChart3 className="mx-auto text-cyan-400" size={40} />
                  <h2 className="text-lg font-bold">Yönetim Paneline Hoş Geldin, Seçgin!</h2>
                  <p className="text-sm text-slate-400 max-w-xl mx-auto">Üst kısımdaki sekmeleri kullanarak kullanıcı aktivitelerini inceleyebilir, gelen destek mesajlarını okuyabilir ve mülakat simülatörüne yeni sorular ekleyip silebilirsin.</p>
                </div>
              </div>
            )}

            {/* 2. SEKME: İLETİŞİM MESAJLARI */}
            {activeTab === 'messages' && (
              <div className="grid grid-cols-1 gap-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 bg-slate-900/40 rounded-3xl border border-slate-800">
                    Henüz gelen bir iletişim mesajı yok.
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/60 pb-3">
                        <div className="flex items-center gap-3">
                          <User className="text-cyan-400" size={18} />
                          <span className="font-bold text-slate-200">{msg.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                          <Mail size={14} className="text-teal-400" />
                          <span>{msg.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-mono ml-auto">
                          <Clock size={14} />
                          <span>{new Date(msg.created_at).toLocaleString('tr-TR')}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/40">
                        <MessageSquare size={18} className="text-slate-400 mt-0.5 shrink-0" />
                        <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 3. SEKME: KULLANICI LİSTESİ */}
            {activeTab === 'users' && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden p-6">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                  <Users className="text-cyan-400" size={20} />
                  Sisteme Kayıtlı Kullanıcılar
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-xs font-mono border-b border-slate-800">
                      <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">Ad Soyad</th>
                        <th className="p-4">E-posta</th>
                        <th className="p-4">Rol</th>
                        <th className="p-4">Kayıt Tarihi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {usersList.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-800/30 transition">
                          <td className="p-4 font-mono text-xs">{u.id}</td>
                          <td className="p-4 font-bold text-slate-200">{u.name}</td>
                          <td className="p-4 text-cyan-400 font-mono text-xs">{u.email}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-mono ${u.role === 'admin' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-400'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500 text-xs font-mono">{new Date(u.created_at).toLocaleString('tr-TR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. SEKME: SORU YÖNETİMİ */}
            {activeTab === 'questions' && (
              <div className="space-y-8">
                <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-6">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <PlusCircle className="text-cyan-400" size={20} />
                    Sisteme Yeni Mülakat Sorusu Ekle
                  </h2>
                  <form onSubmit={handleAddQuestion} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-2">Kategori Seçin</label>
                      <select
                        value={newQuestion.category_id}
                        onChange={(e) => setNewQuestion({ ...newQuestion, category_id: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
                      >
                        <option value="frontend">Frontend Developer</option>
                        <option value="backend">Backend Developer</option>
                        <option value="hr">İK & Davranışsal</option>
                        <option value="product">Ürün Yönetimi (Product)</option>
                        <option value="leadership">Takım Lideri (Leadership)</option>
                        <option value="english">İngilizce Mülakat</option>
                        <option value="finance">Finans & Analiz</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-2">Soru Metni</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Mülakat sorusunu buraya yazın..."
                        value={newQuestion.question_text}
                        onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold px-6 py-3 rounded-xl transition cursor-pointer text-sm"
                    >
                      Soruyu Kaydet
                    </button>
                  </form>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <Database className="text-cyan-400" size={20} />
                      Mevcut Soruları Yönet ve Sil
                    </h2>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="hr">İK & Davranışsal</option>
                      <option value="product">Ürün Yönetimi</option>
                      <option value="leadership">Takım Lideri</option>
                      <option value="english">İngilizce</option>
                      <option value="finance">Finans</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    {questionsList.length === 0 ? (
                      <p className="text-center text-xs text-slate-500 py-6">Bu kategoride kayıtlı soru bulunamadı.</p>
                    ) : (
                      questionsList.map((q, idx) => (
                        <div key={q.id} className="flex items-center justify-between gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60">
                          <div className="flex items-start gap-3">
                            <span className="text-xs font-mono text-cyan-400 mt-0.5">#{idx + 1}</span>
                            <p className="text-sm text-slate-300">{q.question_text}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 p-2.5 rounded-xl transition shrink-0 cursor-pointer"
                            title="Soruyu Sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}