# Frontend Architecture - Updated

## Stack & Technology Decisions

### Core Framework
- **Next.js 15.5.5** (App Router) + **React 19.1**
- **TypeScript** (strict mode) - 100% coverage
- **Tailwind CSS v4** (config-free approach)
- **Port**: 3104 (backend: 3000, avoiding conflicts)

### State Management & Data
- **Zustand** - Global state management (planned)
- **TanStack Query** - Server state & caching
- **React Hook Form + Zod** - Form validation & handling
- **NextAuth.js v5** - Authentication system

### UI & Interaction
- **Shadcn/ui inspired primitives** - Custom UI component library
- **@dnd-kit** - Drag & drop (page builder - planned)
- **Lucide React** - Icon system
- **Framer Motion** - Animations (planned)

### Development Tools
- **ESLint + Next.js config** - Code quality
- **PostCSS** - CSS processing
- **TypeScript compiler** - Type checking

## Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── (auth)/             # Auth route group
│   │   └── login/          # ✅ Login page
│   ├── (dashboard)/        # Dashboard route group  
│   │   ├── dashboard/      # ⚠️ Basic dashboard
│   │   ├── sites/         # ⚠️ Site management (planned)
│   │   └── pages/         # ⚠️ Page management (planned)
│   ├── register/          # ✅ Registration page
│   ├── forgot-password/   # ✅ Password reset
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home redirect
├── components/
│   ├── auth/              # ✅ Authentication components
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── forgot-password-form.tsx
│   ├── app/               # ✅ Application components
│   │   └── topbar.tsx
│   ├── brand/             # ✅ Brand assets
│   │   └── logo.tsx
│   └── ui/                # ✅ UI primitives
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── form.tsx
├── lib/                   # Utilities & helpers
│   └── session.ts         # ✅ Session management
├── providers/             # ✅ React providers
│   ├── auth-provider.tsx
│   ├── query-provider.tsx
│   └── theme-provider.tsx
└── store/                 # ⚠️ Zustand stores (planned)
```

## Authentication Architecture

### Current Implementation Status: ✅ Complete

```typescript
// Authentication Flow
1. User visits protected route → Redirected to /login
2. Login form → NextAuth.js credentials provider
3. Session established → Redirect to /dashboard
4. Session management via cookies + server-side validation
```

### Auth Pages Status
- **Login**: ✅ Production ready (hedef tasarıma uygun)
- **Register**: ✅ Complete with validation
- **Forgot Password**: ✅ UI ready, backend integration pending

### Session Management
```typescript
// lib/session.ts
- getSession() - Client-side session fetching
- getServerSession() - Server component session
- Session type definitions
- Error handling for auth failures
```

## Component Architecture

### Design System Principles
1. **Utility-first CSS** - Tailwind classes preferred
2. **Composition over inheritance** - Small, focused components
3. **TypeScript strict** - All props and states typed
4. **Accessibility first** - WCAG 2.1 AA compliance
5. **Consistent animations** - 200-300ms transitions

### UI Component Standards
```typescript
// Component naming convention
- PascalCase for components
- kebab-case for files
- Descriptive prop interfaces
- Default exports with displayName

// Example structure:
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(...)
```

### Color System & Theming
```css
/* Page-specific color coding */
Login: Blue theme (#3B82F6, #1D4ED8)
Register: Teal theme (#14B8A6, #0F766E)  
Forgot Password: Orange theme (#F97316, #EA580C)

/* Consistent across all pages */
- Form containers: bg-white with subtle shadow
- Input states: bg-gray-50 → bg-white on focus
- Error states: red-50 background, red-600 text
- Success states: green-50 background, green-600 text
```

## State Management Strategy

### Current Status: ⚠️ Basic Implementation

```typescript
// Session state - ✅ Implemented
- NextAuth.js session provider
- Server/client session sync
- Automatic redirects

// Form state - ✅ Implemented
- React Hook Form + Zod validation
- Field-level error handling
- Optimistic UI updates

// Global app state - ⚠️ Planned
- Zustand store setup pending
- Site management state
- Page builder state
- User preferences
```

### Planned Zustand Architecture
```typescript
// stores/auth.ts - User authentication state
// stores/sites.ts - Site management
// stores/pageBuilder.ts - Canvas & block state
// stores/ui.ts - UI preferences & themes
```

## Performance Considerations

### Current Optimizations ✅
- **Next.js 15** automatic optimizations
- **Static generation** where possible
- **Component memoization** for expensive renders
- **Image optimization** via next/image
- **Font optimization** with next/font

### Bundle Analysis (Planned)
- Bundle analyzer integration
- Code splitting audit
- Unused dependency cleanup
- Performance budget establishment

### Target Metrics
```
First Contentful Paint: < 1.2s
Largest Contentful Paint: < 2.5s
Cumulative Layout Shift: < 0.1
First Input Delay: < 100ms
```

## API Integration Strategy

### Current Status: ⚠️ Partial Implementation

```typescript
// Authentication APIs - ✅ Working
POST /api/auth/signin (NextAuth.js)
GET  /api/auth/session
POST /api/auth/signout

// Pending Backend Integration
POST /api/auth/register     // Register form ready
POST /api/auth/forgot       // Forgot password form ready
GET  /api/user/profile      // User profile planned
```

### TanStack Query Setup (Planned)
```typescript
// Query configuration
- Automatic retries
- Background refetching  
- Optimistic updates
- Error boundary integration
- Caching strategies
```

## Development Workflow

### Local Development
```bash
# Development server
npm run dev -- -p 3104

# Type checking
npm run typecheck

# Linting
npm run lint

# Production build test
npm run build
```

### Code Quality Gates
- **TypeScript**: No `any` types, strict mode
- **ESLint**: Zero warnings/errors
- **Component testing**: Manual QA for now
- **Accessibility**: Manual testing with screen readers

## Deployment Architecture

### Current Status: ⚠️ Planning Phase

```
Development: localhost:3104
Staging: TBD (Vercel planned)
Production: TBD (Vercel planned)

Environment Variables:
- NEXT_PUBLIC_APP_URL
- NEXT_PUBLIC_API_URL  
- NEXTAUTH_SECRET
- NEXTAUTH_URL
```

## Security Considerations

### Implemented ✅
- **NextAuth.js** secure session management
- **CSRF protection** via NextAuth.js
- **XSS protection** via React's built-in escaping
- **TypeScript** compile-time type safety

### Pending Implementation
- Content Security Policy headers
- Rate limiting on auth endpoints
- Input sanitization validation
- Secure cookie configuration

## Browser Support

### Target Browsers
- Chrome 100+ ✅
- Firefox 100+ ✅  
- Safari 15+ ✅
- Edge 100+ ✅

### Progressive Enhancement
- Core functionality without JavaScript
- Graceful degradation for older browsers
- Accessibility-first approach

## Future Architecture Decisions

### Sprint 2 Planned Changes
1. **Zustand Integration** - Global state management
2. **TanStack Query** - Server state & API layer
3. **Error Boundaries** - Graceful error handling
4. **Loading States** - Better UX during async operations

### Sprint 3+ Considerations
1. **@dnd-kit Integration** - Page builder drag & drop
2. **Real-time Updates** - WebSocket or Server-Sent Events
3. **Advanced Caching** - Service Worker implementation
4. **PWA Features** - Offline capability

---

**Last Updated**: 2025-01-28  
**Architecture Status**: Sprint 1 Foundation Complete ✅  
**Next Review**: Sprint 2 Planning