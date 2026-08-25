export type PatientPortalAppointmentStatus = 'scheduled' | 'completed' | 'cancelled'

/** Indices map to i18n keys `patientPortal.mock.doctors.{i}` etc. */
export type PatientPortalAppointmentItem = {
  id: string
  date: string
  time24: string
  status: PatientPortalAppointmentStatus
  doctorIndex: number
  treatmentIndex: number
  notesIndex: number
}

export type PatientPortalQueryParse = {
  displayName: string | null
  displayCode: string | null
}

export type PatientPortalViewModel = {
  patientId: string
  /** From share URL query `n`; when null, page uses `patientPortal.fallbackName`. */
  queryDisplayName: string | null
  /** From share URL query `c`; when null, page builds code from `fallbackPatientCode`. */
  queryDisplayCode: string | null
  /** Used with `formatPatientRecordLabel` when `queryDisplayCode` is null. */
  fallbackPatientCode: string
  totalInvoiced: number
  totalPaid: number
  totalRemaining: number
  nextPaymentDueIso: string
  clinicPhoneDigits: string
  appointments: PatientPortalAppointmentItem[]
}
