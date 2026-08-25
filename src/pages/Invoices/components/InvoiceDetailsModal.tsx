import { zodResolver } from '@hookform/resolvers/zod'
import { format, parseISO } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import type { FC } from 'react'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAddInvoicePayments } from '@/hooks/invoices/useAddInvoicePayments'
import { useDeleteInvoicePayment } from '@/hooks/invoices/useDeleteInvoicePayment'
import { useInvoice } from '@/hooks/invoices/useInvoice'
import { useUpdateInvoicePayment } from '@/hooks/invoices/useUpdateInvoicePayment'
import { getInvoiceDerived } from '@/types/invoice.types'
import { formatInvoiceMoney } from '@/utils/formatters'

const createNewPaymentsSchema = (t: (k: string) => string) =>
  z.object({
    rows: z
      .array(
        z.object({
          paidAt: z.string().min(1, t('invoices.details.validation.date')),
          amount: z
            .string()
            .min(1, t('invoices.details.validation.amount'))
            .refine((s) => {
              const n = Number(s)
              return !Number.isNaN(n) && n > 0
            }, t('invoices.details.validation.amount')),
        })
      )
      .min(1),
  })

type NewPaymentsForm = z.infer<ReturnType<typeof createNewPaymentsSchema>>

/** Segmented control: grey track, white elevated active segment (mock parity). */
const detailsTabsListClass =
  'grid h-auto w-full grid-cols-2 gap-1 rounded-xl border-0 bg-muted/40 p-1 shadow-none'

const detailsTabsTriggerClass =
  'flex-1 rounded-lg border-0 px-4 py-2.5 text-sm font-semibold text-muted-foreground shadow-none transition-all data-[state=inactive]:bg-transparent data-[state=active]:bg-surface data-[state=active]:text-primary data-[state=active]:shadow-sm'

export type InvoiceDetailsModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoiceId: string | null
}

