import { zodResolver } from '@hookform/resolvers/zod'
import type { FC } from 'react'
import { useEffect, useId, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import type { WizardFormValues } from '@/components/common/ClinicSwitcher/clinicWizard.form'
import { DEFAULT_WORK_DAYS } from '@/components/common/ClinicSwitcher/clinicWizard.constants'
import { NewClinicDetailsStep } from '@/components/common/ClinicSwitcher/NewClinicDetailsStep'
import { NewClinicWorkDaysStep } from '@/components/common/ClinicSwitcher/NewClinicWorkDaysStep'
import { NewClinicWorkHoursStep } from '@/components/common/ClinicSwitcher/NewClinicWorkHoursStep'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCreateClinic } from '@/hooks/clinics/useCreateClinic'
import type { WorkDayId } from '@/types/clinic.types'

const workDayIdSchema = z.enum([
  'saturday',
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
])

export type NewClinicWizardModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const NewClinicWizardModal: FC<NewClinicWizardModalProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation()
  const create = useCreateClinic()
  const logoFieldId = useId()
  const [step, setStep] = useState(0)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoError, setLogoError] = useState<string | null>(null)

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, t('clinics.newWizard.validation.name')),
        phone: z.string().min(1, t('clinics.newWizard.validation.phone')),
        address: z.string().min(1, t('clinics.newWizard.validation.address')),
        workDays: z
          .array(workDayIdSchema)
          .min(1, t('clinics.newWizard.validation.workDays')),
        startTime: z.string().min(1, t('clinics.newWizard.validation.startTime')),
        endTime: z.string().min(1, t('clinics.newWizard.validation.endTime')),
      }),
    [t]
  )

  const form = useForm<WizardFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      workDays: DEFAULT_WORK_DAYS,
      startTime: '',
      endTime: '',
    },
  })

  const { register, handleSubmit, trigger, formState, getValues, setValue, watch, reset } = form

  const defaultForm = useMemo(
    () => ({
      name: '',
      phone: '',
      address: '',
      workDays: DEFAULT_WORK_DAYS,
      startTime: '',
      endTime: '',
    }),
    []
  )

  useEffect(() => {
    if (!open) return
    setStep(0)
    reset(defaultForm)
    setLogoFile(null)
    setLogoError(null)
  }, [open, reset, defaultForm])

  const handleLogoChange = (file: File | null) => {
    setLogoError(null)
    if (!file) {
      setLogoFile(null)
      return
    }
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      setLogoError(t('clinics.newWizard.step1.logoErrorType'))
      setLogoFile(null)
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setLogoError(t('clinics.newWizard.step1.logoErrorSize'))
      setLogoFile(null)
      return
    }
    setLogoFile(file)
  }

  const toggleDay = (id: WorkDayId) => {
    const cur = getValues('workDays')
    const next = cur.includes(id) ? cur.filter((d) => d !== id) : [...cur, id]
    setValue('workDays', next, { shouldValidate: true, shouldDirty: true })
  }

  const handleDialogOpenChange = (next: boolean) => {
    if (!next) {
      setStep(0)
      reset(defaultForm)
      setLogoFile(null)
      setLogoError(null)
    }
    onOpenChange(next)
  }

  const onSubmit = async (data: WizardFormValues) => {
    await create.mutateAsync({
      name: data.name,
      phone: data.phone,
      address: data.address,
      logoFileName: logoFile?.name ?? null,
      workDays: data.workDays,
      workHours: {
        startTime: data.startTime,
        endTime: data.endTime,
      },
    })
    setStep(0)
    reset(defaultForm)
    setLogoFile(null)
    setLogoError(null)
    onOpenChange(false)
  }

  const goNext = async () => {
    if (step === 0) {
      const ok = await trigger(['name', 'phone', 'address'], { shouldFocus: true })
      if (ok) setStep(1)
      return
    }
    if (step === 1) {
      const ok = await trigger('workDays', { shouldFocus: true })
      if (ok) setStep(2)
    }
  }

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1)
  }

  const workDays = watch('workDays')

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle>{t('clinics.newWizard.title')}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (step === 2) void handleSubmit(onSubmit)(e)
          }}
          className="space-y-6"
        >
          {step === 0 ? (
            <NewClinicDetailsStep
              register={register}
              errors={formState.errors}
              logoError={logoError}
              onLogoChange={handleLogoChange}
              logoInputId={logoFieldId}
            />
          ) : null}
          {step === 1 ? (
            <NewClinicWorkDaysStep selected={workDays} onToggle={toggleDay} />
          ) : null}
          {step === 2 ? <NewClinicWorkHoursStep register={register} errors={formState.errors} /> : null}

          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border-card pt-4">
            <Button
              type="button"
              variant="outline"
              className="border-border-card"
              onClick={() => handleDialogOpenChange(false)}
            >
              {t('clinics.newWizard.cancel')}
            </Button>
            {step > 0 ? (
              <Button type="button" variant="outline" className="border-border-card" onClick={goBack}>
                {t('clinics.newWizard.back')}
              </Button>
            ) : null}
            {step < 2 ? (
              <Button type="button" className="bg-primary text-primary-foreground" onClick={() => void goNext()}>
                {t('clinics.newWizard.next')}
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={create.isPending}
                className="bg-primary text-primary-foreground"
              >
                {create.isPending ? t('clinics.newWizard.saving') : t('clinics.newWizard.save')}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
