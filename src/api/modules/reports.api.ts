import { z } from 'zod'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type { ReportsPeriod } from '@/types/reports.types'
import { parseApiResponse } from '@/types/api.types'

const dashboardStatsSchema = z.object({
  totalRevenue: z.number(),
  totalExpenses: z.number(),
  netProfit: z.number(),
  profitMargin: z.number(),
  revenueChange: z.number(),
  expensesChange: z.number(),
  netProfitChange: z.number(),
  marginChange: z.number(),
})

const expenseCategorySchema = z.object({
  id: z.string(),
  label: z.string(),
  amount: z.number(),
  percentage: z.number(),
})

const revenueChartPointSchema = z.object({
  month: z.string(),
  revenue: z.number(),
  expenses: z.number(),
})

const reportsBundleSchema = z.object({
  stats: dashboardStatsSchema,
  expenseCategories: z.array(expenseCategorySchema),
  revenueChart: z.array(revenueChartPointSchema),
})

export type ReportsClinicOption = { id: string; name: string }

const clinicsListSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
  })
)

export const reportsApi = {
  getBundle: async (params: { period: ReportsPeriod; clinicId: string }) => {
    const res = await apiClient.get<unknown>(endpoints.reports.bundle, {
      params: {
        period: params.period,
        clinicId: params.clinicId,
      },
    })
    return parseApiResponse(res.data, reportsBundleSchema)
  },

  getClinics: async () => {
    const res = await apiClient.get<unknown>(endpoints.reports.clinics)
    return parseApiResponse(res.data, clinicsListSchema)
  },
}
