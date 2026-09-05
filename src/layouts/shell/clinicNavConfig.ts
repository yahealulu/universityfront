import {
  Calendar,
  FileText,
  FlaskConical,
  LayoutDashboard,
  Microscope,
  PieChart,
  Settings,
  Stethoscope,
  UserCog,
  Users,
  Wallet,
  WalletCards,
} from 'lucide-react'

import type { UserRole } from '@/types/auth.types'

export const clinicNavItems = [
  { to: '/clinic/dashboard', key: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/clinic/patients', key: 'nav.patients', icon: Users },
  { to: '/clinic/appointments', key: 'nav.appointments', icon: Calendar },
  { to: '/clinic/invoices', key: 'nav.invoice', icon: FileText },
  { to: '/clinic/my-payments', key: 'nav.myPayments', icon: WalletCards },
  { to: '/clinic/labs', key: 'nav.labsManagement', icon: Microscope },
  { to: '/clinic/lab-requests', key: 'nav.labsRequests', icon: FlaskConical },
  { to: '/clinic/doctors', key: 'nav.doctors', icon: Stethoscope },
  { to: '/clinic/secretaries', key: 'nav.secretaries', icon: UserCog },
  { to: '/clinic/expenses', key: 'nav.expenses', icon: Wallet },
  { to: '/clinic/reports', key: 'nav.reports', icon: PieChart },
  { to: '/clinic/settings', key: 'nav.settings', icon: Settings },
] as const

export type ClinicNavItem = (typeof clinicNavItems)[number]

export const NAV_ROUTES_BY_ROLE: Record<UserRole, readonly string[]> = {
  owner: clinicNavItems.map((item) => item.to),
  doctor: [
    '/clinic/dashboard',
    '/clinic/patients',
    '/clinic/appointments',
    '/clinic/my-payments',
  ],
  secretary: [
    '/clinic/dashboard',
    '/clinic/patients',
    '/clinic/appointments',
    '/clinic/invoices',
  ],
}

export const getNavItemsForRole = (role: UserRole | null | undefined): ClinicNavItem[] => {
  if (!role) return []
  const allowed = new Set(NAV_ROUTES_BY_ROLE[role])
  return clinicNavItems.filter((item) => allowed.has(item.to))
}
