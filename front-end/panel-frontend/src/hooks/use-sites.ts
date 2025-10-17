/**
 * Sites Hooks
 * TanStack Query hooks for sites data fetching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { useSitesStore, type Site } from '@/store';

interface SitesListResponse {
  sites: Site[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface CreateSiteInput {
  name: string;
  description?: string;
  domain?: string;
  subdomain?: string;
  demoId?: string;
  theme?: Record<string, unknown>;
}

interface UpdateSiteInput extends Partial<CreateSiteInput> {
  logo?: string;
  favicon?: string;
  customCSS?: string;
}

/**
 * Fetch sites list
 */
export function useSites(filters?: Record<string, unknown>) {
  const { setSites, setLoading, setError } = useSitesStore();

  return useQuery({
    queryKey: queryKeys.sites.list(filters),
    queryFn: async () => {
      setLoading(true);
      try {
        const data = await apiClient.get<SitesListResponse>('/api/sites');
        setSites(data.sites);
        return data;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Siteler yüklenemedi';
        setError(message);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch single site
 */
export function useSite(id: string) {
  const { setCurrentSite } = useSitesStore();

  return useQuery({
    queryKey: queryKeys.sites.detail(id),
    queryFn: async () => {
      const data = await apiClient.get<{ site: Site }>(`/api/sites/${id}`);
      setCurrentSite(data.site);
      return data.site;
    },
    enabled: !!id,
  });
}

/**
 * Create new site
 */
export function useCreateSite() {
  const queryClient = useQueryClient();
  const { addSite } = useSitesStore();

  return useMutation({
    mutationFn: async (input: CreateSiteInput) => {
      const data = await apiClient.post<{ site: Site }>('/api/sites', input);
      return data.site;
    },
    onSuccess: (newSite) => {
      addSite(newSite);
      queryClient.invalidateQueries({ queryKey: queryKeys.sites.lists() });
    },
  });
}

/**
 * Update existing site
 */
export function useUpdateSite(id: string) {
  const queryClient = useQueryClient();
  const { updateSite } = useSitesStore();

  return useMutation({
    mutationFn: async (input: UpdateSiteInput) => {
      const data = await apiClient.patch<{ site: Site }>(
        `/api/sites/${id}`,
        input
      );
      return data.site;
    },
    onSuccess: (updatedSite) => {
      updateSite(id, updatedSite);
      queryClient.invalidateQueries({ queryKey: queryKeys.sites.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.sites.lists() });
    },
  });
}

/**
 * Delete site
 */
export function useDeleteSite() {
  const queryClient = useQueryClient();
  const { removeSite } = useSitesStore();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/sites/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      removeSite(deletedId);
      queryClient.invalidateQueries({ queryKey: queryKeys.sites.lists() });
    },
  });
}
