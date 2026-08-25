import { zodResolver } from '@hookform/resolvers/zod'
import type { FC } from 'react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { useUpdateSettings } from '@/hooks/settings/useUpdateSettings'
import { WEEKDAY_KEYS_ORDER, type WorkDaysState } from '@/types/settings.types'
import { cn } from '@/lib/utils'

const workDaysSchema = z.object({
  sun: z.boolean(),
  mon: z.boolean(),
  tue: z.boolean(),
  wed: z.boolean(),
  thu: z.boolean(),
  fri: z.boolean(),
  sat: z.boolean(),
})

type FormValues = z.infer<typeof workDaysSchema>

export type WorkDaysTabProps = {
  workDays: WorkDaysState
}

export const WorkDaysTab: FC<WorkDaysTabProps> = ({ workDays }) => {
  const { t } = useTranslation()
  const updateMutation = useUpdateSettings()

  const form = useForm<FormValues>({
    resolver: zodResolver(workDaysSchema),
    defaultValues: workDays,
  })

  useEffect(() => {
    form.reset(workDays)
  }, [workDays, form])

  const handleCancel = () => {
    form.reset(workDays)
  }

  const onSubmit = form.handleSubmit(async (values) => {
    await updateMutation.mutateAsync({ workDays: values })
  })

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {WEEKDAY_KEYS_ORDER.map((key) => (
          <label
            key={key}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-muted/40'
            )}
          >
            <Controller
              name={key}
              control={form.control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
              )}
            />
            <span className="text-sm font-semibold text-foreground">
              {t(`settings.workDays.${key}`)}
            </span>
          </label>
        ))}
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
