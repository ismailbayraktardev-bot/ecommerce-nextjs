"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreatePage } from "@/hooks/use-pages";
import { useSite } from "@/hooks/use-sites";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { RHFProvider } from "@/components/ui/form";

const schema = z.object({
  title: z.string().min(2, "Sayfa başlığı en az 2 karakter olmalıdır"),
  slug: z
    .string()
    .min(1, "Slug gereklidir")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug sadece küçük harf, rakam ve tire (-) içerebilir"
    ),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isPublished: z.boolean(),
});

type Values = z.infer<typeof schema>;

export default function CreatePagePage() {
  const params = useParams();
  const router = useRouter();
  const siteId = params.id as string;

  const { data: site } = useSite(siteId);
  const createPage = useCreatePage(siteId);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      slug: "",
      metaTitle: "",
      metaDescription: "",
      isPublished: false,
    },
  });

  // Auto-generate slug from title
  const watchTitle = form.watch("title");
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);

    // Auto-generate slug if not manually edited
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    if (!form.formState.dirtyFields.slug) {
      form.setValue("slug", slug);
    }
  };

  const onSubmit = async (values: Values) => {
    setError(null);

    try {
      const page = await createPage.mutateAsync({
        title: values.title,
        slug: values.slug,
        metaTitle: values.metaTitle || undefined,
        metaDescription: values.metaDescription || undefined,
        isPublished: values.isPublished,
        content: {}, // Empty content, will be filled in page editor
      });

      // Redirect to page editor
      router.push(`/pages/${page.id}/edit`);
    } catch (e: any) {
      setError(e?.message || "Sayfa oluşturulurken bir hata oluştu");
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/sites/${siteId}/pages`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Sayfalara Geri Dön
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            Yeni Sayfa Oluştur
          </h1>
          <p className="text-sm text-gray-600 mt-2 ml-15">
            {site?.name || "Site"} için yeni bir sayfa oluşturun
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
          <RHFProvider form={form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Page Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Sayfa Başlığı *
                </label>
                <Input
                  type="text"
                  placeholder="Örn: Ana Sayfa, Hakkımızda, İletişim"
                  className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:border-green-400 focus:bg-white transition-colors"
                  {...form.register("title")}
                  onChange={handleTitleChange}
                />
                <FormError name="title" />
                <p className="text-xs text-gray-500">
                  Sayfanızın başlığı. Ziyaretçiler tarafından görülecek.
                </p>
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  URL Slug *
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {site?.domain || site?.subdomain || "site"}/
                  </span>
                  <Input
                    type="text"
                    placeholder="ana-sayfa"
                    className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:border-green-400 focus:bg-white transition-colors"
                    {...form.register("slug")}
                  />
                </div>
                <FormError name="slug" />
                <p className="text-xs text-gray-500">
                  URL'de görünecek kısım. Otomatik oluşturulur, isterseniz
                  değiştirebilirsiniz.
                </p>
              </div>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500 font-medium">
                    SEO Ayarları (Opsiyonel)
                  </span>
                </div>
              </div>

              {/* Meta Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Meta Başlık
                </label>
                <Input
                  type="text"
                  placeholder="Sayfa başlığından farklıysa girin"
                  className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:border-green-400 focus:bg-white transition-colors"
                  {...form.register("metaTitle")}
                />
                <FormError name="metaTitle" />
                <p className="text-xs text-gray-500">
                  Arama motorlarında görünecek başlık. Boş bırakılırsa sayfa
                  başlığı kullanılır.
                </p>
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Meta Açıklama
                </label>
                <textarea
                  placeholder="Sayfa hakkında kısa bir açıklama (150-160 karakter önerilir)"
                  className="w-full h-24 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-green-400 focus:bg-white focus:outline-none transition-colors resize-none"
                  {...form.register("metaDescription")}
                />
                <FormError name="metaDescription" />
                <p className="text-xs text-gray-500">
                  Arama sonuçlarında görünecek açıklama. SEO için önemlidir.
                </p>
              </div>

              {/* Publish Status */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="isPublished"
                  className="h-4 w-4 rounded border-gray-300 text-green-500 focus:ring-green-400"
                  {...form.register("isPublished")}
                />
                <label
                  htmlFor="isPublished"
                  className="text-sm text-gray-700 flex items-center gap-2"
                >
                  {form.watch("isPublished") ? (
                    <>
                      <Eye className="w-4 h-4 text-green-600" />
                      <span>
                        Sayfayı hemen yayınla (taslak olarak kalmayacak)
                      </span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 text-gray-500" />
                      <span>Taslak olarak kaydet (yayınlanmayacak)</span>
                    </>
                  )}
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4">
                <Link href={`/sites/${siteId}/pages`} className="flex-1">
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
                  disabled={createPage.isPending}
                  className="flex-1 h-12 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-all duration-200 hover:shadow-lg"
                >
                  {createPage.isPending
                    ? "Oluşturuluyor..."
                    : "Sayfa Oluştur & Düzenle"}
                </Button>
              </div>
            </form>
          </RHFProvider>
        </div>

        {/* Help Section */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-100 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">💡 İpucu</h3>
          <p className="text-xs text-gray-600">
            Sayfa oluşturduktan sonra page builder ile içerik ekleyebilir, bloklar
            ekleyebilir ve tasarımı özelleştirebilirsiniz. Taslak olarak
            kaydederseniz yayınlamadan önce düzenleyebilirsiniz.
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
