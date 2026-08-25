import { zodResolver } from '@hookform/resolvers/zod'
import type { FC } from 'react'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { usePatchPatientProfile } from '@/hooks/patients/usePatientMutations'
import type { PatientDetailPayload } from '@/types/patient.types'

const buildSchema = (t: (k: string) => string) =>
  z.object({
    name: z.string().min(2, t('patients.edit.validation.name')),
    email: z.string().email(t('patients.edit.validation.email')),
    phone: z.string().min(6, t('patients.edit.validation.phone')),
    address: z.string().min(2, t('patients.edit.validation.address')),
    lastVisit: z.string().min(1, t('patients.edit.validation.date')),
    nextVisit: z.string().min(1, t('patients.edit.validation.date')),
  })

type FormValues = z.infer<ReturnType<typeof buildSchema>>

export type EditPatientProfileModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId: string
  profile: PatientDetailPayload['profile'] | undefined
}

export const EditPatientProfileModal: FC<EditPatientProfileModalProps> = ({
  open,
  onOpenChange,
  patientId,
  profile,
}) => {
  const { t } = useTranslation()
  const schema = useMemo(() => buildSchema(t), [t])
  const patch = usePatchPatientProfile(patientId)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      lastVisit: '',
      nextVisit: '',
    },
  })

  useEffect(() => {
    if (!open || !profile) return
    form.reset({
      name: profile.name,
      email: profile.contact.email,
      phone: profile.contact.phone,
      address: profile.contact.address,
      lastVisit: profile.activities.lastVisit,
      nextVisit: profile.activities.nextVisit,
    })
  }, [open, profile, form])

  const onSubmit = form.handleSubmit(async (values) => {
    await patch.mutateAsync({
      name: values.name.trim(),
      contact: {
        email: values.email.trim(),
        phone: values.phone.trim(),
        address: values.address.trim(),
      },
      activities: {
        lastVisit: values.lastVisit,
        nextVisit: values.nextVisit,
      },
    })
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle>{t('patients.edit.title')}</DialogTitle>
        </DialogHeader>
        {!profile ? (
          <div className="space-y-3 py-2" aria-busy="true">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ed-name">{t('patients.edit.name')}</Label>
            <Input id="ed-name" {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ed-email">{t('patients.edit.email')}</Label>
            <Input id="ed-email" type="email" {...form.register('email')} />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ed-phone">{t('patients.edit.phone')}</Label>
            <Input id="ed-phone" {...form.register('phone')} />
            {form.formState.errors.phone && (
              <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ed-addr">{t('patients.edit.address')}</Label>
            <Input id="ed-addr" {...form.register('address')} />
            {form.formState.errors.address && (
              <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ed-lv">{t('patients.edit.lastVisit')}</Label>
              <Input id="ed-lv" type="date" {...form.register('lastVisit')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ed-nv">{t('patients.edit.nextVisit')}</Label>
              <Input id="ed-nv" type="date" {...form.register('nextVisit')} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('patients.edit.cancel')}
            </Button>
            <Button type="submit" disabled={patch.isPending}>
              {patch.isPending ? t('patients.edit.saving') : t('patients.edit.save')}
            </Button>
          </div>
        </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
