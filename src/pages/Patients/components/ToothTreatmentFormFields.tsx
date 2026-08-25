import type { FC } from 'react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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

const NONE = '__none__'

export type ToothTreatmentDraftValues = {
  category: string
  treatmentType: string
  price: string
  paid: string
  notes: string
}

export type ToothTreatmentFormFieldsProps = {
  form: UseFormReturn<ToothTreatmentDraftValues>
}

export const ToothTreatmentFormFields: FC<ToothTreatmentFormFieldsProps> = ({ form }) => {
  const { t } = useTranslation()
  const { control, register, watch, formState } = form
  const notesLen = watch('notes').length

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="tooth-treatment-category">{t('patients.dental.chooseCategory')}</Label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="tooth-treatment-category" aria-label={t('patients.dental.chooseCategory')}>
                <SelectValue placeholder={t('patients.dental.chooseCategory')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>{t('patients.dental.chooseCategory')}</SelectItem>
                <SelectItem value="restorative">{t('patients.dental.demoCategory.restorative')}</SelectItem>
                <SelectItem value="preventive">{t('patients.dental.demoCategory.preventive')}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tooth-treatment-type">{t('patients.dental.chooseTreatment')}</Label>
        <Controller
          name="treatmentType"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="tooth-treatment-type" aria-label={t('patients.dental.chooseTreatment')}>
                <SelectValue placeholder={t('patients.dental.chooseTreatment')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>{t('patients.dental.chooseTreatment')}</SelectItem>
                <SelectItem value="composite">{t('patients.dental.demoTreatment.composite')}</SelectItem>
                <SelectItem value="crown">{t('patients.dental.demoTreatment.crown')}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tooth-treatment-price">{t('patients.dental.priceOptional')}</Label>
          <Input
            id="tooth-treatment-price"
            inputMode="decimal"
            autoComplete="off"
            placeholder={t('patients.dental.pricePlaceholder')}
            aria-invalid={Boolean(formState.errors.price)}
            {...register('price')}
          />
          {formState.errors.price ? (
            <p className="text-xs text-danger">{formState.errors.price.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="tooth-treatment-paid">{t('patients.dental.paidOptional')}</Label>
          <Input
            id="tooth-treatment-paid"
            inputMode="decimal"
            autoComplete="off"
            placeholder={t('patients.dental.paidPlaceholder')}
            aria-invalid={Boolean(formState.errors.paid)}
            {...register('paid')}
          />
          {formState.errors.paid ? (
            <p className="text-xs text-danger">{formState.errors.paid.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tooth-treatment-notes">{t('patients.treatments.columns.notes')}</Label>
        <Textarea
          id="tooth-treatment-notes"
          rows={4}
          maxLength={100}
          placeholder={t('patients.dental.notesPlaceholder')}
          aria-invalid={Boolean(formState.errors.notes)}
          {...register('notes')}
        />
        <p className="text-end text-xs text-muted-foreground">
          {t('patients.dental.notesCharCount', { current: notesLen, max: 100 })}
        </p>
        {formState.errors.notes ? (
          <p className="text-xs text-danger">{formState.errors.notes.message}</p>
        ) : null}
      </div>
    </div>
  )
}
