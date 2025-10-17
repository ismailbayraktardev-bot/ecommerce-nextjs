/**
 * Sites Store - Zustand
 * Manages sites state and operations
 */

import { create } from 'zustand';

export interface Site {
  id: string;
  name: string;
  domain: string | null;
  subdomain: string | null;
  description: string | null;
  logo: string | null;
  favicon: string | null;
  demoId: string | null;
  theme: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  _count?: {
    pages: number;
    media: number;
  };
}

export interface SitesState {
  // State
  sites: Site[];
  currentSite: Site | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setSites: (sites: Site[]) => void;
  setCurrentSite: (site: Site | null) => void;
  addSite: (site: Site) => void;
  updateSite: (id: string, updates: Partial<Site>) => void;
  removeSite: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useSitesStore = create<SitesState>((set) => ({
  // Initial state
  sites: [],
  currentSite: null,
  isLoading: false,
  error: null,

  // Actions
  setSites: (sites) => set({ sites, isLoading: false, error: null }),

  setCurrentSite: (site) => set({ currentSite: site }),

  addSite: (site) =>
    set((state) => ({
      sites: [site, ...state.sites],
      error: null,
    })),

  updateSite: (id, updates) =>
    set((state) => ({
      sites: state.sites.map((site) =>
        site.id === id ? { ...site, ...updates } : site
      ),
      currentSite:
        state.currentSite?.id === id
          ? { ...state.currentSite, ...updates }
          : state.currentSite,
      error: null,
    })),

  removeSite: (id) =>
    set((state) => ({
      sites: state.sites.filter((site) => site.id !== id),
      currentSite: state.currentSite?.id === id ? null : state.currentSite,
      error: null,
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error, isLoading: false }),

  reset: () =>
    set({
      sites: [],
      currentSite: null,
      isLoading: false,
      error: null,
    }),
}));