export const InvoiceDetailsModal: FC<InvoiceDetailsModalProps> = ({
  open,
  onOpenChange,
  invoiceId,
}) => {
  const { t, i18n } = useTranslation()
  const locale = i18n.language.startsWith('ar') ? ar : enUS
  const schema = useMemo(() => createNewPaymentsSchema(t), [t])

  const { data: invoice, isPending, isError, refetch } = useInvoice(open ? invoiceId : null)
  const addPayments = useAddInvoicePayments()
  const updatePayment = useUpdateInvoicePayment()
  const deletePayment = useDeleteInvoicePayment()

  const [tab, setTab] = useState('new')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDate, setEditDate] = useState('')
  const [editAmount, setEditAmount] = useState('')
  const [pendingDeletePaymentId, setPendingDeletePaymentId] = useState<string | null>(null)

  const form = useForm<NewPaymentsForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      rows: [{ paidAt: format(new Date(), 'yyyy-MM-dd'), amount: '' }],
    },
  })

  const { control, handleSubmit, reset, formState } = form
  const { fields, append, remove } = useFieldArray({ control, name: 'rows' })

  useEffect(() => {
    if (!open) {
      setPendingDeletePaymentId(null)
      return
    }
    setTab('new')
    setEditingId(null)
    setPendingDeletePaymentId(null)
    reset({
      rows: [{ paidAt: format(new Date(), 'yyyy-MM-dd'), amount: '' }],
    })
  }, [open, invoiceId, reset])

  const derived = invoice ? getInvoiceDerived(invoice) : null

  const dateLabel = invoice
    ? format(parseISO(invoice.invoiceDate), 'd/M/yyyy', { locale })
    : ''

  const onSaveNewPayments = handleSubmit(async (values) => {
    if (!invoiceId) return
    await addPayments.mutateAsync({
      invoiceId,
      payments: values.rows.map((r) => ({
        paidAt: r.paidAt,
        amount: Number(r.amount),
      })),
    })
    reset({
      rows: [{ paidAt: format(new Date(), 'yyyy-MM-dd'), amount: '' }],
    })
  })

  const startEdit = (id: string, paidAt: string, amount: number) => {
    setEditingId(id)
    setEditDate(paidAt)
    setEditAmount(String(amount))
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = async (paymentId: string) => {
    if (!invoiceId) return
    const amount = Number(editAmount)
    if (Number.isNaN(amount) || amount <= 0) return
    await updatePayment.mutateAsync({
      invoiceId,
      paymentId,
      body: { paidAt: editDate, amount },
    })
    setEditingId(null)
  }

  const confirmRemovePayment = async () => {
    if (!invoiceId || !pendingDeletePaymentId) return
    try {
      await deletePayment.mutateAsync({ invoiceId, paymentId: pendingDeletePaymentId })
      setPendingDeletePaymentId(null)
    } catch {
      /* surfaced via mutation state */
    }
  }

  const formatPayDate = (iso: string) => format(parseISO(iso), 'd/M/yyyy', { locale })

  return (
    <Fragment>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto gap-4" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{t('invoices.details.title')}</DialogTitle>
        </DialogHeader>

        {isPending && (
          <div className="space-y-3 py-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {isError && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            <p>{t('invoices.details.loadError')}</p>
            <Button type="button" variant="outline" className="mt-3" onClick={() => void refetch()}>
              {t('invoices.details.retry')}
            </Button>
          </div>
        )}

        {invoice && derived && (
          <>
            <div className="rounded-xl bg-primary/10 px-4 py-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="font-bold text-primary">#{invoice.invoiceNumber}</span>
                <span className="text-sm text-foreground">{dateLabel}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-start justify-between gap-2">
                <span className="text-lg font-bold text-foreground">{invoice.patientName}</span>
                <span className="text-sm text-muted-foreground">{invoice.treatmentTitle}</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-primary/10 px-3 py-3 text-center">
                <p className="text-xs font-semibold text-primary">{t('invoices.details.total')}</p>
                <p className="mt-1 text-xl font-bold text-primary">{formatInvoiceMoney(invoice.total)}</p>
              </div>
              <div className="rounded-xl bg-success/10 px-3 py-3 text-center">
                <p className="text-xs font-semibold text-success">{t('invoices.details.paid')}</p>
                <p className="mt-1 text-xl font-bold text-success">{formatInvoiceMoney(derived.paidTotal)}</p>
              </div>
              <div className="rounded-xl bg-danger/10 px-3 py-3 text-center">
                <p className="text-xs font-semibold text-danger">{t('invoices.details.remaining')}</p>
                <p className="mt-1 text-xl font-bold text-danger">
                  {derived.status === 'paid' ? '—' : formatInvoiceMoney(derived.remaining)}
                </p>
              </div>
            </div>

            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className={cn(detailsTabsListClass)}>
                <TabsTrigger value="new" className={cn(detailsTabsTriggerClass)}>
                  {t('invoices.details.tabNewPayment')}
                </TabsTrigger>
                <TabsTrigger value="history" className={cn(detailsTabsTriggerClass)}>
                  {t('invoices.details.tabHistory')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="new" className="mt-3 space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid gap-4 border-b border-border-card pb-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>{t('invoices.details.paymentDate')}</Label>
                      <Controller
                        name={`rows.${index}.paidAt`}
                        control={control}
                        render={({ field: f }) => <Input type="date" {...f} />}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('invoices.details.paymentAmount')}</Label>
                      <Controller
                        name={`rows.${index}.amount`}
                        control={control}
                        render={({ field: f }) => (
                          <Input
                            type="text"
                            inputMode="decimal"
                            placeholder={t('invoices.addModal.moneyPlaceholder')}
                            {...f}
                          />
                        )}
                      />
                    </div>
                    {fields.length > 1 && (
                      <div className="sm:col-span-2">
                        <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                          {t('invoices.details.removeRow')}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {formState.errors.rows && (
                  <p className="text-sm text-danger">{t('invoices.details.fixRows')}</p>
                )}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    className="gap-1.5 bg-primary/10 px-4 text-primary hover:bg-primary/15"
                    onClick={() =>
                      append({ paidAt: format(new Date(), 'yyyy-MM-dd'), amount: '' })
                    }
                  >
                    <Plus className="h-4 w-4 shrink-0" aria-hidden />
                    {t('invoices.details.morePayments')}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-3">
                <div className="overflow-hidden rounded-lg border border-border-card">
                  <table className="w-full text-sm">
                    <thead className="bg-primary/10 text-foreground">
                      <tr>
                        <th className="px-3 py-2.5 text-start text-sm font-semibold">
                          {t('invoices.details.paymentDate')}
                        </th>
                        <th className="px-3 py-2.5 text-start text-sm font-semibold">
                          {t('invoices.details.paymentAmount')}
                        </th>
                        <th className="px-3 py-2.5 text-end text-sm font-semibold">
                          {t('invoices.table.actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-card">
                      {invoice.payments.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-3 py-6 text-center text-muted-foreground">
                            {t('invoices.details.noPayments')}
                          </td>
                        </tr>
                      ) : (
                        invoice.payments.map((p) => (
                          <tr key={p.id}>
                            <td className="px-3 py-2">
                              {editingId === p.id ? (
                                <Input
                                  type="date"
                                  value={editDate}
                                  onChange={(e) => setEditDate(e.target.value)}
                                />
                              ) : (
                                formatPayDate(p.paidAt)
                              )}
                            </td>
                            <td className="px-3 py-2 font-medium text-primary">
                              {editingId === p.id ? (
                                <Input
                                  type="text"
                                  inputMode="decimal"
                                  value={editAmount}
                                  onChange={(e) => setEditAmount(e.target.value)}
                                />
                              ) : (
                                formatInvoiceMoney(p.amount)
                              )}
                            </td>
                            <td className="px-3 py-2 text-end">
                              {editingId === p.id ? (
                                <div className="flex justify-end gap-1">
                                  <Button type="button" size="sm" variant="outline" onClick={cancelEdit}>
                                    {t('invoices.details.cancelEdit')}
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => void saveEdit(p.id)}
                                    disabled={updatePayment.isPending}
                                  >
                                    {t('invoices.details.saveEdit')}
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex justify-end gap-1">
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-primary"
                                    aria-label={t('invoices.details.editPayment')}
                                    onClick={() => startEdit(p.id, p.paidAt, p.amount)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-danger"
                                    aria-label={t('invoices.details.deletePayment')}
                                    onClick={() => setPendingDeletePaymentId(p.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex w-full flex-col gap-3 border-t border-border-card pt-4 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="min-h-11 flex-1 border-border-card"
                onClick={() => onOpenChange(false)}
              >
                {t('invoices.details.cancel')}
              </Button>
              <Button
                type="button"
                className="min-h-11 flex-1"
                disabled={tab !== 'new' || addPayments.isPending}
                onClick={() => void onSaveNewPayments()}
              >
                {addPayments.isPending ? t('invoices.details.saving') : t('invoices.details.save')}
              </Button>
            </div>

            {addPayments.isError && (
              <p className="text-sm text-danger">{t('invoices.details.savePaymentsError')}</p>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>

      <Dialog
        open={pendingDeletePaymentId !== null}
        onOpenChange={(o) => {
          if (!o) {
            setPendingDeletePaymentId(null)
            deletePayment.reset()
          }
        }}
      >
        <DialogContent className="sm:rounded-2xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{t('invoices.details.deletePaymentTitle')}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{t('invoices.details.deletePaymentDescription')}</p>
          {deletePayment.isError && (
            <p className="text-sm text-danger" role="alert">
              {t('invoices.details.deletePaymentError')}
            </p>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={deletePayment.isPending}
              onClick={() => setPendingDeletePaymentId(null)}
            >
              {t('invoices.details.deletePaymentCancel')}
            </Button>
            <Button
              type="button"
              className="bg-danger text-white hover:opacity-90"
              disabled={deletePayment.isPending}
              onClick={() => void confirmRemovePayment()}
            >
              {deletePayment.isPending
                ? t('invoices.details.deletePaymentLoading')
                : t('invoices.details.deletePaymentConfirm')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}
