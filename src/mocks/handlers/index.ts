import { appointmentsHandlers } from '@/mocks/handlers/appointments.handlers'
import { doctorsHandlers } from '@/mocks/handlers/doctors.handlers'
import { dashboardHandlers } from '@/mocks/handlers/dashboard.handlers'
import { invoicesHandlers } from '@/mocks/handlers/invoices.handlers'
import { labRequestsHandlers } from '@/mocks/handlers/lab-requests.handlers'
import { labsHandlers } from '@/mocks/handlers/labs.handlers'
import { expensesHandlers } from '@/mocks/handlers/expenses.handlers'
import { reportsHandlers } from '@/mocks/handlers/reports.handlers'
import { secretariesHandlers } from '@/mocks/handlers/secretaries.handlers'
import { settingsHandlers } from '@/mocks/handlers/settings.handlers'
import { patientsHandlers } from '@/mocks/handlers/patients.handlers'
import { clinicsHandlers } from '@/mocks/handlers/clinics.handlers'

export const handlers = [
  ...clinicsHandlers,
  ...dashboardHandlers,
  ...doctorsHandlers,
  ...appointmentsHandlers,
  ...invoicesHandlers,
  ...labsHandlers,
  ...labRequestsHandlers,
  ...secretariesHandlers,
  ...expensesHandlers,
  ...reportsHandlers,
  ...settingsHandlers,
  ...patientsHandlers,
]
