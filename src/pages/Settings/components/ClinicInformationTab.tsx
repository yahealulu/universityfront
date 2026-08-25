import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { settingsApi } from '@/api/modules/settings.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUpdateSettings } from '@/hooks/settings/useUpdateSettings'
import type { ClinicInfo } from '@/types/settings.types'

const buildSchema = (t: (k: string) => string) =>
  z.object({
    name: z.string().min(1, t('settings.validation.name')),
    phone: z.string().min(1, t('settings.validation.phone')),
    address: z.string().min(1, t('settings.validation.address')),
    logoUrl: z.string().optional(),
  })

export type ClinicInformationTabProps = {
  clinic: ClinicInfo
}

export const ClinicInformationTab: FC<ClinicInformationTabProps> = ({ clinic }) => {
  const { t } = useTranslation()
  const schema = buildSchema(t)
  type FormValues = z.infer<typeof schema>

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const pendingFileRef = useRef<File | null>(null)

  const updateMutation = useUpdateSettings()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: clinic.name,
      phone: clinic.phone,
      address: clinic.address,
      logoUrl: clinic.logoUrl,
    },
  })

  useEffect(() => {
    form.reset({
      name: clinic.name,
      phone: clinic.phone,
      address: clinic.address,
      logoUrl: clinic.logoUrl,
    })
    setObjectUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    pendingFileRef.current = null
  }, [clinic.name, clinic.phone, clinic.address, clinic.logoUrl, form])

  const previewSrc = objectUrl ?? clinic.logoUrl ?? undefined

  const handlePickFile = () => {
    fileInputRef.current?.click()
  }

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    pendingFileRef.current = file
    setObjectUrl(URL.createObjectURL(file))
    e.target.value = ''
  }

  const handleCancel = () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    setObjectUrl(null)
    pendingFileRef.current = null
    form.reset({
      name: clinic.name,
      phone: clinic.phone,
      address: clinic.address,
      logoUrl: clinic.logoUrl,
    })
  }

  const onSubmit = form.handleSubmit(async (values) => {
    let logoUrl = values.logoUrl
    if (pendingFileRef.current) {
      const uploaded = await settingsApi.uploadLogo(pendingFileRef.current)
      logoUrl = uploaded.logoUrl
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      setObjectUrl(null)
      pendingFileRef.current = null
    }
    await updateMutation.mutateAsync({
      clinic: {
        name: values.name.trim(),
        phone: values.phone.trim(),
        address: values.address.trim(),
        logoUrl,
      },
    })
  })

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        aria-hidden
        onChange={onFileChange}
      />

      <div className="grid gap-4 sm:grid-cols-1">
        <div className="space-y-2">
          <Label htmlFor="clinic-name">{t('settings.clinic.name')}</Label>
          <Input id="clinic-name" {...form.register('name')} />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="clinic-phone">{t('settings.clinic.phone')}</Label>
          <Input id="clinic-phone" type="tel" {...form.register('phone')} />
          {form.formState.errors.phone && (
            <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="clinic-address">{t('settings.clinic.address')}</Label>
          <Input id="clinic-address" {...form.register('address')} />
          {form.formState.errors.address && (
            <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <Label>{t('settings.clinic.logo')}</Label>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/40">
            {previewSrc ? (
              <img src={previewSrc} alt="" className="max-h-full max-w-full object-contain p-2" />
            ) : (
              <span className="text-xs text-muted-foreground">{t('settings.clinic.noLogo')}</span>
            )}
          </div>
          <Button type="button" variant="outline" className="gap-2" onClick={handlePickFile}>
            <Pencil className="h-4 w-4" />
            {t('settings.clinic.editLogo')}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={handleCancel} disabled={updateMutation.isPending}>
          {t('settings.actions.cancel')}
        </Button>
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? t('settings.actions.saving') : t('settings.actions.save')}
        </Button>
      </div>
    </form>
  )
}
