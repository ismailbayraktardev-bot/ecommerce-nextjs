# Luna → Arda: API Endpoint Talepleri (Sprint 3)
**Tarih:** 2025-10-17
**Durum:** 🔴 CRITICAL - Sprint 3 Başarısı İçin Gerekli
**Frontend Hazırlık:** %100 ✅
**Backend Implementation:** ⏳ Bekleniyor

---

## 📊 GENEL DURUM

### **Frontend Durumu**
- ✅ Login Page: Production ready (Arda'nın login API'si ile çalışıyor)
- ✅ Register Page: UI %100 hazır, **backend API bekleniyor** 🔴
- ✅ Forgot Password Page: UI %100 hazır, **backend API bekleniyor** 🟡
- ⏳ Site Management: Frontend henüz yok, **backend API'leri planlanıyor** 🟡

### **Backend Durumu (Arda'nın Sprint 1 Özet Raporundan)**
- ✅ Prisma schema: Tam ve detaylı (User, Site, Page, Block, Media, Demo)
- ✅ NextAuth.js v5: Kurulu ve çalışıyor
- ✅ Register API: **İMPLEMENT EDİLMİŞ!** ✅ (`/api/auth/register`)
- ❌ Forgot Password API: Henüz yok
- ❌ Sites CRUD APIs: Henüz yok
- ❌ Dashboard Stats API: Henüz yok

---

## 🎯 ÖNCELİK SIRASINA GÖRE API TALEPLERİ

### **🔴 KRİTİK (HEMEN GEREKLİ - Sprint 3 Hafta 1)**

#### **1. Forgot Password API** (Yüksek Öncelik)
**Frontend Durum:** %100 Hazır ✅
**Backend Durum:** Henüz yok ❌
**Blocker:** Frontend integrate edilemiyor

**Endpoint:** `POST /api/auth/forgot-password`

**Request Schema:**
```typescript
{
  email: string; // Valid email format
}
```

**Response Success (200):**
```typescript
{
  success: true;
  message: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi";
}
```

**Response Error (400 - User Not Found):**
```typescript
{
  success: false;
  message: "Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı";
  error: {
    code: "USER_NOT_FOUND"
  }
}
```

**Response Error (400 - Validation):**
```typescript
{
  success: false;
  message: "Geçerli bir e-posta adresi girin";
  error: {
    code: "VALIDATION_ERROR",
    field: "email"
  }
}
```

