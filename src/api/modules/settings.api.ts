import { z } from 'zod'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type { SettingsPatchPayload } from '@/types/settings.types'
import { parseApiResponse } from '@/types/api.types'

const clinicInfoSchema = z.object({
  name: z.string(),
  phone: z.string(),
  address: z.string(),
  logoUrl: z.string().optional(),
})

const workDaysSchema = z.object({
  sun: z.boolean(),
  mon: z.boolean(),
  tue: z.boolean(),
  wed: z.boolean(),
  thu: z.boolean(),
  fri: z.boolean(),
  sat: z.boolean(),
})

const workHoursSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
})

const settingsPayloadSchema = z.object({
  clinic: clinicInfoSchema,
  workDays: workDaysSchema,
  workHours: workHoursSchema,
})

const logoUploadResponseSchema = z.object({
  logoUrl: z.string(),
})

export const settingsApi = {
  get: async () => {
    const res = await apiClient.get<unknown>(endpoints.settings.root)
    return parseApiResponse(res.data, settingsPayloadSchema)
  },

  patch: async (body: SettingsPatchPayload) => {
    const res = await apiClient.patch<unknown>(endpoints.settings.root, body)
    return parseApiResponse(res.data, settingsPayloadSchema)
  },

  /** Upload logo; MSW returns a stable public path. Merge `logoUrl` into clinic via `patch`. */
  uploadLogo: async (file: File) => {
    const formData = new FormData()
    formData.append('logo', file)
    const res = await apiClient.post<unknown>(endpoints.settings.logo, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return parseApiResponse(res.data, logoUploadResponseSchema)
  },
}

