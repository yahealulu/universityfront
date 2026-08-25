import type {
  PatientOption,
  ScheduleAppointment,
  ScheduleDoctor,
  TreatmentOption,
} from '@/types/appointment-schedule.types'

export const mockScheduleDoctors: ScheduleDoctor[] = [
  { id: 'dr-sarah', name: 'Dr. Sarah Johnson', specialty: 'General Dentist' },
  { id: 'dr-michael', name: 'Dr. Michael Chen', specialty: 'Orthodontist' },
  { id: 'dr-emily', name: 'Dr. Emily Davis', specialty: 'Periodontist' },
]

export const mockTreatmentOptions: TreatmentOption[] = [
  { id: 'tr-root-canal', label: 'Root Canal' },
  { id: 'tr-braces', label: 'Braces' },
  { id: 'tr-whitening', label: 'Whitening' },
  { id: 'tr-cleaning', label: 'Cleaning' },
  { id: 'tr-extraction', label: 'Extraction' },
  { id: 'tr-crown', label: 'Crown' },
]

export const mockPatientOptions: PatientOption[] = [
  { id: 'pt-demo', displayName: 'Michael Smith', patientCode: '0123456789' },
  { id: 'pt-1', displayName: 'Ahmed Al-Rashid', patientCode: 'PT-2024-0091' },
  { id: 'pt-2', displayName: 'Fatima Al-Zahra', patientCode: 'PT-2024-0142' },
  { id: 'pt-3', displayName: 'Omar Hassan', patientCode: 'PT-2024-0088' },
  { id: 'pt-4', displayName: 'Layla Mansour', patientCode: 'PT-2024-0201' },
  { id: 'pt-5', displayName: 'Youssef Karim', patientCode: 'PT-2024-0115' },
  { id: 'pt-6', displayName: 'Nour El-Din', patientCode: 'PT-2024-0199' },
]

/** Demo schedule matching marketing screenshots (Feb 11, 2026). */
export const mockSeedAppointmentsFeb11: ScheduleAppointment[] = [
  {
    id: 'apt-1',
    doctorId: 'dr-sarah',
    patientId: 'pt-1',
    patientName: 'Ahmed Al-Rashid',
    patientCode: 'PT-2024-0091',
    procedureLabel: 'Root Canal',
    startTime: '09:00',
    durationMinutes: 60,
  },
  {
    id: 'apt-2',
    doctorId: 'dr-michael',
    patientId: 'pt-2',
    patientName: 'Fatima Al-Zahra',
    patientCode: 'PT-2024-0142',
    procedureLabel: 'Braces',
    startTime: '09:30',
    durationMinutes: 90,
  },
  {
    id: 'apt-3',
    doctorId: 'dr-emily',
    patientId: 'pt-3',
    patientName: 'Omar Hassan',
    patientCode: 'PT-2024-0088',
    procedureLabel: 'Whitening',
    startTime: '10:00',
    durationMinutes: 30,
  },
  {
    id: 'apt-4',
    doctorId: 'dr-sarah',
    patientId: 'pt-4',
    patientName: 'Layla Mansour',
    patientCode: 'PT-2024-0201',
    procedureLabel: 'Cleaning',
    startTime: '11:00',
    durationMinutes: 30,
  },
  {
    id: 'apt-5',
    doctorId: 'dr-michael',
    patientId: 'pt-5',
    patientName: 'Youssef Karim',
    patientCode: 'PT-2024-0115',
    procedureLabel: 'Cleaning',
    startTime: '11:30',
    durationMinutes: 30,
  },
]

export const SCHEDULE_DAY_START = '09:00'
export const SCHEDULE_DAY_END = '18:00'
export const SCHEDULE_SLOT_MINUTES = 30

export const getSeedAppointmentsForDate = (date: string): ScheduleAppointment[] => {
  if (date === '2026-02-11') {
    return mockSeedAppointmentsFeb11.map((a) => ({ ...a }))
  }
  return []
}
