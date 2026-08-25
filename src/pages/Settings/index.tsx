import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSettings } from '@/hooks/settings/useSettings'
import { ClinicInformationTab } from '@/pages/Settings/components/ClinicInformationTab'
import { WorkDaysTab } from '@/pages/Settings/components/WorkDaysTab'
import { WorkHoursTab } from '@/pages/Settings/components/WorkHoursTab'
import { cn } from '@/lib/utils'

export const SettingsPage: FC = () => {
  const { t } = useTranslation()
  const settingsQuery = useSettings()

  if (settingsQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>
        <Skeleton className="h-11 w-full max-w-2xl" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    )
  }

  if (settingsQuery.isError || !settingsQuery.data) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        {t('settings.error.load')}
      </div>
    )
  }

  const data = settingsQuery.data

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('settings.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('settings.subtitle')}</p>
        </div>
      </div>

      <Tabs defaultValue="clinic" className="w-full">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <TabsList className={cn('h-auto w-full max-w-2xl flex-wrap justify-start lg:ms-auto lg:max-w-none')}>
            <TabsTrigger
              value="clinic"
              className="min-w-0 flex-1 px-2 py-2 text-xs sm:min-w-[7rem] sm:px-3 sm:text-sm"
            >
              {t('settings.tabs.clinic')}
            </TabsTrigger>
            <TabsTrigger
              value="days"
              className="min-w-0 flex-1 px-2 py-2 text-xs sm:min-w-[7rem] sm:px-3 sm:text-sm"
            >
              {t('settings.tabs.workDays')}
            </TabsTrigger>
            <TabsTrigger
              value="hours"
              className="min-w-0 flex-1 px-2 py-2 text-xs sm:min-w-[7rem] sm:px-3 sm:text-sm"
            >
              {t('settings.tabs.workHours')}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="clinic" className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <ClinicInformationTab clinic={data.clinic} />
        </TabsContent>
        <TabsContent value="days" className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <WorkDaysTab workDays={data.workDays} />
        </TabsContent>
        <TabsContent value="hours" className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <WorkHoursTab workHours={data.workHours} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
