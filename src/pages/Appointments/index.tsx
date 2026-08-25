import { addDays, format, parseISO, subDays } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'
import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'
import { useAppointmentSchedule } from '@/hooks/appointments/useAppointmentSchedule'
import { useAppointmentsMeta } from '@/hooks/appointments/useAppointmentsMeta'

import { AppointmentScheduleGrid } from './components/AppointmentScheduleGrid'
import { AppointmentScheduleToolbar } from './components/AppointmentScheduleToolbar'
import { NewAppointmentModal } from './components/NewAppointmentModal'

export const AppointmentsPage: FC = () => {
  const { t, i18n } = useTranslation()
  const [selectedDay, setSelectedDay] = useState(() => format(new Date(), 'yyyy-MM-dd'))
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [prefill, setPrefill] = useState<{ doctorId: string; startTime: string }>({
    doctorId: '',
    startTime: '09:00',
  })

  const scheduleQuery = useAppointmentSchedule(selectedDay)
  const metaQuery = useAppointmentsMeta()

  const formattedToolbarDate = useMemo(() => {
    const d = parseISO(selectedDay)
    const locale = i18n.language.startsWith('ar') ? ar : enUS
    return format(d, 'EEEE, MMMM d, yyyy', { locale })
  }, [selectedDay, i18n.language])

  const handlePrevDay = () => {
    setSelectedDay((prev) => format(subDays(parseISO(prev), 1), 'yyyy-MM-dd'))
  }

  const handleNextDay = () => {
    setSelectedDay((prev) => format(addDays(parseISO(prev), 1), 'yyyy-MM-dd'))
  }

  const handleSlotAdd = (doctorId: string, startTime: string) => {
    setPrefill({ doctorId, startTime })
    setModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary md:text-3xl">{t('appointments.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">{t('appointments.subtitle')}</p>
      </div>

      <div className="rounded-card border border-border-card bg-surface p-4 shadow-card md:p-6">
        {scheduleQuery.isPending && (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        )}

        {scheduleQuery.isError && (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">{t('appointments.error.load')}</p>
            <button
              type="button"
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              onClick={() => void scheduleQuery.refetch()}
            >
              {t('appointments.error.retry')}
            </button>
          </div>
        )}

        {scheduleQuery.data && (
          <>
            <AppointmentScheduleToolbar
              formattedDate={formattedToolbarDate}
              search={search}
              onSearchChange={setSearch}
              onPrevDay={handlePrevDay}
              onNextDay={handleNextDay}
              className="mb-4"
            />
            <AppointmentScheduleGrid
              doctors={scheduleQuery.data.doctors}
              appointments={scheduleQuery.data.appointments}
              dayStart={scheduleQuery.data.dayStart}
              dayEnd={scheduleQuery.data.dayEnd}
              slotMinutes={scheduleQuery.data.slotMinutes}
              search={search}
              onSlotAdd={handleSlotAdd}
            />
          </>
        )}
      </div>

      <NewAppointmentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        selectedDate={selectedDay}
        defaultDoctorId={prefill.doctorId}
        defaultStartTime={prefill.startTime}
        meta={metaQuery.data}
      />
    </div>
  )
}
