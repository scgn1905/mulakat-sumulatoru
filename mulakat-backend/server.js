console.log("BENİM SERVER.JS DOSYAM ÇALIŞIYOR");
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { GoogleGenAI } = require('@google/genai');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'mulakat_gizli_anahtar_2026';
const ai = new GoogleGenAI({ apiKey: "AQ.Ab8RN6JyrhmRDClWcZFvqLnKLp_INDpXa04diGI7C1KLgMxwnQ" });
app.use(cors());
app.use(express.json());

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Erişim reddedildi. Token bulunamadı." });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Geçersiz veya süresi dolmuş token." });
        }
        req.user = user;
        next();
    });
};

// --- İLETİŞİM MESAJI KAYDETME ENDPOINT'İ ---
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: "Lütfen tüm alanları doldurun." });
    }
    try {
        await db.query("INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)", [name, email, message]);
        res.status(201).json({ message: "Mesajınız başarıyla gönderildi!" });
    } catch (err) {
        console.error("İletişim hatası:", err);
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

// --- ŞİFRE SIFIRLAMA TALEBİ ---
app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Lütfen e-posta adresinizi girin." });
    }

    try {
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.json({ message: "Eğer bu e-posta adresi sistemde kayıtlıysa şifre sıfırlama bağlantısı gönderilmiştir." });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        await db.query("INSERT INTO password_resets (email, token) VALUES (?, ?)", [email, resetToken]);
        console.log(`🔐 ŞİFRE SIFIRLAMA LİNKİ (Simülasyon): http://localhost:5175/reset-password?token=${resetToken}`);
        res.json({ message: "Şifre sıfırlama talimatları e-posta adresinize gönderildi. (Konsolu kontrol edin)" });
    } catch (err) {
        console.error("Şifre sıfırlama hatası:", err);
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

// --- YENİ ŞİFREYİ KAYDETME ---
app.post('/api/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return res.status(400).json({ error: "Eksik bilgi girdiniz." });
    }

    try {
        const [rows] = await db.query("SELECT * FROM password_resets WHERE token = ? ORDER BY created_at DESC LIMIT 1", [token]);
        if (rows.length === 0) {
            return res.status(400).json({ error: "Geçersiz veya süresi dolmuş token." });
        }

        const resetRecord = rows[0];
        await db.query("UPDATE users SET password = ? WHERE email = ?", [newPassword, resetRecord.email]);
        await db.query("DELETE FROM password_resets WHERE email = ?", [resetRecord.email]);
        res.json({ message: "Şifreniz başarıyla güncellendi. Giriş yapabilirsiniz." });
    } catch (err) {
        console.error("Şifre yenileme hatası:", err);
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

// --- AYARLAR GÜNCELLEME ---
app.put('/api/settings', verifyToken, async (req, res) => {
    const { 
        ai_tone, report_detail, weekly_goal, 
        target_position, experience_level, 
        theme_color, email_notifications, sound_effects 
    } = req.body;

    try {
        const [existing] = await db.query("SELECT * FROM user_settings WHERE user_id = ?", [req.user.id]);
        
        if (existing.length === 0) {
            await db.query(`
                INSERT INTO user_settings (user_id, ai_tone, report_detail, weekly_goal, target_position, experience_level, theme_color, email_notifications, sound_effects)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [req.user.id, ai_tone, report_detail, weekly_goal, target_position, experience_level, theme_color, email_notifications, sound_effects]);
        } else {
            const query = `
                UPDATE user_settings 
                SET ai_tone = ?, report_detail = ?, weekly_goal = ?, 
                    target_position = ?, experience_level = ?, 
                    theme_color = ?, email_notifications = ?, sound_effects = ?
                WHERE user_id = ?
            `;
            await db.query(query, [
                ai_tone, report_detail, weekly_goal, 
                target_position, experience_level, 
                theme_color, email_notifications, sound_effects, 
                req.user.id
            ]);
        }

        res.json({ message: "Ayarlar başarıyla güncellendi ve kaydedildi!" });
    } catch (err) {
        console.error("Ayar güncelleme hatası:", err);
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

// --- ŞİFRE DEĞİŞTİRME ---
app.put('/api/change-password', verifyToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Lütfen mevcut ve yeni şifrenizi girin." });
    }

    try {
        const [users] = await db.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }

        const user = users[0];
        if (user.password !== currentPassword) {
            return res.status(400).json({ message: "Mevcut şifreniz hatalı." });
        }

        await db.query("UPDATE users SET password = ? WHERE id = ?", [newPassword, req.user.id]);
        res.json({ message: "Şifreniz başarıyla güncellendi." });
    } catch (err) {
        console.error("Şifre değiştirme hatası:", err);
        res.status(500).json({ message: "Sunucu hatası oluştu." });
    }
});

const initDatabase = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        await db.query(`
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS password_resets (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                token VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS interview_questions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category_id VARCHAR(50) NOT NULL,
                question_text TEXT NOT NULL
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS interview_results (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_email VARCHAR(255) NOT NULL,
                category_title VARCHAR(255) NOT NULL,
                score INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS user_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL UNIQUE,
                ai_tone VARCHAR(100) DEFAULT 'Standart Profesyonel & Dengeli',
                report_detail VARCHAR(100) DEFAULT 'Kapsamlı STAR Analizi & Kelime Tavsiyeleri',
                weekly_goal INT DEFAULT 3,
                target_position VARCHAR(150) DEFAULT 'Yazılım Mühendisliği / Developer',
                experience_level VARCHAR(100) DEFAULT 'Mid-Level (Uzman / 2-5 Yıl)',
                theme_color VARCHAR(50) DEFAULT 'Safir Mavi',
                email_notifications BOOLEAN DEFAULT TRUE,
                sound_effects BOOLEAN DEFAULT TRUE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // --- DUYURULAR TABLOSU (Doğru İsimle Düzeltildi) ---
        await db.query(`
            CREATE TABLE IF NOT EXISTS announcements (
                id INT AUTO_INCREMENT PRIMARY KEY,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("Tablolar eksiksiz hazır.");

        const [rows] = await db.query("SELECT COUNT(*) as count FROM interview_questions");
        if (rows[0].count === 0) {
            const defaultQuestions = [
                ['frontend', 'React bileşenlerinde state ve props kavramlarını karşılaştırarak örnek veriniz.'],
                ['frontend', 'useEffect hook\'u hangi amaçlarla kullanılır ve cleanup fonksiyonu neden önemlidir?'],
                ['frontend', 'Büyük ölçekli bir React uygulamasında performans optimizasyonu için hangi stratejileri izlersiniz?'],
                ['frontend', 'Virtual DOM mekanizması nasıl çalışır ve tarayıcı performansına katkısı nedir?'],
                ['backend', 'Node.js event loop mekanizmasını ve asenkron I/O işlemlerinin nasıl yönetildiğini açıklayınız.'],
                ['backend', 'RESTful API tasarlarken dikkat edilmesi gereken en temel prensipler nelerdir?'],
                ['backend', 'İlişkisel veritabanlarında index (indeks) kullanımı sorgu performansını nasıl etkiler?'],
                ['backend', 'Mikroservis mimarisinin monolitik yapılara göre avantajları ve dezavantajları nelerdir?'],
                ['hr', 'Geçmiş tecrübelerinizde ekibinizle ciddi bir fikir ayrılığı yaşadığınız kriz anını STAR metoduna göre anlatır misiniz?'],
                ['hr', 'Kendi kariyerinizde geliştirmek istediğiniz zayıf yönünüz nedir ve bunu aşmak için ne gibi adımlar atıyorsunuz?'],
                ['hr', 'Çok yoğun bir çalışma temposunda ve kısıtlı sürede birden fazla öncelikli işi nasıl yönetirsiniz?'],
                ['product', 'MVP (Minimum Viable Product) geliştirme sürecinde ilk özellikleri belirlerken hangi kriterleri baz alırsınız?'],
                ['product', 'Müşteri geri bildirimleri ile yazılım ekibinin teknik borç temizleme talebi çakıştığında nasıl bir yol izlersiniz?'],
                ['leadership', 'Ekip içinde düşük performans gösteren bir geliştiriciye karşı lider olarak yaklaşımınız nasıl olur?'],
                ['leadership', 'Teknik kararlar alırken ekip içi mutabakat (consensus) sağlanamadığında inisiyatifi nasıl ele alırsınız?'],
                ['english', 'Could you describe a challenging technical project you managed and how you overcame obstacles?'],
                ['english', 'Where do you see your professional career path and technical skills in the next five years?'],
                ['finance', 'Eksik veya belirsiz finansal veri setleriyle çalışırken risk analizini nasıl gerçekleştirirsiniz?'],
                ['finance', 'Yatırımın geri dönüş süresi (ROI) hesaplamalarında maliyet optimizasyonunu nasıl sağlarsınız?']
            ];

            for (let q of defaultQuestions) {
                await db.query("INSERT INTO interview_questions (category_id, question_text) VALUES (?, ?)", [q[0], q[1]]);
            }
            console.log("Genişletilmiş mülakat soruları eklendi.");
        }
    } catch (err) {
        console.error("Veritabanı başlatılırken hata:", err);
    }
};

initDatabase();

app.get('/', (req, res) => {
    res.json({ message: "Mülakat Simülatörü Tam Sürüm Backend Aktif!" });
});

app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Lütfen tüm alanları doldurun." });
    }
    try {
        const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Bu e-posta adresi ile zaten bir hesap var." });
        }
        const [result] = await db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password]);
        await db.query("INSERT INTO user_settings (user_id) VALUES (?)", [result.insertId]);
        res.status(201).json({ message: "Kayıt başarıyla oluşturuldu!" });
    } catch (err) {
        console.error("Kayıt hatası:", err);
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Lütfen e-posta ve şifrenizi girin." });
    }
    try {
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0 || users[0].password !== password) {
            return res.status(401).json({ error: "E-posta veya şifre hatalı." });
        }
        const user = users[0];
        const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ message: "Giriş başarılı!", token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error("Giriş hatası:", err);
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.get('/api/profile', verifyToken, async (req, res) => {
    try {
        const [users] = await db.query("SELECT id, name, email, created_at FROM users WHERE id = ?", [req.user.id]);
        if (users.length === 0) return res.status(404).json({ error: "Kullanıcı bulunamadı." });
        res.json(users[0]);
    } catch (err) {
        console.error("Profil hatası:", err);
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.put('/api/profile', verifyToken, async (req, res) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: "Ad ve e-posta alanları boş bırakılamaz." });
    }

    try {
        const [existing] = await db.query("SELECT * FROM users WHERE email = ? AND id != ?", [email, req.user.id]);
        if (existing.length > 0) {
            return res.status(400).json({ error: "Bu e-posta adresi başka bir hesap tarafından kullanılıyor." });
        }

        await db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, req.user.id]);
        res.json({ message: "Profil bilgileri başarıyla güncellendi." });
    } catch (err) {
        console.error("Profil güncelleme hatası:", err);
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.get('/api/settings', verifyToken, async (req, res) => {
    try {
        const [settings] = await db.query("SELECT * FROM user_settings WHERE user_id = ?", [req.user.id]);
        if (settings.length === 0) {
            await db.query("INSERT INTO user_settings (user_id) VALUES (?)", [req.user.id]);
            const [newSettings] = await db.query("SELECT * FROM user_settings WHERE user_id = ?", [req.user.id]);
            return res.json(newSettings[0]);
        }
        res.json(settings[0]);
    } catch (err) {
        console.error("Ayarları getirme hatası:", err);
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

// --- ADMIN: İLETİŞİM MESAJLARINI LİSTELEME ---
app.get('/api/admin/messages', verifyToken, async (req, res) => {
    try {
        if (req.user.email !== 'secginn@gmail.com') {
            return res.status(403).json({ error: "Bu alana sadece süper yönetici erişebilir." });
        }
        const [messages] = await db.query("SELECT * FROM contact_messages ORDER BY created_at DESC");
        res.json(messages);
    } catch (err) {
        console.error("Mesajları getirme hatası:", err);
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

// --- ADMIN: KULLANICILARI LİSTELEME ---
app.get('/api/admin/users', verifyToken, async (req, res) => {
    try {
        if (req.user.email !== 'secginn@gmail.com') {
            return res.status(403).json({ error: "Bu alana sadece süper yönetici erişebilir." });
        }
        const [users] = await db.query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC");
        res.json(users);
    } catch (err) {
        console.error("Kullanıcıları getirme hatası:", err);
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

// --- DUYURU OLUŞTURMA ENDPOINT'İ (Sadece Admin) ---
app.post('/api/announcements', verifyToken, async (req, res) => {
    if (req.user.email !== 'secginn@gmail.com') {
        return res.status(403).json({ error: "Bu işlem için yetkiniz yok." });
    }
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: "Duyuru metni boş olamaz." });
    }
    try {
        await db.query("INSERT INTO announcements (message) VALUES (?)", [message]);
        res.status(201).json({ message: "Duyuru başarıyla yayınlandı!" });
    } catch (err) {
        console.error("Duyuru ekleme hatası:", err);
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

// --- DUYURULARI LİSTELEME ENDPOINT'İ (Herkes Görebilir) ---
app.get('/api/announcements', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM announcements ORDER BY created_at DESC");
        res.json(rows);
    } catch (err) {
        console.error("Duyuruları getirme hatası:", err);
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

// --- DUYURU SİLME ENDPOINT'İ (Sadece Admin) ---
app.delete('/api/announcements/:id', verifyToken, async (req, res) => {
    if (req.user.email !== 'secginn@gmail.com') {
        return res.status(403).json({ error: "Bu işlem için yetkiniz yok." });
    }
    try {
        await db.query("DELETE FROM announcements WHERE id = ?", [req.params.id]);
        res.json({ message: "Duyuru başarıyla silindi." });
    } catch (err) {
        console.error("Duyuru silme hatası:", err);
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.get('/api/questions/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
    try {
        const [rows] = await db.query("SELECT * FROM interview_questions WHERE category_id = ? ORDER BY RAND()", [categoryId]);
        res.json(rows);
    } catch (err) {
        console.error("Soru getirme hatası:", err);
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.post('/api/questions', verifyToken, async (req, res) => {
    if (req.user.email !== 'secginn@gmail.com') {
        return res.status(403).json({ error: "Bu işlem için yetkiniz yok." });
    }
    const { category_id, question_text } = req.body;
    try {
        await db.query("INSERT INTO interview_questions (category_id, question_text) VALUES (?, ?)", [category_id, question_text]);
        res.status(201).json({ message: "Soru eklendi." });
    } catch (err) {
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.delete('/api/questions/:id', verifyToken, async (req, res) => {
    if (req.user.email !== 'secginn@gmail.com') {
        return res.status(403).json({ error: "Bu işlem için yetkiniz yok." });
    }
    try {
        await db.query("DELETE FROM interview_questions WHERE id = ?", [req.params.id]);
        res.json({ message: "Soru silindi." });
    } catch (err) {
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.post('/api/interview-results', async (req, res) => {
    const { user_email, category_title, score } = req.body;
    try {
        await db.query("INSERT INTO interview_results (user_email, category_title, score) VALUES (?, ?, ?)", [user_email, category_title, score]);
        res.status(201).json({ message: "Sonuç kaydedildi." });
    } catch (err) {
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.get('/api/interview-results/:email', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM interview_results WHERE user_email = ? ORDER BY created_at DESC", [req.params.email]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.get('/api/leaderboard', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT user_email, category_title, score, created_at 
            FROM interview_results 
            ORDER BY score DESC, created_at DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error("Liderlik tablosu hatası:", err);
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.post('/api/evaluate', verifyToken, async (req, res) => {
    const { question, answer } = req.body;

    if (!answer) {
        return res.status(400).json({ error: "Değerlendirilecek cevap bulunamadı." });
    }

    try {
        const apiKey = "AQ.Ab8RN6JyrhmRDClWcZFvqLnKLp_INDpXa04diGI7C1KLgMxwnQ";
        const prompt = "Sen kıdemli bir teknik mülakat uzmanısın. Mülakat Sorusu: \"" + question + "\". Adayın Verdiği Yanıt: \"" + answer + "\". KURALLAR: 1. Aday saçma sapan, alakasız, çok kısa veya tek bir nokta/karakter yazdıysa puanı KESİNLİKLE 0 ile 20 arasında ver. 2. Yanıtı teknik açıdan ve STAR metoduna göre ciddi şekilde değerlendir. Yanıtını KESİNLİKLE şu JSON formatında döndür, başka hiçbir metin ekleme: {\"score\": 15, \"feedback\": \"Geri bildirim metni\"}";

        const fetchUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-3.6-flash:generateContent?key=" + apiKey;

        const geminiResponse = await fetch(fetchUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await geminiResponse.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        let rawText = data.candidates[0].content.parts[0].text;
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

        const result = JSON.parse(rawText);
        res.json({ score: result.score, feedback: result.feedback });

    } catch (err) {
        console.error("YAPAY ZEKA HATASI:", err);
        res.status(500).json({ error: "Yapay zeka analizi sırasında hata: " + err.message });
    }
});

app.listen(5000, '0.0.0.0', (err) => {
    if (err) {
        console.error("Listen hatası:", err);
        return;
    }

    console.log("✅ Server 5000 portunda dinleniyor.");
});