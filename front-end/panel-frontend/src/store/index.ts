/**
 * Store Index
 * Centralized exports for all Zustand stores
 */

export { useAuthStore } from './auth-store';
export type { AuthState } from './auth-store';

export { useUIStore } from './ui-store';
export type { UIState } from './ui-store';

export { useSitesStore } from './sites-store';
export type { Site, SitesState } from './sites-store';
