import React from 'react';
import { FileText } from 'lucide-react';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-8 text-slate-300">
      <div className="border-b border-slate-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-teal-400 font-mono text-xs">
          <FileText size={16} />
          <span>KULLANIM SÖZLEŞMESİ</span>
        </div>
        <h1 className="text-3xl font-black text-slate-100">Kullanım Şartları</h1>
        <p className="text-xs text-slate-400">Son Güncelleme: Temmuz 2026</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-100">1. Hizmet Kapsamı</h2>
          <p className="text-slate-400">
            MULAKAT.AI bir eğitsel mülakat simülatörüdür. Yapay zekâ tarafından üretilen puanlar ve değerlendirmeler tavsiye niteliğindedir; gerçek şirketlerin işe alım garantisi anlamına gelmez.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-100">2. Kullanıcı Sorumlulukları</h2>
          <p className="text-slate-400">
            Kullanıcılar platform üzerinde küfür, hakaret, nefret söylemi içeren yanıtlar vermemeyi kabul eder. Aksi durumlarda hesabın erişimi kısıtlanabilir.
          </p>
        </section>
      </div>
    </div>
  );
}