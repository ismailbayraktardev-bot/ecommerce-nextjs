# Proje Başlangıç Prompt'u

Bu dokümanda, yeni isimlendirilen AI ekibimiz ile projeye nasıl başlayacağımızı gösteren master prompt bulunur.

## 🚀 Master Starting Prompt

```
🎯 PROJE BAŞLIYOR: Modern Panel & Page Builder Sistemi

👥 EKİBİMİZ:
• ARDA - Backend & Database Uzmanı (Gemini Code Assist)
• LUNA - Frontend & UI/UX Uzmanı (GPT Codex)  
• DENİZ - DevOps & Entegrasyon Uzmanı (Cloud Code)

📋 PROJE VİZYONU:
E-ticaret ve kurumsal web siteleri için modüler tema sistemi + drag-and-drop page builder geliştiriyoruz. Tek ana tema altyapısı üzerinde 8 farklı demo varyantı (4 e-ticaret + 4 kurumsal) sunacağız.

⚙️ TEKNOLOJİ MİMARİSİ:
• Backend: Next.js 15 + Prisma + PostgreSQL + NextAuth.js v5
• Frontend: Next.js 15 + React 19 + Tailwind + Shadcn/ui + @dnd-kit
• DevOps: Vercel + GitHub Actions + Cloudinary + Monitoring

🔄 İŞBİRLİĞİ WORKFLOW'U:
1. Her AI uzmanı kendi alanında görev alır
2. Git commit'leri ile kod paylaşımı yaparız  
3. API contract'ları ve handoff'lar belirli formatlarla gerçekleşir
4. Sprint-based çalışma düzeni benimseriz

🎯 İLK GÖREV ATAMALARI:

ARDA'YA GÖREV:
"Arda, projenin temel backend altyapısını kuracaksın. 
1. eCommerce/backend/ dizininde Next.js projesi oluştur
2. Prisma schema tasarla (User, Site, Page, Block, Media, Demo modelleri)
3. İlk database migration'ını yap
4. Temel authentication API'lerini hazırla (NextAuth.js v5)

Detayları backend-project-setup.md dosyasında bulabilirsin."

LUNA'YA GÖREV:
"Luna, modern ve responsive frontend foundation'ını oluşturacaksın.
1. eCommerce/frontend/ dizininde Next.js projesi kur
2. Tailwind CSS + Shadcn/ui setup'ını tamamla
3. Dashboard layout component'lerini oluştur
4. Authentication form'larını (login/signup) tasarla

Detayları frontend-project-setup.md dosyasında bulabilirsin."

DENİZ'E GÖREV:
"Deniz, development environment ve CI/CD foundation'ını hazırlayacaksın.
1. Git repository konfigürasyonunu yap
2. Docker containerization setup'ı
3. Temel GitHub Actions workflow'unu oluştur  
4. Environment variables yönetimini kur

İlk sprint sonunda production-ready deployment pipeline'ı hazır olsun."

🔄 KOORDİNASYON KURALLARI:
• Her görev tamamlandığında git commit + progress update
• API değişikliklerinde ilgili team member'ları bilgilendir
• Daily standup: Her AI'nin tamamladığı ve sonraki planı
• Handoff format: Standart JSON schemas + documentation

🎯 İLK SPRİNT HEDEF:
2 hafta sonunda:
• Çalışan authentication sistemi
• Temel dashboard interface  
• Database ile API connection
• CI/CD pipeline foundation
• Development environment tam hazır

BAŞLAYALIM! İlk olarak ARDA görevini tamamlasın, ardından LUNA ve DENİZ paralel çalışabilir.
```

## 📋 Görev Verme Format'ı

Her AI'ya görev verirken aşağıdaki format'ı kullan:

```
🎯 [AD] GÖREVI: [Görev Başlığı]

📋 CONTEXT: [Mevcut proje durumu, hangi aşamada olduğumuz]

🔧 DETAYLAR: [Spesifik yapılacaklar listesi]

📊 DELIVERABLES: [Beklenen çıktılar]

⚡ ÖNEMLİ: [Dikkat edilmesi gereken noktalar]

🤝 TEAM HANDOFF: [Diğer ekip üyelerine ne vereceğin]
```

## 🔄 Progress Tracking Template

```
📊 SPRİNT PROGRESS UPDATE

ARDA DURUMU:
✅ Tamamlanan: [...]
🔄 Devam eden: [...]  
📋 Sonraki: [...]

LUNA DURUMU:
✅ Tamamlanan: [...]
🔄 Devam eden: [...]
📋 Sonraki: [...]

DENİZ DURUMU:  
✅ Tamamlanan: [...]
🔄 Devam eden: [...]
📋 Sonraki: [...]

🔗 EKİP SİNERJİSİ:
• ARDA → LUNA handoff: [...]
• LUNA → DENİZ handoff: [...]  
• DENİZ → TEAM feedback: [...]

📈 SONRAKI ADIMLAR:
[Sprint'teki sıradaki major milestone]
```

Bu master prompt ile projeye organized ve coordinate bir şekilde başlayabiliriz. Her AI uzmanının rolü net, görevleri tanımlı ve işbirliği protokolleri belirlenmiş durumda! 🚀