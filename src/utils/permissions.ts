import { NAV_ROUTES_BY_ROLE } from '@/layouts/shell/clinicNavConfig'
import type { UserRole } from '@/types/auth.types'

export const getHomePathForRole = (_role: UserRole | null | undefined): string => {
  return '/clinic/dashboard'
}

export const canAccessRoute = (role: UserRole | null | undefined, pathname: string): boolean => {
  if (!role) return false
  const prefixes = NAV_ROUTES_BY_ROLE[role]
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

export const isOwnerRole = (role: UserRole | null | undefined): role is 'owner' => role === 'owner'

export const isDoctorRole = (role: UserRole | null | undefined): role is 'doctor' => role === 'doctor'

export const isSecretaryRole = (role: UserRole | null | undefined): role is 'secretary' =>
  role === 'secretary'
