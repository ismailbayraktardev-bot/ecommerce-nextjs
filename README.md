# Modern Panel & Page Builder Sistemi

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

---

Bu proje, e-ticaret ve kurumsal web siteleri için geliştirilmiş, modüler ve çoklu demo desteği sunan modern bir tema sistemi ve entegre, sürükle-bırak arayüzlü bir sayfa oluşturucu (Page Builder) projesidir. Geliştirme süreci, AI kod asistanları (Gemini, GPT Codex, Cloud Code) ile hızlandırılmıştır.

## 🚀 Proje Vizyonu

- **Modüler Altyapı:** Tek bir ana tema üzerinde farklı sektörlere yönelik (4 e-ticaret + 4 kurumsal) hazır demo varyantları sunmak.
- **API-First Yaklaşım:** Backend ve frontend'in tamamen ayrık olduğu, headless bir mimari kullanmak.
- **Modern Kullanıcı Deneyimi:** Tek tıkla demo kurulumu ve sürükle-bırak arayüzlü bir page builder ile içerik yönetimini kolaylaştırmak.
- **AI Destekli Geliştirme:** Karmaşık görevleri AI ajanlarına delege ederek geliştirme sürecini optimize etmek.

## ⚙️ Teknoloji Mimarisi

| Alan      | Teknolojiler                                                    |
| --------- | --------------------------------------------------------------- |
| **Backend** | Next.js 15, Prisma, PostgreSQL, NextAuth.js v5                   |
| **Frontend**| Next.js 15, React 19, Tailwind CSS, Shadcn/ui, @dnd-kit        |
| **DevOps**  | Vercel, GitHub Actions, Cloudinary, Docker, Supabase            |

## 📂 Proje Yapısı

Proje, ana `eCommerce` klasörü altında bir monorepo yapısı benimser:

```
eCommerce/
├── 📁 back-end/         # Backend Next.js projesi (panel-backend)
├── 📁 front-end/        # Frontend Next.js projesi (panel-frontend)
├── 📁 docs/             # Proje dökümantasyonu, planlama ve sprint özetleri
├── 📁 devops/           # CI/CD, Docker ve deployment konfigürasyonları
└── 📄 README.md         # Bu dosya
```

## ⚡ Nasıl Başlanır?

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### Gereksinimler

- Node.js 18+
- npm / yarn / pnpm
- PostgreSQL veritabanı

### Kurulum

1.  **Repository'yi klonlayın:**
    ```bash
    git clone https://github.com/ismailbayraktardev-bot/ecommerce-nextjs.git
    cd ecommerce-nextjs
    ```

2.  **Backend Kurulumu:**
    ```bash
    cd back-end/panel-backend
    npm install
    cp .env.example .env.local
    ```
    `.env.local` dosyasını kendi veritabanı ve NextAuth.js bilgilerinizle güncelleyin.

3.  **Frontend Kurulumu:**
    ```bash
    cd ../../front-end/panel-frontend
    npm install
    cp .env.example .env.local
    ```
    `.env.local` dosyasını backend API adresinizle güncelleyin.

4.  **Veritabanı Migrasyonu:**
    Backend projesi içindeyken Prisma migrasyonunu çalıştırın:
    ```bash
    cd back-end/panel-backend
    npx prisma migrate dev
    ```

5.  **Projeyi Çalıştırma:**
    Her iki projeyi de ayrı terminallerde başlatın:
    ```bash
    # Terminal 1: Backend
    cd back-end/panel-backend
    npm run dev

    # Terminal 2: Frontend
    cd front-end/panel-frontend
    npm run dev
    ```

## 👥 Ekibimiz

- **ARDA:** Backend & Veritabanı Uzmanı (Gemini Code Assist)
- **LUNA:** Frontend & UI/UX Uzmanı (GPT Codex)
- **DENİZ:** DevOps & Entegrasyon Uzmanı (Cloud Code)

## 🤖 AI Kullanım Notu
Bu projede AI ajanları, geliştirme sürecini hızlandırmak için birer asistan olarak kullanılır. `docs/ai/ai-agent-mega-prompts.md` dosyasındaki prompt'lar, AI'dan en iyi verimi almak için özel olarak tasarlanmıştır. Çıktıların her zaman test edilmesi ve projenin standartlarına uygun şekilde refactor edilmesi gerektiğini unutmayın.

## 📄 Lisans

**Copyright © 2025 Ismail Bayraktar. Tüm Hakları Saklıdır.**

Bu proje özel mülkiyettir. Yazılımın veya herhangi bir bölümünün izinsiz olarak yeniden dağıtılması, kopyalanması, değiştirilmesi veya satılması kesinlikle yasaktır.