import type { FC } from 'react'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type { WizardFormValues } from '@/components/common/ClinicSwitcher/clinicWizard.form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type NewClinicWorkHoursStepProps = {
  register: UseFormRegister<WizardFormValues>
  errors: FieldErrors<WizardFormValues>
}

export const NewClinicWorkHoursStep: FC<NewClinicWorkHoursStepProps> = ({ register, errors }) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">{t('clinics.newWizard.step3.heading')}</h3>
        <p className="text-sm text-muted-foreground">{t('clinics.newWizard.step3.subheading')}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="work-start">{t('clinics.newWizard.step3.startLabel')}</Label>
          <Input
            id="work-start"
            type="time"
            className="border-border-card"
            aria-invalid={Boolean(errors.startTime)}
            {...register('startTime')}
          />
          {errors.startTime?.message ? (
            <p className="text-sm text-destructive">{String(errors.startTime.message)}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="work-end">{t('clinics.newWizard.step3.endLabel')}</Label>
          <Input
            id="work-end"
            type="time"
            className="border-border-card"
            aria-invalid={Boolean(errors.endTime)}
            {...register('endTime')}
          />
          {errors.endTime?.message ? (
            <p className="text-sm text-destructive">{String(errors.endTime.message)}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
