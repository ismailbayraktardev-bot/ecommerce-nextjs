"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateSite } from "@/hooks/use-sites";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { RHFProvider } from "@/components/ui/form";

const schema = z.object({
  name: z.string().min(2, "Site adı en az 2 karakter olmalıdır"),
  description: z.string().optional(),
  subdomain: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[a-z0-9-]+$/.test(val),
      "Subdomain sadece küçük harf, rakam ve tire (-) içerebilir"
    ),
  domain: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(val),
      "Geçerli bir domain adresi girin"
    ),
});

type Values = z.infer<typeof schema>;

export default function CreateSitePage() {
  const router = useRouter();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      subdomain: "",
      domain: "",
    },
  });

  const createSite = useCreateSite();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: Values) => {
    setError(null);

    try {
      const site = await createSite.mutateAsync({
        name: values.name,
        description: values.description || undefined,
        subdomain: values.subdomain || undefined,
        domain: values.domain || undefined,
      });

      // Redirect to sites list or site edit page
      router.push(`/sites/${site.id}/edit`);
    } catch (e: any) {
      setError(e?.message || "Site oluşturulurken bir hata oluştu");
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/sites"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Sitelere Geri Dön
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            Yeni Site Oluştur
          </h1>
          <p className="text-sm text-gray-600 mt-2 ml-15">
            İlk sitenizi oluşturun ve yayına başlayın
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
          <RHFProvider form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Site Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Site Adı *
                </label>
                <Input
                  type="text"
                  placeholder="Örn: E-ticaret Sitem"
                  className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:border-teal-400 focus:bg-white transition-colors"
                  {...form.register("name")}
                />
                <FormError name="name" />
                <p className="text-xs text-gray-500">
                  Sitenizin gösterilen adı. İstediğiniz zaman değiştirebilirsiniz.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Açıklama (Opsiyonel)
                </label>
                <textarea
                  placeholder="Siteniz hakkında kısa bir açıklama..."
                  className="w-full h-24 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-teal-400 focus:bg-white focus:outline-none transition-colors resize-none"
                  {...form.register("description")}
                />
                <FormError name="description" />
              </div>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500 font-medium">
                    Domain Ayarları
                  </span>
                </div>
              </div>

              {/* Subdomain */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Subdomain (Opsiyonel)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="orneksitem"
                    className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:border-teal-400 focus:bg-white transition-colors"
                    {...form.register("subdomain")}
                  />
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    .gradiator.com
                  </span>
                </div>
                <FormError name="subdomain" />
                <p className="text-xs text-gray-500">
                  Ücretsiz subdomain ile hemen başlayın. Sadece küçük harf, rakam ve tire (-) kullanın.
                </p>
              </div>

              {/* Custom Domain */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Özel Domain (Opsiyonel)
                </label>
                <Input
                  type="text"
                  placeholder="orneksite.com"
                  className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:border-teal-400 focus:bg-white transition-colors"
                  {...form.register("domain")}
                />
                <FormError name="domain" />
                <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-800">
                    Kendi domain adresinizi kullanabilirsiniz. DNS ayarlarını yaptıktan
                    sonra domain aktif olacaktır.
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4">
                <Link href="/sites" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 rounded-xl border-gray-200 hover:bg-gray-50"
                  >
                    İptal
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={createSite.isPending}
                  className="flex-1 h-12 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-medium transition-all duration-200 hover:shadow-lg"
                >
                  {createSite.isPending ? "Oluşturuluyor..." : "Site Oluştur"}
                </Button>
              </div>
            </form>
          </RHFProvider>
        </div>

        {/* Help Section */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-100 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            💡 İpucu
          </h3>
          <p className="text-xs text-gray-600">
            Site oluşturduktan sonra sayfa ekleyebilir, tema özelleştirebilir ve
            içeriklerinizi yönetebilirsiniz. Subdomain veya domain şu an belirtmezseniz
            daha sonra ekleyebilirsiniz.
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
