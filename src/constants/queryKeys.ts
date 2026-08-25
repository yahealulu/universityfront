export const queryKeys = {
  clinics: {
    all: ['clinics'] as const,
    list: () => [...queryKeys.clinics.all, 'list'] as const,
  },
  expenses: {
    all: ['expenses'] as const,
    scope: (clinicId: string) => [...queryKeys.expenses.all, clinicId] as const,
    list: (clinicId: string) => [...queryKeys.expenses.scope(clinicId), 'list'] as const,
    summary: (clinicId: string) => [...queryKeys.expenses.scope(clinicId), 'summary'] as const,
  },
  reports: {
    all: ['reports'] as const,
    scope: (clinicId: string) => [...queryKeys.reports.all, clinicId] as const,
    bundle: (clinicId: string, period: string) =>
      [...queryKeys.reports.scope(clinicId), 'bundle', period] as const,
    clinics: (clinicId: string) => [...queryKeys.reports.scope(clinicId), 'clinics'] as const,
  },
  secretaries: {
    all: ['secretaries'] as const,
    scope: (clinicId: string) => [...queryKeys.secretaries.all, clinicId] as const,
    list: (clinicId: string) => [...queryKeys.secretaries.scope(clinicId), 'list'] as const,
  },
  doctors: {
    all: ['doctors'] as const,
    scope: (clinicId: string) => [...queryKeys.doctors.all, clinicId] as const,
    list: (clinicId: string) => [...queryKeys.doctors.scope(clinicId), 'list'] as const,
    meta: (clinicId: string) => [...queryKeys.doctors.scope(clinicId), 'meta'] as const,
    detail: (clinicId: string, id: string) =>
      [...queryKeys.doctors.scope(clinicId), 'detail', id] as const,
  },
  labRequests: {
    all: ['lab-requests'] as const,
    scope: (clinicId: string) => [...queryKeys.labRequests.all, clinicId] as const,
    list: (clinicId: string) => [...queryKeys.labRequests.scope(clinicId), 'list'] as const,
    meta: (clinicId: string) => [...queryKeys.labRequests.scope(clinicId), 'meta'] as const,
  },
  labs: {
    all: ['labs'] as const,
    scope: (clinicId: string) => [...queryKeys.labs.all, clinicId] as const,
    list: (clinicId: string) => [...queryKeys.labs.scope(clinicId), 'list'] as const,
  },
  invoices: {
    all: ['invoices'] as const,
    scope: (clinicId: string) => [...queryKeys.invoices.all, clinicId] as const,
    list: (clinicId: string) => [...queryKeys.invoices.scope(clinicId), 'list'] as const,
    detail: (clinicId: string, id: string) =>
      [...queryKeys.invoices.scope(clinicId), 'detail', id] as const,
    meta: (clinicId: string) => [...queryKeys.invoices.scope(clinicId), 'meta'] as const,
  },
  appointments: {
    all: ['appointments'] as const,
    scope: (clinicId: string) => [...queryKeys.appointments.all, clinicId] as const,
    schedule: (clinicId: string, date: string) =>
      [...queryKeys.appointments.scope(clinicId), 'schedule', date] as const,
    meta: (clinicId: string) => [...queryKeys.appointments.scope(clinicId), 'meta'] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    scope: (clinicId: string) => [...queryKeys.dashboard.all, clinicId] as const,
    stats: (clinicId: string) => [...queryKeys.dashboard.scope(clinicId), 'stats'] as const,
    topDoctors: (clinicId: string) =>
      [...queryKeys.dashboard.scope(clinicId), 'top-doctors'] as const,
    todayAppointments: (clinicId: string) =>
      [...queryKeys.dashboard.scope(clinicId), 'today-appointments'] as const,
    expensesBreakdown: (clinicId: string) =>
      [...queryKeys.dashboard.scope(clinicId), 'expenses-breakdown'] as const,
    revenueExpenses: (clinicId: string, from: string, to: string) =>
      [...queryKeys.dashboard.scope(clinicId), 'revenue-expenses', from, to] as const,
  },
  settings: {
    all: ['settings'] as const,
    scope: (clinicId: string) => [...queryKeys.settings.all, clinicId] as const,
    detail: (clinicId: string) => [...queryKeys.settings.scope(clinicId), 'detail'] as const,
  },
  patients: {
    all: ['patients'] as const,
    scope: (clinicId: string) => [...queryKeys.patients.all, clinicId] as const,
    list: (clinicId: string, q: string, page: number, pageSize: number) =>
      [...queryKeys.patients.scope(clinicId), 'list', q, page, pageSize] as const,
    detail: (clinicId: string, patientId: string) =>
      [...queryKeys.patients.scope(clinicId), 'detail', patientId] as const,
  },
} as const
