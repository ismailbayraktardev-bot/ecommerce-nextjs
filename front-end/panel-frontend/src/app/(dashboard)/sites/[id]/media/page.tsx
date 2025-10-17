"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useSite } from "@/hooks/use-sites";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  Search,
  Image as ImageIcon,
  Trash2,
  ArrowLeft,
  X,
} from "lucide-react";
import Link from "next/link";

// Placeholder - will be implemented with real API
interface MediaFile {
  id: string;
  url: string;
  filename: string;
  type: string;
  size: number;
  createdAt: string;
}

export default function SiteMediaPage() {
  const params = useParams();
  const siteId = params.id as string;

  const { data: site } = useSite(siteId);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Placeholder media files - will be fetched from API
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Handle file upload
    handleUpload(Array.from(files));
  };

  const handleUpload = async (files: File[]) => {
    setUploading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("siteId", siteId);

        const response = await fetch(`${API_URL}/api/media/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();

        // Add to media files list
        setMediaFiles((prev) => [
          {
            id: data.media.id,
            url: data.media.url,
            filename: data.media.filename,
            type: data.media.type,
            size: data.media.size,
            createdAt: data.media.createdAt,
          },
          ...prev,
        ]);
      }

      alert("Dosyalar başarıyla yüklendi!");
    } catch (error) {
      alert("Dosya yükleme hatası!");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    handleUpload(files);
  };

  const filteredMedia = mediaFiles.filter((file) =>
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

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
              Medya Kütüphanesi
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {site?.name || "Site"} için tüm medya dosyalarınızı buradan
              yönetin
            </p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer bg-gray-50"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Dosya Yükle
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Dosyaları buraya sürükleyin veya tıklayarak seçin
        </p>
        <Button
          type="button"
          className="bg-purple-500 hover:bg-purple-600 text-white"
          disabled={uploading}
        >
          {uploading ? "Yükleniyor..." : "Dosya Seç"}
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Medya ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 rounded-xl border-gray-200 bg-white focus:border-purple-400 transition-colors"
        />
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-16">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? "Arama sonucu bulunamadı" : "Henüz medya yüklemediniz"}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? "Farklı bir arama terimi deneyin"
              : "İlk medya dosyanızı yükleyerek başlayın"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMedia.map((file) => (
            <div
              key={file.id}
              className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              {/* Image Preview */}
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {file.type.startsWith("image/") ? (
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-300" />
                )}
              </div>

              {/* File Info */}
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.filename}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(file.size)}
                </p>
              </div>

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="bg-white/90 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Copy URL to clipboard
                    navigator.clipboard.writeText(file.url);
                    alert("URL kopyalandı!");
                  }}
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="bg-white/90 hover:bg-white text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      confirm(
                        `"${file.filename}" dosyasını silmek istediğinizden emin misiniz?`
                      )
                    ) {
                      setMediaFiles((prev) =>
                        prev.filter((f) => f.id !== file.id)
                      );
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

      {/* Info */}
      <div className="text-sm text-gray-600 text-center pt-4">
        {filteredMedia.length > 0 && (
          <span>Toplam {filteredMedia.length} medya dosyası</span>
        )}
      </div>
    </div>
  );
}
