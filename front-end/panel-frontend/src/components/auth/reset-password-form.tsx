"use client";

import { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { RHFProvider } from "@/components/ui/form";

const schema = z
  .object({
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
    confirmPassword: z.string().min(6, "Şifre tekrarı gereklidir"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

type Values = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Token validation
  useEffect(() => {
    if (!token) {
      setError("Geçersiz veya eksik sıfırlama bağlantısı");
    }
  }, [token]);

  const onSubmit = async (values: Values) => {
    if (!token) {
      setError("Geçersiz sıfırlama bağlantısı");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Şifre sıfırlama başarısız");
      }

      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (e: any) {
      setError(e?.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="rounded-2xl bg-white shadow-lg border border-gray-200 p-8 text-center">
          {/* Logo ve Başlık */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BrandLogo className="h-8 w-8" />
              <div className="text-xl font-bold tracking-tight text-gray-900">
                Gradiator
              </div>
            </div>
            <div className="mb-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Şifreniz Başarıyla Değiştirildi!
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Yeni şifrenizle giriş yapabilirsiniz. Giriş sayfasına yönlendiriliyorsunuz...
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                3 saniye içinde otomatik olarak giriş sayfasına yönlendirileceksiniz.
              </p>
            </div>

            <a
              href="/login"
              className="flex items-center justify-center w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-all duration-200 hover:shadow-lg"
            >
              Hemen Giriş Yap
            </a>
          </div>
        </div>
      </div>
    );
  }

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
            Yeni Şifre Belirleyin
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Hesabınız için güçlü bir şifre oluşturun
          </p>
        </div>

        {/* Form */}
        <RHFProvider form={form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Yeni Şifre */}
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
                  className="pr-12 h-12 rounded-xl border-gray-200 bg-gray-50 focus:border-orange-500 focus:bg-white transition-colors"
                  id="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="Yeni şifrenizi girin"
                  {...form.register("password")}
                  disabled={!token}
                />
              </div>
              <FormError name="password" />
            </div>

            {/* Şifre Tekrarı */}
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd((v) => !v)}
                    className="p-1 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <Input
                  className="pr-12 h-12 rounded-xl border-gray-200 bg-gray-50 focus:border-orange-500 focus:bg-white transition-colors"
                  id="confirmPassword"
                  type={showConfirmPwd ? "text" : "password"}
                  placeholder="Şifrenizi tekrar girin"
                  {...form.register("confirmPassword")}
                  disabled={!token}
                />
              </div>
              <FormError name="confirmPassword" />
            </div>

            {/* Şifre Gereksinimleri */}
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
              <h3 className="text-xs font-medium text-gray-900 mb-2">
                Şifre Gereksinimleri:
              </h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• En az 6 karakter uzunluğunda olmalı</li>
                <li>• Güçlü bir şifre için harf, rakam ve özel karakter kullanın</li>
              </ul>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            <Button
              disabled={loading || !token}
              className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
            >
              {loading ? "Şifre Değiştiriliyor..." : "Şifreyi Değiştir"}
            </Button>
          </form>
        </RHFProvider>

        {/* Giriş Linki */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Şifrenizi hatırladınız mı?{" "}
            <a
              href="/login"
              className="text-orange-500 hover:text-orange-600 hover:underline font-medium transition-colors"
            >
              Giriş Yapın
            </a>
          </p>
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
