Conventions

Kodlama
- TypeScript zorunlu, `any` kaçınılır.
- Server Components varsayılan; client gerekliyse `"use client"`.
- Fonksiyonel komponentler, küçük ve tek sorumluluk.

UI/UX
- WCAG 2.1 AA: odak, kontrast, klavye desteği.
- Tailwind utility-first; gereksiz custom CSS eklenmez.
- Bileşen API’ları tutarlı: `variant`, `size` gibi ortak props.

Adlandırma
- Dosyalar kebab-case; route klasörleri App Router konvansiyonlarıyla.
- UI primitifleri: `src/components/ui/*`.

Test/Quality
- ESLint temiz; derleme hatasız.
- Kritik akışlar için Playwright planlanacak.

