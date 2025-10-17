"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSite, useUpdateSite, useDeleteSite } from "@/hooks/use-sites";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, ArrowLeft, Trash2, Save, AlertTriangle } from "lucide-react";
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

export default function EditSitePage() {
  const params = useParams();
  const router = useRouter();
  const siteId = params.id as string;

  const { data: site, isLoading } = useSite(siteId);
  const updateSite = useUpdateSite(siteId);
  const deleteSite = useDeleteSite();

  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    values: {
      name: site?.name || "",
      description: site?.description || "",
      subdomain: site?.subdomain || "",
      domain: site?.domain || "",
    },
  });

  const onSubmit = async (values: Values) => {
    setError(null);

    try {
      await updateSite.mutateAsync({
        name: values.name,
        description: values.description || undefined,
        subdomain: values.subdomain || undefined,
        domain: values.domain || undefined,
      });

      // Show success message (could use toast)
      alert("Site başarıyla güncellendi!");
    } catch (e: any) {
      setError(e?.message || "Site güncellenirken bir hata oluştu");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSite.mutateAsync(siteId);
      router.push("/sites");
    } catch (e: any) {
      setError(e?.message || "Site silinirken bir hata oluştu");
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Site bulunamadı</p>
        </div>
      </div>
    );
  }

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
            Site Düzenle
          </h1>
          <p className="text-sm text-gray-600 mt-2 ml-15">
            {site.name} ayarlarını buradan yönetin
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-8">
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
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Açıklama
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
                  Subdomain
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
              </div>

              {/* Custom Domain */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Özel Domain
                </label>
                <Input
                  type="text"
                  placeholder="orneksite.com"
                  className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:border-teal-400 focus:bg-white transition-colors"
                  {...form.register("domain")}
                />
                <FormError name="domain" />
              </div>

              {/* Site Stats */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Site İstatistikleri
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Sayfalar</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {site._count?.pages || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Medya</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {site._count?.media || 0}
                    </div>
                  </div>
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
                  disabled={updateSite.isPending}
                  className="flex-1 h-12 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-medium transition-all duration-200 hover:shadow-lg"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateSite.isPending ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </Button>
              </div>
            </form>
          </RHFProvider>

          {/* Danger Zone */}
          <div className="pt-8 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Tehlikeli Bölge
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              Bu işlemler geri alınamaz. Lütfen dikkatli olun.
            </p>

            {!showDeleteConfirm ? (
              <Button
                type="button"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Siteyi Sil
              </Button>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
                <p className="text-sm text-red-800 font-medium">
                  "{site.name}" sitesini silmek istediğinizden emin misiniz?
                </p>
                <p className="text-xs text-red-600">
                  Bu işlem tüm sayfaları, medya dosyalarını ve ayarları
                  kalıcı olarak silecektir.
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1"
                  >
                    İptal
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleDelete}
                    disabled={deleteSite.isPending}
                  >
                    {deleteSite.isPending ? "Siliniyor..." : "Evet, Sil"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Link href={`/sites/${siteId}/pages`}>
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-gray-200 hover:bg-gray-50"
            >
              Sayfaları Yönet
            </Button>
          </Link>
          <Link href={`/sites/${siteId}/media`}>
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-gray-200 hover:bg-gray-50"
            >
              Medya Kütüphanesi
            </Button>
          </Link>
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
