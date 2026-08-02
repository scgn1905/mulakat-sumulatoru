const mysql = require('mysql2');

// MySQL bağlantı havuzu oluşturma (Şifreyi doğrudan buraya yazıyoruz)
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1905',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Önce veritabanının kendisini oluşturalım
pool.query("CREATE DATABASE IF NOT EXISTS mulakat_db", (err) => {
    if (err) {
        console.error("Veritabanı oluşturulurken hata:", err);
        return;
    }
    console.log("MySQL 'mulakat_db' veritabanı hazır.");
});

// Veritabanına tam bağlantı havuzu
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1905',
    database: 'mulakat_db',
    port: 3306
});

module.exports = db.promise();