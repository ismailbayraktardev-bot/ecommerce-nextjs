# Sprint 1: Backend Kurulum ve Özet Raporu

**Sorumlu:** Arda (Backend & Veritabanı Uzmanı)
**Tarih:** 16.10.2025

Bu döküman, projenin ilk sprint'i boyunca backend tarafında yapılan tüm kurulum, geliştirme ve hata ayıklama adımlarını özetlemektedir.

## 1. Proje Kurulumu ve Yapılandırma

Projenin backend kısmı, `back-end/panel-backend` dizini altında modern bir Next.js 15 projesi olarak kurulmuştur.

- **Komut:** `npx create-next-app@latest panel-backend --typescript --tailwind --eslint --app --src-dir`
- **Temel Bağımlılıklar:**
  - `next@15`: Ana framework
  - `react@19`: UI kütüphanesi
  - `prisma`: Veritabanı ORM'i
  - `next-auth@5 (beta)`: Kimlik doğrulama
  - `zod`: Veri doğrulama
  - `bcryptjs`: Şifre hash'leme

## 2. Veritabanı Mimarisi (Prisma)

Veritabanı şeması, projenin tüm veri modellerini içerecek şekilde `prisma/schema.prisma` dosyasında tanımlanmıştır. Veritabanı olarak Supabase üzerinde çalışan PostgreSQL kullanılmıştır.

### Tam Prisma Şeması

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String?  @db.Text
  access_token       String?  @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?  @db.Text
  session_state      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  image       String?
  password    String?  // For credentials-based registration
  role        UserRole @default(USER)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  accounts    Account[]
  sessions    Session[]
  pages       Page[]
  sites       Site[]

  @@map("users")
}

model Site {
  id          String   @id @default(cuid())
  name        String
  domain      String?  @unique
  subdomain   String?  @unique
  description String?
  favicon     String?
  logo        String?
  
  // Demo configuration
  demoId      String?
  demoData    Json?
  
  // Theme settings
  theme       Json     @default("{}")
  customCSS   String?
  
  // User relation
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Content relations
  pages       Page[]
  media       Media[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("sites")
}

model Page {
  id          String    @id @default(cuid())
  title       String
  slug        String
  content     Json      @default("[]") // Block data
  metaTitle   String?
  metaDesc    String?
  published   Boolean   @default(false)
  
  // Site relation
  siteId      String
  site        Site      @relation(fields: [siteId], references: [id], onDelete: Cascade)
  
  // User relation  
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([siteId, slug])
  @@map("pages")
}

model Block {
  id          String   @id @default(cuid())
  type        String   // "hero", "features", "testimonials", etc.
  name        String
  category    String   // "layout", "content", "ecommerce"
  icon        String?
  
  // Block definition
  schema      Json     // Block attributes schema
  defaultData Json     // Default attribute values
  
  // Metadata
  version     String   @default("1.0.0")
  published   Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("blocks")
}

model Media {
  id          String   @id @default(cuid())
  filename    String
  originalName String
  mimeType    String
  size        Int
  url         String
  width       Int?
  height      Int?
  alt         String?
  
  // Site relation
  siteId      String
  site        Site     @relation(fields: [siteId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("media")
}

model Demo {
  id          String   @id @default(cuid())
  name        String
  category    String   // "ecommerce", "corporate"
  subcategory String   // "fashion", "agency", etc.
  description String?
  thumbnail   String?
  
  // Demo configuration
  config      Json     // Theme settings, colors, fonts
  pages       Json     // Page templates
  blocks      Json     // Block data
  media       Json     // Media files metadata
  
  // Metadata
  version     String   @default("1.0.0")
  published   Boolean  @default(true)
  downloads   Int      @default(0)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("demos")
}

enum UserRole {
  USER
  ADMIN
  SUPER_ADMIN
}
```

## 3. Kimlik Doğrulama (NextAuth.js)

Projenin temel kimlik doğrulama altyapısı, şifre ile kayıt ve giriş yapmayı destekleyecek şekilde kurulmuştur.

### Ana Yapılandırma (`src/lib/auth.ts`)

Bu dosya, Prisma'yı NextAuth'a bağlayan adaptörü ve giriş (`Credentials`) stratejisini içerir.

```typescript
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import Credentials from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'; // Import at the top level

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Validate credentials exist
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 2. Find user in the database
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        // 3. Check if user exists and has a password (i.e., not an OAuth user)
        if (!user || !user.password) {
          return null;
        }

        // 4. Compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        // 5. If valid, return the user object. NextAuth will handle the rest.
        if (isPasswordValid) {
          return user;
        }

        // 6. If not valid, return null
        return null;
      },
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // Redirect users to a custom login page
  }
})
```

### Kayıt API Endpoint (`src/app/api/auth/register/route.ts`)

Bu endpoint, yeni kullanıcıların sisteme kaydolmasını sağlar.

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

// Updated schema to match frontend
const registerSchema = z.object({
  firstName: z.string().min(1, 'Ad alanı boş olamaz'),
  lastName: z.string().min(1, 'Soyad alanı boş olamaz'),
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      // This now correctly handles missing fields and other validation errors
      return NextResponse.json({ message: validation.error.issues[0].message }, { status: 400 });
    }

    // Destructure validated data
    const { firstName, lastName, email, password } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Bu e-posta adresi zaten kullanımda' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Combine firstName and lastName for the 'name' field in the database
    const name = `${firstName} ${lastName}`.trim();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
        message: "Hesabınız başarıyla oluşturuldu",
        user: userWithoutPassword
    }, { status: 201 });

  } catch (error) {
    console.error("REGISTER_ERROR", error);
    return NextResponse.json({ message: 'Beklenmedik bir hata oluştu.' }, { status: 500 });
  }
}
```

