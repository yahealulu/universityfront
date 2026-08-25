import { zodResolver } from '@hookform/resolvers/zod'
import type { FC } from 'react'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUpdateSettings } from '@/hooks/settings/useUpdateSettings'
import type { WorkHoursState } from '@/types/settings.types'

export type WorkHoursTabProps = {
  workHours: WorkHoursState
}

export const WorkHoursTab: FC<WorkHoursTabProps> = ({ workHours }) => {
  const { t } = useTranslation()
  const updateMutation = useUpdateSettings()

  const schema = useMemo(
    () =>
      z
        .object({
          startTime: z.string().min(1, t('settings.validation.startTime')),
          endTime: z.string().min(1, t('settings.validation.endTime')),
        })
        .refine(
          (v) => v.endTime > v.startTime,
          { message: t('settings.validation.endAfterStart'), path: ['endTime'] }
        ),
    [t]
  )

  type FormValues = z.infer<typeof schema>

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: workHours,
  })

  useEffect(() => {
    form.reset(workHours)
  }, [workHours, form])

  const handleCancel = () => {
    form.reset(workHours)
  }

  const onSubmit = form.handleSubmit(async (values) => {
    await updateMutation.mutateAsync({ workHours: values })
  })

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid max-w-xl grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="work-start">{t('settings.workHours.start')}</Label>
          <Input id="work-start" type="time" step={60} {...form.register('startTime')} />
          {form.formState.errors.startTime && (
            <p className="text-sm text-destructive">{form.formState.errors.startTime.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="work-end">{t('settings.workHours.end')}</Label>
          <Input id="work-end" type="time" step={60} {...form.register('endTime')} />
          {form.formState.errors.endTime && (
            <p className="text-sm text-destructive">{form.formState.errors.endTime.message}</p>
          )}
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
