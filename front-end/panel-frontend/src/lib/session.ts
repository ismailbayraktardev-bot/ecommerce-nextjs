export type Session = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  expires?: string;
} | null;

export async function getSession(): Promise<Session> {
  try {
    const res = await fetch("/api/auth/session", {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Session;
    if (!data || !data?.user?.email) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getServerSession(): Promise<Session> {
  try {
    const { cookies } = await import("next/headers");
    const cookie = cookies().toString();
    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3100";
    const res = await fetch(`${origin}/api/auth/session`, {
      headers: { accept: "application/json", cookie },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Session;
    if (!data || !data?.user?.email) return null;
    return data;
  } catch {
    return null;
  }
}
