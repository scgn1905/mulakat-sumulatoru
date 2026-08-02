import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { 
  User, 
  Briefcase, 
  Sliders, 
  Bell, 
  Save, 
  CheckCircle2, 
  Sparkles,
  Volume2,
  Palette,
  Check
} from 'lucide-react';

export default function Settings() {
  const { t } = useTranslation();
  const { colorTheme, setColorTheme } = useTheme();
  
  const [settingsData, setSettingsData] = useState({
    fullName: '',
    email: '',
    defaultRole: 'software_engineer',
    experienceLevel: 'mid',
    aiInterviewerTone: 'professional',
    feedbackDetail: 'detailed',
    weeklyGoal: '3',
    emailNotifications: true,
    soundEffects: true
  });

  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const colorOptions = [
    { id: 'orange', name: 'Ateş Turuncusu', hex: '#f97316' },
    { id: 'blue', name: 'Safir Mavi', hex: '#2563eb' },
    { id: 'emerald', name: 'Zümrüt Yeşil', hex: '#10b981' }
  ];

  useEffect(() => {
    const fetchSettingsAndProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const profileRes = await fetch('http://localhost:5000/api/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setSettingsData(prev => ({
            ...prev,
            fullName: profileData.name || prev.fullName,
            email: profileData.email || prev.email
          }));
        }

        const settingsRes = await fetch('http://localhost:5000/api/settings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          setSettingsData(prev => ({
            ...prev,
            aiInterviewerTone: data.ai_tone || prev.aiInterviewerTone,
            feedbackDetail: data.report_detail || prev.feedbackDetail,
            weeklyGoal: String(data.weekly_goal || prev.weeklyGoal),
            defaultRole: data.target_position || prev.defaultRole,
            experienceLevel: data.experience_level || prev.experienceLevel,
            emailNotifications: data.email_notifications ?? prev.emailNotifications,
            soundEffects: data.sound_effects ?? prev.soundEffects
          }));
        }
      } catch (error) {
        console.error("Ayarlar yüklenirken sunucu hatası:", error);
      }
    };

    fetchSettingsAndProfile();
  }, []);

  const handleChange = (field, value) => {
    setSettingsData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const token = localStorage.getItem('token');

    try {
      if (token) {
        const response = await fetch('http://localhost:5000/api/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ai_tone: settingsData.aiInterviewerTone,
            report_detail: settingsData.feedbackDetail,
            weekly_goal: parseInt(settingsData.weeklyGoal),
            target_position: settingsData.defaultRole,
            experience_level: settingsData.experienceLevel,
            theme_color: colorTheme,
            email_notifications: settingsData.emailNotifications,
            sound_effects: settingsData.soundEffects
          })
        });

        if (!response.ok) {
          throw new Error("Ayarlar sunucuya kaydedilemedi.");
        }
      }

      localStorage.setItem('userPreferences', JSON.stringify(settingsData));
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      currentUser.name = settingsData.fullName;
      currentUser.email = settingsData.email;
      localStorage.setItem('user', JSON.stringify(currentUser));

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Kayıt hatası:", error);
      setErrorMsg("Ayarlar kaydedilirken bir hata oluştu.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-slate-100 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <span className="text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase">
            {t('settingsTag', '// KULLANICI TERCİHLERİ')}
          </span>
          <h1 className="text-3xl font-black mt-1">{t('settingsTitle', 'Hesap ve Mülakat Ayarları')}</h1>
        </div>

        {saved && (
          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 px-4 py-2 rounded-xl text-sm animate-pulse">
            <CheckCircle2 size={16} />
            <span>{t('settingsSaved', 'Ayarlar başarıyla kaydedildi!')}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-red-950/60 border border-red-500/40 text-red-300 px-4 py-2 rounded-xl text-sm">
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
            <div className="w-10 h-10 bg-slate-800 text-cyan-400 rounded-xl flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">{t('profileSection', 'Kişisel Bilgiler')}</h2>
              <p className="text-xs text-slate-400">{t('profileSectionDesc', 'Temel hesap bilgilerini güncelleyin.')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">{t('fullNameLabel', 'Ad Soyad')}</label>
              <input 
                type="text" 
                value={settingsData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">{t('emailLabel', 'E-posta Adresi')}</label>
              <input 
                type="email" 
                value={settingsData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
            <div className="w-10 h-10 bg-slate-800 text-cyan-400 rounded-xl flex items-center justify-center">
              <Briefcase size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">{t('interviewPrefsSection', 'Varsayılan Mülakat Senaryoları')}</h2>
              <p className="text-xs text-slate-400">{t('interviewPrefsDesc', 'Simülasyon başlatırken hızlı geçiş için hedef rolünüzü belirleyin.')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">{t('targetRoleLabel', 'Hedef Pozisyon / Departman')}</label>
              <select 
                value={settingsData.defaultRole}
                onChange={(e) => handleChange('defaultRole', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 transition cursor-pointer"
              >
                <option value="software_engineer">Yazılım Mühendisliği / Developer</option>
                <option value="product_manager">Ürün Yönetimi (Product Owner / PM)</option>
                <option value="hr_management">İnsan Kaynakları & İK Yöneticiliği</option>
                <option value="marketing">Pazarlama & Büyüme (Growth)</option>
                <option value="finance">Finans & Muhasebe</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">{t('experienceLevelLabel', 'Kıdem Seviyesi')}</label>
              <select 
                value={settingsData.experienceLevel}
                onChange={(e) => handleChange('experienceLevel', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 transition cursor-pointer"
              >
                <option value="junior">Junior (Yeni Başlayan / 0-2 Yıl)</option>
                <option value="mid">Mid-Level (Uzman / 2-5 Yıl)</option>
                <option value="senior">Senior (Kıdemli / 5+ Yıl)</option>
                <option value="lead">Lead / C-Level (Yönetici)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
            <div className="w-10 h-10 bg-slate-800 text-cyan-400 rounded-xl flex items-center justify-center">
              <Sliders size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">{t('aiPersonaSection', 'Yapay Zekâ Mülakatör Karakteri')}</h2>
              <p className="text-xs text-slate-400">{t('aiPersonaDesc', 'Simülasyon içerisindeki AI yöneticisinin tavrını ve raporlama detayını özelleştirin.')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">{t('aiToneLabel', 'Mülakatör Tonu & Sertliği')}</label>
              <select 
                value={settingsData.aiInterviewerTone}
                onChange={(e) => handleChange('aiInterviewerTone', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 transition cursor-pointer"
              >
                <option value="professional">Standart Profesyonel & Dengeli</option>
                <option value="strict">Sert & Disiplinli Kurumsal (Stres Testi)</option>
                <option value="supportive">Yapıcı & Rehber Odaklı (Destekçi)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">{t('feedbackDetailLabel', 'Rapor & Geri Bildirim Detayı')}</label>
              <select 
                value={settingsData.feedbackDetail}
                onChange={(e) => handleChange('feedbackDetail', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 transition cursor-pointer"
              >
                <option value="detailed">Kapsamlı STAR Analizi & Kelime Tavsiyeleri</option>
                <option value="summary">Özet Puan Kartı & Temel Gelişim Alanları</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-mono text-slate-400 mb-2">{t('weeklyGoalLabel', 'Haftalık Pratik Hedefi (Simülasyon)')}</label>
            <div className="flex items-center gap-4">
              {['1', '3', '5', '7'].map((goal) => (
                <button
                  type="button"
                  key={goal}
                  onClick={() => handleChange('weeklyGoal', goal)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    settingsData.weeklyGoal === goal 
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)]' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {goal} Mülakat / Hafta
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
            <div className="w-10 h-10 bg-slate-800 text-cyan-400 rounded-xl flex items-center justify-center">
              <Palette size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Görünüm ve Tema Tercihleri</h2>
              <p className="text-xs text-slate-400">Arayüz renk paletini kişiselleştirin.</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-mono text-slate-400">Vurgu Rengi Paleti</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {colorOptions.map((color) => {
                const isSelected = colorTheme === color.id || (color.id === 'orange' && colorTheme === 'cyan');
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setColorTheme(color.id)}
                    style={{
                      borderColor: isSelected ? color.hex : undefined,
                      backgroundColor: isSelected ? `${color.hex}20` : undefined
                    }}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition cursor-pointer bg-slate-950 ${
                      isSelected ? 'border-2 font-bold' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-5 h-5 rounded-full shadow-md shrink-0" 
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-xs font-semibold text-slate-200">{color.name}</span>
                    </div>
                    {isSelected && <Check size={16} style={{ color: color.hex }} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
            <div className="w-10 h-10 bg-slate-800 text-cyan-400 rounded-xl flex items-center justify-center">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">{t('notifSection', 'Bildirimler & Ses Efektleri')}</h2>
              <p className="text-xs text-slate-400">{t('notifSectionDesc', 'Hatırlatıcılar ve uygulama içi ses tercihleri.')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition">
              <div className="flex items-center gap-3">
                <Sparkles size={18} className="text-cyan-400" />
                <div>
                  <span className="text-sm font-semibold block text-slate-200">E-posta Hatırlatıcıları</span>
                  <span className="text-xs text-slate-400">Haftalık hedef takibi ve yeni mülakat ipuçları hakkında bildirim al.</span>
                </div>
              </div>
              <input 
                type="checkbox"
                checked={settingsData.emailNotifications}
                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition">
              <div className="flex items-center gap-3">
                <Volume2 size={18} className="text-cyan-400" />
                <div>
                  <span className="text-sm font-semibold block text-slate-200">Mülakat Ses Efektleri</span>
                  <span className="text-xs text-slate-400">Simülasyon içi geri sayım, başarı ve geçiş sesleri.</span>
                </div>
              </div>
              <input 
                type="checkbox"
                checked={settingsData.soundEffects}
                onChange={(e) => handleChange('soundEffects', e.target.checked)}
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold px-8 py-4 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Save size={18} />
            <span>{t('saveChanges', 'Değişiklikleri Kaydet')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}