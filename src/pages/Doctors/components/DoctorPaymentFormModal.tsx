import { zodResolver } from '@hookform/resolvers/zod'
import { format, parseISO } from 'date-fns'
import type { FC } from 'react'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { DoctorPayment } from '@/types/doctor.types'

const schema = (t: (k: string) => string) =>
  z.object({
    paidAt: z.string().min(1, t('doctors.paymentModal.validation.date')),
    amount: z
      .string()
      .min(1, t('doctors.paymentModal.validation.amount'))
      .refine((s) => {
        const n = Number(s)
        return !Number.isNaN(n) && n >= 0
      }, t('doctors.paymentModal.validation.amount')),
    paymentMethod: z.string().optional(),
  })

type FormValues = z.infer<ReturnType<typeof schema>>

export type DoctorPaymentFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: DoctorPayment | null
  onSave: (values: { paidAt: string; amount: number; paymentMethod?: string }) => Promise<void>
  isSaving: boolean
}

export const DoctorPaymentFormModal: FC<DoctorPaymentFormModalProps> = ({
  open,
  onOpenChange,
  editing,
  onSave,
  isSaving,
}) => {
  const { t } = useTranslation()
  const formSchema = useMemo(() => schema(t), [t])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paidAt: '',
      amount: '',
      paymentMethod: '',
    },
  })

  useEffect(() => {
    if (!open) return
    if (editing) {
      form.reset({
        paidAt: format(parseISO(editing.paidAt), 'yyyy-MM-dd'),
        amount: String(editing.amount),
        paymentMethod: editing.paymentMethod,
      })
    } else {
      form.reset({ paidAt: format(new Date(), 'yyyy-MM-dd'), amount: '', paymentMethod: '' })
    }
  }, [open, editing, form])

  const onSubmit = form.handleSubmit(async (values) => {
    await onSave({
      paidAt: new Date(values.paidAt + 'T12:00:00.000Z').toISOString(),
      amount: Number(values.amount),
      paymentMethod: values.paymentMethod?.trim() || undefined,
    })
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('doctors.paymentModal.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pay-date">{t('doctors.paymentModal.date')}</Label>
            <Input id="pay-date" type="date" {...form.register('paidAt')} />
            {form.formState.errors.paidAt && (
              <p className="text-sm text-danger">{form.formState.errors.paidAt.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="pay-amt">{t('doctors.paymentModal.amount')}</Label>
            <Input
              id="pay-amt"
              inputMode="decimal"
              placeholder={t('doctors.paymentModal.amountPlaceholder')}
              {...form.register('amount')}
            />
            {form.formState.errors.amount && (
              <p className="text-sm text-danger">{form.formState.errors.amount.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="pay-method">{t('doctors.paymentModal.method')}</Label>
            <Input id="pay-method" {...form.register('paymentMethod')} />
          </div>
          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="border-border-card"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              {t('doctors.paymentModal.cancel')}
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? t('doctors.paymentModal.saving') : t('doctors.paymentModal.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
