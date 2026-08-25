import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardStats } from '@/hooks/dashboard/useDashboardStats'
import { formatCurrencyUsd, formatPercent } from '@/utils/formatters'

import { StatCard } from './StatCard'

export const DashboardStatsSection: FC = () => {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const { data, isPending, isError, refetch } = useDashboardStats()

  if (isPending) {
    return (
      <div
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-busy="true"
        aria-label={t('dashboard.loading')}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-card border border-border-card bg-surface p-5 shadow-card"
          >
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-3 h-9 w-32" />
            <Skeleton className="mt-4 h-4 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="rounded-card border border-border-card bg-surface p-6 shadow-card">
        <p className="text-sm text-muted-foreground">{t('dashboard.error.page')}</p>
        <button
          type="button"
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          onClick={() => void refetch()}
        >
          {t('dashboard.error.retry')}
        </button>
      </div>
    )
  }

  const marginLabel = t('common.percent', { value: formatPercent(data.profitMargin, locale) })

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        titleKey="dashboard.stats.totalRevenue"
        valueLabel={formatCurrencyUsd(data.totalRevenue, locale)}
        valueTone="success"
        deltaPercent={data.revenueChange}
        deltaTone="success"
      />
      <StatCard
        titleKey="dashboard.stats.totalExpenses"
        valueLabel={formatCurrencyUsd(data.totalExpenses, locale)}
        valueTone="danger"
        deltaPercent={data.expensesChange}
        deltaTone="danger"
      />
      <StatCard
        titleKey="dashboard.stats.netProfit"
        valueLabel={formatCurrencyUsd(data.netProfit, locale)}
        valueTone="neutral"
        deltaPercent={data.netProfitChange}
        deltaTone="neutral"
      />
      <StatCard
        titleKey="dashboard.stats.profitMargins"
        valueLabel={marginLabel}
        valueTone="warning"
        deltaPercent={data.marginChange}
        deltaTone="warning"
      />
    </div>
  )
}
