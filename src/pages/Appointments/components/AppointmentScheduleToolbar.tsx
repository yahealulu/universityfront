import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export type AppointmentScheduleToolbarProps = {
  formattedDate: string
  search: string
  onSearchChange: (value: string) => void
  onPrevDay: () => void
  onNextDay: () => void
  className?: string
}

export const AppointmentScheduleToolbar: FC<AppointmentScheduleToolbarProps> = ({
  formattedDate,
  search,
  onSearchChange,
  onPrevDay,
  onNextDay,
  className,
}) => {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'flex flex-col gap-4 border-b border-border-card pb-4 md:flex-row md:items-center md:justify-between',
        className
      )}
    >
      <div className="flex items-center justify-center gap-2 md:justify-start">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0 border-border-card"
          onClick={onPrevDay}
          aria-label={t('appointments.toolbar.prevDay')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="min-w-[12rem] text-center text-base font-bold text-primary md:min-w-[16rem] md:text-lg">
          {formattedDate}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0 border-border-card"
          onClick={onNextDay}
          aria-label={t('appointments.toolbar.nextDay')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="relative w-full md:max-w-md md:flex-1">
        <Search
          className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('appointments.toolbar.searchPlaceholder')}
          className="ps-10"
          aria-label={t('appointments.toolbar.searchAria')}
        />
      </div>
    </div>
  )
}
