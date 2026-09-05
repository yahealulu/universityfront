import type { FC } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import { RoleGuard } from '@/components/auth/RoleGuard'
import { AppLayout } from '@/layouts/AppLayout'
import { LoginPage } from '@/pages/Auth/LoginPage'
import { AppointmentsRoute } from '@/pages/Appointments/AppointmentsRoute'
import { DashboardPage } from '@/pages/Dashboard'
import { InvoicesRoute } from '@/pages/Invoices/InvoicesRoute'
import { DoctorDetailRoute } from '@/pages/Doctors/DoctorDetailRoute'
import { DoctorsRoute } from '@/pages/Doctors/DoctorsRoute'
import { LabRequestsRoute } from '@/pages/LabRequests/LabRequestsRoute'
import { LabsRoute } from '@/pages/Labs/LabsRoute'
import { ExpensesRoute } from '@/pages/Expenses/ExpensesRoute'
import { MyPaymentsRoute } from '@/pages/MyPayments/MyPaymentsRoute'
import { ReportsRoute } from '@/pages/Reports/ReportsRoute'
import { SecretariesRoute } from '@/pages/Secretaries/SecretariesRoute'
import { SettingsRoute } from '@/pages/Settings/SettingsRoute'
import { PatientPortalRoute } from '@/pages/PatientPortal/PatientPortalRoute'
import { PatientProfileRoute } from '@/pages/Patients/PatientProfileRoute'
import { PatientsRoute } from '@/pages/Patients/PatientsRoute'
import type { PortalType } from '@/store/auth.store'
import { useAuthStore } from '@/store/auth.store'
import { getHomePathForRole } from '@/utils/permissions'

const getPortalHomePath = (portalType: PortalType | null): string => {
  const role = useAuthStore.getState().role
  if (portalType && role) {
    return getHomePathForRole(role)
  }
  return '/clinic/dashboard'
}

const PublicOnlyRoute: FC = () => {
  const token = useAuthStore((state) => state.token)
  const portalType = useAuthStore((state) => state.portalType)

  if (token && portalType) {
    return <Navigate to={getPortalHomePath(portalType)} replace />
  }

  return <Outlet />
}

const PortalGuard: FC<{ portalType: PortalType }> = () => {
  const token = useAuthStore((state) => state.token)
  const activePortalType = useAuthStore((state) => state.portalType)

  if (!token || !activePortalType) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  {
    element: <PublicOnlyRoute />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    path: '/clinic',
    element: <PortalGuard portalType="clinic" />,
    children: [
      {
        element: <RoleGuard />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: 'dashboard', element: <DashboardPage /> },
              { path: 'patients', element: <PatientsRoute /> },
              { path: 'patients/:patientId', element: <PatientProfileRoute /> },
              { path: 'appointments', element: <AppointmentsRoute /> },
              { path: 'invoices', element: <InvoicesRoute /> },
              { path: 'my-payments', element: <MyPaymentsRoute /> },
              { path: 'labs', element: <LabsRoute /> },
              { path: 'lab-requests', element: <LabRequestsRoute /> },
              { path: 'doctors', element: <DoctorsRoute /> },
              { path: 'doctors/:doctorId', element: <DoctorDetailRoute /> },
              { path: 'secretaries', element: <SecretariesRoute /> },
              { path: 'expenses', element: <ExpensesRoute /> },
              { path: 'reports', element: <ReportsRoute /> },
              { path: 'settings', element: <SettingsRoute /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '/patient-portal/:patientId', element: <PatientPortalRoute /> },
  { path: '*', element: <Navigate to="/login" replace /> },
])
