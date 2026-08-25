import { z } from 'zod'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { parseApiResponse } from '@/types/api.types'
import type { ClinicSummary, CreateClinicPayload, CreatedClinicResponse } from '@/types/clinic.types'

const workDayIdSchema = z.enum([
  'saturday',
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
])

const clinicSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
})

const clinicsListSchema = z.array(clinicSummarySchema)

const createClinicBodySchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  logoFileName: z.string().nullable(),
  workDays: z.array(workDayIdSchema),
  workHours: z.object({
    startTime: z.string().min(1),
    endTime: z.string().min(1),
  }),
})

const createdClinicSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const clinicsApi = {
  getList: async (): Promise<ClinicSummary[]> => {
    const res = await apiClient.get<unknown>(endpoints.clinics.list)
    return parseApiResponse(res.data, clinicsListSchema)
  },

  create: async (payload: CreateClinicPayload): Promise<CreatedClinicResponse> => {
    createClinicBodySchema.parse(payload)
    const res = await apiClient.post<unknown>(endpoints.clinics.create, payload)
    return parseApiResponse(res.data, createdClinicSchema)
  },
}
