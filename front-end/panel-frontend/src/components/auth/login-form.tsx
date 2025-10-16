"use client";

import { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { RHFProvider } from "@/components/ui/form";

const schema = z.object({
  email: z.string().email({ message: "Geçerli bir e‑posta adresi girin" }),
  password: z.string().min(4, "En az 4 karakter olmalıdır"),
  remember: z.boolean().optional(),
});

type Values = z.infer<typeof schema>;

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const { status } = useSession();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: true },
  });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    if (status === "authenticated") {
      window.location.href = callbackUrl || "/dashboard";
    }
  }, [status, callbackUrl]);

  const onSubmit = async (values: Values) => {
    setError(null);
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: callbackUrl || "/dashboard",
      });
      if (res?.error) setError(res.error || "Giriş başarısız");
      else window.location.href = res?.url || callbackUrl || "/dashboard";
    } catch (e: any) {
      setError(e?.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl bg-white shadow-lg border border-gray-200 p-8 relative">
        {/* Logo ve Başlık */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BrandLogo className="h-8 w-8" />
            <div className="text-xl font-bold tracking-tight text-gray-900">
              Gradiator
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tekrar Hoş Geldin!
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Seni yeniden görmek harika
          </p>
        </div>

        {/* Tab'lar */}
        <div className="mb-8">
          <div className="relative flex rounded-full bg-gray-100 p-1">
            {/* Animasyonlu background */}
            <div
              className={`absolute top-1 h-8 rounded-full bg-blue-500 shadow-sm transition-all duration-300 ease-out ${
                activeTab === "signin"
                  ? "left-1 w-[calc(50%-4px)]"
                  : "left-[calc(50%+2px)] w-[calc(50%-4px)]"
              }`}
            />
            <button
              type="button"
              onClick={() => setActiveTab("signin")}
              className={`relative z-10 flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                activeTab === "signin"
                  ? "text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Giriş Yap
            </button>
            <a
              href="/register"
              className={`relative z-10 flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 text-center ${
                activeTab === "signup"
                  ? "text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Kayıt Ol
            </a>
          </div>
        </div>

        {/* Form */}
        <RHFProvider form={form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                  <Mail size={20} />
                </div>
                <Input
                  className="pr-12 h-12 rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors"
                  id="email"
                  type="email"
                  placeholder="E-posta adresinizi girin"
                  {...form.register("email")}
                />
              </div>
              <FormError name="email" />
            </div>

            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="p-1 hover:text-gray-600 transition-colors"
                  >
                    {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <Input
                  className="pr-12 h-12 rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white transition-colors"
                  id="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="Şifrenizi girin"
                  {...form.register("password")}
                />
              </div>
              <FormError name="password" />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 transition-colors"
                  {...form.register("remember")}
                />
                Beni hatırla
              </label>
              <a
                className="text-sm text-blue-500 hover:text-blue-600 hover:underline transition-colors"
                href="/forgot-password"
              >
                Şifremi unuttum?
              </a>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            <Button
              disabled={loading}
              className="w-full h-12 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-all duration-200 hover:shadow-lg"
              type="submit"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
        </RHFProvider>

        {/* Ayırıcı */}
        <div className="my-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-500 font-medium">
                VEYA
              </span>
            </div>
          </div>
        </div>

        {/* Sosyal Medya Girişleri */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              // Apple Sign In - gelecekte implement edilecek
              console.log("Apple ile giriş tıklandı");
            }}
            className="w-full flex items-center justify-center gap-3 h-12 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition-all duration-200 hover:shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
            </svg>
            Apple ile Giriş Yap
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              signIn("google", { callbackUrl: callbackUrl || "/dashboard" });
            }}
            className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google ile Giriş Yap
          </button>
        </div>
      </div>
    </div>
  );
}

function FormError({ name }: { name: keyof Values }) {
  const { formState } = useFormContext<Values>();
  const err = formState.errors?.[name]?.message as string | undefined;
  if (!err) return null;
  return <p className="text-xs text-red-600 ml-1">{err}</p>;
}
