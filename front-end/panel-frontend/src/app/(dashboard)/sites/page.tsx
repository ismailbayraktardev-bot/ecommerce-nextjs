"use client";

import { useState } from "react";
import { useSites, useDeleteSite } from "@/hooks/use-sites";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Globe, Trash2, Edit, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function SitesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, error } = useSites();
  const deleteSite = useDeleteSite();

  const sites = data?.sites || [];

  const filteredSites = sites.filter((site) =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.domain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.subdomain?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
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
            Siteler yüklenirken hata oluştu: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Sitelerim
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Tüm sitelerinizi buradan yönetin
          </p>
        </div>
        <Link href="/sites/create">
          <Button className="bg-teal-500 hover:bg-teal-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Site Oluştur
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Site ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 rounded-xl border-gray-200 bg-white focus:border-teal-400 transition-colors"
        />
      </div>

      {/* Sites Grid */}
      {filteredSites.length === 0 ? (
        <div className="text-center py-16">
          <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? "Arama sonucu bulunamadı" : "Henüz site oluşturmadınız"}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? "Farklı bir arama terimi deneyin"
              : "İlk sitenizi oluşturarak başlayın"}
          </p>
          {!searchQuery && (
            <Link href="/sites/create">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Yeni Site Oluştur
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSites.map((site) => (
            <div
              key={site.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200"
            >
              {/* Site Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {site.name[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {site.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <Globe className="w-3 h-3" />
                      {site.domain || site.subdomain || "Yayında değil"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {site.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {site.description}
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-100">
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

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link href={`/sites/${site.id}/edit`} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full h-9 text-sm border-gray-200 hover:bg-gray-50"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Düzenle
                  </Button>
                </Link>
                {site.domain && (
                  <a
                    href={`https://${site.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 border-gray-200 hover:bg-gray-50"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => {
                    if (confirm(`"${site.name}" sitesini silmek istediğinizden emin misiniz?`)) {
                      deleteSite.mutate(site.id);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Info */}
      {data?.pagination && (
        <div className="text-sm text-gray-600 text-center pt-4">
          Toplam {data.pagination.total} siteden {filteredSites.length} tanesi gösteriliyor
        </div>
      )}
    </div>
  );
}
