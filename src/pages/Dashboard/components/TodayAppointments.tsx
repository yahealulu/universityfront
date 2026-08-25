import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'
import { useTodayAppointments } from '@/hooks/dashboard/useTodayAppointments'

import { AppointmentRow } from './AppointmentRow'

export const TodayAppointments: FC = () => {
  const { t } = useTranslation()
  const { data, isPending, isError, refetch } = useTodayAppointments()

  if (isPending) {
    return (
      <section
        className="rounded-card border border-border-card bg-surface shadow-card"
        aria-busy="true"
        aria-label={t('dashboard.appointments.title')}
      >
        <div className="border-b border-border-card px-4 py-4">
          <Skeleton className="h-6 w-56" />
        </div>
        <div className="max-h-[320px] space-y-2 overflow-y-auto p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 rounded-lg border border-border-card p-3">
              <Skeleton className="h-8 w-16 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="rounded-card border border-border-card bg-surface p-6 shadow-card">
        <h2 className="text-lg font-bold text-foreground">{t('dashboard.appointments.title')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t('dashboard.appointments.error')}</p>
        <button
          type="button"
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          onClick={() => void refetch()}
        >
          {t('dashboard.appointments.retry')}
        </button>
      </section>
    )
  }

  if (!data?.length) {
    return (
      <section className="rounded-card border border-border-card bg-surface p-6 shadow-card">
        <h2 className="text-lg font-bold text-foreground">{t('dashboard.appointments.title')}</h2>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t('dashboard.appointments.empty')}
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-card border border-border-card bg-surface shadow-card">
      <h2 className="border-b border-border-card px-4 py-4 text-lg font-bold text-foreground">
        {t('dashboard.appointments.title')}
      </h2>
      <div className="max-h-[320px] space-y-2 overflow-y-auto p-4">
        {data.map((apt) => (
          <AppointmentRow key={apt.id} appointment={apt} />
        ))}
      </div>
    </section>
  )
}
