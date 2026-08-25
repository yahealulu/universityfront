import { z } from 'zod'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type { CreateAppointmentInput } from '@/types/appointment-schedule.types'
import { parseApiResponse } from '@/types/api.types'

const scheduleDoctorSchema = z.object({
  id: z.string(),
  name: z.string(),
  specialty: z.string(),
})

const scheduleAppointmentSchema = z.object({
  id: z.string(),
  doctorId: z.string(),
  patientId: z.string(),
  patientName: z.string(),
  patientCode: z.string(),
  procedureLabel: z.string(),
  startTime: z.string(),
  durationMinutes: z.number(),
})

const appointmentScheduleSchema = z.object({
  doctors: z.array(scheduleDoctorSchema),
  appointments: z.array(scheduleAppointmentSchema),
  dayStart: z.string(),
  dayEnd: z.string(),
  slotMinutes: z.number(),
})

const treatmentOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
})

const patientOptionSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  patientCode: z.string(),
})

const appointmentsMetaSchema = z.object({
  doctors: z.array(scheduleDoctorSchema),
  treatments: z.array(treatmentOptionSchema),
  patients: z.array(patientOptionSchema),
})

export const appointmentsApi = {
  getSchedule: async (params: { date: string }) => {
    const res = await apiClient.get<unknown>(endpoints.appointments.schedule, { params })
    return parseApiResponse(res.data, appointmentScheduleSchema)
  },

  getMeta: async () => {
    const res = await apiClient.get<unknown>(endpoints.appointments.meta)
    return parseApiResponse(res.data, appointmentsMetaSchema)
  },

  create: async (body: CreateAppointmentInput) => {
    const res = await apiClient.post<unknown>(endpoints.appointments.create, body)
    return parseApiResponse(res.data, scheduleAppointmentSchema)
  },
}
