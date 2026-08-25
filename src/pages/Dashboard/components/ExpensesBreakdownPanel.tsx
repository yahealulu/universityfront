import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'
import type { ExpenseCategory } from '@/types/dashboard.types'

import { ExpenseBar } from './ExpenseBar'

export type ExpensesBreakdownPanelProps = {
  titleKey: string
  categories: ExpenseCategory[] | undefined
  isPending: boolean
  isError: boolean
  onRetry: () => void
  emptyKey?: string
  errorKey?: string
  retryKey?: string
}

export const ExpensesBreakdownPanel: FC<ExpensesBreakdownPanelProps> = ({
  titleKey,
  categories,
  isPending,
  isError,
  onRetry,
  emptyKey = 'dashboard.expenses.empty',
  errorKey = 'dashboard.expenses.error',
  retryKey = 'dashboard.expenses.retry',
}) => {
  const { t, i18n } = useTranslation()
  const locale = i18n.language

  if (isPending) {
    return (
      <section
        className="rounded-card border border-border-card bg-surface p-4 shadow-card"
        aria-busy="true"
        aria-label={t(titleKey)}
      >
        <Skeleton className="mb-4 h-6 w-40" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="rounded-card border border-border-card bg-surface p-6 shadow-card">
        <h2 className="text-lg font-bold text-foreground">{t(titleKey)}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t(errorKey)}</p>
        <button
          type="button"
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          onClick={() => void onRetry()}
        >
          {t(retryKey)}
        </button>
      </section>
    )
  }

  if (!categories?.length) {
    return (
      <section className="rounded-card border border-border-card bg-surface p-6 shadow-card">
        <h2 className="text-lg font-bold text-foreground">{t(titleKey)}</h2>
        <p className="mt-4 text-center text-sm text-muted-foreground">{t(emptyKey)}</p>
      </section>
    )
  }

  return (
    <section className="rounded-card border border-border-card bg-surface p-4 shadow-card">
      <h2 className="mb-4 text-lg font-bold text-foreground">{t(titleKey)}</h2>
      <div className="space-y-5">
        {categories.map((cat) => (
          <ExpenseBar key={cat.id} category={cat} locale={locale} />
        ))}
      </div>
    </section>
  )
}
