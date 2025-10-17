/**
 * Query Keys
 * Centralized TanStack Query key definitions
 */

export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },

  // Sites
  sites: {
    all: ['sites'] as const,
    lists: () => [...queryKeys.sites.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.sites.lists(), filters] as const,
    details: () => [...queryKeys.sites.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.sites.details(), id] as const,
  },

  // Pages
  pages: {
    all: ['pages'] as const,
    lists: () => [...queryKeys.pages.all, 'list'] as const,
    list: (siteId: string, filters?: Record<string, unknown>) =>
      [...queryKeys.pages.lists(), siteId, filters] as const,
    details: () => [...queryKeys.pages.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.pages.details(), id] as const,
  },

  // Dashboard
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
  },
} as const;
