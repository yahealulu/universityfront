import type { FallbackProps } from 'react-error-boundary'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ErrorBoundary } from 'react-error-boundary'

import { DashboardStatsSection } from '@/pages/Dashboard/components/DashboardStatsSection'
import { ExpensesBreakdown } from '@/pages/Dashboard/components/ExpensesBreakdown'
import { RevenueExpensesChart } from '@/pages/Dashboard/components/RevenueExpensesChart'
import { TodayAppointments } from '@/pages/Dashboard/components/TodayAppointments'
import { TopDoctorsList } from '@/pages/Dashboard/components/TopDoctorsList'

const DashboardPageError: FC<FallbackProps> = ({ resetErrorBoundary }) => {
  const { t } = useTranslation()
  return (
    <div className="rounded-card border border-danger/30 bg-surface p-8 text-center shadow-card">
      <p className="text-foreground">{t('dashboard.error.page')}</p>
      <button
        type="button"
        className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        onClick={resetErrorBoundary}
      >
        {t('dashboard.error.retry')}
      </button>
    </div>
  )
}

const ChartSectionError: FC<FallbackProps> = ({ resetErrorBoundary }) => {
  const { t } = useTranslation()
  return (
    <div className="rounded-card border border-border-card bg-surface p-6 shadow-card">
      <h2 className="text-lg font-bold text-foreground">{t('dashboard.chart.fallbackTitle')}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{t('dashboard.error.section')}</p>
      <button
        type="button"
        className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        onClick={resetErrorBoundary}
      >
        {t('dashboard.chart.retry')}
      </button>
    </div>
  )
}

export const DashboardPage: FC = () => {
  return (
    <ErrorBoundary FallbackComponent={DashboardPageError}>
      <div className="space-y-6">
        <DashboardStatsSection />
        <div className="grid gap-6 lg:grid-cols-2">
          <TopDoctorsList />
          <TodayAppointments />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <ExpensesBreakdown />
          <ErrorBoundary FallbackComponent={ChartSectionError}>
            <RevenueExpensesChart />
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  )
}
