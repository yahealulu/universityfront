import { format, parseISO } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'
import { Pencil, Trash2 } from 'lucide-react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import type { LabRequest } from '@/types/lab-request.types'
import { formatInvoiceMoney } from '@/utils/formatters'

import { LabRequestStatusBadge } from './LabRequestStatusBadge'

export type LabRequestsTableProps = {
  requests: LabRequest[]
  onEdit: (row: LabRequest) => void
  onDelete: (row: LabRequest) => void
}

export const LabRequestsTable: FC<LabRequestsTableProps> = ({ requests, onEdit, onDelete }) => {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language.startsWith('ar')
  const locale = i18n.language.startsWith('ar') ? ar : enUS
  const datePattern = i18n.language.startsWith('ar') ? 'd/M/yyyy' : 'M/d/yyyy'

  return (
    <div className="overflow-x-table rounded-xl border border-border-card" dir={isArabic ? 'rtl' : 'ltr'}>
      <table className="w-full min-w-[960px] border-collapse text-sm">
        <thead>
          {isArabic ? (
            <tr className="bg-[#e0f2fe]">
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labRequests.table.actions')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labRequests.table.status')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labRequests.table.cost')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labRequests.table.requestDate')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labRequests.table.quantity')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labRequests.table.workType')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labRequests.table.patient')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labRequests.table.lab')}</th>
            </tr>
          ) : (
            <tr className="bg-[#e0f2fe]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labRequests.table.lab')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labRequests.table.patient')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labRequests.table.workType')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labRequests.table.quantity')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labRequests.table.requestDate')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labRequests.table.cost')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labRequests.table.status')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labRequests.table.actions')}</th>
            </tr>
          )}
        </thead>
        <tbody className="divide-y divide-border-card bg-surface">
          {requests.map((row) => {
            const dateLabel = format(parseISO(row.requestDate), datePattern, { locale })
            return (
              isArabic ? (
                <tr key={row.id} className="hover:bg-page/80">
                  <td className="px-4 py-3 text-start">
                    <div className="flex items-center justify-start gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary"
                        aria-label={t('labRequests.table.editAria')}
                        onClick={() => onEdit(row)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-danger"
                        aria-label={t('labRequests.table.deleteAria')}
                        onClick={() => onDelete(row)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <LabRequestStatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3">
                    {row.costUsd === null ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <span className="font-bold text-primary">{formatInvoiceMoney(row.costUsd)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-foreground">{dateLabel}</td>
                  <td className="px-4 py-3 text-foreground">{row.quantity}</td>
                  <td className="px-4 py-3 text-foreground">{row.workTypeLabel}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-foreground">{row.patientName}</p>
                    <p className="text-xs text-muted-foreground">#{row.patientCode}</p>
                  </td>
                  <td className="px-4 py-3 font-bold text-foreground">{row.labName}</td>
                </tr>
              ) : (
                <tr key={row.id} className="hover:bg-page/80">
                  <td className="px-4 py-3 font-bold text-foreground">{row.labName}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-foreground">{row.patientName}</p>
                    <p className="text-xs text-muted-foreground">#{row.patientCode}</p>
                  </td>
                  <td className="px-4 py-3 text-foreground">{row.workTypeLabel}</td>
                  <td className="px-4 py-3 text-foreground">{row.quantity}</td>
                  <td className="px-4 py-3 text-foreground">{dateLabel}</td>
                  <td className="px-4 py-3">
                    {row.costUsd === null ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <span className="font-bold text-primary">{formatInvoiceMoney(row.costUsd)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <LabRequestStatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary"
                        aria-label={t('labRequests.table.editAria')}
                        onClick={() => onEdit(row)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-danger"
                        aria-label={t('labRequests.table.deleteAria')}
                        onClick={() => onDelete(row)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
