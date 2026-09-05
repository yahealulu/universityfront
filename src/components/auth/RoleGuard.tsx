import type { FC } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuthStore } from '@/store/auth.store'
import { canAccessRoute, getHomePathForRole } from '@/utils/permissions'

export const RoleGuard: FC = () => {
  const role = useAuthStore((state) => state.role)
  const location = useLocation()

  if (!canAccessRoute(role, location.pathname)) {
    return <Navigate to={getHomePathForRole(role)} replace />
  }

  return <Outlet />
}
