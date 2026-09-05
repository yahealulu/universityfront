import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Label } from '@/components/ui/label'
import { useClinicsList } from '@/hooks/clinics/useClinicsList'
import { cn } from '@/lib/utils'

export type ClinicAccessValues = {
  hasAllClinics: boolean
  clinicIds: string[]
}

export type ClinicAccessStepProps = {
  values: ClinicAccessValues
  onChange: (values: ClinicAccessValues) => void
  error?: string | null
  className?: string
}

export const ClinicAccessStep: FC<ClinicAccessStepProps> = ({
  values,
  onChange,
  error,
  className,
}) => {
  const { t } = useTranslation()
  const { data: clinics, isLoading } = useClinicsList()

  const toggleClinic = (clinicId: string, checked: boolean) => {
    const next = checked
      ? [...values.clinicIds, clinicId]
      : values.clinicIds.filter((id) => id !== clinicId)
    onChange({ ...values, clinicIds: next })
  }

  const toggleAllClinics = (checked: boolean) => {
    onChange({
      hasAllClinics: checked,
      clinicIds: checked ? (clinics ?? []).map((c) => c.id) : values.clinicIds,
    })
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <p className="text-sm font-medium text-foreground">{t('clinicAccess.title')}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t('clinicAccess.description')}</p>
      </div>

      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border-card bg-page/50 px-3 py-3">
        <div>
          <span className="text-sm font-medium text-foreground">{t('clinicAccess.allClinics')}</span>
          <p className="text-xs text-muted-foreground">{t('clinicAccess.allClinicsHint')}</p>
        </div>
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border-card text-primary focus:ring-primary"
          checked={values.hasAllClinics}
          onChange={(e) => toggleAllClinics(e.target.checked)}
        />
      </label>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">{t('clinicAccess.selectClinics')}</p>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">{t('clinicAccess.loading')}</p>
        ) : (
          <ul className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-border-card p-3">
            {(clinics ?? []).map((clinic) => {
              const checked = values.hasAllClinics || values.clinicIds.includes(clinic.id)
              return (
                <li key={clinic.id} className="flex items-center gap-2">
                  <input
                    id={`clinic-access-${clinic.id}`}
                    type="checkbox"
                    className="h-4 w-4 rounded border-border-card text-primary focus:ring-primary"
                    checked={checked}
                    disabled={values.hasAllClinics}
                    onChange={(e) => toggleClinic(clinic.id, e.target.checked)}
                  />
                  <Label htmlFor={`clinic-access-${clinic.id}`} className="text-sm font-normal">
                    {clinic.name}
                  </Label>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  )
}

export const validateClinicAccess = (
  values: ClinicAccessValues,
  t: (key: string) => string,
): string | null => {
  if (values.hasAllClinics) return null
  if (!values.clinicIds.length) return t('clinicAccess.validation.required')
  return null
}
