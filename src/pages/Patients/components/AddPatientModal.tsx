import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { arSA, enUS } from 'date-fns/locale'
import { Upload } from 'lucide-react'
import type { FC } from 'react'
import { useEffect, useId, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreatePatient } from '@/hooks/patients/usePatientMutations'
import type { CreatePatientInput } from '@/types/patient.types'

const BLOOD_NONE = '__none__'
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const

const MAX_FILE_BYTES = 5 * 1024 * 1024

const getDefaultFormValues = () => ({
  firstName: '',
  lastName: '',
  gender: '',
  bloodType: BLOOD_NONE,
  phone: '',
  address: '',
  birthDay: '',
  birthMonth: '',
  birthYear: '',
})

const buildSchema = (t: (k: string) => string, maxCalendarYear: number) =>
  z
    .object({
      firstName: z.string(),
      lastName: z.string(),
      gender: z.string(),
      bloodType: z.string(),
      phone: z.string(),
      address: z.string(),
      birthDay: z.string(),
      birthMonth: z.string(),
      birthYear: z.string(),
    })
    .superRefine((data, ctx) => {
      const full = `${data.firstName.trim()} ${data.lastName.trim()}`.trim()
      if (full.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('patients.addModal.validation.fullName'),
          path: ['firstName'],
        })
      }
      if (!['male', 'female', 'other'].includes(data.gender)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('patients.addModal.validation.gender'),
          path: ['gender'],
        })
      }
      if (!data.birthDay || !data.birthMonth || !data.birthYear) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('patients.addModal.validation.dobIncomplete'),
          path: ['birthYear'],
        })
      } else {
        const d = Number(data.birthDay)
        const m = Number(data.birthMonth)
        const y = Number(data.birthYear)
        const dt = new Date(y, m - 1, d)
        if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('patients.addModal.validation.dobInvalid'),
            path: ['birthDay'],
          })
        }
        if (y < 1920) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('patients.addModal.validation.birthYear'),
            path: ['birthYear'],
          })
        }
        if (y > maxCalendarYear) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('patients.addModal.validation.birthYearMax'),
            path: ['birthYear'],
          })
        }
      }
      if (data.phone.trim().length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('patients.addModal.validation.phone'),
          path: ['phone'],
        })
      }
      if (data.address.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('patients.addModal.validation.address'),
          path: ['address'],
        })
      }
    })

type FormValues = z.infer<ReturnType<typeof buildSchema>>

export type AddPatientModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const mapToCreateInput = (values: FormValues): CreatePatientInput => ({
  fullName: `${values.firstName.trim()} ${values.lastName.trim()}`.trim(),
  phone: values.phone.trim(),
  email: '',
  gender: values.gender as CreatePatientInput['gender'],
  birthYear: Number(values.birthYear),
  address: values.address.trim(),
  bloodType: values.bloodType === BLOOD_NONE ? '' : values.bloodType,
})

