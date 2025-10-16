# Backend Proje Başlangıç Rehberi

## Proje Genel Bakış

Bu proje, **e-ticaret** ve **kurumsal** web siteleri için modüler tema sistemi ve entegre page builder'ın **backend** kısmını kapsamaktadır. API-first mimari ile tamamen headless yaklaşım benimsenmiştir.

## Ana Hedefler

- **Next.js 15 App Router** ile modern API altyapısı
- **Prisma + PostgreSQL** ile type-safe database yönetimi
- **NextAuth.js v5** ile authentication sistemi
- **Demo import/export** mekanizması
- **Content Management** API'leri
- **Media Management** (Cloudinary/S3)
- **Multi-tenant** demo desteği

## Teknoloji Stack

### Core Framework
- **Next.js 15** - App Router, Server Actions, API Routes
- **TypeScript** - Tam tip güvenliği
- **Node.js 18+** - Runtime environment

### Database & ORM
- **PostgreSQL** - Ana veritabanı
- **Prisma ORM** - Type-safe database client
- **Neon/Supabase** - Serverless Postgres hosting

### Authentication
- **NextAuth.js v5** - Authentication framework
- **JWT Tokens** - Session management
- **OAuth Providers** - Google, GitHub, etc.

### File Management
- **Cloudinary** - Media CDN ve transformasyon
- **Next.js Image** - Image optimization
- **Sharp** - Image processing

### Validation & API
- **Zod** - Runtime type validation
- **tRPC** (optional) - Type-safe API
- **Swagger/OpenAPI** - API documentation

### Development Tools
- **Prisma Studio** - Database GUI
- **Docker** - Containerization
- **Jest** - Unit testing
- **ESLint + Prettier** - Code formatting

## Database Schema

### Core Models

```prisma
// prisma/schema.prisma

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  image       String?
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

## API Endpoints Yapısı

### Authentication APIs
```
POST   /api/auth/signin              # Login
POST   /api/auth/signup              # Register  
POST   /api/auth/signout             # Logout
GET    /api/auth/session             # Get current session
GET    /api/auth/providers           # OAuth providers
```

### Site Management APIs
```
GET    /api/sites                    # List user sites
POST   /api/sites                    # Create new site
GET    /api/sites/[id]               # Get site details
PUT    /api/sites/[id]               # Update site
DELETE /api/sites/[id]               # Delete site
POST   /api/sites/[id]/duplicate     # Duplicate site
```

### Page Management APIs
```
GET    /api/sites/[siteId]/pages                # List pages
POST   /api/sites/[siteId]/pages                # Create page
GET    /api/sites/[siteId]/pages/[id]           # Get page
PUT    /api/sites/[siteId]/pages/[id]           # Update page
DELETE /api/sites/[siteId]/pages/[id]           # Delete page
POST   /api/sites/[siteId]/pages/[id]/publish   # Publish page
```

### Block Management APIs
```
GET    /api/blocks                   # List available blocks
GET    /api/blocks/[type]            # Get block definition
POST   /api/blocks                   # Create custom block
PUT    /api/blocks/[id]              # Update block definition
DELETE /api/blocks/[id]              # Delete custom block
```

### Demo Management APIs
```
GET    /api/demos                    # List all demos
GET    /api/demos/[category]         # List demos by category
GET    /api/demos/[id]               # Get demo details
POST   /api/demos/[id]/import        # Import demo to site
POST   /api/demos/[id]/preview       # Generate demo preview
GET    /api/demos/[id]/download      # Download demo assets
```

### Media Management APIs
```
GET    /api/sites/[siteId]/media     # List media files
POST   /api/sites/[siteId]/media     # Upload media
GET    /api/sites/[siteId]/media/[id] # Get media details
PUT    /api/sites/[siteId]/media/[id] # Update media metadata
DELETE /api/sites/[siteId]/media/[id] # Delete media
```

### Content Import/Export APIs
```
POST   /api/sites/[siteId]/export    # Export site content
POST   /api/sites/[siteId]/import    # Import site content
GET    /api/sites/[siteId]/backup    # Create backup
POST   /api/sites/[siteId]/restore   # Restore from backup
```

## Proje Kurulum Adımları

### 1. Proje İnit
```bash
# Next.js projesi oluştur
npx create-next-app@latest panel-backend --typescript --tailwind --eslint --app

cd panel-backend

# Dependency'leri yükle
npm install prisma @prisma/client
npm install next-auth@beta
npm install zod
npm install @types/bcryptjs bcryptjs
npm install cloudinary multer
npm install @types/multer
npm install sharp

# Dev dependencies
npm install -D prisma
npm install -D @types/node
```

### 2. Environment Setup
```bash
# .env.local dosyası oluştur
cp .env.example .env.local
```

```env
# .env.local
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/panel_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-client-id" 
GITHUB_SECRET="your-github-client-secret"

# Media Upload
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# App Settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### 3. Database Setup
```bash
# Prisma init
npx prisma init

# Migrate database
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed database (optional)
npx prisma db seed
```

