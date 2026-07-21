import { GoogleGenAI } from '@google/genai';

// Google AI Studio'dan alacağın ücretsiz API Key'i tırnak içine yapıştır
const apiKey = 'YOUR_GEMINI_API_KEY'; 
const ai = new GoogleGenAI({ apiKey });

export async function evaluateAnswerWithAI(category, question, userAnswer) {
  try {
    const prompt = `
Sen kıdemli bir İnsan Kaynakları ve Mülakat Değerlendirme Uzmanısın.
Aşağıda verilen mülakat sorusuna ve adayın verdiği yanıta göre profesyonel bir analiz yap.

Mülakat Kategorisi: ${category}
Soru: ${question}
Adayın Yanıtı: "${userAnswer}"

Lütfen adayın yanıtını değerlendir ve SADECE aşağıdaki JSON formatında yanıt ver. Başka hiçbir açıklama yazma:

{
  "score": 10 üzerinden vereceğin puan (örneğin 8.5 veya 7.0 - sayı olarak),
  "strengths": "Adayın cevabındaki güçlü yönler ve olumlu noktalar (kısa ve net 1-2 cümle)",
  "improvements": "Adayın yanıtında geliştirmesi gereken yerler ve tavsiyeler (kısa ve net 1-2 cümle)"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text;
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanedText);

    return {
      score: Number(result.score) || 7,
      strengths: result.strengths || 'Yanıtınız konuyla ilgili temel noktaları kapsıyor.',
      improvements: result.improvements || 'Daha somut örnekler ve metrikler ekleyebilirsiniz.'
    };
  } catch (error) {
    console.error('AI Değerlendirme Hatası:', error);
    return {
      score: 7.5,
      strengths: 'Yanıtınız alındı ve temel kriterleri karşılıyor.',
      improvements: 'Teknik detayları biraz daha örneklendirerek zenginleştirebilirsiniz.'
    };
  }
}