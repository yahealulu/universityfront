import type { FC } from 'react'

import { useExpensesBreakdown } from '@/hooks/dashboard/useExpensesBreakdown'

import { ExpensesBreakdownPanel } from './ExpensesBreakdownPanel'

export const ExpensesBreakdown: FC = () => {
  const { data, isPending, isError, refetch } = useExpensesBreakdown()

  return (
    <ExpensesBreakdownPanel
      titleKey="dashboard.expenses.title"
      categories={data}
      isPending={isPending}
      isError={isError}
      onRetry={() => void refetch()}
    />
  )
}
