/**
 * Auth Store - Zustand
 * Manages authentication state across the application
 */

import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
}

export interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Actions
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  reset: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: true,
    }),
}));
