Contributing – Panel Frontend

Requirements
- Node 20+ (LTS)
- pnpm veya npm (tercih serbest)

Install & Run
- Klasör: `front-end/panel-frontend`
- `npm i`
- `cp .env.example .env.local` ve değerleri düzenleyin
- `npm run dev` → http://localhost:3100

Code Style
- TypeScript strict, React 19, Next.js App Router
- Tailwind v4 utility-first (inline), minimal custom CSS
- Component props tipli, erişilebilirlik (WCAG 2.1 AA) gözetin
- Dosya adları: kebab-case, component dosyaları PascalCase değil (Next App Router ile uyum)

PR Checklist
- ESLint temiz: `npm run lint`
- Derleme geçer: `npm run build`
- Lighthouse temel metrikler > 90 (Local UI parçaları için)
- UI: Klavye navigasyonu ve odak halkaları mevcut

Folders
- `src/app` → routes/layout
- `src/components/ui` → düşük seviye UI
- `src/providers` → context/provider bileşenleri
- `src/lib` → api ve yardımcılar
- `src/store` → Zustand store’lar
- `docs/` → mimari, kararlar, rehberler

