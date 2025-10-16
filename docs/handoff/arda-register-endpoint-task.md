# 🎯 ARDA GÖREVI: Register Endpoint & Auth Integration

**Tarih:** 2025-01-28  
**Öncelik:** HIGH - Frontend hazır bekliyor  
**Tahmini Süre:** 30-45 dakika  

## 📋 GÖREV ÖZETİ

Luna frontend'de register form'unu tamamladı ve fully functional. Ancak backend'de `/api/auth/register` endpoint'i eksik. Kullanıcılar kayıt olamıyor ve şu hatayı alıyorlar:

```
POST /api/auth/register 404 Not Found
```

## 🔧 YAPILMASI GEREKENLER

### **1. Register API Endpoint (Ana Görev)**

**Dosya:** `back-end/panel-backend/src/app/api/auth/register/route.ts`

**Beklenen Fonksiyonalite:**
- Email/password ile kullanıcı kaydı
- Password hashing (bcryptjs)
- Email uniqueness kontrolü
- Zod validation
- Proper error handling
- Turkish error messages

**Expected Request Body:**
```typescript
{
  firstName: string,
  lastName: string, 
  email: string,
  password: string
}
```

**Expected Response (Success):**
```typescript
{
  message: "Hesabınız başarıyla oluşturuldu",
  user: {
    id: string,
    email: string, 
    name: string,
    role: "USER",
    createdAt: DateTime
  }
}
```

### **2. Prisma Schema Update (Gerekli)**

**Dosya:** `back-end/panel-backend/prisma/schema.prisma`

User modeline password field'i eklenmesi gerekiyor:
```prisma
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  image       String?
  password    String?  // <- BU EKSIK!
  role        UserRole @default(USER)
  // ... rest of fields
}
```

**Migration Command:**
```bash
cd back-end/panel-backend
npx prisma db push
# veya
npx prisma migrate dev --name add-user-password
```

### **3. Auth.ts Güncelleme (Kritik)**

**Dosya:** `back-end/panel-backend/src/lib/auth.ts`

Credentials provider'ın authorize fonksiyonu şu an sadece hardcoded admin@example.com ile çalışıyor. Register edilen kullanıcıları da desteklemesi gerekiyor:

```typescript
async authorize(credentials) {
  // Mevcut: sadece admin@example.com
  // Gerekli: database'den user lookup + password compare
  
  const user = await prisma.user.findUnique({
    where: { email: credentials.email }
  });
  
  if (!user || !user.password) return null;
  
  const isValid = await bcrypt.compare(credentials.password, user.password);
  return isValid ? user : null;
}
```

## 💻 IMPLEMENTATION EXAMPLE

```typescript
// register/route.ts İÇİN TEMEL STRUKTUR
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

const registerSchema = z.object({
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'), 
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Parse & validate request body
    // 2. Check if user already exists
    // 3. Hash password  
    // 4. Create user in database
    // 5. Return success response
  } catch (error) {
    // Handle validation errors, duplicate email, etc.
  }
}
```

## 🧪 TEST SENARYOLARI

### Test Case 1: Başarılı Kayıt
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User", 
    "email": "test@example.com",
    "password": "123456"
  }'

# Beklenen: 201 Created + user object
```

### Test Case 2: Duplicate Email
```bash
# Aynı email ile ikinci kayıt denemesi
# Beklenen: 400 Bad Request + "Bu e-posta adresi zaten kullanımda"
```

### Test Case 3: Invalid Data
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "A",
    "email": "invalid-email", 
    "password": "123"
  }'

# Beklenen: 400 Bad Request + validation error
```

### Test Case 4: Login After Register
```bash
# 1. Register new user
# 2. Try to login with same credentials via /login page
# 3. Should successfully authenticate
```

## 🔍 MEVCUT DURUM ANALIZI

**Backend Dependencies - ✅ Available:**
- bcryptjs: ^3.0.2 (password hashing)
- zod: ^4.1.12 (validation)
- @prisma/client: ^6.17.1 (database)
- next-auth: ^5.0.0-beta.29 (authentication)

**Database Connection:**
- PostgreSQL via Prisma
- Development database should be running
- Connection string in .env

**Frontend Integration Points:**
- RegisterForm component ready at `/register`
- Form validation with Zod on frontend
- Error handling implemented
- Success flow: register → auto-login → redirect to /dashboard

## 🚨 KNOWN ISSUES & FIXES NEEDED

### Issue 1: Password Field Missing
```sql
-- Current User table doesn't have password field
-- Need to add it for credentials-based auth
ALTER TABLE users ADD COLUMN password TEXT;
```

### Issue 2: Auth.ts Hardcoded Logic
```typescript
// Current: only works for admin@example.com
if (credentials.email === "admin@example.com" && credentials.password === "password")

// Needed: dynamic database lookup for any registered user
const user = await prisma.user.findUnique({ where: { email: credentials.email }});
```

### Issue 3: Frontend Error Messages
Frontend bekliyor Turkish error messages:
- "Bu e-posta adresi zaten kullanımda"
- "Geçersiz e-posta formatı"
- "Şifre en az 6 karakter olmalıdır"

## 📊 HANDOFF INFO FROM LUNA

**Frontend Status:**
- ✅ Register form tamamen hazır
- ✅ Form validation (Zod) implemented
- ✅ Error state handling ready
- ✅ Loading states implemented  
- ✅ Success redirect to /dashboard planned
- ✅ Turkish localization complete

**API Contract Expected:**
```typescript
// POST /api/auth/register
Request: {
  firstName: string;
  lastName: string;
  email: string; 
  password: string;
}

Response Success (201): {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
  }
}

Response Error (400/500): {
  message: string; // Turkish error message
}
```

## 🎯 ACCEPTANCE CRITERIA

**Definition of Done:**
- [ ] Register API endpoint responds to POST requests
- [ ] User model updated with password field
- [ ] Password properly hashed before storing
- [ ] Email uniqueness enforced
- [ ] Proper error handling with Turkish messages
- [ ] Auth.ts updated to handle registered users
- [ ] Register → Login flow works end-to-end
- [ ] Frontend register form functional
- [ ] Database migration applied

**Success Metrics:**
- User can register via frontend form
- User can login with registered credentials  
- Appropriate error messages shown for edge cases
- Password stored securely (hashed)
- No security vulnerabilities introduced

## 🤝 NEXT STEPS AFTER COMPLETION

1. **Test Integration** - Frontend + Backend kayıt akışını test et
2. **Security Review** - Password hashing, validation double-check
3. **Error Handling** - Edge cases ve error messages kontrolü
4. **Documentation** - API endpoint documentation güncelle

**Estimated Luna waiting time:** 45 minutes max
**Priority Level:** 🔴 HIGH - Blocking frontend testing

---

**Arda, authentication foundation'ını sen tamamlayacaksın. Luna frontend'i hazır halde bekliyor. This is a critical handoff task!** 🚀