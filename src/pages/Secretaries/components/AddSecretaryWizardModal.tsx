import { zodResolver } from '@hookform/resolvers/zod'
import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateSecretary } from '@/hooks/secretaries/useCreateSecretary'
import { useUpdateSecretary } from '@/hooks/secretaries/useUpdateSecretary'
import type { SecretaryFull } from '@/types/secretary.types'

const step1Schema = (t: (k: string) => string) =>
  z.object({
    username: z.string().min(1, t('secretaries.wizard.validation.username')),
    password: z.string().min(8, t('secretaries.wizard.validation.password')),
  })

const step2Schema = (t: (k: string) => string) =>
  z.object({
    firstName: z.string().min(1, t('secretaries.wizard.validation.firstName')),
    lastName: z.string().min(1, t('secretaries.wizard.validation.lastName')),
    phone: z.string().min(1, t('secretaries.wizard.validation.phone')),
    salary: z
      .string()
      .min(1, t('secretaries.wizard.validation.salary'))
      .refine((s) => {
        const n = Number(s)
        return !Number.isNaN(n) && n >= 0
      }, t('secretaries.wizard.validation.salary')),
  })

type Step1Values = z.infer<ReturnType<typeof step1Schema>>
type Step2Values = z.infer<ReturnType<typeof step2Schema>>

export type AddSecretaryWizardModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingSecretary: SecretaryFull | null
}

export const AddSecretaryWizardModal: FC<AddSecretaryWizardModalProps> = ({
  open,
  onOpenChange,
  editingSecretary,
}) => {
  const { t } = useTranslation()
  const isEdit = Boolean(editingSecretary)
  const [step, setStep] = useState<1 | 2>(1)

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
      phone: '',
      salary: '',
    },
  })

  const createMutation = useCreateSecretary()
  const updateMutation = useUpdateSecretary()

  useEffect(() => {
    if (!open) return
    if (isEdit && editingSecretary) {
      setStep(2)
      form1.reset({ username: editingSecretary.username, password: '' })
      form2.reset({
        firstName: editingSecretary.firstName,
        lastName: editingSecretary.lastName,
        phone: editingSecretary.phone,
        salary: String(editingSecretary.salary),
      })
    } else {
      setStep(1)
      form1.reset({ username: '', password: '' })
      form2.reset({
        firstName: '',
        lastName: '',
        phone: '',
        salary: '',
      })
    }
  }, [open, isEdit, editingSecretary, form1, form2])

  const handleClose = () => {
    onOpenChange(false)
    setStep(1)
  }

  const onNext = form1.handleSubmit(() => setStep(2))

  const onSubmitCreate = form2.handleSubmit(async (v2) => {
    const v1 = form1.getValues()
    try {
      await createMutation.mutateAsync({
        username: v1.username,
        password: v1.password,
        firstName: v2.firstName,
        lastName: v2.lastName,
        phone: v2.phone,
        salary: Number(v2.salary),
      })
      handleClose()
    } catch {
      // mutation toast / error
    }
  })

  const onSubmitEdit = form2.handleSubmit(async (v2) => {
    if (!editingSecretary) return
    try {
      await updateMutation.mutateAsync({
        id: editingSecretary.id,
        body: {
          firstName: v2.firstName,
          lastName: v2.lastName,
          phone: v2.phone,
          salary: Number(v2.salary),
        },
      })
      handleClose()
    } catch {
      // handled
    }
  })

  const saving = createMutation.isPending || updateMutation.isPending
  const err = isEdit ? updateMutation.error : createMutation.error

  const title =
    step === 1
      ? t('secretaries.wizard.titleStep1')
      : isEdit
        ? t('secretaries.wizard.titleEdit')
        : t('secretaries.wizard.titleStep2')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {step === 1 && !isEdit && (
          <form onSubmit={onNext} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sec-user">{t('secretaries.wizard.username')}</Label>
              <Input
                id="sec-user"
                autoComplete="username"
                placeholder={t('secretaries.wizard.usernamePlaceholder')}
                {...form1.register('username')}
              />
              {form1.formState.errors.username && (
                <p className="text-sm text-danger">{form1.formState.errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sec-pass">{t('secretaries.wizard.password')}</Label>
              <Input
                id="sec-pass"
                type="password"
                autoComplete="new-password"
                placeholder={t('secretaries.wizard.passwordPlaceholder')}
                {...form1.register('password')}
              />
              {form1.formState.errors.password && (
                <p className="text-sm text-danger">{form1.formState.errors.password.message}</p>
              )}
            </div>
            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <Button type="button" variant="outline" className="border-border-card" onClick={handleClose}>
                {t('secretaries.wizard.cancel')}
              </Button>
              <Button type="submit">{t('secretaries.wizard.next')}</Button>
            </div>
          </form>
        )}

        {(step === 2 || isEdit) && (
          <form onSubmit={isEdit ? onSubmitEdit : onSubmitCreate} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sec-fn">{t('secretaries.wizard.firstName')}</Label>
                <Input
                  id="sec-fn"
                  placeholder={t('secretaries.wizard.firstNamePlaceholder')}
                  {...form2.register('firstName')}
                />
                {form2.formState.errors.firstName && (
                  <p className="text-sm text-danger">{form2.formState.errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sec-ln">{t('secretaries.wizard.lastName')}</Label>
                <Input
                  id="sec-ln"
                  placeholder={t('secretaries.wizard.lastNamePlaceholder')}
                  {...form2.register('lastName')}
                />
                {form2.formState.errors.lastName && (
                  <p className="text-sm text-danger">{form2.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sec-phone">{t('secretaries.wizard.phone')}</Label>
              <Input id="sec-phone" type="tel" placeholder={t('secretaries.wizard.phonePlaceholder')} {...form2.register('phone')} />
              {form2.formState.errors.phone && (
                <p className="text-sm text-danger">{form2.formState.errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sec-salary">{t('secretaries.wizard.salary')}</Label>
              <Input
                id="sec-salary"
                inputMode="decimal"
                placeholder={t('secretaries.wizard.salaryPlaceholder')}
                {...form2.register('salary')}
              />
              {form2.formState.errors.salary && (
                <p className="text-sm text-danger">{form2.formState.errors.salary.message}</p>
              )}
            </div>
            {err && <p className="text-sm text-danger">{t('secretaries.wizard.submitError')}</p>}
            <div className="flex flex-wrap justify-end gap-3 pt-2">
              {!isEdit && (
                <Button
                  type="button"
                  variant="outline"
                  className="border-border-card"
                  onClick={() => setStep(1)}
                  disabled={saving}
                >
                  {t('secretaries.wizard.back')}
                </Button>
              )}
              <Button type="button" variant="outline" className="border-border-card" onClick={handleClose} disabled={saving}>
                {t('secretaries.wizard.cancel')}
              </Button>
              <Button type="submit" disabled={saving}>
                {saving
                  ? t('secretaries.wizard.saving')
                  : isEdit
                    ? t('secretaries.wizard.save')
                    : t('secretaries.wizard.submit')}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
