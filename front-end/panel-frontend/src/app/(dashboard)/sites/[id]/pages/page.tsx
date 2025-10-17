"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePages, useDeletePage } from "@/hooks/use-pages";
import { useSite } from "@/hooks/use-sites";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  FileText,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function SitePagesPage() {
  const params = useParams();
  const router = useRouter();
  const siteId = params.id as string;

  const [searchQuery, setSearchQuery] = useState("");
  const { data: site } = useSite(siteId);
  const { data, isLoading, error } = usePages(siteId);
  const deletePage = useDeletePage();

  const pages = data?.pages || [];

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">
            Sayfalar yüklenirken hata oluştu: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/sites"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Sitelere Geri Dön
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Sayfalar
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {site?.name || "Site"} için tüm sayfalarınızı buradan yönetin
            </p>
          </div>
          <Link href={`/sites/${siteId}/pages/create`}>
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Sayfa Oluştur
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Sayfa ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 rounded-xl border-gray-200 bg-white focus:border-green-400 transition-colors"
        />
      </div>

      {/* Pages List */}
      {filteredPages.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery
              ? "Arama sonucu bulunamadı"
              : "Henüz sayfa oluşturmadınız"}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? "Farklı bir arama terimi deneyin"
              : "İlk sayfanızı oluşturarak başlayın"}
          </p>
          {!searchQuery && (
            <Link href={`/sites/${siteId}/pages/create`}>
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Yeni Sayfa Oluştur
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPages.map((page) => (
            <div
              key={page.id}
              className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Page Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg truncate">
                      {page.title}
                    </h3>
                    {page.isPublished ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                        <Eye className="w-3 h-3" />
                        Yayında
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        <EyeOff className="w-3 h-3" />
                        Taslak
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="truncate">/{page.slug}</span>
                    <span>·</span>
                    <span>
                      {new Date(page.updatedAt).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {page.metaDescription && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {page.metaDescription}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/pages/${page.id}/edit`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 border-gray-200 hover:bg-gray-50"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Düzenle
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      if (
                        confirm(
                          `"${page.title}" sayfasını silmek istediğinizden emin misiniz?`
                        )
                      ) {
                        deletePage.mutate(page.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Info */}
      {data?.pagination && (
        <div className="text-sm text-gray-600 text-center pt-4">
          Toplam {data.pagination.total} sayfadan {filteredPages.length} tanesi
          gösteriliyor
        </div>
      )}
    </div>
  );
}
