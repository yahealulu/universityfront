import { z } from 'zod'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type { LabRequestUpsertInput } from '@/types/lab-request.types'
import { parseApiResponse } from '@/types/api.types'

const labRequestSchema = z.object({
  id: z.string(),
  labId: z.string(),
  labName: z.string(),
  patientId: z.string(),
  patientName: z.string(),
  patientCode: z.string(),
  workTypeId: z.string(),
  workTypeLabel: z.string(),
  quantity: z.number(),
  requestDate: z.string(),
  costUsd: z.number().nullable(),
  status: z.enum(['pending', 'delivered', 'canceled']),
  notes: z.string(),
})

const labRequestsListSchema = z.array(labRequestSchema)

const metaLabSchema = z.object({
  id: z.string(),
  name: z.string(),
})

const metaPatientSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  patientCode: z.string(),
})

const metaWorkTypeSchema = z.object({
  id: z.string(),
  label: z.string(),
})

const labRequestsMetaSchema = z.object({
  labs: z.array(metaLabSchema),
  patients: z.array(metaPatientSchema),
  workTypes: z.array(metaWorkTypeSchema),
})

export const labRequestsApi = {
  list: async () => {
    const res = await apiClient.get<unknown>(endpoints.labRequests.list)
    return parseApiResponse(res.data, labRequestsListSchema)
  },

  getMeta: async () => {
    const res = await apiClient.get<unknown>(endpoints.labRequests.meta)
    return parseApiResponse(res.data, labRequestsMetaSchema)
  },

  create: async (body: LabRequestUpsertInput) => {
    const res = await apiClient.post<unknown>(endpoints.labRequests.list, body)
    return parseApiResponse(res.data, labRequestSchema)
  },

  update: async (id: string, body: LabRequestUpsertInput) => {
    const res = await apiClient.patch<unknown>(endpoints.labRequests.detail(id), body)
    return parseApiResponse(res.data, labRequestSchema)
  },

  delete: async (id: string) => {
    await apiClient.delete(endpoints.labRequests.detail(id))
  },
}
