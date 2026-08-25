import { Pencil } from 'lucide-react'
import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useInvoicesMeta } from '@/hooks/invoices/useInvoicesMeta'
import { InvoiceDetailsModal } from '@/pages/Invoices/components/InvoiceDetailsModal'
import { InvoiceStatusBadge } from '@/pages/Invoices/components/InvoiceStatusBadge'
import type { Invoice } from '@/types/invoice.types'
import { getInvoiceDerived } from '@/types/invoice.types'
import type { InvoicesTabSummary } from '@/types/patient.types'
import { formatInvoiceMoney, formatIsoDateLocale } from '@/utils/formatters'

import { PatientInvoiceModal } from './PatientInvoiceModal'

/** Display id in table: hash + backend invoice number (e.g. #IN-123460). */
const formatInvoiceTableId = (invoiceNumber: string) => `#${invoiceNumber}`

export type PatientInvoicesTabProps = {
  patientId: string
  patientDisplayName: string
  summary: InvoicesTabSummary
  invoices: Invoice[]
}

export const PatientInvoicesTab: FC<PatientInvoicesTabProps> = ({
  patientId,
  patientDisplayName,
  summary,
  invoices,
}) => {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language.startsWith('ar')
  const metaQuery = useInvoicesMeta()
  const [addOpen, setAddOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsId, setDetailsId] = useState<string | null>(null)

  const openDetails = (id: string) => {
    setDetailsId(id)
    setDetailsOpen(true)
  }

  const rows = useMemo(
    () =>
      invoices.map((inv) => ({
        inv,
        derived: getInvoiceDerived(inv),
      })),
    [invoices]
  )

  const thClass = isArabic
    ? 'px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground'
    : 'px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-muted-foreground'

  const renderRow = (inv: Invoice, derived: ReturnType<typeof getInvoiceDerived>) => {
    const dateDisplay = formatIsoDateLocale(inv.invoiceDate, i18n.language)
    const remainingContent =
      derived.status === 'paid' ? (
        <span className="text-danger">—</span>
      ) : (
        <span className="text-danger">{formatInvoiceMoney(derived.remaining)}</span>
      )

    const idCell = (
      <td key="id" className="px-4 py-3">
        <button
          type="button"
          className="font-semibold text-primary hover:underline"
          onClick={() => openDetails(inv.id)}
        >
          {formatInvoiceTableId(inv.invoiceNumber)}
        </button>
      </td>
    )

    const dateCell = (
      <td key="date" className="px-4 py-3 text-foreground">
        {dateDisplay}
      </td>
    )

    const treatmentCell = (
      <td key="tr" className="px-4 py-3">
        <p className="font-bold text-foreground">{inv.treatmentTitle}</p>
        <p className="text-sm text-muted-foreground">{inv.treatmentSubtitle}</p>
      </td>
    )

    const numEnd = isArabic ? 'text-start' : 'text-end'

    const totalCell = (
      <td key="tot" className={`px-4 py-3 font-medium text-primary ${numEnd}`}>
        {formatInvoiceMoney(inv.total)}
      </td>
    )

    const paidCell = (
      <td key="paid" className={`px-4 py-3 font-medium text-foreground ${numEnd}`}>
        {formatInvoiceMoney(derived.paidTotal)}
      </td>
    )

    const remainingCell = (
      <td key="rem" className={`px-4 py-3 ${numEnd}`}>
        {remainingContent}
      </td>
    )

    const statusCell = (
      <td key="st" className="px-4 py-3">
        <InvoiceStatusBadge status={derived.status} />
      </td>
    )

    const actionsCell = (
      <td key="act" className={isArabic ? 'px-4 py-3 text-start' : 'px-4 py-3 text-end'}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-primary"
          aria-label={t('patients.invoices.editInvoice')}
          onClick={() => openDetails(inv.id)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </td>
    )

    const cellsLtr = [
      idCell,
      dateCell,
      treatmentCell,
      totalCell,
      paidCell,
      remainingCell,
      statusCell,
      actionsCell,
    ]
    const cells = isArabic ? [...cellsLtr].reverse() : cellsLtr

    return (
      <tr key={inv.id} className="hover:bg-muted/20">
        {cells}
      </tr>
    )
  }

  const headersLtr = [
    { key: 'invoiceId', label: t('patients.invoices.columns.invoiceId') },
    { key: 'date', label: t('patients.invoices.columns.date') },
    { key: 'treatment', label: t('patients.invoices.columns.treatment') },
    { key: 'total', label: t('patients.invoices.columns.total'), alignEnd: true },
    { key: 'paid', label: t('patients.invoices.columns.paid'), alignEnd: true },
    { key: 'remaining', label: t('patients.invoices.columns.remaining'), alignEnd: true },
    { key: 'status', label: t('patients.invoices.columns.status') },
    { key: 'actions', label: t('patients.invoices.columns.actions'), alignEnd: true },
  ] as { key: string; label: string; alignEnd?: boolean }[]

  const headers = isArabic ? [...headersLtr].reverse() : headersLtr

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-foreground">{t('patients.invoices.title')}</h2>
        <Button type="button" onClick={() => setAddOpen(true)}>
          {t('patients.invoices.addInvoice')}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border-card bg-primary/10 px-4 py-4">
          <p className="text-xs font-semibold uppercase text-primary">{t('patients.invoices.summary.total')}</p>
          <p className="mt-2 text-xl font-bold text-primary">{formatInvoiceMoney(summary.totalInvoiced)}</p>
        </div>
        <div className="rounded-xl border border-border-card bg-success/10 px-4 py-4">
          <p className="text-xs font-semibold uppercase text-success">{t('patients.invoices.summary.paid')}</p>
          <p className="mt-2 text-xl font-bold text-success">{formatInvoiceMoney(summary.totalPaid)}</p>
        </div>
        <div className="rounded-xl border border-border-card bg-danger/10 px-4 py-4">
          <p className="text-xs font-semibold uppercase text-danger">{t('patients.invoices.summary.remaining')}</p>
          <p className="mt-2 text-xl font-bold text-danger">{formatInvoiceMoney(summary.totalRemaining)}</p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-border-card bg-surface py-12 text-center text-sm text-muted-foreground">
          {t('patients.invoices.empty')}
        </div>
      ) : (
        <div
          className="overflow-x-table rounded-xl border border-border-card bg-surface"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <table className="w-full min-w-[960px] text-sm">
            <thead className="border-b border-border-card bg-muted/40">
              <tr>
                {headers.map((h) => (
                  <th
                    key={h.key}
                    className={
                      h.alignEnd && !isArabic
                        ? `${thClass} text-end`
                        : h.alignEnd && isArabic
                          ? `${thClass} text-start`
                          : thClass
                    }
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-card">
              {rows.map(({ inv, derived }) => renderRow(inv, derived))}
            </tbody>
          </table>
        </div>
      )}

      <PatientInvoiceModal
        open={addOpen}
        onOpenChange={setAddOpen}
        patientId={patientId}
        patientDisplayName={patientDisplayName}
        meta={metaQuery.data}
      />

      <InvoiceDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        invoiceId={detailsId}
      />
    </div>
  )
}
