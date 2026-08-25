import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import type { PatientTreatment } from '@/types/patient.types'
import { formatInvoiceMoney, formatIsoDateLocale } from '@/utils/formatters'

export type ToothTreatmentHistoryTableProps = {
  rows: PatientTreatment[]
  locale: string
}

export const ToothTreatmentHistoryTable: FC<ToothTreatmentHistoryTableProps> = ({
  rows,
  locale,
}) => {
  const { t } = useTranslation()

  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border-card bg-muted/20 py-10 text-center text-sm text-muted-foreground">
        {t('patients.dental.modalHistoryEmpty')}
      </p>
    )
  }

  return (
    <div className="overflow-x-table rounded-xl border border-border-card">
      <table className="w-full min-w-[36rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border-card bg-muted/40">
            <th className="px-4 py-3 text-start font-semibold text-foreground">
              {t('patients.dental.tableDate')}
            </th>
            <th className="px-4 py-3 text-start font-semibold text-foreground">
              {t('patients.dental.tableTreatment')}
            </th>
            <th className="px-4 py-3 text-start font-semibold text-foreground">
              {t('patients.dental.tableNote')}
            </th>
            <th className="px-4 py-3 text-end font-semibold text-foreground">
              {t('patients.dental.tablePrice')}
            </th>
            <th className="px-4 py-3 text-end font-semibold text-foreground">
              {t('patients.dental.tablePaid')}
            </th>
            <th className="px-4 py-3 text-end font-semibold text-foreground">
              {t('patients.dental.tableRemaining')}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((tr) => (
            <tr key={tr.id} className="border-b border-border-card last:border-0">
              <td className="px-4 py-3 align-top text-muted-foreground">
                {formatIsoDateLocale(tr.date, locale)}
              </td>
              <td className="px-4 py-3 align-top">
                <p className="font-semibold text-primary">{tr.treatmentType}</p>
                <p className="text-xs text-muted-foreground">{tr.category}</p>
              </td>
              <td className="max-w-xs px-4 py-3 align-top text-foreground">{tr.notes}</td>
              <td className="px-4 py-3 text-end font-semibold text-primary">
                {formatInvoiceMoney(tr.price)}
              </td>
              <td className="px-4 py-3 text-end font-semibold text-foreground">
                {formatInvoiceMoney(tr.paid)}
              </td>
              <td className="px-4 py-3 text-end font-semibold text-danger">
                {formatInvoiceMoney(tr.remaining)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
