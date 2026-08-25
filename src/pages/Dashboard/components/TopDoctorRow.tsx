import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import type { TopDoctor } from '@/types/dashboard.types'
import { formatCurrencyUsd } from '@/utils/formatters'

export type TopDoctorRowProps = {
  doctor: TopDoctor
  locale: string
}

export const TopDoctorRow: FC<TopDoctorRowProps> = ({ doctor, locale }) => {
  const { t } = useTranslation()
  const isTop = doctor.rank === 1

  return (
    <div
      className={[
        'flex items-center gap-4 border-b border-border-card px-4 py-3 last:border-b-0',
        isTop ? 'bg-primary/5' : '',
      ].join(' ')}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white"
        aria-label={String(doctor.rank)}
      >
        {doctor.rank}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-foreground">{doctor.name}</p>
        <p className="text-sm text-muted-foreground">
          {t('dashboard.topDoctors.treatments', { count: doctor.treatmentCount })}
        </p>
      </div>
      <p className="shrink-0 text-base font-bold text-primary">
        {formatCurrencyUsd(doctor.revenue, locale)}
      </p>
    </div>
  )
}
