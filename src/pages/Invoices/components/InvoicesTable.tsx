import { format, parseISO } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'
import { Pencil } from 'lucide-react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import type { Invoice } from '@/types/invoice.types'
import { getInvoiceDerived } from '@/types/invoice.types'
import { formatInvoiceMoney } from '@/utils/formatters'

import { InvoiceStatusBadge } from './InvoiceStatusBadge'

export type InvoicesTableProps = {
  invoices: Invoice[]
  onEdit: (id: string) => void
}

export const InvoicesTable: FC<InvoicesTableProps> = ({ invoices, onEdit }) => {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language.startsWith('ar')
  const locale = i18n.language.startsWith('ar') ? ar : enUS

  return (
    <div className="overflow-x-table rounded-xl border border-border-card" dir={isArabic ? 'rtl' : 'ltr'}>
      <table className="w-full min-w-[960px] border-collapse text-sm">
        <thead>
          {isArabic ? (
            <tr className="bg-[#e0f2fe]">
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('invoices.table.actions')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('invoices.table.status')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('invoices.table.remaining')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('invoices.table.paid')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('invoices.table.total')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('invoices.table.date')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('invoices.table.treatment')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('invoices.table.patient')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('invoices.table.invoiceId')}</th>
            </tr>
          ) : (
            <tr className="bg-[#e0f2fe]">
              <th className="ps-0 pe-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('invoices.table.invoiceId')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('invoices.table.patient')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('invoices.table.treatment')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('invoices.table.date')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('invoices.table.total')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('invoices.table.paid')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('invoices.table.remaining')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('invoices.table.status')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('invoices.table.actions')}</th>
            </tr>
          )}
        </thead>
        <tbody className="divide-y divide-border-card bg-surface">
          {invoices.map((inv) => {
            const { paidTotal, remaining, status } = getInvoiceDerived(inv)
            const dateLabel = format(parseISO(inv.invoiceDate), 'dd/MM/yyyy', { locale })
            return (
              isArabic ? (
                <tr key={inv.id} className="hover:bg-page/80">
                  <td className="px-4 py-3 text-start">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary"
                      aria-label={t('invoices.table.editAria')}
                      onClick={() => onEdit(inv.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </td>
                  <td className="px-4 py-3">
                    <InvoiceStatusBadge status={status} />
                  </td>
                  <td className="px-4 py-3 font-medium text-danger">
                    {status === 'paid' ? '—' : formatInvoiceMoney(remaining)}
                  </td>
                  <td className="px-4 py-3 font-medium text-primary">{formatInvoiceMoney(paidTotal)}</td>
                  <td className="px-4 py-3 font-bold text-primary">{formatInvoiceMoney(inv.total)}</td>
                  <td className="px-4 py-3 text-foreground">{dateLabel}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-foreground">{inv.treatmentTitle}</p>
                    <p className="text-xs text-muted-foreground">{inv.treatmentSubtitle}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-foreground">{inv.patientName}</p>
                    <p className="text-xs text-muted-foreground">
                      #{inv.patientRecordId}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-primary">#{inv.invoiceNumber}</span>
                  </td>
                </tr>
              ) : (
                <tr key={inv.id} className="hover:bg-page/80">
                  <td className="pe-4 ps-0 py-3">
                    <span className="font-semibold text-primary">#{inv.invoiceNumber}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-foreground">{inv.patientName}</p>
                    <p className="text-xs text-muted-foreground">
                      #{inv.patientRecordId}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-foreground">{inv.treatmentTitle}</p>
                    <p className="text-xs text-muted-foreground">{inv.treatmentSubtitle}</p>
                  </td>
                  <td className="px-4 py-3 text-foreground">{dateLabel}</td>
                  <td className="px-4 py-3 font-bold text-primary">{formatInvoiceMoney(inv.total)}</td>
                  <td className="px-4 py-3 font-medium text-primary">{formatInvoiceMoney(paidTotal)}</td>
                  <td className="px-4 py-3 font-medium text-danger">
                    {status === 'paid' ? '—' : formatInvoiceMoney(remaining)}
                  </td>
                  <td className="px-4 py-3">
                    <InvoiceStatusBadge status={status} />
                  </td>
                  <td className="px-4 py-3 text-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary"
                      aria-label={t('invoices.table.editAria')}
                      onClick={() => onEdit(inv.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
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
