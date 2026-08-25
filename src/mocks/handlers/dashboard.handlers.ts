import { http, HttpResponse } from 'msw'

import {
  mockDashboardStats,
  mockExpenseCategories,
  mockRevenueChart,
  mockTodayAppointments,
  mockTopDoctors,
} from '@/mocks/data/dashboard.mock'
import { getTenantId, getTenantOrdinal } from '@/mocks/handlers/utils'

const json = <T>(data: T) =>
  HttpResponse.json({ success: true as const, data })

/** Match Axios requests regardless of origin (VITE_API_BASE_URL) */
const pathEndsWith = (suffix: string) =>
  (({ request }: { request: Request }) => {
    const url = new URL(request.url)
    return url.pathname.endsWith(suffix)
  }) as ({ request }: { request: Request }) => boolean

export const dashboardHandlers = [
  http.get(pathEndsWith('/api/dashboard/stats'), ({ request }) => {
    const ord = getTenantOrdinal(getTenantId(request))
    return json({
      ...mockDashboardStats,
      totalRevenue: mockDashboardStats.totalRevenue + ord * 850,
      totalExpenses: mockDashboardStats.totalExpenses + ord * 530,
      netProfit: mockDashboardStats.netProfit + ord * 320,
      profitMargin: Math.max(10, mockDashboardStats.profitMargin - ord * 2.2),
    })
  }),
  http.get(pathEndsWith('/api/dashboard/top-doctors'), ({ request }) => {
    const ord = getTenantOrdinal(getTenantId(request))
    return json(
      mockTopDoctors.map((d, i) => ({
        ...d,
        id: `${d.id}-c${ord + 1}`,
        name: `${d.name} · C${ord + 1}`,
        treatmentCount: d.treatmentCount + ord * 3 + i,
        revenue: d.revenue + ord * 250,
      }))
    )
  }),
  http.get(pathEndsWith('/api/dashboard/today-appointments'), ({ request }) => {
    const ord = getTenantOrdinal(getTenantId(request))
    return json(
      mockTodayAppointments.map((a) => ({
        ...a,
        id: `${a.id}-c${ord + 1}`,
        patientName: `${a.patientName} C${ord + 1}`,
      }))
    )
  }),
  http.get(pathEndsWith('/api/dashboard/expenses-breakdown'), ({ request }) => {
    const ord = getTenantOrdinal(getTenantId(request))
    return json(
      mockExpenseCategories.map((x, i) => ({
        ...x,
        amount: x.amount + ord * 120 + i * 20,
      }))
    )
  }),
  http.get(pathEndsWith('/api/dashboard/revenue-expenses'), ({ request }) => {
    const ord = getTenantOrdinal(getTenantId(request))
    return json(
      mockRevenueChart.map((p) => ({
        ...p,
        revenue: p.revenue + ord * 700,
        expenses: p.expenses + ord * 320,
      }))
    )
  }),
]
