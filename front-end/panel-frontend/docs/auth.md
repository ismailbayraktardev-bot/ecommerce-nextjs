Auth Entegrasyonu

Özet
- Backend: NextAuth v5 endpoint’leri `/api/auth/...` hazır (Arda)
- Frontend: Basit credentials flow eklendi (`signInCredentials`)

Env
- `NEXT_PUBLIC_API_URL` → backend origin (örn: http://localhost:3000)
- Same-origin tercih edilir; farklı origin’de CORS + cookie ayarları gerekir.

Akış
1) Login formu: `/auth/login`
2) `POST /api/auth/callback/credentials` (email, password)
3) Başarılıysa cookie set edilir; UI `/`’a yönlenir.

Dosyalar
- UI: `src/app/(auth)/login/page.tsx`
- API helper: `src/lib/api.ts`

Notlar
- Üretimde next-auth client utils ve CSRF korumaları değerlendirilecek.
- Reverse proxy ile tek origin önerilir.