export const AddPatientModal: FC<AddPatientModalProps> = ({ open, onOpenChange }) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const fileInputId = useId()
  const maxCalendarYear = new Date().getFullYear()
  const schema = useMemo(() => buildSchema(t, maxCalendarYear), [t, maxCalendarYear])
  const createMutation = useCreatePatient()

  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null)
  const [fileErrorKey, setFileErrorKey] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: getDefaultFormValues(),
  })

  const monthOptions = useMemo(() => {
    const loc = i18n.language.startsWith('ar') ? arSA : enUS
    return Array.from({ length: 12 }, (_, i) => ({
      value: String(i + 1),
      label: format(new Date(2000, i, 1), 'LLLL', { locale: loc }),
    }))
  }, [i18n.language])

  const dayOptions = useMemo(
    () => Array.from({ length: 31 }, (_, i) => String(i + 1)),
    []
  )

  const yearOptions = useMemo(() => {
    const years: string[] = []
    for (let y = maxCalendarYear; y >= 1920; y -= 1) {
      years.push(String(y))
    }
    return years
  }, [maxCalendarYear])

  useEffect(() => {
    if (!open) return
    form.reset(getDefaultFormValues())
    setFileErrorKey(null)
    setAvatarPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when dialog opens
  }, [open])

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl)
    }
  }, [avatarPreviewUrl])

  const handleFileChange = (file: File | null) => {
    setFileErrorKey(null)
    if (!file) {
      setAvatarPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
      return
    }
    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      setFileErrorKey('patients.addModal.fileErrorType')
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setFileErrorKey('patients.addModal.fileErrorSize')
      return
    }
    setAvatarPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
  }

  const onSubmit = form.handleSubmit(async (values) => {
    const created = await createMutation.mutateAsync(mapToCreateInput(values))
    onOpenChange(false)
    form.reset(getDefaultFormValues())
    setFileErrorKey(null)
    setAvatarPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    void navigate(`/clinic/patients/${created.id}`)
  })

  const genderValue = form.watch('gender')
  const bloodValue = form.watch('bloodType')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle>{t('patients.addModal.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-foreground">
              {t('patients.addModal.sectionBasic')}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pt-first">{t('patients.addModal.firstName')}</Label>
                <Input
                  id="pt-first"
                  className="border-border-card"
                  placeholder={t('patients.addModal.firstNamePlaceholder')}
                  aria-invalid={Boolean(form.formState.errors.firstName)}
                  {...form.register('firstName')}
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-danger">{form.formState.errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pt-last">{t('patients.addModal.lastName')}</Label>
                <Input
                  id="pt-last"
                  className="border-border-card"
                  placeholder={t('patients.addModal.lastNamePlaceholder')}
                  aria-invalid={Boolean(form.formState.errors.lastName)}
                  {...form.register('lastName')}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('patients.addModal.gender')}</Label>
                <Select
                  value={genderValue === '' ? undefined : genderValue}
                  onValueChange={(v) => form.setValue('gender', v as FormValues['gender'])}
                >
                  <SelectTrigger className="border-border-card" aria-invalid={Boolean(form.formState.errors.gender)}>
                    <SelectValue placeholder={t('patients.addModal.genderPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t('patients.gender.male')}</SelectItem>
                    <SelectItem value="female">{t('patients.gender.female')}</SelectItem>
                    <SelectItem value="other">{t('patients.gender.other')}</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.gender && (
                  <p className="text-sm text-danger">{form.formState.errors.gender.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t('patients.addModal.bloodTypeOptional')}</Label>
                <Select
                  value={bloodValue}
                  onValueChange={(v) => form.setValue('bloodType', v)}
                >
                  <SelectTrigger className="border-border-card">
                    <SelectValue placeholder={t('patients.addModal.bloodTypePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={BLOOD_NONE}>{t('patients.addModal.bloodTypeSkip')}</SelectItem>
                    {BLOOD_TYPES.map((bt) => (
                      <SelectItem key={bt} value={bt}>
                        {bt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pt-phone">{t('patients.addModal.phoneNumber')}</Label>
                <Input
                  id="pt-phone"
                  className="border-border-card"
                  placeholder={t('patients.addModal.phonePlaceholder')}
                  aria-invalid={Boolean(form.formState.errors.phone)}
                  {...form.register('phone')}
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-danger">{form.formState.errors.phone.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pt-addr">{t('patients.addModal.address')}</Label>
                <Input
                  id="pt-addr"
                  className="border-border-card"
                  placeholder={t('patients.addModal.addressPlaceholder')}
                  aria-invalid={Boolean(form.formState.errors.address)}
                  {...form.register('address')}
                />
                {form.formState.errors.address && (
                  <p className="text-sm text-danger">{form.formState.errors.address.message}</p>
                )}
              </div>
            </div>
          </div>

          <hr className="border-border-card" />

          <div className="space-y-4">
            <h3 className="text-base font-semibold text-foreground">
              {t('patients.addModal.sectionDob')}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>{t('patients.addModal.dobDay')}</Label>
                <Select
                  value={form.watch('birthDay') === '' ? undefined : form.watch('birthDay')}
                  onValueChange={(v) => form.setValue('birthDay', v)}
                >
                  <SelectTrigger className="border-border-card" aria-invalid={Boolean(form.formState.errors.birthDay)}>
                    <SelectValue placeholder={t('patients.addModal.chooseDay')} />
                  </SelectTrigger>
                  <SelectContent>
                    {dayOptions.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.birthDay && (
                  <p className="text-sm text-danger">{form.formState.errors.birthDay.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>{t('patients.addModal.dobMonth')}</Label>
                <Select
                  value={form.watch('birthMonth') === '' ? undefined : form.watch('birthMonth')}
                  onValueChange={(v) => form.setValue('birthMonth', v)}
                >
                  <SelectTrigger className="border-border-card">
                    <SelectValue placeholder={t('patients.addModal.chooseMonth')} />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('patients.addModal.dobYear')}</Label>
                <Select
                  value={form.watch('birthYear') === '' ? undefined : form.watch('birthYear')}
                  onValueChange={(v) => form.setValue('birthYear', v)}
                >
                  <SelectTrigger className="border-border-card" aria-invalid={Boolean(form.formState.errors.birthYear)}>
                    <SelectValue placeholder={t('patients.addModal.chooseYear')} />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.birthYear && (
                  <p className="text-sm text-danger">{form.formState.errors.birthYear.message}</p>
                )}
              </div>
            </div>
          </div>

          <hr className="border-border-card" />

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">
              {t('patients.addModal.sectionFiles')}
            </h3>
            <div className="rounded-xl border border-dashed border-border-card bg-muted/20 px-4 py-8 text-center">
              <input
                id={fileInputId}
                type="file"
                accept="image/png,image/jpeg"
                className="sr-only"
                aria-label={t('patients.addModal.uploadAria')}
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null
                  handleFileChange(f)
                  e.target.value = ''
                }}
              />
              <div className="mb-3 flex justify-center">
                <Upload className="h-8 w-8 text-primary" aria-hidden />
              </div>
              <label
                htmlFor={fileInputId}
                className="cursor-pointer text-base font-semibold text-primary hover:underline"
              >
                {t('patients.addModal.uploadTitle')}
              </label>
              <p className="mt-2 text-xs text-muted-foreground">{t('patients.addModal.uploadHint')}</p>
              {avatarPreviewUrl ? (
                <div className="mt-4 flex flex-col items-center gap-2">
                  <img
                    src={avatarPreviewUrl}
                    alt=""
                    className="max-h-32 max-w-full rounded-lg border border-border-card object-contain"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleFileChange(null)}
                  >
                    {t('patients.addModal.removeFile')}
                  </Button>
                </div>
              ) : null}
            </div>
            {fileErrorKey ? <p className="text-sm text-danger">{t(fileErrorKey)}</p> : null}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-lg"
              onClick={() => onOpenChange(false)}
            >
              {t('patients.addModal.cancel')}
            </Button>
            <Button type="submit" className="h-11 rounded-lg" disabled={createMutation.isPending}>
              {createMutation.isPending ? t('patients.addModal.saving') : t('patients.addModal.submit')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
