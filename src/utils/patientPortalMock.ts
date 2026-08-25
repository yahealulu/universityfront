import { addDays, format } from 'date-fns'

import type {
  PatientPortalAppointmentItem,
  PatientPortalAppointmentStatus,
  PatientPortalQueryParse,
  PatientPortalViewModel,
} from '@/types/patientPortal.types'

const MAX_NAME_LEN = 80
const MAX_CODE_LEN = 32

export type PatientPortalShareProfileInput = {
  name: string
  patientCode: string
}

/** Builds the public patient summary URL (optional `n` / `c` query for display). */
export const buildPatientPortalShareUrl = (
  origin: string,
  patientId: string,
  profile: PatientPortalShareProfileInput
): string => {
  const params = new URLSearchParams()
  const n = profile.name.trim().slice(0, MAX_NAME_LEN)
  const c = profile.patientCode.trim().slice(0, MAX_CODE_LEN)
  if (n.length > 0) params.set('n', n)
  if (c.length > 0) params.set('c', c)
  const qs = params.toString()
  const base = `${origin.replace(/\/$/, '')}/patient-portal/${encodeURIComponent(patientId)}`
  return qs ? `${base}?${qs}` : base
}

const hashStringToSeed = (str: string): number => {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const mulberry32 = (seed: number) => {
  let a = seed
  return (): number => {
    a += 0x6d2b79f5
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const clampInt = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, Math.floor(value)))

const sanitizeQuerySegment = (value: string | null, maxLen: number): string | null => {
  if (value === null) return null
  const trimmed = value.trim()
  if (trimmed.length === 0) return null
  return trimmed.slice(0, maxLen)
}

export const parsePatientPortalSearchParams = (params: URLSearchParams): PatientPortalQueryParse => {
  const rawName = params.get('n')
  const rawCode = params.get('c')
  return {
    displayName: sanitizeQuerySegment(rawName, MAX_NAME_LEN),
    displayCode: sanitizeQuerySegment(rawCode, MAX_CODE_LEN),
  }
}

const TIME_SLOTS = ['09:00', '10:30', '11:15', '14:00', '15:30', '16:45'] as const

const buildAppointments = (rand: () => number, patientId: string): PatientPortalAppointmentItem[] => {
  const count = clampInt(3 + rand() * 4, 3, 6)
  const today = new Date()
  const items: PatientPortalAppointmentItem[] = []

  for (let i = 0; i < count; i += 1) {
    const dayOffset = clampInt(-14 + rand() * 28, -14, 21)
    const date = format(addDays(today, dayOffset), 'yyyy-MM-dd')
    const timeIndex = clampInt(rand() * TIME_SLOTS.length, 0, TIME_SLOTS.length - 1)
    const time24 = TIME_SLOTS[timeIndex] ?? '09:00'
    const statusRoll = rand()
    const status: PatientPortalAppointmentStatus =
      dayOffset < 0 ? (statusRoll < 0.85 ? 'completed' : 'cancelled') : statusRoll < 0.7 ? 'scheduled' : 'completed'

    items.push({
      id: `${patientId}-portal-appt-${i}`,
      date,
      time24,
      status,
      doctorIndex: clampInt(rand() * 6, 0, 5),
      treatmentIndex: clampInt(rand() * 8, 0, 7),
      notesIndex: clampInt(rand() * 5, 0, 4),
    })
  }

  return items.sort((a, b) => a.date.localeCompare(b.date) || a.time24.localeCompare(b.time24))
}

/**
 * Deterministic demo payload for the public patient summary page.
 */
export const buildPatientPortalViewModel = (
  patientId: string,
  query: PatientPortalQueryParse
): PatientPortalViewModel => {
  const seed = hashStringToSeed(patientId)
  const rand = mulberry32(seed)

  const baseInvoiced = 800 + Math.floor(rand() * 4200)
  const paidRatio = 0.35 + rand() * 0.55
  const totalPaid = Math.floor(baseInvoiced * paidRatio)
  const totalRemaining = Math.max(0, baseInvoiced - totalPaid)

  const partA = clampInt(rand() * 90000 + 10000, 10000, 99999)
  const partB = clampInt(rand() * 90000 + 10000, 10000, 99999)
  const fallbackPatientCode = `${partA}${partB}`

  const nextDue = format(addDays(new Date(), clampInt(rand() * 21, 3, 18)), 'yyyy-MM-dd')
  const phoneDigits = String(clampInt(2000000 + rand() * 7999999, 2000000, 9999999))

  return {
    patientId,
    queryDisplayName: query.displayName,
    queryDisplayCode: query.displayCode,
    fallbackPatientCode,
    totalInvoiced: baseInvoiced,
    totalPaid,
    totalRemaining,
    nextPaymentDueIso: nextDue,
    clinicPhoneDigits: phoneDigits,
    appointments: buildAppointments(rand, patientId),
  }
}
