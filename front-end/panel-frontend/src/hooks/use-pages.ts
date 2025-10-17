/**
 * Pages Hooks
 * TanStack Query hooks for pages data fetching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';

export interface Page {
  id: string;
  siteId: string;
  title: string;
  slug: string;
  content: any; // JSON content from page builder
  metaTitle: string | null;
  metaDescription: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PagesListResponse {
  pages: Page[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface CreatePageInput {
  title: string;
  slug: string;
  content?: any;
  metaTitle?: string;
  metaDescription?: string;
  isPublished?: boolean;
}

interface UpdatePageInput extends Partial<CreatePageInput> {}

/**
 * Fetch pages list for a site
 */
export function usePages(siteId: string, filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.pages.list(siteId, filters),
    queryFn: async () => {
      const data = await apiClient.get<PagesListResponse>(
        `/api/sites/${siteId}/pages`
      );
      return data;
    },
    enabled: !!siteId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch single page
 */
export function usePage(id: string) {
  return useQuery({
    queryKey: queryKeys.pages.detail(id),
    queryFn: async () => {
      const data = await apiClient.get<{ page: Page }>(`/api/pages/${id}`);
      return data.page;
    },
    enabled: !!id,
  });
}

/**
 * Create new page
 */
export function useCreatePage(siteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePageInput) => {
      const data = await apiClient.post<{ page: Page }>(
        `/api/sites/${siteId}/pages`,
        input
      );
      return data.page;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.pages.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.sites.lists(),
      });
    },
  });
}

/**
 * Update existing page
 */
export function useUpdatePage(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdatePageInput) => {
      const data = await apiClient.patch<{ page: Page }>(
        `/api/pages/${id}`,
        input
      );
      return data.page;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pages.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.pages.lists() });
    },
  });
}

/**
 * Delete page
 */
export function useDeletePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/pages/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pages.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.sites.lists() });
    },
  });
}
