export async function evaluateAnswerWithAI(category, question, userAnswer) {
  // Kısa bir yapay zekâ "düşünme" simülasyonu (600ms)
  await new Promise(resolve => setTimeout(resolve, 600));

  const text = userAnswer.trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // 1. Durum: Rastgele harfler veya çok kısa/anlamsız metinler
  const isRandom = wordCount < 3 || /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]{1,5}$/.test(text) || /(.)\1{3,}/.test(text);
  
  if (isRandom) {
    return {
      score: 2.0,
      strengths: 'Belirgin bir profesyonel yaklaşım veya anahtar kelime tespit edilemedi.',
      improvements: 'Mülakat yanıtınız anlamlı bir cümle yapısı içermiyor. Lütfen soruyu dikkatlice okuyup detaylı ve profesyonel bir yanıt oluşturun.'
    };
  }

  // 2. Durum: Orta düzey veya kısa yanıtlar (4 - 15 kelime)
  if (wordCount < 15) {
    return {
      score: 5.5,
      strengths: `Temel düzeyde konuyla ilgili (${category}) kısa bir yaklaşım sergilenmiş.`,
      improvements: 'Yanıtınız çok kısa. Mülakatlarda "STAR" (Durum, Görev, Eylem, Sonuç) metodunu kullanarak deneyimlerinizi daha detaylı hikayeleştirmelisiniz.'
    };
  }

  // 3. Durum: Kapsamlı, uzun ve detaylı profesyonel yanıtlar (15+ kelime)
  // Kelime sayısına ve içeriğe göre dinamik küsuratlı puan üretiriz
  const dynamicScore = Math.min(6.5 + (wordCount * 0.1), 9.8).toFixed(1);

  let specificStrength = 'Konuyu ele alış biçiminiz ve kurumsal farkındalığınız oldukça net.';
  let specificImprovement = 'Analizinizi sektörel metrikler ve somut örneklerle destekleyerek etki gücünü artırabilirsiniz.';

  if (category.toLowerCase().includes('insan') || category.toLowerCase().includes('hr')) {
    specificStrength = 'İletişim diliniz empati odaklı ve ekip uyumunu gözetir nitelikte.';
    specificImprovement = 'Çatışma çözme adımlarını daha somut bir vaka üzerinden anlatabilirsiniz.';
  } else if (category.toLowerCase().includes('satış') || category.toLowerCase().includes('pazarlama')) {
    specificStrength = 'Sonuç odaklı ve ikna kabiliyetini öne çıkaran bir tutum sergilemişsiniz.';
    specificImprovement = 'Müşteri itirazlarını karşılarken veri odaklı argümanlar ekleyebilirsiniz.';
  } else if (category.toLowerCase().includes('yönetim') || category.toLowerCase().includes('liderlik')) {
    specificStrength = 'Liderlik vizyonunuz ve sorumluluk alma bilinciniz net bir şekilde hissediliyor.';
    specificImprovement = 'Kriz anlarında aldığınız stratejik kararları delegasyon süreçleriyle ilişkilendirebilirsiniz.';
  }

  return {
    score: Number(dynamicScore),
    strengths: specificStrength,
    improvements: specificImprovement
  };
}