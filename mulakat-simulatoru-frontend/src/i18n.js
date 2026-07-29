import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  tr: {
    translation: {
      // Menü & Genel
      home: "Ana Sayfa",
      features: "Özellikler",
      interviews: "Mülakatlar",
      pricing: "Fiyatlar",
      faq: "SSS",
      contact: "İletişim",
      login: "Giriş Yap",
      register: "Kayıt Ol",
      fullName: "Ad Soyad",
      email: "E-posta Adresi",

      // Hero
      heroTitle: "Şirket Mülakatlarına Yapay Zekâ ile Hazırlanın",
      heroDesc: "Zorlu İK soruları veya teknik senaryolar karşısında bocalama. Gerçekçi mülakat simülasyonlarıyla tecrübe kazan, özgüvenini katla.",
      startInterview: "Mülakatı Başlat",
      answerTag: "YANIT",
      autoFlow: "Otomatik Senaryo Akışı",

      // Features (Özellikler)
      featTechTag: "// KURUMSAL MÜLAKAT TEKNOLOJİSİ",
      feat1Title: "Davranışsal Analiz",
      feat1Desc: "Sorulara verdiğiniz tepkiler STAR metoduna uyum seviyenize göre değerlendirilir.",
      feat2Title: "Pozisyona Özel Senaryolar",
      feat2Desc: "Yöneticilik, İK veya Mühendislik rolleri için özelleştirilmiş senaryolar.",
      feat3Title: "Gelişim Raporu",
      feat3Desc: "İletişim diliniz ve güçlü yönleriniz detaylı raporlarla sunulur.",

      // Pricing (Fiyatlandırma)
      planStarterTag: "TEMEL BAŞLANGIÇ",
      planProTag: "KARIYER PAKETİ",
      starterFeat1: "Ayda 3 Şirket Mülakatı Simülasyonu",
      starterFeat2: "Temel Yetkinlik Puanlaması",
      proFeat1: "Sınırsız Mülakat Simülasyonu",
      proFeat2: "İngilizce Mülakat & Akıcılık Analizi",
      upgradePro: "Pro'ya Geç",

      // FAQ (SSS)
      faq1Q: "Şirket mülakat simülatörü yanıtlarımı nasıl analiz ediyor?",
      faq1A: "Yapay zekâ modelimiz, yanıtlarınızı STAR metodolojisi (Durum, Görev, Eylem, Sonuç), kriz yönetimi beceriniz ve anlatım netliğiniz açısından analiz eder.",
      faq2Q: "Hangi pozisyon ve departmanlar için mülakat pratiği var?",
      faq2A: "Yazılım, İK Yönetimi, Pazarlama, Proje & Ürün Yönetimi, Finans ve Müşteri İlişkileri gibi pek çok farklı departmana özel kurumsal senaryolar mevcuttur.",
      faq3Q: "Şirketlerin güncel mülakat soruları nasıl belirleniyor?",
      faq3A: "Soru havuzumuz; global ve yerel şirketlerin güncel mülakat süreçleri ve İK beklentileri referans alınarak sürekli güncellenir.",
      faq4Q: "Ücretsiz sürümde kısıtlama var mı?",
      faq4A: "Ücretsiz planda her ay 3 tam mülakat simülasyonu hakkınız bulunur. İngilizce mülakat simülasyonları ve PDF raporları Pro pakete dahildir.",

      // Contact (İletişim)
      contactDesc: "Sorularınız ve iş birlikleri için bize ulaşabilirsiniz.",
      messagePlaceholder: "Mesajınız...",
      sendBtn: "Gönder",
      msgSent: "Mesajınız İletildi!"
    }
  },
  en: {
    translation: {
      // Menü & Genel
      home: "Home",
      features: "Features",
      interviews: "Interviews",
      pricing: "Pricing",
      faq: "FAQ",
      contact: "Contact",
      login: "Sign In",
      register: "Sign Up",
      fullName: "Full Name",
      email: "Email Address",

      // Hero
      heroTitle: "Prepare for Company Interviews with AI",
      heroDesc: "Don't struggle with tough HR questions or technical scenarios. Gain experience and boost your confidence with realistic interview simulations.",
      startInterview: "Start Interview",
      answerTag: "RESPONSE",
      autoFlow: "Automated Scenario Flow",

      // Features
      featTechTag: "// CORPORATE INTERVIEW TECHNOLOGY",
      feat1Title: "Behavioral Analysis",
      feat1Desc: "Your responses are evaluated based on your alignment with the STAR methodology.",
      feat2Title: "Role-Specific Scenarios",
      feat2Desc: "Customized scenarios tailored for Management, HR, or Engineering roles.",
      feat3Title: "Progress Report",
      feat3Desc: "Your communication tone and key strengths are delivered in detailed reports.",

      // Pricing
      planStarterTag: "BASIC STARTER",
      planProTag: "CAREER PASS",
      starterFeat1: "3 Interview Simulations per month",
      starterFeat2: "Basic Competency Scoring",
      proFeat1: "Unlimited Interview Simulations",
      proFeat2: "English Interview & Fluency Analysis",
      upgradePro: "Upgrade to Pro",

      // FAQ
      faq1Q: "How does the interview simulator analyze my answers?",
      faq1A: "Our AI model analyzes your responses based on the STAR methodology (Situation, Task, Action, Result), crisis management skills, and communication clarity.",
      faq2Q: "Which job roles and departments are supported?",
      faq2A: "We offer corporate scenarios tailored for Software Engineering, HR Management, Marketing, Product & Project Management, Finance, and Customer Success.",
      faq3Q: "How are company interview questions updated?",
      faq3A: "Our question bank is continuously updated based on current hiring standards and HR expectations from global and local companies.",
      faq4Q: "Are there any limits on the free plan?",
      faq4A: "The free plan includes 3 full interview simulations each month. English interview simulations and PDF reports require a Pro subscription.",

      // Contact
      contactDesc: "Feel free to reach out to us for any questions or collaborations.",
      messagePlaceholder: "Your message...",
      sendBtn: "Send Message",
      msgSent: "Your message has been sent!"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'tr',
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;