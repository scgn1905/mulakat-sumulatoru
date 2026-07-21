import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const QUESTION_TIME_LIMIT = 180; // Soru başına 3 dakika

// KATEGORİLERE GÖRE 7'ŞER SORULUK BANKA
const questionsByCategory = {
  hr: [
    { id: 1, category: 'İnsan Kaynakları', question: 'Bize kendinizden ve kariyerinizde ulaşmak istediğiniz hedeflerden bahseder misiniz?', hint: 'Kısa özgeçmişinizden bahsettikten sonra pozisyonla örtüşen hedeflerinize odaklanın.', sampleFeedback: { score: 8, strengths: 'Net ve akıcı özgeçmiş özeti.', improvements: 'Somut başarı örnekleri eklenebilir.', idealAnswer: 'Kısaca tecrübelerimden bahsettikten sonra hedefimin teknik yetkinliklerimle ekibe değer katmak olduğunu söylerim.' } },
    { id: 2, category: 'İnsan Kaynakları', question: 'Takım içinde bir ekip arkadaşınızla fikir ayrılığı yaşadığınız anı ve nasıl çözdüğünüzü anlatır mısınız?', hint: 'STAR tekniğini kullanın. İletişime odaklanın.', sampleFeedback: { score: 9, strengths: 'İletişim odaklı yaklaşım.', improvements: 'Çıktı vurgulanabilir.', idealAnswer: 'Veriler üzerinden konuşarak kişiselleştirmeden ortak paydada buluşurum.' } },
    { id: 3, category: 'İnsan Kaynakları', question: 'Sıkışık bir teslim tarihi (deadline) ve beklenmedik sorunlar karşısında nasıl hareket edersiniz?', hint: 'Önceliklendirme ve şeffaf iletişim kurma becerinize vurgu yapın.', sampleFeedback: { score: 7.5, strengths: 'Soğukkanlı tutum.', improvements: 'Yöneticileri bilgilendirme adımı eklenebilir.', idealAnswer: 'Görevleri aciliyetine göre sıralar, kritik adımlara odaklanır ve ekibimle şeffaf iletişim kurarım.' } },
    { id: 4, category: 'İnsan Kaynakları', question: 'Geçmişte yaptığınız bir hatadan aldığınız en büyük ders neydi?', hint: 'Sorumluluk aldığınızı ve bu deneyimin sizi nasıl geliştirdiğini gösterin.', sampleFeedback: { score: 8, strengths: 'Sorumluluk alma bilinci.', improvements: 'Sonrasındaki kontrol mekanizmasından bahsedilebilir.', idealAnswer: 'Hatamı hızlıca üstlenip çözüm ürettim ve benzer durumlar için kontrol adımları ekledim.' } },
    { id: 5, category: 'İnsan Kaynakları', question: 'Neden bizim şirketimizde çalışmak istiyorsunuz?', hint: 'Şirketin vizyonu ve projeleri ile kendi değerlerinizi eşleştirin.', sampleFeedback: { score: 8.5, strengths: 'Şirket kültürüne uyum.', improvements: 'Spesifik projelere atıf yapılabilir.', idealAnswer: 'Şirketinizin yenilikçi vizyonu ve projeleri tecrübelerimle birebir örtüşüyor.' } },
    { id: 6, category: 'İnsan Kaynakları', question: 'Motive olmadığınız bir projede çalışma disiplininizi nasıl korursunuz?', hint: 'İçsel motivasyon, profesyonellik ve sorumluluk bilincini vurgulayın.', sampleFeedback: { score: 8, strengths: 'Disiplin ve sorumluluk vurgusu.', improvements: 'Küçük hedefler koyma stratejisi eklenebilir.', idealAnswer: 'Kişisel motivasyondan ziyade profesyonel sorumluluklarıma odaklanır, işi parçalara bölerek tamamlarım.' } },
    { id: 7, category: 'İnsan Kaynakları', question: 'Gelişime açık yönleriniz (zayıf yönleriniz) nelerdir ve bunlar üzerinde nasıl çalışıyorsunuz?', hint: 'Üzerinde aktif çalıştığınız bir yönünüzü dürüstçe paylaşın.', sampleFeedback: { score: 8.5, strengths: 'Öz farkındalık yüksek.', improvements: 'Aşmak için kullandığınız araçlardan bahsedilebilir.', idealAnswer: 'Aynı anda birden fazla işe odaklanmakta zorlanıyordum; bu yüzden Trello/Notion gibi araçlarla zaman yönetimi yapıyorum.' } }
  ],
  backend: [
    { id: 1, category: 'Java & Backend', question: 'Java’da HashMap ve ConcurrentHashMap arasındaki temel farklar nelerdir?', hint: 'Thread-safety ve kilit mekanizmalarına odaklanın.', sampleFeedback: { score: 8.5, strengths: 'Teknik terimler doğru.', improvements: 'Performance overhead konusuna değinilebilir.', idealAnswer: 'ConcurrentHashMap thread-safe yapısıyla segment/bucket bazlı kilitler kullanarak yüksek performans sunar.' } },
    { id: 2, category: 'Java & Backend', question: 'Spring Boot’ta @Component, @Service ve @Repository anatasyonları arasındaki fark nedir?', hint: 'Persistence katmanındaki Exception Translation mekanizmasını hatırlayın.', sampleFeedback: { score: 9, strengths: 'Katmanlı mimari hakimiyeti iyi.', improvements: 'Custom stereo-type kullanımı eklenebilir.', idealAnswer: '@Repository veritabanı hatalarını DataAccessException türüne çevirir, @Service iş mantığını temsil eder.' } },
    { id: 3, category: 'Java & Backend', question: 'ORM (Hibernate) kullanırken karşılaşılan N+1 problemi nedir ve nasıl çözülür?', hint: 'Lazy loading, Join Fetch ve Entity Graph çözümlerine değinin.', sampleFeedback: { score: 8, strengths: 'Problem tanımı net.', improvements: 'BatchSize seçeneği eklenebilir.', idealAnswer: 'Ana sorgunun ardından ilişkili her kayıt için ayrı sorgu atılmasıdır; Join Fetch veya EntityGraph ile çözülür.' } },
    { id: 4, category: 'Java & Backend', question: 'RESTful API tasarımında Idempotent metot ne anlama gelir? Hangi HTTP metotları idempotenttir?', hint: 'GET, PUT, DELETE metotlarının durum değiştirme özelliklerini düşünün.', sampleFeedback: { score: 8.5, strengths: 'HTTP standartları bilgisi tam.', improvements: 'POST ile PUT karşılaştırması netleştirilebilir.', idealAnswer: 'Aynı isteğin birden fazla kez atıldığında sunucu durumunda aynı sonucu üretmesidir; GET, PUT, DELETE idempotenttir.' } },
    { id: 5, category: 'Java & Backend', question: 'Veritabanı işlemlerinde ACID prensipleri neyi ifade eder?', hint: 'Atomicity, Consistency, Isolation ve Durability kavramlarını kısaca açıklayın.', sampleFeedback: { score: 9, strengths: 'Veritabanı teorisi sağlam.', improvements: 'Isolation seviyelerine değinilebilir.', idealAnswer: 'İşlemlerin ya hep ya hiç gerçekleşmesini ve veri bütünlüğünün korunmasını garanti eden prensiplerdir.' } },
    { id: 6, category: 'Java & Backend', question: 'Mikroservis mimarisinde Servis Keşfi (Service Discovery) ve API Gateway ne işe yarar?', hint: 'Eureka, Consul ve dinamik IP yönlendirmesi konularından bahsedin.', sampleFeedback: { score: 8.5, strengths: 'Dağıtık sistem bilinci yüksek.', improvements: 'Load balancing rolü vurgulanabilir.', idealAnswer: 'API Gateway tek giriş noktası sağlarken, Service Discovery servislerin dinamik IP ve portlarını yönetir.' } },
    { id: 7, category: 'Java & Backend', question: 'Java Garbage Collector (GC) nasıl çalışır ve Memory Leak durumları nasıl oluşabilir?', hint: 'Heap bellek ve kapatılmayan bağlantıları düşünün.', sampleFeedback: { score: 8, strengths: 'Bellek yönetimi hakimiyeti iyi.', improvements: 'GC algoritmalarına değinilebilir.', idealAnswer: 'Kullanılmayan nesneleri bellekten temizler. Kapatılmayan akışlar veya static referanslar bellek sızıntısına yol açabilir.' } }
  ],
  frontend: [
    { id: 1, category: 'Frontend & React', question: 'React Virtual DOM nedir ve Reconciliation (Uzlaştırma) süreci nasıl çalışır?', hint: 'Diffing algoritması ve render maliyetlerini düşünün.', sampleFeedback: { score: 8, strengths: 'Virtual DOM yapısı net.', improvements: 'Fiber mimarisi eklenebilir.', idealAnswer: 'React, yapılan değişiklikleri bellek içi Virtual DOM üzerinde karşılaştırıp sadece değişen kısımları gerçek DOM’a yansıtır.' } },
    { id: 2, category: 'Frontend & React', question: 'useEffect Hook’unda dependency array (bağımlılık dizisi) nasıl kullanılır ve yazılmazsa ne olur?', hint: 'Sonsuz döngü ve component lifecycle ilişkisine değinin.', sampleFeedback: { score: 8.5, strengths: 'Hook mekanizması anlaşılmış.', improvements: 'Cleanup function kullanım örneği eklenebilir.', idealAnswer: 'Dizi boşsa sadece mount anında çalışır; yazılmazsa her render sonrasında tekrar çalışarak performans sorunlarına yol açabilir.' } },
    { id: 3, category: 'Frontend & React', question: 'JavaScript’te Closure kavramı nedir? Bir kullanım senaryosu örneği verin.', hint: 'Dış fonksiyona ait değişkenlerin iç fonksiyon tarafından hatırlanmasını düşünün.', sampleFeedback: { score: 9, strengths: 'Temel JS bilgisi güçlü.', improvements: 'Encapsulation örneği verilebilir.', idealAnswer: 'Bir fonksiyonun, kendi kapsama alanı dışındaki değişkenleri fonksiyon çalışmasını bitirse bile hatırlayabilmesidir.' } },
    { id: 4, category: 'Frontend & React', question: 'Web performansını artırmak için ne tür optimizasyon teknikleri uygularsınız?', hint: 'useMemo, useCallback, React.lazy ve bundle splitting konularından bahsedin.', sampleFeedback: { score: 8.5, strengths: 'Performans odaklı yaklaşım.', improvements: 'Web Vitals metrikleri eklenebilir.', idealAnswer: 'Gereksiz render’ları önlemek için useMemo/useCallback, büyük bileşenler için React.lazy ve code splitting kullanırım.' } },
    { id: 5, category: 'Frontend & React', question: 'State Management için Redux Toolkit veya Context API ne zaman tercih edilmelidir?', hint: 'Uygulama ölçeği ve re-render maliyetlerini kıyaslayın.', sampleFeedback: { score: 8, strengths: 'Mimari karar verme becerisi iyi.', improvements: 'Zustand gibi alternatifler anılabilir.', idealAnswer: 'Küçük ve orta ölçekli uygulamalarda Context API yeterliyken, karmaşık state yapılarında Redux Toolkit tercih edilir.' } },
    { id: 6, category: 'Frontend & React', question: 'CSS Grid ve Flexbox arasındaki temel kullanım farkı nedir?', hint: 'Tek boyutlu (1D) ve iki boyutlu (2D) yerleşim mantığını karşılaştırın.', sampleFeedback: { score: 8.5, strengths: 'CSS düzenleme bilgisi tam.', improvements: 'Responsive tasarım uyumu eklenebilir.', idealAnswer: 'Flexbox tek boyutlu hizalamalar için, CSS Grid ise iki boyutlu sayfa düzenleri içindir.' } },
    { id: 7, category: 'Frontend & React', question: 'HTTP isteklerinde Debounce ve Throttle teknikleri ne amaçla kullanılır?', hint: 'Arama kutusu ve sayfa kaydırma olaylarını düşünün.', sampleFeedback: { score: 9, strengths: 'Kullanıcı deneyimi bilinci yüksek.', improvements: 'Lodash gibi kütüphaneler anılabilir.', idealAnswer: 'Debounce kullanıcı yazmayı bitirene kadar bekler, Throttle ise belirten zaman aralığında isteği en fazla bir kez tetikler.' } }
  ],
  data: [
    { id: 1, category: 'Veri Bilimi', question: 'Overfitting (Aşırı Öğrenme) nedir ve modeli bundan korumak için hangi yöntemler kullanılır?', hint: 'Cross-Validation, L1/L2 regülasyonu ve Dropout tekniklerini hatırlayın.', sampleFeedback: { score: 8.8, strengths: 'Çözüm yöntemleri eksiksiz.', improvements: 'Data augmentation eklenebilir.', idealAnswer: 'Modelin eğitim verisini ezberlemesidir. Cross-validation, L1/L2 regülasyonu ve budama ile engellenir.' } },
    { id: 2, category: 'Veri Bilimi', question: 'Eksik verilerle karşılaştığınızda izlediğiniz veri ön işleme adımları nelerdir?', hint: 'Mean/Median Imputation veya KNN Imputation stratejilerini değerlendirin.', sampleFeedback: { score: 8.5, strengths: 'Ön işleme hakimiyeti iyi.', improvements: 'MCAR/MAR tipleri belirtilebilir.', idealAnswer: 'Eksik veri oranına göre silme yapabilir veya sayısal değişkenlerde median, kategorik değişkenlerde mod ile doldurma uygularım.' } },
    { id: 3, category: 'Veri Bilimi', question: 'Sınıflandırma modellerinde Accuracy metriği ne zaman yanıltıcı olur? Hangi metrikler tercih edilmelidir?', hint: 'Dengesiz veri kümeleri, Precision, Recall ve F1-Score konularına odaklanın.', sampleFeedback: { score: 9, strengths: 'Model değerlendirme hassasiyeti yüksek.', improvements: 'ROC-AUC eğrisi vurgulanabilir.', idealAnswer: 'Dengesiz veri setlerinde yanıltıcıdır. Precision, Recall ve F1-Score kullanılır.' } },
    { id: 4, category: 'Veri Bilimi', question: 'Supervised ve Unsupervised Öğrenme arasındaki temel fark nedir?', hint: 'Etiketli veri kullanımı ve k-Means/Random Forest örneklerini verin.', sampleFeedback: { score: 8.5, strengths: 'Temel teorik altyapı sağlam.', improvements: 'Semi-supervised öğrenmeye değinilebilir.', idealAnswer: 'Gözetimli öğrenmede etiketli veri kullanılır; gözetimsiz öğrenmede etiket yoktur, kümeleme yapılır.' } },
    { id: 5, category: 'Veri Bilimi', question: 'Veri analizinde P-value (P-değeri) nedir ve hipotez testlerinde nasıl yorumlanır?', hint: 'Sıfır hipotezi (H0) ve %5 anlamlılık düzeyini düşünün.', sampleFeedback: { score: 8, strengths: 'İstatistiksel kavramlar net.', improvements: 'Type I ve Type II hatalarına atıf yapılabilir.', idealAnswer: 'Sıfır hipotezinin doğru olduğu varsayımı altında elde edilen sonucun olasılığıdır. 0.05’ten küçükse H0 reddedilir.' } },
    { id: 6, category: 'Veri Bilimi', question: 'Random Forest ve Gradient Boosting algoritmaları arasındaki fark nedir?', hint: 'Bagging ve Boosting yaklaşımlarını karşılaştırın.', sampleFeedback: { score: 9, strengths: 'ML algoritmaları hakimiyeti tam.', improvements: 'Paralelleştirme farkları belirtilebilir.', idealAnswer: 'Random Forest ağaçları bağımsız ve paralel kurarken (Bagging), Gradient Boosting ağaçları sıralı kurarak hataları düzeltir (Boosting).' } },
    { id: 7, category: 'Veri Bilimi', question: 'PCA (Temel Bileşenler Analizi) ne amaçla kullanılır ve nasıl çalışır?', hint: 'Boyut indirgeme ve varyans koruma ilkelerini açıklayın.', sampleFeedback: { score: 8.5, strengths: 'Boyut indirgeme kavramı iyi.', improvements: 'Özdeğer/Özvektör mantığı eklenebilir.', idealAnswer: 'Yüksek boyutlu verilerdeki bilgi kaybını en aza indirerek veriyi daha az boyutlu bileşenlere dönüştürür.' } }
  ],
  devops: [
    { id: 1, category: 'DevOps & Bulut', question: 'Docker Container ve Sanal Makine (VM) arasındaki temel mimari fark nedir?', hint: 'Hypervisor kullanımı ve İşletim Sistemi sanallaştırmasını kıyaslayın.', sampleFeedback: { score: 8.5, strengths: 'Sanallaştırma mantığı net.', improvements: 'Kaynak kullanımı kıyası eklenebilir.', idealAnswer: 'Sanal makineler kendi OS’ine sahipken, Docker container’lar host işletim sisteminin çekirdeğini paylaşır.' } },
    { id: 2, category: 'DevOps & Bulut', question: 'CI/CD boru hattının amacı nedir?', hint: 'Otomatik testler, derleme ve dağıtım adımlarından bahsedin.', sampleFeedback: { score: 9, strengths: 'Süreç yönetimi hakimiyeti iyi.', improvements: 'GitHub Actions örnekleri eklenebilir.', idealAnswer: 'Kod değişikliklerinin otomatik test edilip derlenmesini ve kesintisiz olarak canlı ortama aktarılmasını sağlar.' } },
    { id: 3, category: 'DevOps & Bulut', question: 'Kubernetes üzerinde Pod, Deployment ve Service kavramları neyi ifade eder?', hint: 'En küçük ölçeklenebilir birim ve ağ yönlendirme katmanlarını açıklayın.', sampleFeedback: { score: 8.5, strengths: 'Kubernetes temelleri sağlam.', improvements: 'Ingress bileşeni anılabilir.', idealAnswer: 'Pod en küçük birimdir, Deployment pod’ları yönetir, Service ise pod’lara kararlı ağ erişimi sağlar.' } },
    { id: 4, category: 'DevOps & Bulut', question: 'Infrastructure as Code (IaC) nedir ve Terraform ne avantaj sağlar?', hint: 'Sürüm kontrolü ve bildirimsel yapıdan bahsedin.', sampleFeedback: { score: 8.5, strengths: 'Altyapı yönetimi vizyonu güçlü.', improvements: 'State file yönetimi eklenebilir.', idealAnswer: 'Altyapının kod ile tanımlanmasıdır. Terraform altyapı kurulumunu otomatikleştirir ve sürümlenebilir kılar.' } },
    { id: 5, category: 'DevOps & Bulut', question: 'Blue-Green Deployment stratejisi nasıl çalışır?', hint: 'Sıfır kesinti süresi ve geriye dönük hızlı rollback imkanını açıklayın.', sampleFeedback: { score: 8, strengths: 'Yayınlama stratejileri bilgisi iyi.', improvements: 'Canary Deployment ile kıyaslanabilir.', idealAnswer: 'İki özdeş ortam bulunur; canlı trafik Blue’da iken yeni sürüm Green’e kurulur ve trafik anında Green’e aktarılır.' } },
    { id: 6, category: 'DevOps & Bulut', question: 'Linux sistemlerde CPU/Bellek kullanımını izlemek ve bir süreci sonlandırmak için hangi komutlar kullanılır?', hint: 'top, htop, ps, kill komutlarını hatırlayın.', sampleFeedback: { score: 9, strengths: 'Linux komut satırı bilgisi tam.', improvements: 'kill -9 farkı anılabilir.', idealAnswer: 'Sistem durumu top veya htop ile izlenir; süreç PID değeri tespit edilerek kill ile sonlandırılır.' } },
    { id: 7, category: 'DevOps & Bulut', question: 'Bulut bilişimde IaaS, PaaS ve SaaS modelleri arasındaki fark nedir?', hint: 'Sorumluluk paylaşımı ve AWS EC2 / Heroku / Google Docs örneklerini verin.', sampleFeedback: { score: 8.5, strengths: 'Bulut modelleri net.', improvements: 'Serverless örneği eklenebilir.', idealAnswer: 'IaaS ham sunucu altyapısı, PaaS uygulama geliştirme platformu, SaaS ise kullanıma hazır yazılımdır.' } }
  ],
  cyber: [
    { id: 1, category: 'Siber Güvenlik', question: 'SQL Injection zafiyeti nedir ve kod seviyesinde nasıl önlenir?', hint: 'Parameterized Queries ve Prepared Statement kullanımına odaklanın.', sampleFeedback: { score: 9, strengths: 'Zafiyet analizi net.', improvements: 'ORM koruması eklenebilir.', idealAnswer: 'Kötü niyetli SQL kodlarının girdi alanlarına enjekte edilmesidir; Prepared Statements kullanılarak önlenir.' } },
    { id: 2, category: 'Siber Güvenlik', question: 'XSS (Cross-Site Scripting) türleri nelerdir ve nasıl engellenir?', hint: 'Girdi doğrulama ve Content Security Policy (CSP) konularına değinin.', sampleFeedback: { score: 8.5, strengths: 'XSS çeşitleri doğru.', improvements: 'HttpOnly cookie bayrağı anılabilir.', idealAnswer: 'Kullanıcı tarayıcısında zararlı JS çalıştırılmasıdır; girdi temizleme ve CSP kuralları ile engellenir.' } },
    { id: 3, category: 'Siber Güvenlik', question: 'Simetrik ve Asimetrik Şifreleme arasındaki fark nedir?', hint: 'AES ve RSA algoritmalarını karşılaştırın.', sampleFeedback: { score: 8.5, strengths: 'Kriptoloji temelleri sağlam.', improvements: 'Hybrid encryption mantığı eklenebilir.', idealAnswer: 'Simetrik şifrelemede tek gizli anahtar kullanılır; asimetrik şifrelemede ise Public ve Private iki anahtar bulunur.' } },
    { id: 4, category: 'Siber Güvenlik', question: 'Man-in-the-Middle (MitM) saldırısı nedir ve HTTPS bunu nasıl önler?', hint: 'SSL/TLS sertifikaları ve şifreli veri aktarımını açıklayın.', sampleFeedback: { score: 8, strengths: 'Ağ güvenliği bilgisi iyi.', improvements: 'HSTS başlığı anılabilir.', idealAnswer: 'Saldırganın trafiği dinlemesidir; HTTPS veriyi TLS ile şifreleyerek ve sertifika doğrulayarak MitM’i engeller.' } },
    { id: 5, category: 'Siber Güvenlik', question: 'CSRF (Cross-Site Request Forgery) saldırısı nasıl gerçekleşir ve Anti-CSRF Token nasıl koruma sağlar?', hint: 'Kullanıcının oturum çerezlerini kullanarak izinsiz istek atılmasını düşünün.', sampleFeedback: { score: 8.5, strengths: 'Oturum güvenliği hakimiyeti iyi.', improvements: 'SameSite cookie ayarları eklenebilir.', idealAnswer: 'Kullanıcı adına izinsiz istek yapılmasıdır; her isteğe özel rastgele üretilen Anti-CSRF token doğrulaması ile engellenir.' } },
    { id: 6, category: 'Siber Güvenlik', question: 'Sızma testinde Reconnaissance (Keşif) aşaması neleri kapsar?', hint: 'OSINT ve Nmap port tarama tekniklerini belirtin.', sampleFeedback: { score: 9, strengths: 'Pentest adımları hakimiyeti yüksek.', improvements: 'DNS enumeration araçları anılabilir.', idealAnswer: 'Hedef hakkında bilgi toplama aşamasıdır; Nmap, WHOIS ve açık kaynak istihbarat araçları kullanılır.' } },
    { id: 7, category: 'Siber Güvenlik', question: 'Zero-Day (Sıfırıncı Gün) zafiyeti ne anlama gelir?', hint: 'Geliştiricinin henüz yamalamadığı ve duyurulmamış açıkları düşünün.', sampleFeedback: { score: 8.5, strengths: 'Güvenlik literatürü bilgisi tam.', improvements: 'Yama yönetimi eklenebilir.', idealAnswer: 'Yazılım üreticisi tarafından henüz bilinmeyen veya yaması yayımlanmamış güvenlik zafiyetleridir.' } }
  ],
  product: [
    { id: 1, category: 'Ürün Yönetimi', question: 'Scrum çerçevesinde Sprint Planning, Daily Standup ve Retrospective toplantılarının amaçları nelerdir?', hint: 'Agile süreç yönetimi ve sürekli iyileştirme halkasını açıklayın.', sampleFeedback: { score: 9, strengths: 'Agile ritüelleri hakimiyeti tam.', improvements: 'Sprint Review anılabilir.', idealAnswer: 'Planning hedefleri belirler, Daily günlük engelleri çözmeye odaklanır, Retrospective süreçteki hatalardan ders çıkarır.' } },
    { id: 2, category: 'Ürün Yönetimi', question: 'Bir ürün özelliğini önceliklendirirken hangi metodolojileri (MoSCoW, RICE) kullanırsınız?', hint: 'RICE hesaplamalarını veya MoSCoW yapısını düşünün.', sampleFeedback: { score: 8.5, strengths: 'Önceliklendirme teknikleri net.', improvements: 'Kano Modeli eklenebilir.', idealAnswer: 'RICE skoru ile etki ve efor oranını hesaplar veya MoSCoW yöntemiyle kritik ihtiyaçları önceliklendiririm.' } },
    { id: 3, category: 'Ürün Yönetimi', question: 'MVP (Minimum Viable Product) nedir ve ne zaman yayınlanmalıdır?', hint: 'Pazardan ve kullanıcılardan doğrulama alma amacını açıklayın.', sampleFeedback: { score: 8.5, strengths: 'Ürün stratejisi bilinci yüksek.', improvements: 'Feedback kalitesi vurgulanabilir.', idealAnswer: 'Temel değeri sunan en küçük ürün sürümüdür; pazardaki hipotezleri hızlıca doğrulamak için yayınlanır.' } },
    { id: 4, category: 'Ürün Yönetimi', question: 'Ürün başarısını ölçmek için kullanılan temel KPI ve Metrikler nelerdir?', hint: 'Churn, Retention, LTV, CAC metriklerini açıklayın.', sampleFeedback: { score: 9, strengths: 'Veri odaklı karar verme altyapısı sağlam.', improvements: 'NPS skoru eklenebilir.', idealAnswer: 'Retention kullanıcı bağlılığını, Churn kayıp oranını, CAC kazanım maliyetini, LTV kullanıcının değerini ölçer.' } },
    { id: 5, category: 'Ürün Yönetimi', question: 'Yazılım ekibi ve tasarım ekibi (UI/UX) arasındaki iletişim aksaklıklarını nasıl yönetirsiniz?', hint: 'Erken katılım ve şeffaf iletişim yaklaşımını benimseyin.', sampleFeedback: { score: 8, strengths: 'Paydaş yönetimi becerisi iyi.', improvements: 'Design System etkisi belirtilebilir.', idealAnswer: 'Tasarımcıları sürecin başında teknik ekiple buluşturur, şeffaf iletişim ve veri odaklı kararlarla uzlaşı sağlarım.' } },
    { id: 6, category: 'Ürün Yönetimi', question: 'Kullanıcı Geri Bildirimleri ile Şirket Stratejisi çeliştiğinde nasıl karar verirsiniz?', hint: 'Kısa vadeli talepler ile uzun vadeli vizyon dengesini kurun.', sampleFeedback: { score: 8.5, strengths: 'Stratejik bakış açısı güçlü.', improvements: 'A/B test uygulaması eklenebilir.', idealAnswer: 'Geri bildirimleri veriyle analiz eder, şirketin uzun vadeli vizyonunu ve iş değerini riske atmayacak çözümler üretirim.' } },
    { id: 7, category: 'Ürün Yönetimi', question: 'A/B Testi nedir ve bir A/B testi kurgularken nelere dikkat edilmelidir?', hint: 'Tek bir değişken değiştirme ve örneklem büyüklüğü konularını açıklayın.', sampleFeedback: { score: 8.8, strengths: 'Deneysel ürün geliştirme hakimiyeti iyi.', improvements: 'Hipotez cümlesi kurulması vurgulanabilir.', idealAnswer: 'İki farklı versiyonun performansını kıyaslamaktır; tek bir değişken değiştirmeye ve yeterli örneklem sayısına dikkat edilmelidir.' } }
  ]
};