### Middleware (`src/middleware.ts`)

Bu dosya, korunmuş sayfalara giriş yapmadan erişilmesini engeller.

```typescript
import { auth } from "@/lib/auth"

export default auth((req) => {
  // req.auth is now available
  if (!req.auth && req.nextUrl.pathname !== "/login") {
    const newUrl = new URL("/login", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
}
```

## 4. Hata Ayıklama Süreci (Debugging)

Sprint 1 boyunca karşılaşılan temel sorunlar ve çözümleri:

1.  **Supabase Bağlantı Hatası:** `prisma migrate` komutu, Supabase'in "Connection Pooler" adresine bağlandığı için donuyordu. Çözüm olarak, veritabanı ayarlarından "pooling" özelliği kapatılarak **direkt bağlantı adresi** `.env.local` dosyasına eklendi.
2.  **500 Sunucu Hatası:** Kayıt sırasında geçersiz veri gönderildiğinde sunucu çöküyordu. Sorunun, Zod hata mesajını `validation.error.errors` yerine `validation.error.issues` üzerinden okunması gerektiği anlaşıldı ve düzeltildi.
3.  **400 Geçersiz Veri Hatası:** Frontend'in `firstName` ve `lastName` göndermesi, backend'in ise tek bir `name` alanı beklemesi nedeniyle validasyon hatası alınıyordu. Backend, bu iki alanı kabul edip birleştirecek şekilde güncellenerek sorun çözüldü.
4.  **Veritabanı Bağlantı Kaybı:** `.env.local` dosyasındaki `DATABASE_URL`'in kaybolması nedeniyle `localhost`'a bağlanma hatası alındı. Dosyanın tekrar doğru Supabase adresiyle güncellenmesiyle sorun giderildi.

## 5. Git ve Repository Kurulumu

Proje, tek bir monorepo olarak yönetilmesi için ana dizinde `git init` ile başlatıldı. `panel-backend` içindeki alt `.git` klasörü kaldırıldı. Proje dosyaları, `.gitignore` kuralları ayarlandıktan sonra "feat: Initial project structure and backend setup" mesajıyla GitHub'a gönderildi.
