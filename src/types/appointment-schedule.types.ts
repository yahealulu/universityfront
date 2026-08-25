export type ScheduleDoctor = {
  id: string
  name: string
  specialty: string
}

export type ScheduleAppointment = {
  id: string
  doctorId: string
  patientId: string
  patientName: string
  /** Display file / chart id, e.g. PT-2024-0091 */
  patientCode: string
  procedureLabel: string
  startTime: string
  durationMinutes: number
}

export type AppointmentSchedulePayload = {
  doctors: ScheduleDoctor[]
  appointments: ScheduleAppointment[]
  dayStart: string
  dayEnd: string
  slotMinutes: number
}

export type TreatmentOption = {
  id: string
  label: string
}

export type PatientOption = {
  id: string
  displayName: string
  patientCode: string
}

export type AppointmentsMetaPayload = {
  doctors: ScheduleDoctor[]
  treatments: TreatmentOption[]
  patients: PatientOption[]
}

export type CreateAppointmentInput = {
  doctorId: string
  patientId: string
  treatmentType?: string | null
  durationMinutes: 30 | 60 | 90 | 120
  date: string
  startTime: string
}
