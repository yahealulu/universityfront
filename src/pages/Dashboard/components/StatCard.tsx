import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

type StatDeltaTone = 'success' | 'danger' | 'neutral' | 'warning'

export type StatCardProps = {
  titleKey: string
  valueLabel: string
  /** Colors the main metric (defaults to neutral foreground). */
  valueTone?: StatDeltaTone
  /** When false, hides the delta row (e.g. expenses summary cards). */
  showDelta?: boolean
  deltaPercent: number
  deltaTone: StatDeltaTone
}

const toneClass: Record<StatDeltaTone, string> = {
  success: 'text-success',
  danger: 'text-danger',
  neutral: 'text-primary',
  warning: 'text-warning',
}

const valueToneClass = (tone: StatDeltaTone | undefined): string =>
  tone ? toneClass[tone] : 'text-foreground'

export const StatCard: FC<StatCardProps> = ({
  titleKey,
  valueLabel,
  valueTone,
  showDelta = true,
  deltaPercent,
  deltaTone,
}) => {
  const { t } = useTranslation()
  const Arrow = deltaPercent >= 0 ? ArrowUpRight : ArrowDownRight
  const deltaLabel = `${deltaPercent >= 0 ? '+' : ''}${t('common.percent', { value: Math.abs(deltaPercent) })}`

  return (
    <div className="rounded-card border border-border-card bg-surface p-5 shadow-card">
      <p className="text-sm font-medium text-muted-foreground">{t(titleKey)}</p>
      <p className={`mt-2 text-3xl font-bold tracking-tight ${valueToneClass(valueTone)}`}>{valueLabel}</p>
      {showDelta && (
        <div className={`mt-3 flex items-center gap-1 text-sm font-medium ${toneClass[deltaTone]}`}>
          <Arrow className="h-4 w-4 shrink-0" aria-hidden />
          <span>{deltaLabel}</span>
          <span className="font-normal text-muted-foreground">
            {t('dashboard.stats.deltaVersusLastMonth')}
          </span>
        </div>
      )}
    </div>
  )
}