### 4. Folder Structure
```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── sites/
│   │   ├── pages/
│   │   ├── blocks/
│   │   ├── demos/
│   │   └── media/
│   ├── dashboard/
│   └── page.tsx
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── validations/
│   └── utils/
├── types/
├── components/
└── middleware.ts

prisma/
├── schema.prisma
├── migrations/
└── seed.ts
```

## AI Agent Prompt'ları (Gemini Code Assist)

### 1. Schema Oluşturma
```
Prisma ile modern bir CMS/Page Builder için database schema oluştur:

Modeller:
- User: Authentication, role-based access
- Site: Multi-tenant site management  
- Page: Sayfa yönetimi, block-based content
- Block: Reusable block definitions
- Media: File management
- Demo: Preset demo configurations

İlişkiler:
- User 1-N Site (bir user birden fazla site oluşturabilir)
- Site 1-N Page (her site'ın birden fazla sayfası)
- Site 1-N Media (site'a ait media files)
- Page'ler JSON field ile block data tutsun

TypeScript ile full type-safety sağla.
```

### 2. API Route Oluşturma
```
Next.js App Router ile RESTful API endpoints oluştur:

Endpoint: /api/sites/[siteId]/pages

İşlevler:
- GET: Sayfa listesi (pagination, search, filter)
- POST: Yeni sayfa oluştur (validation ile)
- PUT: Sayfa güncelle
- DELETE: Sayfa sil (soft delete)

Zod ile validation, Prisma ile DB operations.
Error handling ve success responses ekle.
Authentication middleware kontrolü.
```

### 3. Demo Import/Export Sistemi
```
Demo import/export sistemi oluştur:

Demo Format:
- Site settings (theme, config)
- Page templates (JSON blocks)
- Media files (URLs/metadata)
- Block definitions

Import Process:
1. Demo data validation
2. Media files download/upload
3. Pages creation with block data
4. Site settings update
5. Progress tracking

Export Process:
1. Site data serialize
2. Media files package
3. JSON export create

Progress tracking ve error handling ekle.
```

### 4. Authentication Setup
```
NextAuth.js v5 ile authentication sistemi kur:

Providers:
- Credentials (email/password)
- Google OAuth
- GitHub OAuth

Features:
- JWT tokens
- Role-based access (USER, ADMIN)
- Session management
- Protected routes middleware

Database adapter ile Prisma entegre et.
Custom signin/signup pages.
```

### 5. Media Management
```
Cloudinary entegre media management sistemi:

Features:
- File upload (image, video, document)
- Image transformations (resize, crop, format)
- CDN delivery
- Metadata extraction (dimensions, size)
- Alt text management
- Folder organization by site

API Endpoints:
- Upload: multipart/form-data handling
- List: pagination, filtering
- Update: metadata edit
- Delete: Cloudinary cleanup

Validation: file type, size limits.
```

## Geliştirme Workflow'u

### 1. Database-First Yaklaşım
1. Prisma schema tasarla
2. Migration oluştur ve çalıştır
3. TypeScript types generate et
4. API routes implement et

### 2. API Development
1. Zod schema tanımla (validation)
2. Route handler yaz (app/api/)
3. Error handling ekle
4. Swagger documentation

### 3. Testing
1. Unit tests (Jest)
2. Integration tests (API endpoints)
3. Database tests (Prisma)
4. Auth tests (NextAuth)

### 4. Performance Optimization
1. Database query optimization
2. Response caching
3. Image optimization
4. API rate limiting

## Deployment Checklist

### 1. Production Environment
- [ ] Environment variables set
- [ ] Database connection verified
- [ ] OAuth providers configured
- [ ] CDN/Media storage configured

### 2. Security
- [ ] Authentication tested
- [ ] API endpoints secured
- [ ] Rate limiting implemented
- [ ] Input validation active

### 3. Performance
- [ ] Database queries optimized
- [ ] Caching implemented
- [ ] Images optimized
- [ ] Monitoring setup

### 4. Monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Database monitoring
- [ ] API analytics

## Best Practices

### Code Quality
- TypeScript strict mode
- ESLint + Prettier
- Consistent naming conventions
- Error handling standardı

### Security
- Input validation (Zod)
- SQL injection protection (Prisma)
- Authentication checks
- Rate limiting

### Performance
- Database indexing
- Query optimization
- Response caching
- Image optimization

### Maintainability  
- Clean code principles
- Documentation
- Testing coverage
- Version control

## Kritik Başarı Metrikleri

- **API Response Time**: < 200ms
- **Database Query Time**: < 100ms
- **Demo Import Time**: < 3 dakika
- **Uptime**: 99.9%
- **Test Coverage**: > 80%
- **Type Safety**: 100% TypeScript coverage

Bu backend altyapısı, frontend ile tamamen API-first yaklaşımla entegre olacak ve ölçeklenebilir, maintainable bir sistem sağlayacaktır.