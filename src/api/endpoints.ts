const API = '/api'

export const endpoints = {
  clinics: {
    list: `${API}/clinics`,
    create: `${API}/clinics`,
  },
  secretaries: {
    list: `${API}/secretaries`,
    detail: (id: string) => `${API}/secretaries/${id}`,
  },
  doctors: {
    list: `${API}/doctors`,
    meta: `${API}/doctors/meta`,
    detail: (id: string) => `${API}/doctors/${id}`,
    payments: (doctorId: string) => `${API}/doctors/${doctorId}/payments`,
    payment: (doctorId: string, paymentId: string) =>
      `${API}/doctors/${doctorId}/payments/${paymentId}`,
  },
  labRequests: {
    list: `${API}/lab-requests`,
    meta: `${API}/lab-requests/meta`,
    detail: (id: string) => `${API}/lab-requests/${id}`,
  },
  labs: {
    list: `${API}/labs`,
    detail: (id: string) => `${API}/labs/${id}`,
  },
  invoices: {
    list: `${API}/invoices`,
    meta: `${API}/invoices/meta`,
    detail: (id: string) => `${API}/invoices/${id}`,
    payments: (id: string) => `${API}/invoices/${id}/payments`,
    payment: (invoiceId: string, paymentId: string) =>
      `${API}/invoices/${invoiceId}/payments/${paymentId}`,
  },
  appointments: {
    schedule: `${API}/appointments/schedule`,
    meta: `${API}/appointments/meta`,
    create: `${API}/appointments`,
  },
  expenses: {
    list: `${API}/expenses`,
    summary: `${API}/expenses/summary`,
    detail: (id: string) => `${API}/expenses/${id}`,
  },
  reports: {
    bundle: `${API}/reports`,
    clinics: `${API}/reports/clinics`,
  },
  dashboard: {
    stats: `${API}/dashboard/stats`,
    topDoctors: `${API}/dashboard/top-doctors`,
    todayAppointments: `${API}/dashboard/today-appointments`,
    expensesBreakdown: `${API}/dashboard/expenses-breakdown`,
    revenueExpenses: `${API}/dashboard/revenue-expenses`,
  },
  settings: {
    root: `${API}/settings`,
    logo: `${API}/settings/logo`,
  },
  patients: {
    list: `${API}/patients`,
    detail: (id: string) => `${API}/patients/${id}`,
    invoices: (id: string) => `${API}/patients/${id}/invoices`,
    dentalChart: (id: string) => `${API}/patients/${id}/dental-chart`,
    treatmentStage: (patientId: string, treatmentId: string) =>
      `${API}/patients/${patientId}/treatments/${treatmentId}/stages`,
    clinicalHistory: (id: string) => `${API}/patients/${id}/clinical-history`,
    file: (patientId: string, fileId: string) => `${API}/patients/${patientId}/files/${fileId}`,
    appointment: (patientId: string, appointmentId: string) =>
      `${API}/patients/${patientId}/appointments/${appointmentId}`,
  },
} as const
