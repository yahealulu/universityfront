import type { FC } from 'react'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type { WizardFormValues } from '@/components/common/ClinicSwitcher/clinicWizard.form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type NewClinicDetailsStepProps = {
  register: UseFormRegister<WizardFormValues>
  errors: FieldErrors<WizardFormValues>
  logoError: string | null
  onLogoChange: (file: File | null) => void
  logoInputId: string
}

export const NewClinicDetailsStep: FC<NewClinicDetailsStepProps> = ({
  register,
  errors,
  logoError,
  onLogoChange,
  logoInputId,
}) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">{t('clinics.newWizard.step1.heading')}</h3>
        <p className="text-sm text-muted-foreground">{t('clinics.newWizard.step1.subheading')}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="clinic-name">{t('clinics.newWizard.step1.nameLabel')}</Label>
        <Input
          id="clinic-name"
          className="border-border-card"
          placeholder={t('clinics.newWizard.step1.namePlaceholder')}
          aria-invalid={Boolean(errors.name)}
          {...register('name')}
        />
        {errors.name?.message ? (
          <p className="text-sm text-destructive">{String(errors.name.message)}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="clinic-phone">{t('clinics.newWizard.step1.phoneLabel')}</Label>
        <div className="flex gap-2">
          <span className="flex shrink-0 items-center rounded-md border border-border-card bg-muted/40 px-3 text-sm text-muted-foreground">
            {t('clinics.newWizard.step1.phonePrefix')}
          </span>
          <Input
            id="clinic-phone"
            className="min-w-0 flex-1 border-border-card"
            placeholder={t('clinics.newWizard.step1.phonePlaceholder')}
            inputMode="numeric"
            aria-invalid={Boolean(errors.phone)}
            {...register('phone')}
          />
        </div>
        {errors.phone?.message ? (
          <p className="text-sm text-destructive">{String(errors.phone.message)}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="clinic-address">{t('clinics.newWizard.step1.addressLabel')}</Label>
        <Input
          id="clinic-address"
          className="border-border-card"
          placeholder={t('clinics.newWizard.step1.addressPlaceholder')}
          aria-invalid={Boolean(errors.address)}
          {...register('address')}
        />
        {errors.address?.message ? (
          <p className="text-sm text-destructive">{String(errors.address.message)}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor={logoInputId}>{t('clinics.newWizard.step1.logoLabel')}</Label>
        <div className="rounded-xl border border-dashed border-border-card bg-muted/20 px-4 py-8 text-center">
          <input
            id={logoInputId}
            type="file"
            accept="image/png,image/jpeg"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null
              onLogoChange(f)
            }}
          />
          <label
            htmlFor={logoInputId}
            className="mb-2 inline-flex cursor-pointer rounded-lg border border-border-card bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
          >
            {t('clinics.newWizard.step1.logoHint')}
          </label>
          <p className="text-xs text-muted-foreground">{t('clinics.newWizard.step1.logoSubhint')}</p>
        </div>
        {logoError ? <p className="text-sm text-destructive">{logoError}</p> : null}
      </div>
    </div>
  )
}
