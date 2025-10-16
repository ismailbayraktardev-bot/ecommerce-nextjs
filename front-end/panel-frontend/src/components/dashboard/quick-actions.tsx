"use client";

import { Plus, Globe, FileText, Upload, Settings, Users, BarChart3, Palette } from "lucide-react";

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  color: "blue" | "green" | "purple" | "orange" | "teal" | "pink";
  disabled?: boolean;
}

export interface QuickActionsProps {
  actions?: QuickAction[];
  columns?: 2 | 3 | 4;
}

// Default quick actions
const defaultActions: QuickAction[] = [
  {
    id: "create-site",
    title: "Yeni Site Oluştur",
    description: "Modern bir site kurmaya başlayın",
    icon: Plus,
    href: "/sites/new",
    color: "blue"
  },
  {
    id: "manage-sites",
    title: "Sitelerimi Yönet",
    description: "Mevcut sitelerinizi düzenleyin",
    icon: Globe,
    href: "/sites",
    color: "green"
  },
  {
    id: "create-page",
    title: "Sayfa Oluştur",
    description: "Yeni bir sayfa tasarlayın",
    icon: FileText,
    href: "/pages/new",
    color: "purple"
  },
  {
    id: "upload-media",
    title: "Medya Yükle",
    description: "Görseller ve dosyalar ekleyin",
    icon: Upload,
    href: "/media",
    color: "orange"
  },
  {
    id: "analytics",
    title: "Analitik",
    description: "Site performansını görün",
    icon: BarChart3,
    href: "/analytics",
    color: "teal"
  },
  {
    id: "customize",
    title: "Tema Düzenle",
    description: "Site görünümünü özelleştirin",
    icon: Palette,
    href: "/customize",
    color: "pink"
  }
];

export function QuickActions({
  actions = defaultActions,
  columns = 3
}: QuickActionsProps) {

  const getColorClasses = (color: QuickAction['color']) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-50 group-hover:bg-blue-100",
        icon: "text-blue-600",
        border: "border-blue-200"
      },
      green: {
        bg: "bg-green-50 group-hover:bg-green-100",
        icon: "text-green-600",
        border: "border-green-200"
      },
      purple: {
        bg: "bg-purple-50 group-hover:bg-purple-100",
        icon: "text-purple-600",
        border: "border-purple-200"
      },
      orange: {
        bg: "bg-orange-50 group-hover:bg-orange-100",
        icon: "text-orange-600",
        border: "border-orange-200"
      },
      teal: {
        bg: "bg-teal-50 group-hover:bg-teal-100",
        icon: "text-teal-600",
        border: "border-teal-200"
      },
      pink: {
        bg: "bg-pink-50 group-hover:bg-pink-100",
        icon: "text-pink-600",
        border: "border-pink-200"
      }
    };

    return colorMap[color];
  };

  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  const handleActionClick = (action: QuickAction) => {
    if (action.disabled) return;

    if (action.onClick) {
      action.onClick();
    } else if (action.href) {
      window.location.href = action.href;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Hızlı İşlemler</h3>
        <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
          Özelleştir
        </button>
      </div>

      <div className={`grid gap-4 ${gridCols[columns]}`}>
        {actions.map((action) => {
          const colorClasses = getColorClasses(action.color);
          const IconComponent = action.icon;

          const isDisabled = action.disabled;
          const baseClasses = `group relative rounded-lg border p-4 transition-all duration-200 ${
            isDisabled
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-pointer hover:shadow-md'
          }`;

          const actionElement = (
            <div
              className={`${baseClasses} ${colorClasses.border} bg-white hover:bg-gray-50`}
              onClick={() => handleActionClick(action)}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg border ${colorClasses.border} ${colorClasses.bg} transition-colors`}>
                  <IconComponent className={`h-6 w-6 ${colorClasses.icon}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </div>

              {/* Hover indicator */}
              {!isDisabled && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
              )}
            </div>
          );

          return action.href && !isDisabled ? (
            <a key={action.id} href={action.href} className="block">
              {actionElement}
            </a>
          ) : (
            <div key={action.id}>
              {actionElement}
            </div>
          );
        })}
      </div>

      {/* Footer with additional info */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          İpucu: Sık kullandığınız işlemleri favorilerinize ekleyebilirsiniz
        </p>
      </div>
    </div>
  );
}
