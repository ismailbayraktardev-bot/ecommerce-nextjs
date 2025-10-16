"use client";

import { Clock, Globe, FileText, Users, Settings, Plus } from "lucide-react";

export interface ActivityItem {
  id: string;
  type: "site_created" | "page_created" | "page_updated" | "user_registered" | "settings_updated";
  title: string;
  description: string;
  timestamp: Date;
  metadata?: {
    siteName?: string;
    pageName?: string;
    userName?: string;
  };
}

export interface RecentActivityProps {
  activities?: ActivityItem[];
  maxItems?: number;
}

// Mock data for demonstration
const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "site_created",
    title: "Yeni site oluşturuldu",
    description: "E-ticaret Mağaza sitesi başarıyla oluşturuldu",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    metadata: { siteName: "E-ticaret Mağaza" }
  },
  {
    id: "2",
    type: "page_updated",
    title: "Ana sayfa güncellendi",
    description: "Hero bölümü yeniden tasarlandı",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    metadata: { siteName: "E-ticaret Mağaza", pageName: "Ana Sayfa" }
  },
  {
    id: "3",
    type: "page_created",
    title: "Yeni sayfa eklendi",
    description: "Hakkımızda sayfası oluşturuldu",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    metadata: { siteName: "Kurumsal Site", pageName: "Hakkımızda" }
  },
  {
    id: "4",
    type: "settings_updated",
    title: "Site ayarları güncellendi",
    description: "SEO meta bilgileri güncellendi",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    metadata: { siteName: "E-ticaret Mağaza" }
  },
  {
    id: "5",
    type: "site_created",
    title: "Yeni site oluşturuldu",
    description: "Kurumsal Site başarıyla oluşturuldu",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    metadata: { siteName: "Kurumsal Site" }
  }
];

export function RecentActivity({
  activities = mockActivities,
  maxItems = 5
}: RecentActivityProps) {

  const getActivityIcon = (type: ActivityItem['type']) => {
    const iconClasses = "h-5 w-5";

    switch (type) {
      case "site_created":
        return <Globe className={`${iconClasses} text-blue-600`} />;
      case "page_created":
        return <Plus className={`${iconClasses} text-green-600`} />;
      case "page_updated":
        return <FileText className={`${iconClasses} text-orange-600`} />;
      case "user_registered":
        return <Users className={`${iconClasses} text-purple-600`} />;
      case "settings_updated":
        return <Settings className={`${iconClasses} text-gray-600`} />;
      default:
        return <Clock className={`${iconClasses} text-gray-600`} />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case "site_created":
        return "border-blue-200 bg-blue-50";
      case "page_created":
        return "border-green-200 bg-green-50";
      case "page_updated":
        return "border-orange-200 bg-orange-50";
      case "user_registered":
        return "border-purple-200 bg-purple-50";
      case "settings_updated":
        return "border-gray-200 bg-gray-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Şimdi";
    if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} saat önce`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} gün önce`;

    return timestamp.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: diffInDays > 365 ? 'numeric' : undefined
    });
  };

  const displayActivities = activities.slice(0, maxItems);

  if (displayActivities.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h3>
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Henüz aktivite yok</p>
          <p className="text-gray-400 text-xs mt-1">İlk sitenizi oluşturduğunuzda aktiviteler burada görünecek</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Son Aktiviteler</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Tümünü Gör
        </button>
      </div>

      <div className="space-y-4">
        {displayActivities.map((activity, index) => (
          <div key={activity.id} className="flex items-start gap-4">
            {/* Icon */}
            <div className={`p-2 rounded-full border ${getActivityColor(activity.type)} flex-shrink-0`}>
              {getActivityIcon(activity.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </h4>
                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {activity.description}
              </p>

              {activity.metadata && (
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  {activity.metadata.siteName && (
                    <span className="px-2 py-1 bg-gray-100 rounded-md">
                      {activity.metadata.siteName}
                    </span>
                  )}
                  {activity.metadata.pageName && (
                    <span className="px-2 py-1 bg-gray-100 rounded-md">
                      {activity.metadata.pageName}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Timeline line */}
            {index < displayActivities.length - 1 && (
              <div className="absolute left-[2.125rem] mt-12 h-6 w-px bg-gray-200" />
            )}
          </div>
        ))}
      </div>

      {activities.length > maxItems && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button className="w-full text-sm text-gray-600 hover:text-gray-900 font-medium py-2">
            {activities.length - maxItems} aktivite daha göster
          </button>
        </div>
      )}
    </div>
  );
}
