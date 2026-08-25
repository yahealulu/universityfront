import { z } from 'zod'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type { ExpenseCreateInput, ExpenseUpdateInput } from '@/types/expense.types'
import { parseApiResponse } from '@/types/api.types'

const expenseRowCategorySchema = z.enum(['labs', 'doctors', 'others'])

const expenseListItemSchema = z.object({
  id: z.string(),
  date: z.string(),
  title: z.string(),
  category: expenseRowCategorySchema,
  description: z.string(),
  amount: z.number(),
})

const expensesListPayloadSchema = z.object({
  expenses: z.array(expenseListItemSchema),
})

const expensesSummarySchema = z.object({
  labPayments: z.number(),
  totalExpenses: z.number(),
  doctorPayments: z.number(),
  others: z.number(),
})

export const expensesApi = {
  list: async () => {
    const res = await apiClient.get<unknown>(endpoints.expenses.list)
    return parseApiResponse(res.data, expensesListPayloadSchema)
  },

  getSummary: async () => {
    const res = await apiClient.get<unknown>(endpoints.expenses.summary)
    return parseApiResponse(res.data, expensesSummarySchema)
  },

  getDetail: async (id: string) => {
    const res = await apiClient.get<unknown>(endpoints.expenses.detail(id))
    return parseApiResponse(res.data, expenseListItemSchema)
  },

  create: async (body: ExpenseCreateInput) => {
    const res = await apiClient.post<unknown>(endpoints.expenses.list, body)
    return parseApiResponse(res.data, expenseListItemSchema)
  },

  update: async (id: string, body: ExpenseUpdateInput) => {
    const res = await apiClient.patch<unknown>(endpoints.expenses.detail(id), body)
    return parseApiResponse(res.data, expenseListItemSchema)
  },

  delete: async (id: string) => {
    await apiClient.delete(endpoints.expenses.detail(id))
  },
}