**Implementation Notes:**
- Email doğrulaması (Zod ile)
- User existence check
- Reset token generation (expire in 1 hour)
- Token database'e kaydet (VerificationToken model kullan)
- Email sending (başlangıçta console.log yeterli, production'da email service)
- Rate limiting consideration (opsiyonel)

**Frontend Integration Point:**
- File: `src/components/auth/forgot-password-form.tsx`
- Function: `onSubmit` handler
- Current: Mock console.log
- After API: Real API call with error handling

---

#### **2. Reset Password API** (Forgot Password'un devamı)
**Frontend Durum:** Henüz yok ❌
**Backend Durum:** Henüz yok ❌
**İhtiyaç:** Forgot Password flow'u tamamlamak için

**Endpoint:** `POST /api/auth/reset-password`

**Request Schema:**
```typescript
{
  token: string;       // Reset token from email link
  password: string;    // New password (min 6 chars)
  confirmPassword: string; // Must match password
}
```

**Response Success (200):**
```typescript
{
  success: true;
  message: "Şifreniz başarıyla güncellendi";
}
```

**Response Error (400 - Invalid Token):**
```typescript
{
  success: false;
  message: "Geçersiz veya süresi dolmuş bağlantı";
  error: {
    code: "INVALID_TOKEN"
  }
}
```

**Response Error (400 - Validation):**
```typescript
{
  success: false;
  message: "Şifreler eşleşmiyor";
  error: {
    code: "PASSWORD_MISMATCH"
  }
}
```

**Implementation Notes:**
- Token validation ve expiry check
- Password strength validation
- Password hashing (bcrypt)
- User password update
- Token deletion after use
- Auto-login after reset (opsiyonel)

**Frontend To-Do:**
- `/reset-password` sayfası oluştur
- Token query param'ı handle et
- Form UI (reset-password-form.tsx)
- Success redirect to /login

---

### **🟡 YÜKSEK ÖNCELİK (Sprint 3 Hafta 2)**

#### **3. Sites CRUD APIs**
**Frontend Durum:** %0 (Henüz başlanmadı)
**Backend Durum:** Schema hazır ✅, API yok ❌
**İhtiyaç:** Site Management core functionality

##### **3.1. GET /api/sites** (List All Sites)
**Purpose:** Authenticated user'ın tüm sitelerini listele

**Query Parameters (Optional):**
```typescript
{
  page?: number;      // Default: 1
  limit?: number;     // Default: 10
  search?: string;    // Search in site name/domain
  sortBy?: 'createdAt' | 'updatedAt' | 'name';  // Default: createdAt
  order?: 'asc' | 'desc'; // Default: desc
}
```

**Response Success (200):**
```typescript
{
  success: true;
  data: {
    sites: [
      {
        id: string;
        name: string;
        domain: string | null;
        subdomain: string | null;
        description: string | null;
        logo: string | null;
        favicon: string | null;
        demoId: string | null;
        createdAt: string; // ISO date
        updatedAt: string; // ISO date
        _count: {
          pages: number; // Page count for this site
        }
      }
    ],
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }
  }
}
```

**Response Error (401 - Unauthorized):**
```typescript
{
  success: false;
  message: "Oturum açmanız gerekiyor";
  error: {
    code: "UNAUTHORIZED"
  }
}
```

**Implementation Notes:**
- Authentication check (NextAuth session)
- Filter by userId (logged-in user only)
- Pagination implementation
- Search functionality (name, domain, subdomain)
- Sort & order
- Include page count (_count)

---

##### **3.2. POST /api/sites** (Create New Site)
**Purpose:** Yeni site oluştur

**Request Schema:**
```typescript
{
  name: string;           // Required, min 1 char
  description?: string;
  domain?: string;        // Optional, unique
  subdomain?: string;     // Optional, unique
  demoId?: string;        // Optional demo template ID
  theme?: {               // Optional theme settings
    primaryColor?: string;
    secondaryColor?: string;
    font?: string;
  };
}
```

**Response Success (201):**
```typescript
{
  success: true;
  message: "Site başarıyla oluşturuldu";
  data: {
    site: {
      id: string;
      name: string;
      domain: string | null;
      subdomain: string | null;
      description: string | null;
      theme: object;
      createdAt: string;
      updatedAt: string;
    }
  }
}
```

**Response Error (400 - Validation):**
```typescript
{
  success: false;
  message: "Site adı boş olamaz";
  error: {
    code: "VALIDATION_ERROR",
    field: "name"
  }
}
```

**Response Error (409 - Domain Conflict):**
```typescript
{
  success: false;
  message: "Bu domain/subdomain zaten kullanımda";
  error: {
    code: "DOMAIN_EXISTS",
    field: "domain" // or "subdomain"
  }
}
```

**Implementation Notes:**
- Zod validation
- Unique domain/subdomain check
- Auto-generate subdomain if not provided (from name)
- Create with userId from session
- Default theme if not provided
- If demoId provided, copy demo data

---

##### **3.3. GET /api/sites/:id** (Get Site Details)
**Purpose:** Belirli bir site'ın detaylarını getir

**Response Success (200):**
```typescript
{
  success: true;
  data: {
    site: {
      id: string;
      name: string;
      domain: string | null;
      subdomain: string | null;
      description: string | null;
      logo: string | null;
      favicon: string | null;
      theme: object;
      customCSS: string | null;
      demoId: string | null;
      demoData: object | null;
      createdAt: string;
      updatedAt: string;
      _count: {
        pages: number;
        media: number;
      }
    }
  }
}
```

**Response Error (404 - Not Found):**
```typescript
{
  success: false;
  message: "Site bulunamadı";
  error: {
    code: "SITE_NOT_FOUND"
  }
}
```

**Response Error (403 - Forbidden):**
```typescript
{
  success: false;
  message: "Bu siteye erişim yetkiniz yok";
  error: {
    code: "FORBIDDEN"
  }
}
```

**Implementation Notes:**
- Authentication check
- Authorization check (userId === site.userId)
- Include counts (pages, media)

---

##### **3.4. PATCH /api/sites/:id** (Update Site)
**Purpose:** Site bilgilerini güncelle

**Request Schema (Partial Update):**
```typescript
{
  name?: string;
  description?: string;
  domain?: string;
  subdomain?: string;
  logo?: string;
  favicon?: string;
  theme?: object;
  customCSS?: string;
}
```

**Response Success (200):**
```typescript
{
  success: true;
  message: "Site güncellendi";
  data: {
    site: { /* updated site object */ }
  }
}
```

**Response Error (404 / 403):** Same as GET

**Implementation Notes:**
- Partial update (only provided fields)
- Validate unique domain/subdomain if updating
- Authorization check

---

##### **3.5. DELETE /api/sites/:id** (Delete Site)
**Purpose:** Site'ı ve tüm ilişkili verileri sil

**Response Success (200):**
```typescript
{
  success: true;
  message: "Site başarıyla silindi";
}
```

**Response Error (404 / 403):** Same as GET

**Implementation Notes:**
- Cascade delete (pages, media via Prisma)
- Authorization check
- Soft delete consideration (optional)

---

### **🟢 ORTA ÖNCELİK (Sprint 3-4)**

#### **4. Dashboard Stats API**
**Endpoint:** `GET /api/dashboard/stats`
**Frontend Durum:** Mock data kullanılıyor
**Backend Durum:** Henüz yok

**Response Success (200):**
```typescript
{
  success: true;
  data: {
    totalSites: number;
    totalPages: number;
    totalVisitors: number;  // Future: analytics integration
    activeStatus: number;   // Active sites count
    recentActivity: [
      {
        id: string;
        type: 'site_created' | 'page_published' | 'site_updated';
        message: string;
        timestamp: string; // ISO date
      }
    ];
  }
}
```

**Implementation Notes:**
- Count user's sites, pages
- Recent activity log (last 10 activities)
- Placeholder for visitors (can be 0 for now)

---

#### **5. Pages CRUD APIs** (Sprint 4)
**Not Needed Yet:** Frontend page management henüz başlanmadı
**Beklenebilir:** Sprint 4'e kadar

**Endpoints (Future):**
- `GET /api/sites/:siteId/pages` - List pages
- `POST /api/sites/:siteId/pages` - Create page
- `GET /api/pages/:id` - Get page
- `PATCH /api/pages/:id` - Update page
- `DELETE /api/pages/:id` - Delete page

---

## 📋 FRONTEND ÜZERİNDE YAPILACAKLAR

### **Register API Integration** (Arda'nın API'si Hazır! ✅)

**Arda'nın Özet Raporu:** Register API implement edilmiş!
- Endpoint: `POST /api/auth/register`
- Schema: `{ firstName, lastName, email, password }`
- Response: Success mesajı + user object

**Frontend Tarafında Yapılacaklar:**
1. [ ] `src/components/auth/register-form.tsx` güncelle
2. [ ] API endpoint'ini environment variable'dan al
3. [ ] Error handling implement et
4. [ ] Success durumunda auto-login veya /login redirect
5. [ ] Loading state ekle
6. [ ] Test et (valid/invalid data ile)

**Code Snippet (Placeholder):**
```typescript
// src/components/auth/register-form.tsx
const onSubmit = async (values: Values) => {
  setError(null);
  setLoading(true);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || 'Kayıt başarısız');
      return;
    }

    // Success - redirect to login
    window.location.href = '/login?registered=true';
  } catch (err) {
    setError('Beklenmedik bir hata oluştu');
  } finally {
    setLoading(false);
  }
};
```

---

### **Forgot Password Integration** (Arda API'si Bekleniyor ⏳)

**Frontend Hazırlık:**
- File: `src/components/auth/forgot-password-form.tsx`
- UI: %100 hazır
- Logic: Mock implementation

**Yapılacaklar (API hazır olunca):**
1. [ ] API endpoint integrate et
2. [ ] Success state göster (email gönderildi mesajı)
3. [ ] Error handling
4. [ ] Loading state
5. [ ] Test et

---

### **Site Management Integration** (Frontend Henüz Yok ❌)

**Sprint 3 Hafta 2 Planı:**
1. [ ] Site list page UI oluştur
2. [ ] Site card component
3. [ ] Empty state design
4. [ ] Loading skeleton
5. [ ] Search & filter UI
6. [ ] Create site button
7. [ ] Site creation wizard (4-step)

**API Integration (Arda API'leri hazır olunca):**
- useSites hook (TanStack Query)
- useCreateSite hook
- useUpdateSite hook
- useDeleteSite hook

---

## 🔗 BACKEND-FRONTEND KOORDİNASYON

### **API Contract Standards**

**Standard Response Format:**
```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    field?: string;
  };
}
```

**Standard Error Codes:**
- `VALIDATION_ERROR` - Zod validation failed
- `UNAUTHORIZED` - Not logged in
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource doesn't exist
- `CONFLICT` - Unique constraint violation (e.g., email exists)
- `INTERNAL_ERROR` - Unexpected server error

### **Environment Variables**

**Backend (.env.local):**
```bash
DATABASE_URL="postgresql://..." # Supabase direct connection
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_APP_URL="http://localhost:3100"
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXTAUTH_SECRET="same-as-backend"
NEXTAUTH_URL="http://localhost:3100"
```

### **CORS Configuration** (If Needed)
- Backend ve frontend ayrı portlarda (3000 vs 3100)
- Next.js API routes CORS gerektirmeyebilir (same origin)
- Test edilmeli

---

## ✅ BAŞARI KRİTERLERİ

### **Sprint 3 Hafta 1 (Backend Focus)**
- ✅ Forgot Password API implemented ve test edildi
- ✅ Reset Password API implemented ve test edildi
- ✅ Register API frontend'e integrate edildi ve çalışıyor
- ✅ API documentation güncel

### **Sprint 3 Hafta 2 (Sites Focus)**
- ✅ Sites CRUD APIs (5 endpoint) implemented
- ✅ Frontend site list page functional
- ✅ Frontend site creation wizard MVP
- ✅ Sites API integrated ve test edildi

---

## 🚦 ÖNCELİK MATRISI

| API Endpoint | Öncelik | Frontend Hazırlık | Backend Durum | Blocker? |
|---|---|---|---|---|
| POST /api/auth/register | 🔴 Kritik | %100 ✅ | %100 ✅ | **No** - Integrate edilebilir |
| POST /api/auth/forgot-password | 🔴 Kritik | %100 ✅ | %0 ❌ | **Yes** |
| POST /api/auth/reset-password | 🟡 Yüksek | %0 ❌ | %0 ❌ | No (forgot-password'a bağlı) |
| GET /api/sites | 🟡 Yüksek | %0 ❌ | %0 ❌ | **Yes** (site list için) |
| POST /api/sites | 🟡 Yüksek | %0 ❌ | %0 ❌ | **Yes** (site creation için) |
| GET /api/sites/:id | 🟡 Yüksek | %0 ❌ | %0 ❌ | No |
| PATCH /api/sites/:id | 🟢 Orta | %0 ❌ | %0 ❌ | No |
| DELETE /api/sites/:id | 🟢 Orta | %0 ❌ | %0 ❌ | No |
| GET /api/dashboard/stats | 🟢 Orta | Mock data ⚠️ | %0 ❌ | No (mock kullanılıyor) |

---

## 📞 KOORDİNASYON PLANI

### **Arda ile Sync Points**
1. **Hemen:** Register API frontend integration test
2. **Bu Hafta:** Forgot Password & Reset Password APIs
3. **Gelecek Hafta:** Sites CRUD APIs
4. **As Needed:** API schema değişiklikleri

### **Comunicasyon Kanalları**
- Daily standup: API durum güncellemeleri
- Slack/Discord: Acil blocker'lar
- Dokümantasyon: Bu dosya güncel tutulacak

---

## 🎯 SONRAKI ADIMLAR

### **Luna (Frontend) To-Do List**
1. ✅ Bu dokümantasyonu oluştur
2. ⏭️ Register API'sini integrate et (Arda'nınki hazır!)
3. ⏭️ Forgot Password API bekleme - Arda ile sync
4. ⏭️ Site list page UI başlat (mock data ile)
5. ⏭️ Zustand stores setup (sites store)
6. ⏭️ TanStack Query hooks (useSites, useCreateSite)

### **Arda (Backend) To-Do List** (Tavsiyeler)
1. 🔴 **Forgot Password API** - En yüksek öncelik
2. 🔴 **Reset Password API** - Forgot password'un devamı
3. 🟡 **Sites CRUD APIs** - 5 endpoint (GET, POST, GET/:id, PATCH/:id, DELETE/:id)
4. 🟢 **Dashboard Stats API** - Nice to have
5. 🟢 **API Testing** - Postman/Thunder Client test collection

---

**Luna's Note to Arda:** Süpersin Arda! Sprint 1'de register API'sini mükemmel implement etmişsin. Frontend %100 hazır, şimdi sadece forgot-password ve sites API'lerini bekliyoruz. Sprint 3 başarısı senin elinde! 🚀

**Status:** 📋 DOCUMENTED | 📤 ARDA'YA İLETİLDİ
**Next Review:** Sprint 3 ortası (1 hafta içinde)
**Last Updated:** 2025-10-17
