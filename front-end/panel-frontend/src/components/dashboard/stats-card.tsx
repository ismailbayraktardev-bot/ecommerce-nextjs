"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: "increase" | "decrease" | "neutral";
  };
  icon: LucideIcon;
  description?: string;
  color?: "blue" | "green" | "orange" | "purple" | "red";
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  description,
  color = "blue",
}: StatsCardProps) {
  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      trend: {
        increase: "text-green-600 bg-green-50",
        decrease: "text-red-600 bg-red-50",
        neutral: "text-gray-600 bg-gray-50",
      },
    },
    green: {
      bg: "bg-green-50",
      icon: "text-green-600",
      trend: {
        increase: "text-green-600 bg-green-50",
        decrease: "text-red-600 bg-red-50",
        neutral: "text-gray-600 bg-gray-50",
      },
    },
    orange: {
      bg: "bg-orange-50",
      icon: "text-orange-600",
      trend: {
        increase: "text-green-600 bg-green-50",
        decrease: "text-red-600 bg-red-50",
        neutral: "text-gray-600 bg-gray-50",
      },
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      trend: {
        increase: "text-green-600 bg-green-50",
        decrease: "text-red-600 bg-red-50",
        neutral: "text-gray-600 bg-gray-50",
      },
    },
    red: {
      bg: "bg-red-50",
      icon: "text-red-600",
      trend: {
        increase: "text-green-600 bg-green-50",
        decrease: "text-red-600 bg-red-50",
        neutral: "text-gray-600 bg-gray-50",
      },
    },
  };

  const colorClass = colorClasses[color];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
          {change && (
            <div className="flex items-center mt-2">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  colorClass.trend[change.type]
                }`}
              >
                {change.type === "increase" && "↗"}
                {change.type === "decrease" && "↘"}
                {change.type === "neutral" && "→"}
                <span className="ml-1">{change.value}</span>
              </span>
            </div>
          )}
        </div>
        <div
          className={`p-3 rounded-full ${colorClass.bg} flex-shrink-0 ml-4`}
        >
          <Icon className={`h-6 w-6 ${colorClass.icon}`} />
        </div>
      </div>
    </div>
  );
}
