# 🚀 Gradiator CMS - Kullanım Kılavuzu

## 📋 İçindekiler
1. [Hızlı Başlangıç](#hızlı-başlangıç)
2. [Admin Girişi](#admin-girişi)
3. [Site Yönetimi](#site-yönetimi)
4. [Sayfa Oluşturma](#sayfa-oluşturma)
5. [Page Builder Kullanımı](#page-builder-kullanımı)
6. [Medya Yükleme](#medya-yükleme)

---

## 🎯 Hızlı Başlangıç

### 1. Backend Başlat
```bash
cd back-end/panel-backend
npm run dev
```
**Port:** http://localhost:3001

### 2. Frontend Başlat
```bash
cd front-end/panel-frontend
npm run dev
```
**Port:** http://localhost:3100

### 3. Admin Hesabı Oluştur (İlk Kullanım)
```bash
cd back-end/panel-backend
npx prisma db seed
```

---

## 🔐 Admin Girişi

### Test Admin Hesabı:
```
Email: admin@gradiator.com
Şifre: Admin123!
```

### Giriş Adımları:
1. Tarayıcıda http://localhost:3100 aç
2. `/login` sayfasına git
3. Admin email ve şifresini gir
4. "Giriş Yap" tıkla
5. Dashboard'a yönlendirileceksin

### Yeni Hesap Oluşturma:
1. `/register` sayfasına git
2. Formumu doldur:
   - **Ad:** İsmin
   - **Soyad:** Soyadin
   - **Email:** Email adresin
   - **Şifre:** En az 6 karakter
   - **Şifre Tekrar:** Aynı şifre
   - ✅ Kullanım şartlarını kabul et
3. "Hesap Oluştur" tıkla
4. Otomatik giriş yapılır

---

## 🌐 Site Yönetimi

### Yeni Site Oluştur

#### 1. Site Listesine Git
- Dashboard → "Sitelerim" veya
- Direkt `/sites` URL'sine git

#### 2. "Yeni Site Oluştur" Tıkla
Form alanları:
```
✏️ Site Adı* (zorunlu)
   Örnek: "E-Ticaret Sitem"

📝 Açıklama (opsiyonel)
   Örnek: "Online mağazam için web sitesi"

🌐 Subdomain (opsiyonel)
   Örnek: "magaza" → magaza.gradiator.com

   ⚠️ Kurallar:
   - Sadece küçük harf
   - Rakam kullanabilirsin
   - Tire (-) kullanabilirsin
   - Boşluk OLMAZ

🔗 Özel Domain (opsiyonel)
   Örnek: "magaza.com"

   ⚠️ DNS ayarlarını yapman gerekir
```

#### 3. "Site Oluştur" Tıkla
- Site edit sayfasına yönlendirilirsin
- Buradan site ayarlarını düzenleyebilirsin

### Site Düzenle

#### Site Edit Sayfasında:
```
📊 Site İstatistikleri
   - Sayfa sayısı
   - Medya dosyası sayısı

⚙️ Site Ayarları
   - Site adını değiştir
   - Açıklamayı güncelle
   - Domain ayarları

🔴 Tehlikeli Bölge
   - Siteyi sil (GERİ ALINAMAZ!)
```

#### Hızlı Linkler:
- **Sayfaları Yönet** → Pages list
- **Medya Kütüphanesi** → Media library

---

## 📄 Sayfa Oluşturma

### 1. Site Seç
- Sites listesinden bir site seç
- "Sayfaları Yönet" tıkla veya
- `/sites/[siteId]/pages` git

### 2. "Yeni Sayfa Oluştur" Tıkla

### 3. Form Doldur

```
📝 Sayfa Başlığı* (zorunlu)
   Örnek: "Ana Sayfa", "Hakkımızda", "İletişim"

   💡 Slug otomatik oluşturulur!

🔗 URL Slug* (zorunlu)
   Otomatik: "Ana Sayfa" → "ana-sayfa"

   Elle değiştirebilirsin:
   - Sadece küçük harf
   - Rakam
   - Tire (-)

--- SEO AYARLARI (Opsiyonel) ---

🏷️ Meta Başlık
   Arama motorlarında görünecek
   Boş bırakılırsa sayfa başlığı kullanılır

📋 Meta Açıklama
   Google'da görünecek açıklama
   150-160 karakter önerilir

👁️ Yayın Durumu
   ☑️ İşaretle = Hemen yayınla
   ☐ Boş bırak = Taslak olarak kaydet
```

### 4. "Sayfa Oluştur & Düzenle" Tıkla
- Page Editor'a yönlendirilirsin
- Buradan içeriği oluşturabilirsin

---

## 🎨 Page Builder Kullanımı

### Page Editor Arayüzü

```
┌─────────────────────────────────────────────────────┐
│  ← Geri  |  Sayfa Başlığı  |  👁️ Önizle  💾 Kaydet │
├─────────┬─────────────────────────────┬─────────────┤
│         │                             │             │
│ BLOKLAR │        CANVAS              │ ÖZELLİKLER │
│         │                             │             │
│ Başlık  │   [Seçili bloklar burda]   │ Metin:      │
│ Metin   │                             │ [input]     │
│ Resim   │   [Sürükle & bırak]        │             │
│ Buton   │                             │ Hizalama:   │
│ Boşluk  │                             │ [select]    │
│         │                             │             │
└─────────┴─────────────────────────────┴─────────────┘
```

### 1. Blok Ekleme

#### Sol Panel'den Blok Seç:
```
📝 Başlık - H1, H2, H3, H4, H5, H6
📄 Metin - Paragraf, açıklama metni
🖼️ Resim - Görsel ekle
🔘 Buton - Link butonu ekle
⬜ Boşluk - Dikey boşluk ekle
```

**Nasıl:**
1. Sol panel'den bloğa tıkla
2. Canvas'a otomatik eklenir
3. Sağ panel'de özellikleri açılır

### 2. Blok Düzenleme

#### Blok Seçme:
- Canvas'taki bloğa tıkla
- Seçili blok **mavi çerçeve** ile işaretlenir
- Sağ panel'de özellikleri görünür

#### Başlık Bloğu Özellikleri:
```
📝 Metin: "Başlık yazısı"
🔢 Seviye: H1, H2, H3, H4, H5, H6
↔️ Hizalama: Sol, Orta, Sağ
🎨 Renk: (opsiyonel)
```

#### Metin Bloğu Özellikleri:
```
📝 Metin: Çok satırlı metin alanı
↔️ Hizalama: Sol, Orta, Sağ, İki yana
📏 Font Boyutu: (opsiyonel)
🎨 Renk: (opsiyonel)
```

#### Resim Bloğu Özellikleri:
```
🔗 Resim URL: https://...
📝 Alt Metin: "Resim açıklaması"
↔️ Hizalama: Sol, Orta, Sağ
🔲 Yuvarlatılmış: Evet/Hayır
```

#### Buton Bloğu Özellikleri:
```
📝 Buton Metni: "Tıkla"
🔗 Link: "/sayfa" veya "https://..."
🎨 Variant: Primary, Secondary, Outline
📏 Boyut: Küçük, Orta, Büyük
↔️ Hizalama: Sol, Orta, Sağ
```

#### Boşluk Bloğu Özellikleri:
```
📏 Yükseklik: 20px, 40px, 60px, 80px...
```

### 3. Blok Sıralama

**Drag & Drop:**
1. Bloğun üzerine gel
2. Tutup sürükle
3. İstediğin yere bırak
4. Sıra otomatik güncellenir

### 4. Blok Silme

**2 Yol:**
1. Bloğu seç → Sağ üstteki 🗑️ Çöp kutusu ikonu
2. Confirm dialog → "Evet, Sil"

### 5. Kaydetme

**Kaydet Butonu:**
- Sağ üstte 💾 Kaydet butonu
- Tıkla → Değişiklikler API'ye kaydedilir
- "Sayfa başarıyla kaydedildi!" mesajı

---

## 📸 Medya Yükleme

### Medya Kütüphanesi Aç
- Site edit → "Medya Kütüphanesi" veya
- `/sites/[siteId]/media` git

### Dosya Yükleme

#### Yöntem 1: Drag & Drop
1. Dosyaları bilgisayarından seç
2. Büyük kutuya sürükle
3. Bırak → Otomatik yüklenir

#### Yöntem 2: Dosya Seç
1. Büyük kutuya tıkla
2. Dosya seçme dialog'u açılır
3. Dosyaları seç
4. "Aç" tıkla → Yüklenir

**Desteklenen Formatlar:**
- Resim: JPG, PNG, GIF, WEBP
- (Gelecekte: Video, PDF, vb.)

### Medya Kullanımı

**URL Kopyala:**
1. Dosyanın üzerine gel
2. Hover'da 📋 ikonu görünür
3. Tıkla → URL kopyalanır
4. Page Builder'da Image bloğuna yapıştır

**Dosya Sil:**
1. Dosyanın üzerine gel
2. 🗑️ Çöp kutusu ikonu
3. Confirm → Sil

---

## 🎯 Örnek Kullanım Senaryosu

### Senaryo: Yeni bir "Hakkımızda" sayfası oluştur

1. **Dashboard'a git** (http://localhost:3100/dashboard)

2. **"Sitelerim" → Site seç**

3. **"Sayfaları Yönet" tıkla**

4. **"Yeni Sayfa Oluştur"**
   ```
   Başlık: Hakkımızda
   Slug: hakkimizda (otomatik)
   Meta Başlık: Hakkımızda - Şirketimiz
   Meta Açıklama: Biz kimiz, ne yapıyoruz
   Yayınla: ✅ İşaretle
   ```

5. **"Sayfa Oluştur & Düzenle"**

6. **Page Builder'da içerik ekle:**

   **Blok 1 - Başlık:**
   - Sol panel → "Başlık" tıkla
   - Sağ panel:
     - Metin: "Biz Kimiz?"
     - Seviye: H1
     - Hizalama: Orta

   **Blok 2 - Metin:**
   - Sol panel → "Metin" tıkla
   - Sağ panel:
     - Metin: "2020'den beri..."
     - Hizalama: Sol

   **Blok 3 - Resim:**
   - Sol panel → "Resim" tıkla
   - Medya kütüphanesinden resim seç (URL kopyala)
   - Sağ panel:
     - URL: [yapıştır]
     - Alt: "Ekip fotoğrafı"
     - Hizalama: Orta
     - Yuvarlatılmış: ✅

   **Blok 4 - Buton:**
   - Sol panel → "Buton" tıkla
   - Sağ panel:
     - Metin: "İletişime Geç"
     - Link: "/iletisim"
     - Variant: Primary
     - Boyut: Büyük
     - Hizalama: Orta

7. **💾 Kaydet tıkla**

8. **✅ Tamamlandı!** Sayfa yayında!

---

## 💡 İpuçları

### Dashboard
- 📊 Stats gerçek zamanlı güncellenir
- 🕐 Canlı saat çalışıyor
- 🚀 Quick actions ile hızlı erişim

### Site Yönetimi
- 🔍 Search ile hızlı arama
- 📱 Mobile responsive çalışıyor
- 🗑️ Silme işlemi confirmation istiyor

### Page Builder
- 💡 Block hover'da tip gösterir
- 🎨 Seçili block mavi çerçeveli
- ⚡ Gerçek zamanlı preview
- 💾 Kaydet'i unutma!

### Medya
- 📸 Drag & drop en hızlı yöntem
- 📋 URL kopyala butonu çok kullanışlı
- 🔍 Search ile dosya ara

---

## 🐛 Sorun Giderme

### Backend bağlanamıyor
```bash
# Backend çalışıyor mu kontrol et
cd back-end/panel-backend
npm run dev
# Port 3001'de çalışmalı
```

### Frontend hata veriyor
```bash
# Frontend'i yeniden başlat
cd front-end/panel-frontend
npm run dev
# Port 3100'de çalışmalı
```

### Giriş yapamıyorum
```bash
# Admin hesabı oluştur
cd back-end/panel-backend
npx prisma db seed

# Credentials:
# Email: admin@gradiator.com
# Şifre: Admin123!
```

### Sayfa kaydetmiyor
- Backend API çalışıyor mu kontrol et
- Console'da error var mı bak
- Network tab'da API call'lar başarılı mı

---

## 📞 Destek

**Admin Credentials:**
```
Email: admin@gradiator.com
Password: Admin123!
```

**Ports:**
- Frontend: http://localhost:3100
- Backend: http://localhost:3001

**Documentation:**
- PROGRESS-SUMMARY.md - Proje özeti
- Session summaries - Detaylı notlar
- Sprint docs - Sprint planları

---

## ✅ Checklist - İlk Kullanım

- [ ] Backend başlat (port 3001)
- [ ] Frontend başlat (port 3100)
- [ ] Admin hesabı oluştur (prisma seed)
- [ ] Login yap
- [ ] Demo site kontrol et
- [ ] Yeni site oluştur
- [ ] Sayfa ekle
- [ ] Page builder dene
- [ ] Medya yükle
- [ ] Kaydet ve test et

---

**Başarılar! 🚀**

Herhangi bir sorun olursa, dokumentasyona bak veya console log'larını kontrol et!
