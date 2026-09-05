import { z } from 'zod'

import { apiClient } from '@/api/client'
import type { AuthSession } from '@/types/auth.types'
import { parseApiResponse } from '@/types/api.types'

const clinicSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
})

const authUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().optional(),
  username: z.string(),
  role: z.enum(['owner', 'doctor', 'secretary']),
  hasAllClinics: z.boolean().optional(),
})

const authSessionSchema = z.object({
  accessToken: z.string(),
  token: z.string(),
  user: authUserSchema,
  clinics: z.array(clinicSummarySchema),
  hasAllClinics: z.boolean().optional(),
})

export const authApi = {
  login: async (body: { identifier: string; password: string }): Promise<AuthSession> => {
    const res = await apiClient.post<unknown>('/api/auth/login', body)
    return parseApiResponse(res.data, authSessionSchema)
  },
  logout: async () => {
    await apiClient.post('/api/auth/logout')
  },
  me: async (): Promise<AuthSession> => {
    const res = await apiClient.get<unknown>('/api/auth/me')
    return parseApiResponse(res.data, authSessionSchema)
  },
}
