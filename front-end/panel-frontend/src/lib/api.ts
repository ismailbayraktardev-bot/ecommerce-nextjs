export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    credentials: 'include',
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed: ${res.status}`)
  }
  const ct = res.headers.get('content-type')
  if (ct && ct.includes('application/json')) return res.json() as Promise<T>
  // @ts-expect-error allow unknown
  return (null as T)
}

export type SignInResponse = {
  ok: boolean
  error?: string
}

export async function signInCredentials(email: string, password: string): Promise<SignInResponse> {
  // NextAuth credentials genelde /api/auth/callback/credentials endpoint'ine post edilir
  // Backend ile aynı origin altında çalışıldığı varsayımıyla cookie set edilecektir.
  const form = new URLSearchParams()
  form.set('email', email)
  form.set('password', password)
  // csrf korumaları için backend ayarları gerekebilir; burada temel akış sağlanır.
  const res = await fetch(`${API_BASE_URL}/api/auth/callback/credentials`, {
    method: 'POST',
    body: form,
    credentials: 'include',
  })
  if (res.ok) return { ok: true }
  return { ok: false, error: await res.text() }
}
