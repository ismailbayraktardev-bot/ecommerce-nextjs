import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Giriş Yap - Gradiator",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params?.callbackUrl;

  return (
    <main className="min-h-dvh bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-dvh border-4 border-gray-200">
        {/* Sol Taraf - Form */}
        <div className="flex-1 flex items-center justify-center p-8 border-r-2 border-gray-200">
          <div className="w-full max-w-md">
            <LoginForm callbackUrl={callbackUrl} />
          </div>
        </div>

        {/* Sağ Taraf - Görsel */}
        <div className="flex-1 relative overflow-hidden">
          <div className="h-full w-full bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-800">
            {/* Akan gradient overlay'lar */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.8),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(147,51,234,0.6),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]" />

            {/* Orta alt kısımda copyright */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 max-w-sm text-center">
              <div className="rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 px-6 py-4 shadow-lg">
                <p className="text-sm text-white font-semibold mb-2">
                  © 2025 İsmail Bayraktar
                </p>
                <p className="text-xs text-white/90 leading-relaxed">
                  E-ticaret Web Uygulaması
                  <br />
                  Tüm hakları saklıdır
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-dvh flex flex-col">
        {/* Form Section */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md">
            <LoginForm callbackUrl={callbackUrl} />
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="p-4 text-center bg-blue-600">
          <p className="text-sm text-white font-medium">
            © 2025 İsmail Bayraktar
          </p>
          <p className="text-xs text-blue-100 mt-1">
            E-ticaret Web Uygulaması - Tüm hakları saklıdır
          </p>
        </div>
      </div>
    </main>
  );
}
