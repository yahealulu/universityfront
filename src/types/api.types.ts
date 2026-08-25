import { z } from 'zod'

export type ApiResponse<T> = {
  success: boolean
  data: T
  message?: string
}

export const createApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
  })

export const parseApiResponse = <T>(raw: unknown, dataSchema: z.ZodType<T>): T => {
  const schema = createApiResponseSchema(dataSchema)
  const parsed = schema.parse(raw)
  if (!parsed.success) {
    throw new Error(parsed.message ?? 'Request failed')
  }
  return parsed.data as T
}
