import { zodResolver } from '@hookform/resolvers/zod'
import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
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
import {
  ClinicAccessStep,
  validateClinicAccess,
  type ClinicAccessValues,
} from '@/components/shared/ClinicAccessStep'
import { useCreateDoctor } from '@/hooks/doctors/useCreateDoctor'
import { useUpdateDoctor } from '@/hooks/doctors/useUpdateDoctor'
import type { DoctorFull } from '@/types/doctor.types'
import type { DoctorsMetaPayload } from '@/types/doctor.types'

const step1Schema = (t: (k: string) => string) =>
  z.object({
    username: z.string().min(1, t('doctors.wizard.validation.username')),
    password: z.string().min(8, t('doctors.wizard.validation.password')),
  })

const step2Schema = (t: (k: string) => string) =>
  z.object({
    firstName: z.string().min(1, t('doctors.wizard.validation.firstName')),
    lastName: z.string().min(1, t('doctors.wizard.validation.lastName')),
    specialtyId: z.string().min(1, t('doctors.wizard.validation.specialty')),
    phone: z.string().min(1, t('doctors.wizard.validation.phone')),
    commissionPercent: z
      .string()
      .min(1, t('doctors.wizard.validation.commission'))
      .refine((s) => {
        const n = Number(s)
        return !Number.isNaN(n) && n >= 0 && n <= 100
      }, t('doctors.wizard.validation.commission')),
    certificateNumber: z.string().optional(),
  })

type Step1Values = z.infer<ReturnType<typeof step1Schema>>
type Step2Values = z.infer<ReturnType<typeof step2Schema>>

export type AddDoctorWizardModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingDoctor: DoctorFull | null
  meta: DoctorsMetaPayload | undefined
}

