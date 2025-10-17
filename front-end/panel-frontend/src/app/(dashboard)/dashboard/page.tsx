"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Globe, FileText, Image, Users, TrendingUp, Clock } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("tr-TR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const statsData = [
    {
      title: "Toplam Siteler",
      value: stats?.totalSites.toString() || "0",
      change: {
        value: stats?.sitesChange
          ? `${stats.sitesChange > 0 ? "+" : ""}${stats.sitesChange} bu ay`
          : "Değişiklik yok",
        type: (stats?.sitesChange || 0) >= 0 ? ("increase" as const) : ("decrease" as const),
      },
      icon: Globe,
      description: "Aktif projeleriniz",
      color: "blue" as const,
    },
    {
      title: "Toplam Sayfalar",
      value: stats?.totalPages.toString() || "0",
      change: {
        value: stats?.pagesChange
          ? `${stats.pagesChange > 0 ? "+" : ""}${stats.pagesChange} bu hafta`
          : "Değişiklik yok",
        type: (stats?.pagesChange || 0) >= 0 ? ("increase" as const) : ("decrease" as const),
      },
      icon: FileText,
      description: "Oluşturduğunuz sayfalar",
      color: "green" as const,
    },
    {
      title: "Medya Dosyaları",
      value: stats?.totalMedia.toString() || "0",
      change: {
        value: stats?.mediaChange
          ? `${stats.mediaChange > 0 ? "+" : ""}${stats.mediaChange} bu hafta`
          : "Değişiklik yok",
        type: (stats?.mediaChange || 0) >= 0 ? ("increase" as const) : ("decrease" as const),
      },
      icon: Image,
      description: "Yüklenen görseller",
      color: "purple" as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Hoş geldin{" "}
            {session?.user?.name || session?.user?.email || "Kullanıcı"}!
            Projelerinizin genel durumunu burada görebilirsiniz.
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{formatTime(currentTime)}</span>
          </div>
          <div className="hidden sm:block">
            <span>{formatDate(currentTime)}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            description={stat.description}
            color={stat.color}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Quick Actions - Takes 2 columns */}
        <div className="xl:col-span-2 order-2 xl:order-1">
          <QuickActions columns={2} />
        </div>

        {/* Recent Activity - Takes 1 column */}
        <div className="xl:col-span-1 order-1 xl:order-2">
          <RecentActivity maxItems={4} />
        </div>
      </div>

      {/* Welcome Card for First-time Users */}
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 rounded-lg p-4 sm:p-6 lg:p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">
              🚀 Gradiator'a Hoş Geldiniz!
            </h2>
            <p className="text-blue-100 mb-4 text-sm sm:text-base">
              Güçlü page builder sistemi ile profesyonel web siteleri oluşturun.
              Drag & drop editör, hazır bloklar ve modern tasarımlarla hızlıca
              başlayın.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm sm:text-base">
                İlk Sitenizi Oluşturun
              </button>
              <button className="border border-white/30 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors text-sm sm:text-base">
                Rehberi İnceleyin
              </button>
            </div>
          </div>

          {/* Illustration/Icon */}
          <div className="hidden lg:block ml-8">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <Globe className="h-12 w-12 text-white/80" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
          <div>© 2025 İsmail Bayraktar - E-ticaret Web Uygulaması</div>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span>
              Son güncelleme: {new Date().toLocaleDateString("tr-TR")}
            </span>
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Sistem çevrimiçi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
