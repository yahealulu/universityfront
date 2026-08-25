import type { DashboardStats, ExpenseCategory, RevenueChartPoint } from '@/types/dashboard.types'

export type ReportsPeriod = 'weekly' | 'monthly' | 'yearly'

export type ReportsBundle = {
  stats: DashboardStats
  expenseCategories: ExpenseCategory[]
  revenueChart: RevenueChartPoint[]
}
