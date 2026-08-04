import React, { useEffect, useState } from 'react';
import { Mail, User, Clock, MessageSquare, ShieldCheck, Users, PlusCircle, AlertTriangle, Trash2, BarChart3, Database, Award, Send, RefreshCcw, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'messages', 'users', 'questions', 'results', 'announcement', 'logs'
  const [messages, setMessages] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [questionsList, setQuestionsList] = useState([]);
  const [allResults, setAllResults] = useState([]);
  const [announcementsList, setAnnouncementsList] = useState([]);
  const [errorLogs, setErrorLogs] = useState([]); // <-- Hata logları state'i
  const [activities, setActivities] = useState({ recentResults: [], recentUsers: [], recentMessages: [] }); // <-- Son aktiviteler state'i
  const [logStats, setLogStats] = useState({ todayErrorCount: 0, topErrorRoute: 'Veri Yok' }); // <-- Log istatistikleri state'i
  const [loadingLogs, setLoadingLogs] = useState(false); // <-- Log yüklenme state'i
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(true);

  // Yeni soru form state'i
  const [newQuestion, setNewQuestion] = useState({ category_id: 'frontend', question_text: '' });
  const [selectedCategory, setSelectedCategory] = useState('frontend');

  // Duyuru state'i
  const [announcementText, setAnnouncementText] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // 1. Mesajları çek (Admin yetki kontrolü)
      try {
        const msgRes = await fetch('http://localhost:5000/api/admin/messages', { headers });
        if (msgRes.status === 403 || msgRes.status === 401) {
          setIsAuthorized(false);
          setLoading(false);
          return;
        }
        if (msgRes.ok) {
          const msgData = await msgRes.json();
          setMessages(msgData);
        }
      } catch (e) {
        console.error("Mesajlar alınamadı:", e);
      }

      // 2. Kullanıcıları çek
      try {
        const userRes = await fetch('http://localhost:5000/api/admin/users', { headers });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUsersList(userData);
        }
      } catch (e) {
        console.error("Kullanıcılar alınamadı:", e);
      }

      // 3. Soruları çek
      try {
        const qRes = await fetch(`http://localhost:5000/api/questions/${selectedCategory}`);
        if (qRes.ok) {
          const qData = await qRes.json();
          setQuestionsList(qData);
        }
      } catch (e) {
        console.error("Sorular alınamadı:", e);
      }

      // 4. Skorları çek
      try {
        const lbRes = await fetch('http://localhost:5000/api/leaderboard');
        if (lbRes.ok) {
          const lbData = await lbRes.json();
          setAllResults(lbData);
        }
      } catch (e) {
        console.error("Skorlar alınamadı:", e);
      }

      // 5. Duyuruları çek
      try {
        const annRes = await fetch('http://localhost:5000/api/announcements');
        if (annRes.ok) {
          const annData = await annRes.json();
          setAnnouncementsList(annData);
        }
      } catch (e) {
        console.error("Duyurular alınamadı:", e);
      }

      // 6. Son Aktiviteler ve Log İstatistiklerini Çek
      try {
        const actRes = await fetch('http://localhost:5000/api/admin/activities-and-stats', { headers });
        if (actRes.ok) {
          const actData = await actRes.json();
          setActivities({
            recentResults: actData.recentResults || [],
            recentUsers: actData.recentUsers || [],
            recentMessages: actData.recentMessages || []
          });
          setLogStats(actData.stats || { todayErrorCount: 0, topErrorRoute: 'Veri Yok' });
        }
      } catch (e) {
        console.error("Aktiviteler alınamadı:", e);
      }

    } catch (err) {
      console.error("Genel hata:", err);
      setError("Veriler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Hata loglarını çeken fonksiyon
  const fetchErrorLogs = async () => {
    setLoadingLogs(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/error-logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setErrorLogs(data);
      }
    } catch (err) {
      console.error("Loglar yüklenirken hata:", err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  // Sekme 'logs' olduğunda logları otomatik yükle
  useEffect(() => {
    if (activeTab === 'logs') {
      fetchErrorLogs();
    }
  }, [activeTab]);

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

  // Kullanıcı Silme / Engelleme Fonksiyonu
  const handleDeleteUser = async (userId, userEmail) => {
    if (userEmail === 'secginn@gmail.com') {
      alert("Kendi ana yönetici hesabınızı silemezsiniz!");
      return;
    }
    if (!window.confirm(`Bu kullanıcıyı (${userEmail}) silmek istediğinize emin misiniz?`)) return;
    
    setUsersList(usersList.filter(u => u.id !== userId));
    alert("Kullanıcı başarıyla sistemden kaldırıldı.");
  };

  // Duyuru Gönderme
  const handleSendAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: announcementText })
      });

      if (res.ok) {
        alert("Duyuru başarıyla veritabanına kaydedildi ve yayınlandı!");
        setAnnouncementText('');
        fetchData();
      } else {
        alert("Duyuru yayınlanırken bir hata oluştu.");
      }
    } catch (err) {
      alert("Sunucu bağlantı hatası.");
    }
  };

  // Duyuru Silme Fonksiyonu
  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm("Bu duyuruyu silmek istediğinize emin misiniz?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/announcements/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setAnnouncementsList(announcementsList.filter(a => a.id !== id));
      } else {
        alert("Duyuru silinemedi.");
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
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Başlık Kartı & Sekmeler */}
        <div className="flex flex-col xl:flex-row items-center justify-between bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl gap-4">
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
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'dashboard' ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              İstatistikler
            </button>
            <button 
              onClick={() => setActiveTab('messages')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'messages' ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Mesajlar ({messages.length})
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'users' ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Kullanıcılar ({usersList.length})
            </button>
            <button 
              onClick={() => setActiveTab('questions')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'questions' ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Sorular
            </button>
            <button 
              onClick={() => setActiveTab('results')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'results' ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Skorlar ({allResults.length})
            </button>
            <button 
              onClick={() => setActiveTab('announcement')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'announcement' ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Duyurular
            </button>
            <button 
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'logs' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <AlertTriangle size={14} /> Sistem Hataları
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
            {/* 1. SEKME: İSTATİSTİKLER (DASHBOARD) + SON AKTİVİTELER */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                    <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center">
                      <Award size={28} />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-slate-400">Tamamlanan Mülakat</p>
                      <h3 className="text-3xl font-black text-slate-100">{allResults.length}</h3>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center">
                      <Database size={28} />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-slate-400">Sistem Durumu</p>
                      <h3 className="text-base font-black text-emerald-400 flex items-center gap-2 mt-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span> Aktif & Güvenli
                      </h3>
                    </div>
                  </div>
                </div>

                {/* --- SON AKTİVİTELER / SON KAYITLAR AKIŞI --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Son Mülakatlar */}
                  <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                      <Activity size={16} className="text-cyan-400" /> Son Mülakat Aktiviteleri
                    </h3>
                    <div className="space-y-3">
                      {activities.recentResults.length === 0 ? (
                        <p className="text-xs text-slate-500">Henüz mülakat kaydı yok.</p>
                      ) : (
                        activities.recentResults.map((r, i) => (
                          <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800/60 text-xs space-y-1">
                            <p className="text-slate-300 font-medium truncate"><strong className="text-cyan-400">{r.user_email}</strong> yeni bir mülakat tamamladı.</p>
                            <div className="flex justify-between text-[10px] font-mono text-slate-400">
                              <span>{r.category_title}</span>
                              <span className="text-emerald-400 font-bold">{r.score} Puan</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Son Kayıt Olan Kullanıcılar */}
                  <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                      <Users size={16} className="text-teal-400" /> Son Kayıt Olanlar
                    </h3>
                    <div className="space-y-3">
                      {activities.recentUsers.length === 0 ? (
                        <p className="text-xs text-slate-500">Henüz yeni kullanıcı yok.</p>
                      ) : (
                        activities.recentUsers.map((u, i) => (
                          <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800/60 text-xs space-y-1">
                            <p className="text-slate-200 font-bold">{u.name}</p>
                            <div className="flex justify-between text-[10px] font-mono text-slate-400">
                              <span className="truncate">{u.email}</span>
                              <span>{new Date(u.created_at).toLocaleDateString('tr-TR')}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Son İletişim Mesajları */}
                  <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                      <Mail size={16} className="text-amber-400" /> Son İletişim Mesajları
                    </h3>
                    <div className="space-y-3">
                      {activities.recentMessages.length === 0 ? (
                        <p className="text-xs text-slate-500">Henüz mesaj yok.</p>
                      ) : (
                        activities.recentMessages.map((m, i) => (
                          <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800/60 text-xs space-y-1">
                            <p className="text-slate-200 font-medium"><strong className="text-amber-400">{m.name}</strong> mesaj bıraktı.</p>
                            <div className="flex justify-between text-[10px] font-mono text-slate-400">
                              <span className="truncate">{m.email}</span>
                              <span>{new Date(m.created_at).toLocaleDateString('tr-TR')}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-800/80 p-8 rounded-3xl text-center space-y-3">
                  <BarChart3 className="mx-auto text-cyan-400" size={40} />
                  <h2 className="text-lg font-bold">Yönetim Paneline Hoş Geldin, Seçgin!</h2>
                  <p className="text-sm text-slate-400 max-w-xl mx-auto">Üst sekmeleri kullanarak kullanıcıları yönetebilir, mülakat skorlarını analiz edebilir, soruları düzenleyebilir ve sistem duyuruları yayınlayabilirsin.</p>
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
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden p-6 space-y-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Users className="text-cyan-400" size={20} />
                  Sisteme Kayıtlı Kullanıcılar ve Yönetimi
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
                        <th className="p-4 text-right">İşlem</th>
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
                          <td className="p-4 text-right">
                            {u.email !== 'secginn@gmail.com' && (
                              <button
                                onClick={() => handleDeleteUser(u.id, u.email)}
                                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer inline-flex items-center gap-1.5"
                              >
                                <Trash2 size={14} /> Kaldır
                              </button>
                            )}
                          </td>
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

            {/* 5. SEKME: TÜM MÜLAKAT SONUÇLARI */}
            {activeTab === 'results' && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden p-6 space-y-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Award className="text-cyan-400" size={20} />
                  Kullanıcı Mülakat Sonuçları & Skor Analizi
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-xs font-mono border-b border-slate-800">
                      <tr>
                        <th className="p-4">Aday E-posta</th>
                        <th className="p-4">Kategori / Pozisyon</th>
                        <th className="p-4">Alınan Skor</th>
                        <th className="p-4">Tarih</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {allResults.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="p-6 text-center text-slate-500 text-xs">Henüz tamamlanan bir mülakat kaydı bulunmuyor.</td>
                        </tr>
                      ) : (
                        allResults.map((res, index) => (
                          <tr key={index} className="hover:bg-slate-800/30 transition">
                            <td className="p-4 text-cyan-400 font-mono text-xs">{res.user_email}</td>
                            <td className="p-4 font-bold text-slate-200">{res.category_title}</td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold">
                                {res.score} Puan
                              </span>
                            </td>
                            <td className="p-4 text-slate-500 text-xs font-mono">{new Date(res.created_at).toLocaleString('tr-TR')}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. SEKME: DUYURU YÖNETİMİ & SİLME */}
            {activeTab === 'announcement' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Sol Taraf: Yeni Duyuru Gönderme */}
                <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-2xl flex items-center justify-center">
                      <Send size={24} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Sistem İçi Duyuru Yayınla</h2>
                      <p className="text-xs text-slate-400">24 saat boyunca kullanıcılara gösterilir</p>
                    </div>
                  </div>

                  <form onSubmit={handleSendAnnouncement} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-2">Duyuru İçeriği</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Kullanıcılara iletmek istediğiniz duyuruyu buraya yazın..."
                        value={announcementText}
                        onChange={(e) => setAnnouncementText(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3.5 rounded-xl transition cursor-pointer text-sm flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Send size={16} /> Duyuruyu Gönder
                    </button>
                  </form>
                </div>

                {/* Sağ Taraf: Aktif Duyuruları Listeleme ve Silme */}
                <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <Database className="text-cyan-400" size={20} />
                      Aktif Duyuruları Yönet ve Sil
                    </h2>
                    <span className="text-xs font-mono text-slate-400">({announcementsList.length})</span>
                  </div>

                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {announcementsList.length === 0 ? (
                      <p className="text-center text-xs text-slate-500 py-8">Şu anda aktif (son 24 saat içinde) duyuru bulunmuyor.</p>
                    ) : (
                      announcementsList.map((ann) => (
                        <div key={ann.id} className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60 flex items-center justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-slate-200 font-medium">{ann.message}</p>
                            <span className="text-[10px] font-mono text-slate-500">
                              {new Date(ann.created_at).toLocaleString('tr-TR')}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteAnnouncement(ann.id)}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 p-2.5 rounded-xl transition shrink-0 cursor-pointer"
                            title="Duyuruyu Sil"
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

            {/* 7. SEKME: SİSTEM HATALARI & LOGLAR (+ MİNİ İSTATİSTİKLER) */}
            {activeTab === 'logs' && (
              <div className="space-y-6">
                {/* --- MİNİ LOG İSTATİSTİKLERİ / SAYAÇLAR --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-slate-400">Bugünkü Hata Sayısı</p>
                      <h3 className="text-2xl font-black text-amber-400">{logStats.todayErrorCount} Adet</h3>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center">
                      <Activity size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-slate-400">En Çok Hata Alınan Rota</p>
                      <h3 className="text-base font-black text-rose-300 font-mono mt-1 truncate max-w-[280px]">{logStats.topErrorRoute}</h3>
                    </div>
                  </div>
                </div>

                {/* --- ANA LOG LİSTESİ --- */}
                <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-xl font-black text-white flex items-center gap-2">
                        <AlertTriangle className="text-amber-400" size={20} />
                        <span>Canlı Sistem Hataları</span>
                      </h2>
                      <p className="text-xs text-slate-400">Kullanıcıların karşılaştığı anlık hata raporları ve log kayıtları.</p>
                    </div>
                    <button 
                      onClick={fetchErrorLogs}
                      className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      <RefreshCcw size={14} className={loadingLogs ? 'animate-spin' : ''} />
                      <span>Yenile</span>
                    </button>
                  </div>

                  {loadingLogs ? (
                    <p className="text-xs text-slate-400 text-center py-12">Loglar yükleniyor...</p>
                  ) : errorLogs.length === 0 ? (
                    <div className="text-center py-12 space-y-2">
                      <p className="text-sm text-slate-400">Harika! Şu anda sistemde kayıtlı bir hata bulunmuyor.</p>
                      <p className="text-xs text-emerald-400 font-mono">Sistem sorunsuz çalışıyor.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                      {errorLogs.map((log) => (
                        <div key={log.id} className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded font-mono text-[10px]">
                                {log.route || 'Bilinmeyen Rota'}
                              </span>
                              <span className="text-slate-400 font-mono">Kullanıcı: <strong className="text-slate-200">{log.user_email}</strong></span>
                            </div>
                            <p className="text-slate-200 font-semibold mt-1">{log.error_message}</p>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 shrink-0">
                            {new Date(log.created_at).toLocaleString('tr-TR')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}