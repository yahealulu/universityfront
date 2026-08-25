import { zodResolver } from '@hookform/resolvers/zod'
import type { FC } from 'react'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateLab } from '@/hooks/labs/useCreateLab'
import { useUpdateLab } from '@/hooks/labs/useUpdateLab'
import type { Lab } from '@/types/lab.types'

const createFormSchema = (t: (k: string) => string) =>
  z.object({
    name: z.string().min(1, t('labs.modal.validation.name')),
    phone: z
      .string()
      .min(1, t('labs.modal.validation.phone'))
      .refine((s) => {
        const digits = s.replace(/\D/g, '')
        return digits.length >= 8
      }, t('labs.modal.validation.phoneInvalid')),
    address: z.string().min(1, t('labs.modal.validation.address')),
  })

type FormValues = z.infer<ReturnType<typeof createFormSchema>>

export type LabFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingLab: Lab | null
}

export const LabFormModal: FC<LabFormModalProps> = ({ open, onOpenChange, editingLab }) => {
  const { t } = useTranslation()
  const schema = useMemo(() => createFormSchema(t), [t])
  const createMutation = useCreateLab()
  const updateMutation = useUpdateLab()
  const isEdit = Boolean(editingLab)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
    },
  })

  const { register, handleSubmit, reset, formState } = form

  useEffect(() => {
    if (!open) return
    if (editingLab) {
      reset({
        name: editingLab.name,
        phone: editingLab.phone,
        address: editingLab.address,
      })
    } else {
      reset({ name: '', phone: '', address: '' })
    }
  }, [open, editingLab, reset])

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (editingLab) {
        await updateMutation.mutateAsync({ id: editingLab.id, body: values })
      } else {
        await createMutation.mutateAsync(values)
      }
      onOpenChange(false)
    } catch {
      // Interceptor / mutation may surface toast elsewhere; keep modal open
    }
  })

  const saving = createMutation.isPending || updateMutation.isPending
  const submitError = isEdit ? updateMutation.error : createMutation.error

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? t('labs.modal.titleEdit') : t('labs.modal.titleAdd')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lab-name">{t('labs.modal.name')}</Label>
            <Input
              id="lab-name"
              autoComplete="organization"
              placeholder={t('labs.modal.namePlaceholder')}
              {...register('name')}
            />
            {formState.errors.name && (
              <p className="text-sm text-danger">{formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lab-phone">{t('labs.modal.phone')}</Label>
            <Input
              id="lab-phone"
              type="tel"
              autoComplete="tel"
              placeholder={t('labs.modal.phonePlaceholder')}
              {...register('phone')}
            />
            {formState.errors.phone && (
              <p className="text-sm text-danger">{formState.errors.phone.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lab-address">{t('labs.modal.address')}</Label>
            <Input
              id="lab-address"
              autoComplete="street-address"
              placeholder={t('labs.modal.addressPlaceholder')}
              {...register('address')}
            />
            {formState.errors.address && (
              <p className="text-sm text-danger">{formState.errors.address.message}</p>
            )}
          </div>
          {submitError && (
            <p className="text-sm text-danger">{t('labs.modal.submitError')}</p>
          )}
          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="border-border-card"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              {t('labs.modal.cancel')}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? t('labs.modal.saving') : isEdit ? t('labs.modal.save') : t('labs.modal.submit')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
