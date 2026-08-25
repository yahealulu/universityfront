import { z } from 'zod'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type { LabUpsertInput } from '@/types/lab.types'
import { parseApiResponse } from '@/types/api.types'

const labSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  address: z.string(),
  totalRequests: z.number(),
  activeRequests: z.number(),
})

const labsListSchema = z.array(labSchema)

export const labsApi = {
  list: async () => {
    const res = await apiClient.get<unknown>(endpoints.labs.list)
    return parseApiResponse(res.data, labsListSchema)
  },

  create: async (body: LabUpsertInput) => {
    const res = await apiClient.post<unknown>(endpoints.labs.list, body)
    return parseApiResponse(res.data, labSchema)
  },

  update: async (id: string, body: LabUpsertInput) => {
    const res = await apiClient.patch<unknown>(endpoints.labs.detail(id), body)
    return parseApiResponse(res.data, labSchema)
  },

  delete: async (id: string) => {
    await apiClient.delete(endpoints.labs.detail(id))
  },
}
