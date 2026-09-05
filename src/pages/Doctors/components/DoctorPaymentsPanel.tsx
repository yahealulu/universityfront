import { format, parseISO } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'
import type { DoctorPayment } from '@/types/doctor.types'
import { formatInvoiceMoney } from '@/utils/formatters'

export type DoctorPaymentsTableProps = {
  payments: DoctorPayment[]
  readOnly?: boolean
}

export const DoctorPaymentsTable: FC<DoctorPaymentsTableProps> = ({ payments, readOnly = false }) => {
  const { t, i18n } = useTranslation()
  const locale = i18n.language.startsWith('ar') ? ar : enUS
  const datePattern = i18n.language.startsWith('ar') ? 'd/M/yyyy' : 'M/d/yyyy'

  return (
    <div className="overflow-x-table rounded-xl border border-border-card" dir="ltr">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="bg-[#e0f2fe] text-start text-xs font-semibold uppercase text-muted-foreground">
            <th className="px-4 py-3">{t('doctors.detail.paymentTable.id')}</th>
            <th className="px-4 py-3">{t('doctors.detail.paymentTable.date')}</th>
            <th className="px-4 py-3">{t('doctors.detail.paymentTable.amount')}</th>
            <th className="px-4 py-3">{t('doctors.detail.paymentTable.method')}</th>
            {!readOnly ? (
              <th className="px-4 py-3 text-center">{t('doctors.detail.paymentTable.actions')}</th>
            ) : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-card bg-surface">
          {payments.length === 0 ? (
            <tr>
              <td
                colSpan={readOnly ? 4 : 5}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                {t('myPayments.empty')}
              </td>
            </tr>
          ) : (
            payments.map((p) => (
              <tr key={p.id} className="hover:bg-page/80">
                <td className="px-4 py-3">
                  <span className="font-semibold text-primary">#{p.paymentNumber}</span>
                </td>
                <td className="px-4 py-3">{format(parseISO(p.paidAt), datePattern, { locale })}</td>
                <td className="px-4 py-3 font-semibold text-primary">{formatInvoiceMoney(p.amount)}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.paymentMethod || '—'}</td>
                {!readOnly ? <td className="px-4 py-3 text-center" /> : null}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export type DoctorPaymentsStatsProps = {
  totalTreatments: number
  totalRevenue: number
  outstandingPayments: number
  remainingPayments: number
  isLoading?: boolean
}

export const DoctorPaymentsStats: FC<DoctorPaymentsStatsProps> = ({
  totalTreatments,
  totalRevenue,
  outstandingPayments,
  remainingPayments,
  isLoading,
}) => {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-card" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div className="rounded-card border border-border-card bg-surface p-4 shadow-card">
        <p className="text-xs text-muted-foreground">{t('doctors.detail.stats.treatments')}</p>
        <p className="mt-1 text-2xl font-bold">{totalTreatments}</p>
      </div>
      <div className="rounded-card border border-border-card bg-surface p-4 shadow-card">
        <p className="text-xs text-muted-foreground">{t('doctors.detail.stats.revenue')}</p>
        <p className="mt-1 text-2xl font-bold text-success">{formatInvoiceMoney(totalRevenue)}</p>
      </div>
      <div className="rounded-card border border-border-card bg-surface p-4 shadow-card">
        <p className="text-xs text-muted-foreground">{t('doctors.detail.stats.outstanding')}</p>
        <p className="mt-1 text-2xl font-bold text-primary">{formatInvoiceMoney(outstandingPayments)}</p>
      </div>
      <div className="rounded-card border border-border-card bg-surface p-4 shadow-card">
        <p className="text-xs text-muted-foreground">{t('doctors.detail.stats.remaining')}</p>
        <p className="mt-1 text-2xl font-bold text-danger">{formatInvoiceMoney(remainingPayments)}</p>
      </div>
    </div>
  )
}
