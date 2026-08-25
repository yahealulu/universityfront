import type { ClinicSummary, CreateClinicPayload } from '@/types/clinic.types'

/** Initial seed — IDs aligned with dev tenant and reports mock. */
const seed: ClinicSummary[] = [
  { id: '00000000-0000-4000-8000-000000000001', name: 'Al Noor Dental Center' },
  { id: '00000000-0000-4000-8000-000000000002', name: 'North Smile Branch' },
  { id: '00000000-0000-4000-8000-000000000003', name: 'Downtown Care Clinic' },
]

export const getClinicsSnapshot = (): ClinicSummary[] => seed.map((c) => ({ ...c }))

export const appendClinic = (payload: CreateClinicPayload, id: string): ClinicSummary => {
  const row: ClinicSummary = { id, name: payload.name }
  seed.push(row)
  return row
}
