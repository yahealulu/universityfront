import { zodResolver } from '@hookform/resolvers/zod'
import type { FC } from 'react'
import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCreateInvoice } from '@/hooks/invoices/useCreateInvoice'
import type { InvoicesMetaPayload } from '@/types/invoice.types'

const createFormSchema = (t: (k: string) => string) =>
  z
    .object({
      patientId: z.string().min(1, t('invoices.addModal.validation.patient')),
      treatmentId: z.string().min(1, t('invoices.addModal.validation.treatment')),
      total: z
        .string()
        .min(1, t('invoices.addModal.validation.total'))
        .refine((s) => {
          const n = Number(s)
          return !Number.isNaN(n) && n > 0
        }, t('invoices.addModal.validation.total')),
      paidAmount: z.string().optional(),
      notes: z.string().max(100, t('invoices.addModal.validation.notesMax')).optional(),
    })
    .superRefine((data, ctx) => {
      const raw = data.paidAmount?.trim()
      if (!raw) return
      const paid = Number(raw)
      const total = Number(data.total)
      if (Number.isNaN(paid) || paid < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('invoices.addModal.validation.paidInvalid'),
          path: ['paidAmount'],
        })
        return
      }
      if (paid > total) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('invoices.addModal.validation.paidTooHigh'),
          path: ['paidAmount'],
        })
      }
    })

type FormValues = z.infer<ReturnType<typeof createFormSchema>>

export type AddInvoiceModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  meta: InvoicesMetaPayload | undefined
}

export const AddInvoiceModal: FC<AddInvoiceModalProps> = ({ open, onOpenChange, meta }) => {
  const { t } = useTranslation()
  const schema = useMemo(() => createFormSchema(t), [t])
  const createMutation = useCreateInvoice()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      patientId: '',
      treatmentId: '',
      total: '',
      paidAmount: '',
      notes: '',
    },
  })

  const { control, handleSubmit, reset, watch, formState } = form
  const notesLen = watch('notes')?.length ?? 0

  useEffect(() => {
    if (open) {
      reset({
        patientId: '',
        treatmentId: '',
        total: '',
        paidAmount: '',
        notes: '',
      })
    }
  }, [open, reset])

  const onSubmit = handleSubmit(async (values) => {
    const total = Number(values.total)
    const paidRaw = values.paidAmount?.trim()
    const paid = paidRaw ? Number(paidRaw) : undefined
    await createMutation.mutateAsync({
      patientId: values.patientId,
      treatmentId: values.treatmentId,
      total,
      paidAmount: paid != null && !Number.isNaN(paid) && paid > 0 ? paid : null,
      notes: values.notes?.trim() || undefined,
    })
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-6" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{t('invoices.addModal.title')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="inv-patient">{t('invoices.addModal.patient')}</Label>
            <Controller
              name="patientId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="inv-patient" className="w-full">
                    <SelectValue placeholder={t('invoices.addModal.patientPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {meta?.patients.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {formState.errors.patientId && (
              <p className="text-sm text-danger">{formState.errors.patientId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="inv-treatment">{t('invoices.addModal.treatment')}</Label>
            <Controller
              name="treatmentId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="inv-treatment" className="w-full">
                    <SelectValue placeholder={t('invoices.addModal.treatmentPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {meta?.treatments.map((tr) => (
                      <SelectItem key={tr.id} value={tr.id}>
                        {tr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {formState.errors.treatmentId && (
              <p className="text-sm text-danger">{formState.errors.treatmentId.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="inv-price">{t('invoices.addModal.price')}</Label>
              <Controller
                name="total"
                control={control}
                render={({ field }) => (
                  <Input
                    id="inv-price"
                    type="text"
                    inputMode="decimal"
                    placeholder={t('invoices.addModal.moneyPlaceholder')}
                    {...field}
                  />
                )}
              />
              {formState.errors.total && (
                <p className="text-sm text-danger">{formState.errors.total.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-paid">{t('invoices.addModal.paidOptional')}</Label>
              <Controller
                name="paidAmount"
                control={control}
                render={({ field }) => (
                  <Input
                    id="inv-paid"
                    type="text"
                    inputMode="decimal"
                    placeholder={t('invoices.addModal.moneyPlaceholder')}
                    {...field}
                  />
                )}
              />
              {formState.errors.paidAmount && (
                <p className="text-sm text-danger">{formState.errors.paidAmount.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="inv-notes">{t('invoices.addModal.notes')}</Label>
              <span className="text-xs text-muted-foreground">
                {notesLen}/100
              </span>
            </div>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Textarea id="inv-notes" maxLength={100} rows={4} placeholder={t('invoices.addModal.notesPlaceholder')} {...field} />
              )}
            />
            {formState.errors.notes && (
              <p className="text-sm text-danger">{formState.errors.notes.message}</p>
            )}
          </div>

          {createMutation.isError && (
            <p className="text-sm text-danger">{t('invoices.addModal.submitError')}</p>
          )}

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Button type="button" variant="outline" className="border-border-card" onClick={() => onOpenChange(false)}>
              {t('invoices.addModal.cancel')}
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? t('invoices.addModal.saving') : t('invoices.addModal.submit')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
