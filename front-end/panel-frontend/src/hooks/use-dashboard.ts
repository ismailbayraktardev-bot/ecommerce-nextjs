/**
 * Dashboard Hooks
 * TanStack Query hooks for dashboard stats data fetching
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';

export interface DashboardStats {
  totalSites: number;
  totalPages: number;
  totalMedia: number;
  sitesChange: number;
  pagesChange: number;
  mediaChange: number;
}

/**
 * Fetch dashboard stats
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: async () => {
      const data = await apiClient.get<DashboardStats>('/api/dashboard/stats');
      return data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
