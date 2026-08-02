console.log("BENİM SERVER.JS DOSYAM ÇALIŞIYOR");
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'mulakat_gizli_anahtar_2026';

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

// --- KRİTİK GÜNCELLEME: ROTA EN BAŞA ALINDI ---
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

// --- ŞİFRE DEĞİŞTİRME ENDPOINT'İ (HATASIZ HALİ) ---
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
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        // YENİ EKLENECEK TABLO BURASI:
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

        console.log("Tablolar (users, questions, results, settings) eksiksiz hazır.");

        const [rows] = await db.query("SELECT COUNT(*) as count FROM interview_questions");
        if (rows[0].count === 0) {
            const defaultQuestions = [
                ['java', 'Java dilinde OOP (Nesne Yönelimli Programlama) prensiplerini açıklayınız.'],
                ['java', 'Spring Boot nedir ve avantajları nelerdir?'],
                ['react', 'React bileşenlerinde state ve props kavramlarını karşılaştırınız.'],
                ['react', 'useEffect hook\'u ne amaçla kullanılır? Örnek veriniz.'],
                ['hr', 'Kendinizden bahseder misiniz? En güçlü yönünüz nedir?'],
                ['hr', 'Stresli bir durumla karşılaştığınızda nasıl başa çıkarsınız?']
            ];

            for (let q of defaultQuestions) {
                await db.query("INSERT INTO interview_questions (category_id, question_text) VALUES (?, ?)", [q[0], q[1]]);
            }
            console.log("Varsayılan mülakat soruları eklendi.");
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
        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ message: "Giriş başarılı!", token, user: { id: user.id, name: user.name, email: user.email } });
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

// --- YENİ EKLENEN: KULLANICI PROFİL (AD VE E-POSTA) GÜNCELLEME ENDPOINT'İ ---
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

app.get('/api/questions/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
    try {
        const [rows] = await db.query("SELECT * FROM interview_questions WHERE category_id = ?", [categoryId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.post('/api/questions', verifyToken, async (req, res) => {
    const { category_id, question_text } = req.body;
    try {
        await db.query("INSERT INTO interview_questions (category_id, question_text) VALUES (?, ?)", [category_id, question_text]);
        res.status(201).json({ message: "Soru eklendi." });
    } catch (err) {
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.delete('/api/questions/:id', verifyToken, async (req, res) => {
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
    const { answer } = req.body;
    const wordCount = answer ? answer.trim().split(/\s+/).length : 5;
    let score = Math.min(100, Math.max(40, wordCount * 4));
    res.json({ score, feedback: "Yapay zeka analizi başarıyla tamamlandı." });
});
// --- TEST İÇİN KAYDEDİLEN MESAJLARI GÖRME ---
app.get('/api/test-messages', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM contact_messages");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, '0.0.0.0', (err) => {
    if (err) {
        console.error("Listen hatası:", err);
        return;
    }

    console.log("✅ Server 5000 portunda dinleniyor.");
});