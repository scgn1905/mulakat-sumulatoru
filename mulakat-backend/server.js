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
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --- MERKEZİ HATA LOGLAMA FONKSİYONU ---
const logErrorToDB = (email, message, route) => {
    const query = "INSERT INTO error_logs (user_email, error_message, route) VALUES (?, ?, ?)";
    db.query(query, [email || 'Misafir', message, route], (err) => {
        if (err) console.error("Log veritabanına yazılamadı:", err);
    });
};

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
        logErrorToDB(email, err.message, '/api/contact');
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

// --- ŞİFRE SIFIRLAMA TALEBİ ---
app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    console.log("--------------------------------------------------");
    console.log("🔔 ŞİFRE SIFIRLAMA İSTEĞİ ALINDI - Email:", email);

    if (!email) {
        return res.status(400).json({ error: "Lütfen e-posta adresinizi girin." });
    }

    try {
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        console.log("🔍 Veritabanında bulunan kullanıcı sayısı:", users.length);

        if (users.length === 0) {
            console.log("⚠️ Uyarı: Bu e-posta veritabanında bulunamadı!");
            return res.json({ message: "Eğer bu e-posta adresi sistemde kayıtlıysa şifre sıfırlama bağlantısı gönderilmiştir." });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        await db.query("INSERT INTO password_resets (email, token) VALUES (?, ?)", [email, resetToken]);
        console.log(`✅ BAŞARILI! Şifre Sıfırlama Linki Oluşturuldu: http://localhost:5175/reset-password?token=${resetToken}`);
        console.log("--------------------------------------------------");
        
        res.json({ message: "Şifre sıfırlama talimatları e-posta adresinize gönderildi. (Konsolu kontrol edin)" });
    } catch (err) {
        console.error("❌ Şifre sıfırlama hatası:", err);
        logErrorToDB(email, err.message, '/api/forgot-password');
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
        logErrorToDB(null, err.message, '/api/reset-password');
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
        logErrorToDB(req.user?.email, err.message, '/api/settings');
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
        logErrorToDB(req.user?.email, err.message, '/api/change-password');
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
        
        try {
            await db.query("ALTER TABLE user_settings ADD COLUMN email_notifications BOOLEAN DEFAULT TRUE");
        } catch (e) { /* Sütun varsa geç */ }

        try {
            await db.query("ALTER TABLE user_settings ADD COLUMN sound_effects BOOLEAN DEFAULT TRUE");
        } catch (e) { /* Sütun varsa geç */ }
        
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

        await db.query(`
            CREATE TABLE IF NOT EXISTS announcements (
                id INT AUTO_INCREMENT PRIMARY KEY,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS error_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_email VARCHAR(255),
                error_message TEXT,
                route VARCHAR(255),
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

app.get('/api/user-weekly-goal', verifyToken, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const [settings] = await db.query("SELECT weekly_goal FROM user_settings WHERE user_id = ?", [req.user.id]);
        const weeklyGoal = settings[0]?.weekly_goal || 3;

        const [results] = await db.query(`
            SELECT COUNT(*) as completedCount 
            FROM interview_results 
            WHERE user_email = ? AND created_at >= NOW() - INTERVAL 7 DAY
        `, [userEmail]);

        const completedCount = results[0]?.completedCount || 0;
        const remaining = Math.max(0, weeklyGoal - completedCount);
        const progressPercent = Math.min(100, Math.round((completedCount / weeklyGoal) * 100));

        res.json({ weeklyGoal, completedCount, remaining, progressPercent });
    } catch (err) {
        console.error("Haftalık hedef takip hatası:", err);
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.get('/api/admin/activities-and-stats', verifyToken, async (req, res) => {
    try {
        if (req.user.email !== 'secginn@gmail.com') {
            return res.status(403).json({ error: "Bu alana sadece süper yönetici erişebilir." });
        }

        const [recentResults] = await db.query("SELECT user_email, category_title, score, created_at FROM interview_results ORDER BY created_at DESC LIMIT 3");
        const [recentUsers] = await db.query("SELECT name, email, created_at FROM users ORDER BY created_at DESC LIMIT 3");
        const [recentMessages] = await db.query("SELECT name, email, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 3");
        const [todayErrors] = await db.query("SELECT COUNT(*) as count FROM error_logs WHERE DATE(created_at) = CURDATE()");
        const [topRoute] = await db.query("SELECT route, COUNT(*) as count FROM error_logs GROUP BY route ORDER BY count DESC LIMIT 1");

        res.json({
            recentResults,
            recentUsers,
            recentMessages,
            stats: {
                todayErrorCount: todayErrors[0]?.count || 0,
                topErrorRoute: topRoute[0]?.route || 'Veri Yok'
            }
        });
    } catch (err) {
        console.error("Aktivite ve istatistik hatası:", err);
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
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
        logErrorToDB(email, err.message, '/api/register');
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
        logErrorToDB(email, err.message, '/api/login');
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
        logErrorToDB(req.user?.email, err.message, '/api/profile');
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
        logErrorToDB(req.user?.email, err.message, '/api/profile (PUT)');
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
        logErrorToDB(req.user?.email, err.message, '/api/settings');
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.get('/api/admin/messages', verifyToken, async (req, res) => {
    try {
        if (req.user.email !== 'secginn@gmail.com') {
            return res.status(403).json({ error: "Bu alana sadece süper yönetici erişebilir." });
        }
        const [messages] = await db.query("SELECT * FROM contact_messages ORDER BY created_at DESC");
        res.json(messages);
    } catch (err) {
        console.error("Mesajları getirme hatası:", err);
        logErrorToDB(req.user?.email, err.message, '/api/admin/messages');
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.get('/api/admin/users', verifyToken, async (req, res) => {
    try {
        if (req.user.email !== 'secginn@gmail.com') {
            return res.status(403).json({ error: "Bu alana sadece süper yönetici erişebilir." });
        }
        const [users] = await db.query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC");
        res.json(users);
    } catch (err) {
        console.error("Kullanıcıları getirme hatası:", err);
        logErrorToDB(req.user?.email, err.message, '/api/admin/users');
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.get('/api/admin/error-logs', verifyToken, async (req, res) => {
    try {
        if (req.user.email !== 'secginn@gmail.com') {
            return res.status(403).json({ error: "Bu alana sadece süper yönetici erişebilir." });
        }
        const [logs] = await db.query("SELECT * FROM error_logs ORDER BY created_at DESC LIMIT 50");
        res.json(logs);
    } catch (err) {
        console.error("Logları getirme hatası:", err);
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

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
        logErrorToDB(req.user?.email, err.message, '/api/announcements');
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.get('/api/announcements', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM announcements ORDER BY created_at DESC");
        res.json(rows);
    } catch (err) {
        console.error("Duyuruları getirme hatası:", err);
        logErrorToDB(null, err.message, '/api/announcements (GET)');
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.delete('/api/announcements/:id', verifyToken, async (req, res) => {
    if (req.user.email !== 'secginn@gmail.com') {
        return res.status(403).json({ error: "Bu işlem için yetkiniz yok." });
    }
    try {
        await db.query("DELETE FROM announcements WHERE id = ?", [req.params.id]);
        res.json({ message: "Duyuru başarıyla silindi." });
    } catch (err) {
        console.error("Duyuru silme hatası:", err);
        logErrorToDB(req.user?.email, err.message, '/api/announcements/:id (DELETE)');
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
        logErrorToDB(null, err.message, '/api/questions/:categoryId');
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
        logErrorToDB(req.user?.email, err.message, '/api/questions (POST)');
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
        logErrorToDB(req.user?.email, err.message, '/api/questions/:id (DELETE)');
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.post('/api/interview-results', async (req, res) => {
    const { user_email, category_title, score } = req.body;
    try {
        await db.query("INSERT INTO interview_results (user_email, category_title, score) VALUES (?, ?, ?)", [user_email, category_title, score]);
        res.status(201).json({ message: "Sonuç kaydedildi." });
    } catch (err) {
        logErrorToDB(user_email, err.message, '/api/interview-results');
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.get('/api/interview-results/:email', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM interview_results WHERE user_email = ? ORDER BY created_at DESC", [req.params.email]);
        res.json(rows);
    } catch (err) {
        logErrorToDB(req.params.email, err.message, '/api/interview-results/:email');
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.get('/api/leaderboard', async (req, res) => {
    try {
        const { category } = req.query;
        let query = `
            SELECT r.user_email, MAX(r.score) as score, COUNT(r.id) as interviews, MAX(r.created_at) as created_at, u.name 
            FROM interview_results r 
            LEFT JOIN users u ON r.user_email = u.email
        `;
        let queryParams = [];

        if (category && category !== 'all') {
            query += ` WHERE `;
            if (category === 'frontend' || category === 'Yazılım') {
                query += ` (r.category_title LIKE ? OR r.category_title LIKE ? OR r.category_title LIKE ?) `;
                queryParams.push('%frontend%', '%backend%', '%Yazılım%');
            } else if (category === 'hr' || category === 'İK') {
                query += ` (r.category_title LIKE ? OR r.category_title LIKE ? OR r.category_title LIKE ?) `;
                queryParams.push('%hr%', '%İK%', '%Davranışsal%');
            } else if (category === 'english' || category === 'İngilizce') {
                query += ` (r.category_title LIKE ? OR r.category_title LIKE ?) `;
                queryParams.push('%english%', '%İngilizce%');
            } else if (category === 'product' || category === 'Ürün') {
                query += ` (r.category_title LIKE ? OR r.category_title LIKE ?) `;
                queryParams.push('%product%', '%Ürün%');
            } else {
                query += ` r.category_title LIKE ? `;
                queryParams.push(`%${category}%`);
            }
        }

        query += ` GROUP BY r.user_email, u.name ORDER BY score DESC LIMIT 10`;

        const [rows] = await db.query(query, queryParams);
        res.json(rows);
    } catch (err) {
        console.error("Liderlik tablosu hatası:", err);
        logErrorToDB(null, err.message, '/api/leaderboard');
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.get('/api/user-heatmap', verifyToken, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const [results] = await db.query(
            "SELECT category_title, score FROM interview_results WHERE user_email = ? ORDER BY created_at DESC", 
            [userEmail]
        );

        let stats = {
            "Kriz Yönetimi & Soğukkanlılık": 0,
            "Müşteri İkna Kabiliyeti": 0,
            "Bütçe & Veri Odaklı Karar Alma": 0,
            "Takım İçi Çatışma Çözümü (STAR)": 0,
            "Liderlik & Ekip Motivasyonu": 0,
            "Zaman Yönetimi ve Önceliklendirme": 0
        };

        if (results.length > 0) {
            let totalSum = 0;
            results.forEach(r => totalSum += r.score);
            let generalAvg = Math.round(totalSum / results.length);

            Object.keys(stats).forEach(key => {
                stats[key] = generalAvg;
            });
        }

        res.json(stats);
    } catch (err) {
        console.error("Isı haritası veri hatası:", err);
        logErrorToDB(req.user?.email, err.message, '/api/user-heatmap');
        res.status(500).json({ error: "Sunucu hatası oluştu." });
    }
});

app.post('/api/evaluate', verifyToken, async (req, res) => {
    const { question, answer } = req.body;

    if (!answer) {
        return res.status(400).json({ error: "Değerlendirilecek cevap bulunamadı." });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey.trim() === "") {
            return res.status(500).json({
                error: "Sunucu yapılandırma hatası: Gemini API Anahtarı eksik."
            });
        }

        const prompt = `...`; // Senin uzun prompt'un

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        let rawText = response.text();

        if (!rawText) {
            throw new Error("Yapay zekadan boş yanıt döndü.");
        }

        rawText = rawText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const result = JSON.parse(rawText);

        res.json({
            score: result.score,
            feedback: result.feedback
        });

    } catch (err) {
        console.error("YAPAY ZEKA KRİTİK HATA:", err);
        logErrorOToDB?.(req.user?.email, err.message, "/api/evaluate");
        res.status(500).json({
            error: "Yapay zeka analizi sırasında hata: " + err.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});