import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import type { ToothStatusKey } from '@/types/patient.types'

import { DENTAL_LEGEND_ORDER, statusSurfaceClass } from './dentalStatus.styles'

export type ToothModalLegendProps = {
  selectedStatus: ToothStatusKey
  onSelectStatus: (key: ToothStatusKey) => void
}

export const ToothModalLegend: FC<ToothModalLegendProps> = ({
  selectedStatus,
  onSelectStatus,
}) => {
  const { t } = useTranslation()

  return (
    <div
      className="rounded-xl border border-border-card bg-muted/30 p-3 md:p-4"
      role="group"
      aria-label={t('patients.dental.legendTitle')}
    >
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 md:gap-x-6">
        {DENTAL_LEGEND_ORDER.map((key) => (
          <li key={key}>
            <button
              type="button"
              onClick={() => onSelectStatus(key)}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors md:text-sm',
                selectedStatus === key
                  ? 'border-primary bg-surface text-primary shadow-sm'
                  : 'border-transparent bg-transparent text-foreground hover:bg-muted/50'
              )}
            >
              <span
                className={cn('h-4 w-4 shrink-0 rounded-sm border-2', statusSurfaceClass(key))}
                aria-hidden
              />
              {t(`patients.dental.status.${key}`)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