export const AddDoctorWizardModal: FC<AddDoctorWizardModalProps> = ({
  open,
  onOpenChange,
  editingDoctor,
  meta,
}) => {
  const { t } = useTranslation()
  const isEdit = Boolean(editingDoctor)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [clinicAccess, setClinicAccess] = useState<ClinicAccessValues>({
    hasAllClinics: false,
    clinicIds: [],
  })
  const [clinicAccessError, setClinicAccessError] = useState<string | null>(null)

  const s1 = useMemo(() => step1Schema(t), [t])
  const s2 = useMemo(() => step2Schema(t), [t])

  const form1 = useForm<Step1Values>({
    resolver: zodResolver(s1),
    defaultValues: { username: '', password: '' },
  })

  const form2 = useForm<Step2Values>({
    resolver: zodResolver(s2),
    defaultValues: {
      firstName: '',
      lastName: '',
      specialtyId: '',
      phone: '',
      commissionPercent: '',
      certificateNumber: '',
    },
  })

  const createMutation = useCreateDoctor()
  const updateMutation = useUpdateDoctor()

  useEffect(() => {
    if (!open) return
    if (isEdit && editingDoctor) {
      setStep(2)
      form1.reset({ username: editingDoctor.username, password: '' })
      form2.reset({
        firstName: editingDoctor.firstName,
        lastName: editingDoctor.lastName,
        specialtyId: editingDoctor.specialtyId,
        phone: editingDoctor.phone,
        commissionPercent: String(editingDoctor.commissionPercent),
        certificateNumber: editingDoctor.certificateNumber ?? '',
      })
      setClinicAccess({
        hasAllClinics: editingDoctor.hasAllClinics ?? false,
        clinicIds: editingDoctor.clinicIds ?? [],
      })
    } else {
      setStep(1)
      form1.reset({ username: '', password: '' })
      form2.reset({
        firstName: '',
        lastName: '',
        specialtyId: '',
        phone: '',
        commissionPercent: '',
        certificateNumber: '',
      })
      setClinicAccess({ hasAllClinics: false, clinicIds: [] })
    }
    setClinicAccessError(null)
  }, [open, isEdit, editingDoctor, form1, form2])

  const handleClose = () => {
    onOpenChange(false)
    setStep(1)
  }

  const onNext = form1.handleSubmit(() => setStep(2))

  const onNextToClinics = form2.handleSubmit(() => {
    setClinicAccessError(null)
    setStep(3)
  })

  const submitCreate = async (v2: Step2Values) => {
    const accessError = validateClinicAccess(clinicAccess, t)
    if (accessError) {
      setClinicAccessError(accessError)
      return
    }
    const v1 = form1.getValues()
    try {
      await createMutation.mutateAsync({
        username: v1.username,
        password: v1.password,
        firstName: v2.firstName,
        lastName: v2.lastName,
        specialtyId: v2.specialtyId,
        phone: v2.phone,
        commissionPercent: Number(v2.commissionPercent),
        certificateNumber: v2.certificateNumber?.trim() ? v2.certificateNumber.trim() : null,
        hasAllClinics: clinicAccess.hasAllClinics,
        clinicIds: clinicAccess.clinicIds,
      })
      handleClose()
    } catch {
      // handled by mutation
    }
  }

  const submitEdit = async (v2: Step2Values) => {
    if (!editingDoctor) return
    const accessError = validateClinicAccess(clinicAccess, t)
    if (accessError) {
      setClinicAccessError(accessError)
      return
    }
    try {
      await updateMutation.mutateAsync({
        id: editingDoctor.id,
        body: {
          firstName: v2.firstName,
          lastName: v2.lastName,
          specialtyId: v2.specialtyId,
          phone: v2.phone,
          commissionPercent: Number(v2.commissionPercent),
          certificateNumber: v2.certificateNumber?.trim() ? v2.certificateNumber.trim() : null,
          hasAllClinics: clinicAccess.hasAllClinics,
          clinicIds: clinicAccess.clinicIds,
        },
      })
      handleClose()
    } catch {
      // handled
    }
  }

  const onSubmitClinicStep = () => {
    const accessError = validateClinicAccess(clinicAccess, t)
    if (accessError) {
      setClinicAccessError(accessError)
      return
    }
    void form2.handleSubmit(async (v2) => {
      if (isEdit) await submitEdit(v2)
      else await submitCreate(v2)
    })()
  }

  const saving = createMutation.isPending || updateMutation.isPending
  const err = isEdit ? updateMutation.error : createMutation.error

  const title =
    step === 1
      ? t('doctors.wizard.titleStep1')
      : step === 3
        ? t('doctors.wizard.titleStep3')
        : isEdit
          ? t('doctors.wizard.titleEdit')
          : t('doctors.wizard.titleStep2')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {step === 1 && !isEdit && (
          <form onSubmit={onNext} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doc-user">{t('doctors.wizard.username')}</Label>
              <Input
                id="doc-user"
                autoComplete="username"
                placeholder={t('doctors.wizard.usernamePlaceholder')}
                {...form1.register('username')}
              />
              {form1.formState.errors.username && (
                <p className="text-sm text-danger">{form1.formState.errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="doc-pass">{t('doctors.wizard.password')}</Label>
              <Input
                id="doc-pass"
                type="password"
                autoComplete="new-password"
                placeholder={t('doctors.wizard.passwordPlaceholder')}
                {...form1.register('password')}
              />
              {form1.formState.errors.password && (
                <p className="text-sm text-danger">{form1.formState.errors.password.message}</p>
              )}
            </div>
            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <Button type="button" variant="outline" className="border-border-card" onClick={handleClose}>
                {t('doctors.wizard.cancel')}
              </Button>
              <Button type="submit">{t('doctors.wizard.next')}</Button>
            </div>
          </form>
        )}

        {(step === 2 || isEdit) && step !== 3 && (
          <form
            onSubmit={isEdit ? onNextToClinics : onNextToClinics}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="doc-fn">{t('doctors.wizard.firstName')}</Label>
                <Input
                  id="doc-fn"
                  placeholder={t('doctors.wizard.firstNamePlaceholder')}
                  {...form2.register('firstName')}
                />
                {form2.formState.errors.firstName && (
                  <p className="text-sm text-danger">{form2.formState.errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="doc-ln">{t('doctors.wizard.lastName')}</Label>
                <Input
                  id="doc-ln"
                  placeholder={t('doctors.wizard.lastNamePlaceholder')}
                  {...form2.register('lastName')}
                />
                {form2.formState.errors.lastName && (
                  <p className="text-sm text-danger">{form2.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('doctors.wizard.specialty')}</Label>
              <Controller
                control={form2.control}
                name="specialtyId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="border-border-card">
                      <SelectValue placeholder={t('doctors.wizard.specialtyPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {(meta?.specialties ?? []).map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form2.formState.errors.specialtyId && (
                <p className="text-sm text-danger">{form2.formState.errors.specialtyId.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="doc-phone">{t('doctors.wizard.phone')}</Label>
              <Input id="doc-phone" type="tel" {...form2.register('phone')} />
              {form2.formState.errors.phone && (
                <p className="text-sm text-danger">{form2.formState.errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="doc-comm">{t('doctors.wizard.commission')}</Label>
              <Input
                id="doc-comm"
                inputMode="decimal"
                placeholder={t('doctors.wizard.commissionPlaceholder')}
                {...form2.register('commissionPercent')}
              />
              {form2.formState.errors.commissionPercent && (
                <p className="text-sm text-danger">{form2.formState.errors.commissionPercent.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="doc-cert">{t('doctors.wizard.certificate')}</Label>
              <Input
                id="doc-cert"
                placeholder={t('doctors.wizard.certificatePlaceholder')}
                {...form2.register('certificateNumber')}
              />
            </div>
            {err && <p className="text-sm text-danger">{t('doctors.wizard.submitError')}</p>}
            <div className="flex flex-wrap justify-end gap-3 pt-2">
              {!isEdit && (
                <Button
                  type="button"
                  variant="outline"
                  className="border-border-card"
                  onClick={() => setStep(1)}
                  disabled={saving}
                >
                  {t('doctors.wizard.back')}
                </Button>
              )}
              <Button type="button" variant="outline" className="border-border-card" onClick={handleClose} disabled={saving}>
                {t('doctors.wizard.cancel')}
              </Button>
              <Button type="submit" disabled={saving}>
                {t('doctors.wizard.next')}
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <ClinicAccessStep
              values={clinicAccess}
              onChange={setClinicAccess}
              error={clinicAccessError}
            />
            {err && <p className="text-sm text-danger">{t('doctors.wizard.submitError')}</p>}
            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="border-border-card"
                onClick={() => setStep(2)}
                disabled={saving}
              >
                {t('doctors.wizard.back')}
              </Button>
              <Button type="button" variant="outline" className="border-border-card" onClick={handleClose} disabled={saving}>
                {t('doctors.wizard.cancel')}
              </Button>
              <Button type="button" disabled={saving} onClick={onSubmitClinicStep}>
                {saving
                  ? t('doctors.wizard.saving')
                  : isEdit
                    ? t('doctors.wizard.save')
                    : t('doctors.wizard.submit')}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
