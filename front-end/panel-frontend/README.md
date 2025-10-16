Panel Frontend

- Next.js 15.5.5 + React 19.1.0 (TypeScript)
- Tailwind CSS v4
- Shadcn tarzı minimal UI (Button/Input/Label)
- TanStack Query, Zustand, RHF + Zod, @dnd-kit

Geliştirme

- Env: `NEXT_PUBLIC_API_URL` backend origin (örn: http://localhost:3000)
- Komutlar:
  - `npm i`
  - `npm run dev`

Notlar

- Auth: NextAuth client kullanımı. `/api/auth/:path*` istekleri frontend’de backend’e rewrite edilir; login’de `next-auth/react` `signIn('credentials')` kullanılır.
- Tailwind v4: `@import "tailwindcss"` ile çalışır, ek config gerekmez.
