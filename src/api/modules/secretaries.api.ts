import { z } from 'zod'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type { SecretaryCreateInput, SecretaryUpdateInput } from '@/types/secretary.types'
import { parseApiResponse } from '@/types/api.types'

const secretaryListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  username: z.string(),
  passwordDisplay: z.string(),
})

const secretariesListPayloadSchema = z.object({
  secretaries: z.array(secretaryListItemSchema),
  quota: z.object({
    max: z.number(),
    remaining: z.number(),
  }),
})

const secretaryFullSchema = z.object({
  id: z.string(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  name: z.string(),
  phone: z.string(),
  salary: z.number(),
})

export const secretariesApi = {
  list: async () => {
    const res = await apiClient.get<unknown>(endpoints.secretaries.list)
    return parseApiResponse(res.data, secretariesListPayloadSchema)
  },

  getDetail: async (id: string) => {
    const res = await apiClient.get<unknown>(endpoints.secretaries.detail(id))
    return parseApiResponse(res.data, secretaryFullSchema)
  },

  create: async (body: SecretaryCreateInput) => {
    const res = await apiClient.post<unknown>(endpoints.secretaries.list, body)
    return parseApiResponse(res.data, secretaryFullSchema)
  },

  update: async (id: string, body: SecretaryUpdateInput) => {
    const res = await apiClient.patch<unknown>(endpoints.secretaries.detail(id), body)
    return parseApiResponse(res.data, secretaryFullSchema)
  },

  delete: async (id: string) => {
    await apiClient.delete(endpoints.secretaries.detail(id))
  },
}
