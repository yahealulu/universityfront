import { z } from 'zod'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import { parseApiResponse } from '@/types/api.types'
import { AppointmentStatus } from '@/types/dashboard.types'

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

const topDoctorSchema = z.object({
  id: z.string(),
  rank: z.number(),
  name: z.string(),
  treatmentCount: z.number(),
  revenue: z.number(),
  avatarUrl: z.string().optional(),
})

const topDoctorsSchema = z.array(topDoctorSchema)

const todayAppointmentSchema = z.object({
  id: z.string(),
  time: z.string(),
  patientName: z.string(),
  patientId: z.string(),
  doctorName: z.string(),
  status: z.nativeEnum(AppointmentStatus),
})

const todayAppointmentsSchema = z.array(todayAppointmentSchema)

const expenseCategorySchema = z.object({
  id: z.string(),
  label: z.string(),
  amount: z.number(),
  percentage: z.number(),
})

const expenseCategoriesSchema = z.array(expenseCategorySchema)

const revenueChartPointSchema = z.object({
  month: z.string(),
  revenue: z.number(),
  expenses: z.number(),
})

const revenueChartSchema = z.array(revenueChartPointSchema)

export const dashboardApi = {
  getStats: async () => {
    const res = await apiClient.get<unknown>(endpoints.dashboard.stats)
    return parseApiResponse(res.data, dashboardStatsSchema)
  },

  getTopDoctors: async () => {
    const res = await apiClient.get<unknown>(endpoints.dashboard.topDoctors)
    return parseApiResponse(res.data, topDoctorsSchema)
  },

  getTodayAppointments: async () => {
    const res = await apiClient.get<unknown>(endpoints.dashboard.todayAppointments)
    return parseApiResponse(res.data, todayAppointmentsSchema)
  },

  getExpensesBreakdown: async () => {
    const res = await apiClient.get<unknown>(endpoints.dashboard.expensesBreakdown)
    return parseApiResponse(res.data, expenseCategoriesSchema)
  },

  getRevenueExpenses: async (params: { from: string; to: string }) => {
    const res = await apiClient.get<unknown>(endpoints.dashboard.revenueExpenses, {
      params,
    })
    return parseApiResponse(res.data, revenueChartSchema)
  },
}
