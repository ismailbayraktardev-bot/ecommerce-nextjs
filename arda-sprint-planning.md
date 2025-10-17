# Arda - Backend Sprint Planlaması (Güncel)

**Sorumlu:** Arda (Backend & Veritabanı Uzmanı)
**Tarih:** 17.10.2025

Bu döküman, Luna'dan gelen API talepleri sonrası güncellenmiş ve projenin gelecek sprintleri için backend yol haritasını detaylandırmaktadır.

## 1. Mevcut Durum Özeti (Sprint 1-2 Sonu)

- **Proje Kurulumu:** Tamamlandı.
- **Veritabanı:** Temel şema tamamlandı.
- **Kimlik Doğrulama:** `Register` ve `Login` endpoint'leri **canlı ve çalışır durumda.**
- **Sonuç:** Backend, temel kullanıcı yönetimi özellikleriyle çalışır durumdadır ve yeni özelliklerin geliştirilmesi için hazırdır.

---

## 2. Güncel Sprint Planları (Luna'nın Taleplerine Göre)

### Sprint 3: Kritik API'ler ve Site Yönetimi (Tahmini Süre: 2 Hafta)

Bu sprint, frontend'deki kritik blocker'ları kaldırmaya ve ana işlevsellik olan site yönetimini hayata geçirmeye odaklanmıştır.

#### **Hafta 1: Kimlik Doğrulama Akışını Tamamlama (Frontend Blocker)**

| Öncelik | Görev Adı | Endpoint | Açıklama | Durum |
| :--- | :--- | :--- | :--- | :--- |
| **KRİTİK** 🔴 | **Forgot Password API** | `POST /api/auth/forgot-password` | E-posta ile şifre sıfırlama talebi oluşturur, token üretir ve DB'ye kaydeder. | `Yapılacak` |
| **KRİTİK** 🔴 | **Reset Password API** | `POST /api/auth/reset-password` | Gelen token ile yeni şifrenin belirlenmesini sağlar. | `Yapılacak` |

#### **Hafta 2: Site Yönetimi Temel API'leri (CRUD)**

| Öncelik | Görev Adı | Endpoint | Açıklama | Durum |
| :--- | :--- | :--- | :--- | :--- |
| **Yüksek** 🟡 | **List User's Sites** | `GET /api/sites` | Kullanıcının tüm sitelerini; arama, filtreleme ve sayfalama seçenekleriyle listeler. | `Yapılacak` |
| **Yüksek** 🟡 | **Create New Site** | `POST /api/sites` | Yeni bir site oluşturur. Domain/subdomain'in unique olmasını kontrol eder. | `Yapılacak` |
| **Yüksek** 🟡 | **Get Site Details** | `GET /api/sites/:id` | Belirli bir sitenin detaylarını, ilişkili veri sayılarıyla (`_count`) birlikte getirir. | `Yapılacak` |
| **Yüksek** 🟡 | **Update Site** | `PATCH /api/sites/:id` | Bir sitenin bilgilerini kısmi olarak günceller. | `Yapılacak` |
| **Yüksek** 🟡 | **Delete Site** | `DELETE /api/sites/:id` | Bir siteyi ve ilişkili tüm verilerini (Prisma cascade) siler. | `Yapılacak` |

---

### Sprint 4: Gelişmiş İçerik ve Dashboard (Tahmini Süre: 2 Hafta)

| Öncelik | Görev Adı | Endpoint | Açıklama | Durum |
| :--- | :--- | :--- | :--- | :--- |
| **Orta** 🟢 | **Dashboard Stats API** | `GET /api/dashboard/stats` | Frontend'deki mock datayı gerçek verilerle (toplam site, sayfa sayısı vb.) besler. | `Yapılacak` |
| **Yüksek** 🟡 | **Page Yönetimi API'leri (CRUD)** | `/api/sites/:siteId/pages` | Bir siteye ait sayfaların tam yönetimini sağlar. | `Yapılacak` |
| **Orta** 🟢 | **Media Upload API (Basit)** | `/api/media/upload` | Logo, favicon gibi basit resim yüklemeleri için ilk versiyon. | `Yapılacak` |
| **Düşük** | **API Dokümantasyonu** | - | Postman koleksiyonu veya OpenAPI speği oluşturulması. | `Yapılacak` |

---

### Sprint 5 ve Sonrası: Demo Sistemi ve Optimizasyon

- **Demo Sistemi API'leri:** Hazır demo şablonlarının import/export edilmesi.
- **Gelişmiş Media Kütüphanesi:** Yüklenen tüm medyaların yönetimi.
- **Performans Optimizasyonu:** N+1 sorgularının ve yavaş endpoint'lerin iyileştirilmesi.
- **Güvenlik Taraması ve RBAC:** Rol bazlı yetkilendirmelerin detaylandırılması ve güvenlik denetimleri.

Bu güncellenmiş plan, takımın mevcut öncelikleriyle tam uyumludur ve backend geliştirmesi için net bir yol haritası sunar.