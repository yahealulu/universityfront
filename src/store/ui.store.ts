import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UiState = {
  isSidebarCollapsed: boolean
  setSidebarCollapsed: (next: boolean) => void
  toggleSidebar: () => void
  isMobileNavOpen: boolean
  openMobileNav: () => void
  closeMobileNav: () => void
  toggleMobileNav: () => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      setSidebarCollapsed: (next) => set({ isSidebarCollapsed: next }),
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      isMobileNavOpen: false,
      openMobileNav: () => set({ isMobileNavOpen: true }),
      closeMobileNav: () => set({ isMobileNavOpen: false }),
      toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
    }),
    {
      name: 'astro-clinics-ui',
      partialize: (state) => ({ isSidebarCollapsed: state.isSidebarCollapsed }),
    }
  )
)
