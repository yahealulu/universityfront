import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AuthSession, AuthUser, UserRole } from '@/types/auth.types'
import type { ClinicSummary } from '@/types/clinic.types'

export type PortalType = 'clinic'

type AuthState = {
  token: string | null
  portalType: PortalType | null
  user: AuthUser | null
  role: UserRole | null
  clinics: ClinicSummary[]
  hasAllClinics: boolean
  setToken: (token: string | null) => void
  setSession: (session: {
    token: string
    portalType: PortalType
    user: AuthUser
    clinics: ClinicSummary[]
    hasAllClinics?: boolean
  }) => void
  setAuthSession: (session: AuthSession & { portalType?: PortalType }) => void
  logout: () => void
}

const emptyAuthFields = {
  user: null as AuthUser | null,
  role: null as UserRole | null,
  clinics: [] as ClinicSummary[],
  hasAllClinics: false,
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      portalType: null,
      ...emptyAuthFields,
      setToken: (token) =>
        set(() => ({
          token,
          ...(token
            ? {}
            : {
                portalType: null,
                ...emptyAuthFields,
              }),
        })),
      setSession: ({ token, portalType, user, clinics, hasAllClinics }) =>
        set({
          token,
          portalType,
          user,
          role: user.role,
          clinics,
          hasAllClinics: hasAllClinics ?? user.hasAllClinics ?? false,
        }),
      setAuthSession: ({ accessToken, user, clinics, hasAllClinics, portalType = 'clinic' }) =>
        set({
          token: accessToken,
          portalType,
          user,
          role: user.role,
          clinics,
          hasAllClinics: hasAllClinics ?? user.hasAllClinics ?? false,
        }),
      logout: () =>
        set({
          token: null,
          portalType: null,
          ...emptyAuthFields,
        }),
    }),
    {
      name: 'astro-clinics-auth',
      partialize: (state) => ({
        token: state.token,
        portalType: state.portalType,
        user: state.user,
        role: state.role,
        clinics: state.clinics,
        hasAllClinics: state.hasAllClinics,
      }),
    },
  ),
)
