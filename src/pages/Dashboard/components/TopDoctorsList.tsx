import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'
import { useTopDoctors } from '@/hooks/dashboard/useTopDoctors'

import { TopDoctorRow } from './TopDoctorRow'

export const TopDoctorsList: FC = () => {
  const { t, i18n } = useTranslation()
  const { data, isPending, isError, refetch } = useTopDoctors()
  const locale = i18n.language

  if (isPending) {
    return (
      <section
        className="rounded-card border border-border-card bg-surface shadow-card"
        aria-busy="true"
        aria-label={t('dashboard.topDoctors.title')}
      >
        <div className="border-b border-border-card px-4 py-4">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="divide-y divide-border-card p-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 px-4 py-3">
              <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="rounded-card border border-border-card bg-surface p-6 shadow-card">
        <h2 className="text-lg font-bold text-foreground">{t('dashboard.topDoctors.title')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t('dashboard.topDoctors.error')}</p>
        <button
          type="button"
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          onClick={() => void refetch()}
        >
          {t('dashboard.topDoctors.retry')}
        </button>
      </section>
    )
  }

  if (!data?.length) {
    return (
      <section className="rounded-card border border-border-card bg-surface p-6 shadow-card">
        <h2 className="text-lg font-bold text-foreground">{t('dashboard.topDoctors.title')}</h2>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t('dashboard.topDoctors.empty')}
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-card border border-border-card bg-surface shadow-card">
      <h2 className="border-b border-border-card px-4 py-4 text-lg font-bold text-foreground">
        {t('dashboard.topDoctors.title')}
      </h2>
      <div className="py-1">
        {data.map((doctor) => (
          <TopDoctorRow key={doctor.id} doctor={doctor} locale={locale} />
        ))}
      </div>
    </section>
  )
}
