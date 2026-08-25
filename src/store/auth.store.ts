import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PortalType = 'clinic' | 'admin'

type AuthState = {
  token: string | null
  portalType: PortalType | null
  setToken: (token: string | null) => void
  setSession: (session: { token: string; portalType: PortalType }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      portalType: null,
      setToken: (token) => set((state) => ({ token, portalType: token ? state.portalType : null })),
      setSession: ({ token, portalType }) => set({ token, portalType }),
      logout: () => set({ token: null, portalType: null }),
    }),
    { name: 'astro-clinics-auth' }
  )
)
