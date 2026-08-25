import type { FC } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import { AdminLayout } from '@/layouts/AdminLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { AdminBillingPlansPage } from '@/pages/Admin/Billing'
import { LoginPage } from '@/pages/Auth/LoginPage'
import { AdminDashboardPage } from '@/pages/Admin/Dashboard'
import { AdminLabsManagementPage } from '@/pages/Admin/Labs'
import { AdminSubscriptionsPage } from '@/pages/Admin/Subscriptions'
import { AdminUserDetailsPage } from '@/pages/Admin/Users/Details'
import { AdminUsersPage } from '@/pages/Admin/Users'
import { AppointmentsRoute } from '@/pages/Appointments/AppointmentsRoute'
import { DashboardPage } from '@/pages/Dashboard'
import { InvoicesRoute } from '@/pages/Invoices/InvoicesRoute'
import { DoctorDetailRoute } from '@/pages/Doctors/DoctorDetailRoute'
import { DoctorsRoute } from '@/pages/Doctors/DoctorsRoute'
import { LabRequestsRoute } from '@/pages/LabRequests/LabRequestsRoute'
import { LabsRoute } from '@/pages/Labs/LabsRoute'
import { ExpensesRoute } from '@/pages/Expenses/ExpensesRoute'
import { ReportsRoute } from '@/pages/Reports/ReportsRoute'
import { SecretariesRoute } from '@/pages/Secretaries/SecretariesRoute'
import { SettingsRoute } from '@/pages/Settings/SettingsRoute'
import { PatientPortalRoute } from '@/pages/PatientPortal/PatientPortalRoute'
import { PatientProfileRoute } from '@/pages/Patients/PatientProfileRoute'
import { PatientsRoute } from '@/pages/Patients/PatientsRoute'
import type { PortalType } from '@/store/auth.store'
import { useAuthStore } from '@/store/auth.store'

const getPortalHomePath = (portalType: PortalType | null): string => {
  if (portalType === 'admin') {
    return '/admin/dashboard'
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

const PortalGuard: FC<{ portalType: PortalType }> = ({ portalType }) => {
  const token = useAuthStore((state) => state.token)
  const activePortalType = useAuthStore((state) => state.portalType)

  if (!token || !activePortalType) {
    return <Navigate to="/login" replace />
  }

  if (activePortalType !== portalType) {
    return <Navigate to={getPortalHomePath(activePortalType)} replace />
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
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'patients', element: <PatientsRoute /> },
          { path: 'patients/:patientId', element: <PatientProfileRoute /> },
          { path: 'appointments', element: <AppointmentsRoute /> },
          { path: 'invoices', element: <InvoicesRoute /> },
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
  {
    path: '/admin',
    element: <PortalGuard portalType="admin" />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <AdminDashboardPage /> },
          { path: 'subscriptions', element: <AdminSubscriptionsPage /> },
          { path: 'users', element: <AdminUsersPage /> },
          { path: 'users/:userId', element: <AdminUserDetailsPage /> },
          { path: 'billing', element: <AdminBillingPlansPage /> },
          { path: 'labs', element: <AdminLabsManagementPage /> },
          { path: '*', element: <Navigate to="/admin/dashboard" replace /> },
        ],
      },
    ],
  },
  { path: '/patient-portal/:patientId', element: <PatientPortalRoute /> },
  { path: '*', element: <Navigate to="/login" replace /> },
])
