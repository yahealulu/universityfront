import type { ClinicSummary } from '@/types/clinic.types'

export type UserRole = 'owner' | 'doctor' | 'secretary'

export type AuthUser = {
  id: string
  name: string
  email?: string
  username: string
  role: UserRole
  hasAllClinics?: boolean
}

export type AuthSession = {
  accessToken: string
  token: string
  user: AuthUser
  clinics: ClinicSummary[]
  hasAllClinics?: boolean
}
