import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useDoctorMe } from '@/hooks/doctors/useDoctorMe'

import { DoctorPaymentsStats, DoctorPaymentsTable } from '@/pages/Doctors/components/DoctorPaymentsPanel'

export const MyPaymentsPage: FC = () => {
  const { t } = useTranslation()
  const detailQuery = useDoctorMe()

  const doctor = detailQuery.data?.doctor
  const stats = detailQuery.data?.stats
  const payments = detailQuery.data?.payments ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary md:text-3xl">{t('myPayments.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">{t('myPayments.subtitle')}</p>
      </div>

      {detailQuery.isPending && (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {detailQuery.isError && (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">{t('myPayments.error')}</p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => void detailQuery.refetch()}
          >
            {t('doctors.error.retry')}
          </Button>
        </div>
      )}

      {doctor && stats && (
        <>
          <div className="rounded-card border border-border-card bg-surface p-6 shadow-card">
            <h2 className="text-xl font-bold text-foreground">{doctor.name}</h2>
            <p className="mt-1 text-muted-foreground">{doctor.specialization}</p>
          </div>

          <DoctorPaymentsStats
            totalTreatments={stats.totalTreatments}
            totalRevenue={stats.totalRevenue}
            outstandingPayments={stats.outstandingPayments}
            remainingPayments={stats.remainingPayments}
          />

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">{t('doctors.detail.paymentsTitle')}</h2>
            <DoctorPaymentsTable payments={payments} readOnly />
          </div>
        </>
      )}
    </div>
  )
}
