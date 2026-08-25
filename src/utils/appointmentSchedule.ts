import type { ScheduleAppointment } from '@/types/appointment-schedule.types'

export const timeToMinutes = (hhmm: string): number => {
  const parts = hhmm.split(':').map(Number)
  const h = parts[0] ?? 0
  const m = parts[1] ?? 0
  return h * 60 + m
}

export const minutesToTime = (total: number): string => {
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export const buildSlotStarts = (dayStart: string, dayEnd: string, slotMinutes: number): number[] => {
  const start = timeToMinutes(dayStart)
  const end = timeToMinutes(dayEnd)
  const slots: number[] = []
  for (let t = start; t < end; t += slotMinutes) {
    slots.push(t)
  }
  return slots
}

export type OccupancyCell =
  | { kind: 'empty' }
  | { kind: 'continuation' }
  | { kind: 'start'; appointment: ScheduleAppointment }

export const buildDoctorColumnOccupancy = (
  appointments: ScheduleAppointment[],
  doctorId: string,
  slotStarts: number[],
  slotMinutes: number
): OccupancyCell[] => {
  const byDoctor = appointments.filter((a) => a.doctorId === doctorId)
  const cells: OccupancyCell[] = slotStarts.map(() => ({ kind: 'empty' }))

  for (const apt of byDoctor) {
    const aptStart = timeToMinutes(apt.startTime)
    const aptEnd = aptStart + apt.durationMinutes

    for (let i = 0; i < slotStarts.length; i++) {
      const slotStart = slotStarts[i]
      if (slotStart === undefined) continue
      const slotEnd = slotStart + slotMinutes
      const overlaps = slotStart < aptEnd && slotEnd > aptStart
      if (!overlaps) continue

      if (slotStart === aptStart) {
        cells[i] = { kind: 'start', appointment: apt }
      } else if (slotStart > aptStart && slotStart < aptEnd) {
        cells[i] = { kind: 'continuation' }
      }
    }
  }

  return cells
}

export const matchesAppointmentSearch = (
  apt: ScheduleAppointment,
  doctorName: string,
  query: string
): boolean => {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const hay = [
    apt.patientName,
    apt.patientId,
    apt.patientCode,
    apt.procedureLabel,
    doctorName,
  ]
    .join(' ')
    .toLowerCase()
  return hay.includes(q)
}
