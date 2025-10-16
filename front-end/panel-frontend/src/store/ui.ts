import { create } from 'zustand'

type UIState = {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useUI = create<UIState>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
