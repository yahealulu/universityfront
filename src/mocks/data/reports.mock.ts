import type { ReportsBundle } from '@/types/reports.types'

import { mockDashboardStats, mockExpenseCategories, mockRevenueChart } from '@/mocks/data/dashboard.mock'
import { getTenantOrdinal } from '@/mocks/handlers/utils'

/** Same snapshot as dashboard; MSW can vary by period/clinic later */
export const getReportsBundle = (clinicId: string): ReportsBundle => {
  const ord = getTenantOrdinal(clinicId)
  return {
    stats: {
      ...mockDashboardStats,
      totalRevenue: mockDashboardStats.totalRevenue + ord * 1000,
      totalExpenses: mockDashboardStats.totalExpenses + ord * 560,
      netProfit: mockDashboardStats.netProfit + ord * 300,
      profitMargin: Math.max(10, mockDashboardStats.profitMargin - ord * 2),
    },
    expenseCategories: mockExpenseCategories.map((c, i) => ({
      ...c,
      amount: c.amount + ord * 180 + i * 10,
    })),
    revenueChart: mockRevenueChart.map((p) => ({
      ...p,
      revenue: p.revenue + ord * 750,
      expenses: p.expenses + ord * 340,
    })),
  }
}

