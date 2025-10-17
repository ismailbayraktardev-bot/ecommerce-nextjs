/**
 * UI Store - Zustand
 * Manages UI state like sidebar, modals, notifications
 */

import { create } from 'zustand';

export interface UIState {
  // Sidebar state
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Modal state
  activeModal: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;

  // Notification state
  notification: {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null;
  showNotification: (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning'
  ) => void;
  hideNotification: () => void;

  // Loading overlay
  isLoadingOverlay: boolean;
  setLoadingOverlay: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Modal
  activeModal: null,
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),

  // Notification
  notification: null,
  showNotification: (message, type) =>
    set({ notification: { message, type } }),
  hideNotification: () => set({ notification: null }),

  // Loading overlay
  isLoadingOverlay: false,
  setLoadingOverlay: (loading) => set({ isLoadingOverlay: loading }),
}));
