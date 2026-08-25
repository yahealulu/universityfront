import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useReportsBundle } from '@/hooks/reports/useReportsBundle'
import { useReportClinics } from '@/hooks/reports/useReportClinics'
import { ExpensesBreakdownPanel } from '@/pages/Dashboard/components/ExpensesBreakdownPanel'
import { RevenueExpensesChartPanel } from '@/pages/Dashboard/components/RevenueExpensesChartPanel'
import { StatCard } from '@/pages/Dashboard/components/StatCard'
import type { ReportsPeriod } from '@/types/reports.types'
import { useClinicStore } from '@/store/clinic.store'
import { formatCurrencyUsd, formatPercent } from '@/utils/formatters'

const periods: ReportsPeriod[] = ['weekly', 'monthly', 'yearly']

export const ReportsPage: FC = () => {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const activeClinicId = useClinicStore((s) => s.activeClinicId)
  const setActiveClinicId = useClinicStore((s) => s.setActiveClinicId)

  const [period, setPeriod] = useState<ReportsPeriod>('monthly')
  const [clinicId, setClinicId] = useState<string | null>(activeClinicId)

  const clinicsQuery = useReportClinics()
  const clinics = useMemo(() => clinicsQuery.data ?? [], [clinicsQuery.data])

  useEffect(() => {
    if (!clinicId && clinics.length > 0) {
      const match = clinics.find((c) => c.id === activeClinicId)
      const first = clinics[0]
      if (first) setClinicId(match?.id ?? first.id)
    }
  }, [clinicId, clinics, activeClinicId])

  const bundleQuery = useReportsBundle(period, clinicId)

  const stats = bundleQuery.data?.stats
  const marginLabel = stats
    ? t('common.percent', { value: formatPercent(stats.profitMargin, locale) })
    : ''

  const periodLabel = useMemo(
    () =>
      ({
        weekly: t('reports.period.weekly'),
        monthly: t('reports.period.monthly'),
        yearly: t('reports.period.yearly'),
      }) as Record<ReportsPeriod, string>,
    [t]
  )

  const handleClinicChange = (id: string) => {
    setClinicId(id)
    setActiveClinicId(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">{t('reports.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">{t('reports.subtitle')}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{t('reports.filters.period')}</Label>
            <Select value={period} onValueChange={(v) => setPeriod(v as ReportsPeriod)}>
              <SelectTrigger className="h-11 w-full min-w-0 border-border-card sm:h-10 sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periods.map((p) => (
                  <SelectItem key={p} value={p}>
                    {periodLabel[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{t('reports.filters.clinic')}</Label>
            <Select
              value={clinicId ?? ''}
              onValueChange={handleClinicChange}
              disabled={!clinics.length}
            >
              <SelectTrigger className="h-11 w-full min-w-0 border-border-card sm:h-10 sm:w-[200px]">
                <SelectValue placeholder={t('reports.filters.clinicPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {clinics.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {bundleQuery.isPending && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-card" />
          ))}
        </div>
      )}

      {stats && !bundleQuery.isPending && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            titleKey="reports.stats.totalRevenue"
            valueLabel={formatCurrencyUsd(stats.totalRevenue, locale)}
            valueTone="success"
            deltaPercent={stats.revenueChange}
            deltaTone="success"
          />
          <StatCard
            titleKey="reports.stats.totalExpenses"
            valueLabel={formatCurrencyUsd(stats.totalExpenses, locale)}
            valueTone="danger"
            deltaPercent={stats.expensesChange}
            deltaTone="danger"
          />
          <StatCard
            titleKey="reports.stats.netProfit"
            valueLabel={formatCurrencyUsd(stats.netProfit, locale)}
            valueTone="neutral"
            deltaPercent={stats.netProfitChange}
            deltaTone="neutral"
          />
          <StatCard
            titleKey="reports.stats.profitMargins"
            valueLabel={marginLabel}
            valueTone="warning"
            deltaPercent={stats.marginChange}
            deltaTone="warning"
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <ExpensesBreakdownPanel
          titleKey="reports.expensesBreakdownTitle"
          categories={bundleQuery.data?.expenseCategories}
          isPending={bundleQuery.isPending}
          isError={bundleQuery.isError}
          onRetry={() => void bundleQuery.refetch()}
          emptyKey="reports.emptyBreakdown"
          errorKey="reports.error.load"
          retryKey="reports.error.retry"
        />
        <RevenueExpensesChartPanel
          titleKey="reports.chartTitle"
          revenueLabelKey="dashboard.chart.revenue"
          expensesLabelKey="dashboard.chart.expenses"
          data={bundleQuery.data?.revenueChart}
          isPending={bundleQuery.isPending}
          isError={bundleQuery.isError}
          onRetry={() => void bundleQuery.refetch()}
          emptyKey="reports.emptyChart"
          errorKey="reports.error.chart"
          retryKey="reports.error.retry"
        />
      </div>

    </div>
  )
}