export default function Interview() {
  const location = useLocation();
  const categoryId = location.state?.categoryId || 'hr';
  const mockQuestions = questionsByCategory[categoryId] || questionsByCategory.hr;

  // LOBİ (YÖNERGE & ONAY) DURUMU
  const [isLobbyAccepted, setIsLobbyAccepted] = useState(false);
  const [isRulesChecked, setIsRulesChecked] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [evaluations, setEvaluations] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);

  const currentQuestion = mockQuestions[currentIndex];
  const currentAnswer = answers[currentQuestion.id] || '';
  const currentEvaluation = evaluations[currentQuestion.id];

  // Sadece lobi kabul edildikten sonra sayacı çalıştır
  useEffect(() => {
    if (!isLobbyAccepted || isCompleted) return;
    setTimeLeft(QUESTION_TIME_LIMIT);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex, isCompleted, isLobbyAccepted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'tr-TR';
      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: prev[currentQuestion.id] ? `${prev[currentQuestion.id]} ${transcript}` : transcript
        }));
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [currentQuestion.id]);

  const toggleListening = () => {
    if (!recognitionRef.current) return alert('Ses tanıma desteklenmiyor. Chrome önerilir.');
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleEvaluate = () => {
    if (!currentAnswer.trim()) return;
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      setEvaluations({ ...evaluations, [currentQuestion.id]: currentQuestion.sampleFeedback });
      setIsAnalyzing(false);
    }, 1000);
  };

  const handleNext = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setShowHint(false);
    if (currentIndex < mockQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setShowHint(false);
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  // -------------------------------------------------------------
  // LOBİ (PRE-INTERVIEW LOBBY) EKRANI
  // -------------------------------------------------------------
  if (!isLobbyAccepted) {
    return (
      <div className="max-w-2xl mx-auto my-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
            🎯
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Mülakat Hazırlık Odası</h2>
          <p className="text-xs text-gray-500">
            Seçtiğiniz <strong className="text-blue-600">{mockQuestions[0]?.category}</strong> simülasyonuna başlamak üzeresiniz.
          </p>
        </div>

        {/* Yönergeler Kutusu */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3 leading-relaxed">
          <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
            📋 Simülasyon Yönergeleri & Kurallar:
          </h4>
          <ul className="space-y-2 text-gray-700 list-disc list-inside">
            <li>Bu simülasyonda toplam <strong>7 özel soru</strong> yer almaktadır.</li>
            <li>Her bir soru için verilen düşünme ve yanıt süresi <strong>3 dakikadır (180 saniye)</strong>.</li>
            <li>Yanıtlarınızı doğrudan klavyeden yazabilir veya 🎤 <strong>Sesle Yanıt Ver</strong> butonuna basarak konuşabilirsiniz.</li>
            <li>Her yanıtın ardından <strong>"⚡ Cevabımı Değerlendir"</strong> butonuna basarak anlık yapay zeka analiz skoru alabilirsiniz.</li>
            <li>Süre dolduğunda otomatik olarak bir sonraki soruya geçilecektir.</li>
          </ul>
        </div>

        {/* Kural Onay Kutusu */}
        <div className="flex items-center gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
          <input
            type="checkbox"
            id="acceptRules"
            checked={isRulesChecked}
            onChange={(e) => setIsRulesChecked(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor="acceptRules" className="text-xs font-semibold text-gray-800 cursor-pointer select-none">
            Mülakat yönergelerini ve süre kurallarını okudum, kabul ediyorum.
          </label>
        </div>

        {/* Başlat Butonları */}
        <div className="flex justify-between items-center pt-2">
          <Link
            to="/profile"
            className="text-xs font-semibold text-gray-500 hover:text-gray-800"
          >
            ← Kategorilere Dön
          </Link>

          <button
            onClick={() => setIsLobbyAccepted(true)}
            disabled={!isRulesChecked}
            className={`px-8 py-3 rounded-xl font-bold text-sm shadow-md transition-all ${
              isRulesChecked
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Mülakatı Başlat →
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MÜLAKAT SONUÇ / RAPOR EKRANI
  // -------------------------------------------------------------
  if (isCompleted) {
    const evaluatedScores = Object.values(evaluations).map((e) => e.score);
    const userAvg = evaluatedScores.length
      ? Number((evaluatedScores.reduce((a, b) => a + b, 0) / evaluatedScores.length).toFixed(1))
      : 0;

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
            📊
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">{currentQuestion.category} Mülakat Raporu</h2>
          <p className="text-gray-500 max-w-lg mx-auto text-sm">
            Tüm 7 soruluk mülakat simülasyonunu tamamladınız. Bireysel performansınız aşağıdadır.
          </p>

          <div className="inline-flex items-center gap-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 px-8 py-4 rounded-2xl">
            <div className="text-left">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">
                Genel Puanınız
              </span>
              <span className="text-3xl font-black text-gray-900">{userAvg} / 10</span>
            </div>
            <div className="h-10 w-px bg-blue-200"></div>
            <div className="text-left text-xs space-y-1">
              <p className="text-gray-600"><strong>Toplam Soru:</strong> 7</p>
              <p className="text-gray-600"><strong>Değerlendirilen:</strong> {evaluatedScores.length}</p>
            </div>
          </div>
        </div>

        {/* DETAYLI CEVAP LİSTESİ */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 px-2">Soru Detayları ve Analizler</h3>
          {mockQuestions.map((q, idx) => {
            const userAnswer = answers[q.id];
            const evaluation = evaluations[q.id];

            return (
              <div key={q.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      Soru {idx + 1} / 7 • {q.category}
                    </span>
                    <h4 className="text-base font-bold text-gray-900 pt-1">{q.question}</h4>
                  </div>
                  {evaluation ? (
                    <span className="bg-purple-100 text-purple-800 text-xs font-extrabold px-3 py-1.5 rounded-xl whitespace-nowrap">
                      {evaluation.score} / 10
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1 rounded-xl whitespace-nowrap">
                      Değerlendirilmedi
                    </span>
                  )}
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                  <span className="font-bold text-gray-700 block mb-1">Verdiğiniz Yanıt:</span>
                  <p className="text-gray-600 leading-relaxed italic">
                    {userAnswer ? `"${userAnswer}"` : 'Bu soruya yanıt girilmedi.'}
                  </p>
                </div>

                {evaluation && (
                  <div className="grid md:grid-cols-2 gap-4 text-xs pt-1">
                    <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                      <span className="font-bold text-emerald-800 block mb-1">👍 Güçlü Yönler</span>
                      <p className="text-emerald-900">{evaluation.strengths}</p>
                    </div>
                    <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl">
                      <span className="font-bold text-amber-800 block mb-1">💡 Geliştirilebilir Alanlar</span>
                      <p className="text-amber-900">{evaluation.improvements}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center items-center gap-4 pt-4">
          <button
            onClick={() => window.print()}
            className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm shadow-md"
          >
            🖨️ Raporu Yazdır / PDF İndir
          </button>
          <Link
            to="/profile"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm shadow-md"
          >
            Kategorilere Dön
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MÜLAKAT EKRANI
  // -------------------------------------------------------------
  const progressPercent = Math.round(((currentIndex + 1) / mockQuestions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Üst Bilgi ve İlerleme Çubuğu */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
        <div className="flex justify-between items-center text-sm font-semibold text-gray-600">
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">
            Kategori: {currentQuestion.category}
          </span>
          <span className={`px-3 py-1 rounded-lg ${timeLeft <= 30 ? 'bg-red-100 text-red-600 font-bold animate-pulse' : 'bg-amber-50 text-amber-700'}`}>
            ⏱️ {formatTime(timeLeft)}
          </span>
          <span>Soru {currentIndex + 1} / 7</span>
        </div>
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Soru Kartı */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 leading-snug">
            {currentQuestion.question}
          </h3>
          <button
            onClick={() => setShowHint(!showHint)}
            className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
          >
            {showHint ? 'İpucunu Gizle' : '💡 Teknik İpucu Göster'}
          </button>
          {showHint && (
            <div className="mt-3 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs leading-relaxed">
              {currentQuestion.hint}
            </div>
          )}
        </div>

        {/* Yanıt Alanı */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">Yanıtınız</label>
            <button
              type="button"
              onClick={toggleListening}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{isListening ? '🎙️' : '🎤'}</span>
              {isListening ? 'Dinleniyor... (Durdur)' : 'Sesle Yanıt Ver'}
            </button>
          </div>

          <textarea
            rows={5}
            value={currentAnswer}
            onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
            placeholder={isListening ? 'Sizi dinliyorum...' : 'Cevabınızı buraya yazın veya mikrofon butonuna basarak konuşun...'}
            className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none transition-colors ${
              isListening ? 'border-red-400 bg-red-50/20' : 'border-gray-200'
            }`}
          />
        </div>

        {/* Değerlendirme Butonu */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleEvaluate}
            disabled={!currentAnswer.trim() || isAnalyzing}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              !currentAnswer.trim() || isAnalyzing
                ? 'bg-purple-100 text-purple-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md'
            }`}
          >
            {isAnalyzing ? 'Değerlendiriliyor...' : '⚡ Cevabımı Değerlendir'}
          </button>
        </div>

        {/* Değerlendirme Sonucu */}
        {currentEvaluation && (
          <div className="p-6 bg-slate-50 border border-purple-100 rounded-2xl space-y-3 text-xs leading-relaxed">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <h4 className="font-bold text-gray-900">🎯 Yanıt Analizi</h4>
              <span className="bg-purple-100 text-purple-800 font-extrabold px-3 py-1 rounded-full">
                Skor: {currentEvaluation.score} / 10
              </span>
            </div>
            <div>
              <span className="font-bold text-emerald-700">👍 Güçlü Yönler: </span>
              <span className="text-gray-700">{currentEvaluation.strengths}</span>
            </div>
            <div>
              <span className="font-bold text-amber-700">💡 Geliştirilebilir Alanlar: </span>
              <span className="text-gray-700">{currentEvaluation.improvements}</span>
            </div>
          </div>
        )}

        {/* Gezinme Butonları */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
              currentIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Önceki Soru
          </button>

          <button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm shadow-md"
          >
            {currentIndex === mockQuestions.length - 1 ? 'Mülakatı Bitir ve Raporu Gör' : 'Sonraki Soru →'}
          </button>
        </div>
      </div>
    </div>
  );
}