import type { FC } from 'react'

import { useRevenueChart } from '@/hooks/dashboard/useRevenueChart'

import { RevenueExpensesChartPanel } from './RevenueExpensesChartPanel'

export const RevenueExpensesChart: FC = () => {
  const { data, isPending, isError, refetch } = useRevenueChart()

  return (
    <RevenueExpensesChartPanel
      titleKey="dashboard.chart.title"
      revenueLabelKey="dashboard.chart.revenue"
      expensesLabelKey="dashboard.chart.expenses"
      data={data}
      isPending={isPending}
      isError={isError}
      onRetry={() => void refetch()}
    />
  )
}
