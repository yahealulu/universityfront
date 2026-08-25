import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Skeleton } from '@/components/ui/skeleton'
import type { RevenueChartPoint } from '@/types/dashboard.types'
import { formatAxisThousands, formatCurrencyUsd } from '@/utils/formatters'

type TooltipPayload = {
  color?: string
  name?: string
  value?: number
}

type ChartTooltipProps = {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

const ChartTooltip: FC<ChartTooltipProps> = ({ active, payload, label }) => {
  const { i18n } = useTranslation()
  const locale = i18n.language

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border border-border-card bg-surface px-3 py-2 text-sm shadow-card">
      <p className="mb-1 font-semibold text-foreground">{label}</p>
      <ul className="space-y-1">
        {payload.map((item) => (
          <li key={item.name} className="flex items-center gap-2 text-muted-foreground">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
              aria-hidden
            />
            <span className="text-foreground">{item.name}:</span>
            <span className="font-medium text-foreground">
              {typeof item.value === 'number' ? formatCurrencyUsd(item.value, locale) : '—'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export type RevenueExpensesChartPanelProps = {
  titleKey: string
  revenueLabelKey: string
  expensesLabelKey: string
  data: RevenueChartPoint[] | undefined
  isPending: boolean
  isError: boolean
  onRetry: () => void
  emptyKey?: string
  errorKey?: string
  retryKey?: string
}

export const RevenueExpensesChartPanel: FC<RevenueExpensesChartPanelProps> = ({
  titleKey,
  revenueLabelKey,
  expensesLabelKey,
  data,
  isPending,
  isError,
  onRetry,
  emptyKey = 'dashboard.expenses.empty',
  errorKey = 'dashboard.chart.error',
  retryKey = 'dashboard.chart.retry',
}) => {
  const { t } = useTranslation()

  if (isPending) {
    return (
      <section
        className="rounded-card border border-border-card bg-surface p-4 shadow-card"
        aria-busy="true"
        aria-label={t(titleKey)}
      >
        <Skeleton className="mb-4 h-6 w-48" />
        <Skeleton className="h-56 w-full md:h-[280px]" />
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

  if (!data?.length) {
    return (
      <section className="rounded-card border border-border-card bg-surface p-6 shadow-card">
        <h2 className="text-lg font-bold text-foreground">{t(titleKey)}</h2>
        <p className="mt-4 text-center text-sm text-muted-foreground">{t(emptyKey)}</p>
      </section>
    )
  }

  const chartData = data

  return (
    <section className="rounded-card border border-border-card bg-surface p-4 shadow-card">
      <h2 className="mb-4 text-lg font-bold text-foreground">{t(titleKey)}</h2>
      <div className="h-56 w-full min-w-0 md:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
            <YAxis
              tickFormatter={(v: number) => formatAxisThousands(v)}
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: 16 }}
              formatter={(value: string) => <span className="text-sm text-foreground">{value}</span>}
            />
            <Bar
              name={t(revenueLabelKey)}
              dataKey="revenue"
              fill="var(--color-chart-revenue)"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              name={t(expensesLabelKey)}
              dataKey="expenses"
              fill="var(--color-chart-expenses)"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
