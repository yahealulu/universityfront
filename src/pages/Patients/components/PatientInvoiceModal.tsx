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
import { useCreatePatientInvoice } from '@/hooks/patients/usePatientMutations'
import type { InvoicesMetaPayload } from '@/types/invoice.types'

const buildSchema = (t: (k: string) => string) =>
  z
    .object({
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
      } else if (paid > total) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('invoices.addModal.validation.paidTooHigh'),
          path: ['paidAmount'],
        })
      }
    })

type FormValues = z.infer<ReturnType<typeof buildSchema>>

export type PatientInvoiceModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId: string
  patientDisplayName: string
  meta: InvoicesMetaPayload | undefined
}

export const PatientInvoiceModal: FC<PatientInvoiceModalProps> = ({
  open,
  onOpenChange,
  patientId,
  patientDisplayName,
  meta,
}) => {
  const { t } = useTranslation()
  const schema = useMemo(() => buildSchema(t), [t])
  const createMutation = useCreatePatientInvoice(patientId)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      treatmentId: '',
      total: '',
      paidAmount: '',
      notes: '',
    },
  })

  useEffect(() => {
    if (!open) return
    form.reset({
      treatmentId: meta?.treatments[0]?.id ?? '',
      total: '',
      paidAmount: '',
      notes: '',
    })
  }, [open, meta, form])

  const onSubmit = form.handleSubmit(async (values) => {
    const paidRaw = values.paidAmount?.trim()
    const paidAmount = paidRaw ? Number(paidRaw) : null
    await createMutation.mutateAsync({
      patientId,
      treatmentId: values.treatmentId,
      total: Number(values.total),
      paidAmount,
      notes: values.notes?.trim() ?? '',
    })
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle>{t('patients.invoices.addModalTitle')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pinv-patient">{t('patients.invoices.addModalPatient')}</Label>
            <Input
              id="pinv-patient"
              readOnly
              disabled
              value={patientDisplayName}
              className="bg-muted/50"
              aria-readonly="true"
            />
          </div>

          <div className="space-y-2">
            <Label>{t('patients.invoices.addModalTreatment')}</Label>
            <Controller
              name="treatmentId"
              control={form.control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('invoices.addModal.treatmentPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {(meta?.treatments ?? []).map((tr) => (
                      <SelectItem key={tr.id} value={tr.id}>
                        {tr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.treatmentId && (
              <p className="text-sm text-danger">{form.formState.errors.treatmentId.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pinv-total">{t('invoices.addModal.price')}</Label>
              <Input
                id="pinv-total"
                placeholder={t('invoices.addModal.moneyPlaceholder')}
                {...form.register('total')}
              />
              {form.formState.errors.total && (
                <p className="text-sm text-danger">{form.formState.errors.total.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pinv-paid">{t('invoices.addModal.paidOptional')}</Label>
              <Input
                id="pinv-paid"
                placeholder={t('invoices.addModal.moneyPlaceholder')}
                {...form.register('paidAmount')}
              />
              {form.formState.errors.paidAmount && (
                <p className="text-sm text-danger">{form.formState.errors.paidAmount.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pinv-notes">{t('invoices.addModal.notes')}</Label>
            <Textarea
              id="pinv-notes"
              rows={3}
              maxLength={100}
              placeholder={t('invoices.addModal.notesPlaceholder')}
              {...form.register('notes')}
            />
            <p className="text-end text-xs text-muted-foreground">
              {(form.watch('notes')?.length ?? 0)}/100
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('invoices.addModal.cancel')}
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending
                ? t('patients.invoices.addModalSaving')
                : t('patients.invoices.addModalSubmit')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
