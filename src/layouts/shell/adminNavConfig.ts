import { BarChart3, CircleDollarSign, FlaskConical, Layers, Users } from 'lucide-react'

export const adminNavItems = [
  { to: '/admin/dashboard', key: 'admin.nav.statistics', icon: BarChart3 },
  { to: '/admin/subscriptions', key: 'admin.nav.subscriptions', icon: Layers },
  { to: '/admin/users', key: 'admin.nav.users', icon: Users },
  { to: '/admin/billing', key: 'admin.nav.billing', icon: CircleDollarSign },
  { to: '/admin/labs', key: 'admin.nav.labs', icon: FlaskConical },
] as const

export type AdminNavItem = (typeof adminNavItems)[number]
