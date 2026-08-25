import { http, HttpResponse } from 'msw'

import {
  getSeedAppointmentsForDate,
  mockPatientOptions,
  mockScheduleDoctors,
  mockTreatmentOptions,
  SCHEDULE_DAY_END,
  SCHEDULE_DAY_START,
  SCHEDULE_SLOT_MINUTES,
} from '@/mocks/data/appointments.mock'
import { getTenantId, getTenantOrdinal } from '@/mocks/handlers/utils'
import type { ScheduleAppointment } from '@/types/appointment-schedule.types'

const json = <T>(data: T) =>
  HttpResponse.json({ success: true as const, data })

const pathEndsWith = (suffix: string) =>
  (({ request }: { request: Request }) => {
    const url = new URL(request.url)
    return url.pathname.endsWith(suffix)
  }) as ({ request }: { request: Request }) => boolean

const appointmentsByTenantDate = new Map<string, Map<string, ScheduleAppointment[]>>()

const ensureAppointments = (request: Request, date: string) => {
  const tenantId = getTenantId(request)
  const ord = getTenantOrdinal(tenantId)
  if (!appointmentsByTenantDate.has(tenantId)) {
    appointmentsByTenantDate.set(tenantId, new Map())
  }
  const byDate = appointmentsByTenantDate.get(tenantId) as Map<string, ScheduleAppointment[]>
  if (!byDate.has(date)) {
    byDate.set(
      date,
      getSeedAppointmentsForDate(date).map((a) => ({
        ...a,
        id: `${a.id}-c${ord + 1}`,
        patientName: `${a.patientName} C${ord + 1}`,
      }))
    )
  }
  return byDate.get(date) as ScheduleAppointment[]
}

let idCounter = 100

export const appointmentsHandlers = [
  http.get(pathEndsWith('/api/appointments/schedule'), ({ request }) => {
    const ord = getTenantOrdinal(getTenantId(request))
    const url = new URL(request.url)
    const date = url.searchParams.get('date') ?? new Date().toISOString().slice(0, 10)
    const appointments = ensureAppointments(request, date)
    return json({
      doctors: mockScheduleDoctors.map((d) => ({ ...d, name: `${d.name} C${ord + 1}` })),
      appointments,
      dayStart: SCHEDULE_DAY_START,
      dayEnd: SCHEDULE_DAY_END,
      slotMinutes: SCHEDULE_SLOT_MINUTES,
    })
  }),

  http.get(pathEndsWith('/api/appointments/meta'), ({ request }) => {
    const ord = getTenantOrdinal(getTenantId(request))
    return json({
      doctors: mockScheduleDoctors.map((d) => ({ ...d, name: `${d.name} C${ord + 1}` })),
      treatments: mockTreatmentOptions,
      patients: mockPatientOptions.map((p) => ({
        ...p,
        id: `${p.id}-c${ord + 1}`,
        displayName: `${p.displayName} C${ord + 1}`,
      })),
    })
  }),

  http.post(pathEndsWith('/api/appointments'), async ({ request }) => {
    const ord = getTenantOrdinal(getTenantId(request))
    const body = (await request.json()) as {
      doctorId: string
      patientId: string
      treatmentType?: string | null
      durationMinutes: number
      date: string
      startTime: string
    }

    const patient = mockPatientOptions.find((p) => body.patientId.startsWith(p.id))
    const procedureFromTreatment = mockTreatmentOptions.find((t) => t.id === body.treatmentType)

    const procedureLabel =
      procedureFromTreatment?.label ??
      (typeof body.treatmentType === 'string' && body.treatmentType.length > 0
        ? body.treatmentType
        : 'Consultation')

    const list = ensureAppointments(request, body.date)
    idCounter += 1
    const created: ScheduleAppointment = {
      id: `apt-${idCounter}`,
      doctorId: body.doctorId,
      patientId: body.patientId,
      patientName: `${patient?.displayName ?? 'Unknown patient'} C${ord + 1}`,
      patientCode: patient?.patientCode ?? body.patientId,
      procedureLabel,
      startTime: body.startTime,
      durationMinutes: body.durationMinutes,
    }
    list.push(created)
    return json(created)
  }),
]
