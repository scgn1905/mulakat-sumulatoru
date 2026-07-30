import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs">
          <ShieldCheck size={16} />
          <span>GİZLİLİK VE VERİ GÜVENLİĞİ</span>
        </div>
        <h1 className="text-3xl font-black text-slate-100">Gizlilik Politikası ve KVKK</h1>
        <p className="text-xs text-slate-400">Son Güncelleme: Temmuz 2026</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-100">1. Verilerin Toplanması ve İşlenmesi</h2>
          <p className="text-slate-400">
            MULAKAT.AI simülatörünü kullanırken sunduğunuz ses kayıtları, metin yanıtları ve kullanıcı bilgileri sadece size özel mülakat raporları oluşturmak ve yapay zekâ analiz motorunun performansını artırmak amacıyla işlenir.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-100">2. Veri Güvenliği ve Gizlilik</h2>
          <p className="text-slate-400">
            Mülakat pratikleri esnasında paylaştığınız kişisel verileriniz 3. taraf şirketlerle kesinlikle satılmaz veya paylaşılmaz. Ses ve metin verileriniz şifrelenmiş sunucularımızda güvenle saklanır.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-100">3. Çerezler (Cookies)</h2>
          <p className="text-slate-400">
            Platformumuzda oturumunuzun açık kalmasını sağlamak ve tercihlerinizi (dil, tema vb.) hatırlamak için zorunlu çerezler kullanılmaktadır.
          </p>
        </section>
      </div>
    </div>
  );
}