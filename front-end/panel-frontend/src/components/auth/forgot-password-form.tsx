"use client";

import { useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { RHFProvider } from "@/components/ui/form";

const schema = z.object({
  email: z.string().email({ message: "Geçerli bir e‑posta adresi girin" }),
});

type Values = z.infer<typeof schema>;

export function ForgotPasswordForm({ defaultEmail }: { defaultEmail?: string }) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: defaultEmail || "",
    },
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (values: Values) => {
    setError(null);
    setLoading(true);

    try {
      // Backend'e şifre sıfırlama isteği gönder
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "İşlem başarısız");
      }

      setSuccess(true);
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
              E-posta Gönderildi!
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Şifre sıfırlama bağlantısı{" "}
              <span className="font-medium text-gray-900">{form.getValues("email")}</span>{" "}
              adresine gönderildi.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                E-postayı görmüyorsanız spam klasörünüzü kontrol edin.
                Bağlantı 24 saat içinde geçerliliğini yitirecektir.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => setSuccess(false)}
                variant="outline"
                className="w-full h-12 rounded-xl border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
              >
                Tekrar Gönder
              </Button>

              <a
                href="/login"
                className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-all duration-200 hover:shadow-lg"
              >
                <ArrowLeft size={20} />
                Giriş Sayfasına Dön
              </a>
            </div>
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
            Şifrenizi mi Unuttunuz?
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim
          </p>
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
                  className="pr-12 h-12 rounded-xl border-gray-200 bg-gray-50 focus:border-orange-500 focus:bg-white transition-colors"
                  id="email"
                  type="email"
                  placeholder="E-posta adresinizi girin"
                  {...form.register("email")}
                />
              </div>
              <FormError name="email" />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            <Button
              disabled={loading}
              className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-all duration-200 hover:shadow-lg"
              type="submit"
            >
              {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
            </Button>
          </form>
        </RHFProvider>

        {/* Geri Dön */}
        <div className="mt-6 text-center">
          <a
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Giriş sayfasına geri dön
          </a>
        </div>

        {/* Yardım */}
        <div className="mt-8 p-4 bg-gray-50 border border-gray-100 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Yardıma mı ihtiyacınız var?
          </h3>
          <p className="text-xs text-gray-600">
            Hesabınıza erişim konusunda sorun yaşıyorsanız,{" "}
            <a
              href="mailto:destek@gradiator.com"
              className="text-orange-500 hover:text-orange-600 hover:underline transition-colors"
            >
              destek ekibimiz
            </a>{" "}
            ile iletişime geçin.
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
