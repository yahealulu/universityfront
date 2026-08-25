import { zodResolver } from '@hookform/resolvers/zod'
import type { FC } from 'react'
import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import { useCreateExpense } from '@/hooks/expenses/useCreateExpense'
import { useUpdateExpense } from '@/hooks/expenses/useUpdateExpense'
import type { ExpenseListItem, ExpenseRowCategory } from '@/types/expense.types'

const schema = (t: (k: string) => string) =>
  z.object({
    title: z.string().min(1, t('expenses.modal.validation.title')),
    category: z.enum(['labs', 'doctors', 'others'], {
      message: t('expenses.modal.validation.category'),
    }),
    amount: z
      .string()
      .min(1, t('expenses.modal.validation.amount'))
      .refine((s) => {
        const n = Number(s)
        return !Number.isNaN(n) && n >= 0
      }, t('expenses.modal.validation.amount')),
    description: z.string().max(100, t('expenses.modal.validation.descriptionMax')),
    date: z.string().min(1, t('expenses.modal.validation.date')),
  })

type FormValues = z.infer<ReturnType<typeof schema>>

const categories: ExpenseRowCategory[] = ['labs', 'doctors', 'others']

export type ExpenseFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: ExpenseListItem | null
}

export const ExpenseFormModal: FC<ExpenseFormModalProps> = ({ open, onOpenChange, editing }) => {
  const { t } = useTranslation()
  const isEdit = Boolean(editing)
  const formSchema = useMemo(() => schema(t), [t])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category: 'labs',
      amount: '',
      description: '',
      date: '',
    },
  })

  const createMutation = useCreateExpense()
  const updateMutation = useUpdateExpense()

  useEffect(() => {
    if (!open) return
    if (editing) {
      form.reset({
        title: editing.title,
        category: editing.category,
        amount: String(editing.amount),
        description: editing.description,
        date: editing.date.slice(0, 10),
      })
    } else {
      const today = new Date().toISOString().slice(0, 10)
      form.reset({
        title: '',
        category: 'labs',
        amount: '',
        description: '',
        date: today,
      })
    }
  }, [open, editing, form])

  const descLen = form.watch('description')?.length ?? 0

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = {
      title: values.title,
      category: values.category,
      amount: Number(values.amount),
      description: values.description?.trim() ?? '',
      date: new Date(values.date + 'T12:00:00.000Z').toISOString(),
    }
    try {
      if (isEdit && editing) {
        await updateMutation.mutateAsync({ id: editing.id, body: payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      onOpenChange(false)
    } catch {
      // mutation handles toast if added
    }
  })

  const saving = createMutation.isPending || updateMutation.isPending
  const err = createMutation.error || updateMutation.error

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('expenses.modal.titleEdit') : t('expenses.modal.titleAdd')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ex-title">{t('expenses.modal.title')}</Label>
            <Input
              id="ex-title"
              placeholder={t('expenses.modal.titlePlaceholder')}
              {...form.register('title')}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-danger">{form.formState.errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>{t('expenses.modal.category')}</Label>
            <Controller
              control={form.control}
              name="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="border-border-card">
                    <SelectValue placeholder={t('expenses.modal.categoryPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {t(`expenses.categories.${c}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.category && (
              <p className="text-sm text-danger">{form.formState.errors.category.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ex-amt">{t('expenses.modal.amount')}</Label>
            <Input
              id="ex-amt"
              inputMode="decimal"
              placeholder={t('expenses.modal.amountPlaceholder')}
              {...form.register('amount')}
            />
            {form.formState.errors.amount && (
              <p className="text-sm text-danger">{form.formState.errors.amount.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ex-date">{t('expenses.modal.date')}</Label>
            <Input id="ex-date" type="date" {...form.register('date')} />
            {form.formState.errors.date && (
              <p className="text-sm text-danger">{form.formState.errors.date.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="ex-desc">{t('expenses.modal.description')}</Label>
              <span className="text-xs text-muted-foreground">
                {descLen}/100
              </span>
            </div>
            <Textarea
              id="ex-desc"
              rows={4}
              placeholder={t('expenses.modal.descriptionPlaceholder')}
              maxLength={100}
              {...form.register('description')}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-danger">{form.formState.errors.description.message}</p>
            )}
          </div>
          {err && <p className="text-sm text-danger">{t('expenses.modal.submitError')}</p>}
          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Button type="button" variant="outline" className="border-border-card" onClick={() => onOpenChange(false)} disabled={saving}>
              {t('expenses.modal.cancel')}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? t('expenses.modal.saving') : isEdit ? t('expenses.modal.save') : t('expenses.modal.submit')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
