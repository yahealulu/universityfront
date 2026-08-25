import { format, setHours, setMilliseconds, setMinutes, setSeconds } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'
import { Plus } from 'lucide-react'
import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { ScheduleAppointment, ScheduleDoctor } from '@/types/appointment-schedule.types'
import {
  buildDoctorColumnOccupancy,
  buildSlotStarts,
  matchesAppointmentSearch,
  minutesToTime,
} from '@/utils/appointmentSchedule'

import { AppointmentBlock } from './AppointmentBlock'

export type AppointmentScheduleGridProps = {
  doctors: ScheduleDoctor[]
  appointments: ScheduleAppointment[]
  dayStart: string
  dayEnd: string
  slotMinutes: number
  search: string
  onSlotAdd: (doctorId: string, startTime: string) => void
}

const slotLabel = (minutesFromMidnight: number, locale: typeof enUS) => {
  const h = Math.floor(minutesFromMidnight / 60)
  const m = minutesFromMidnight % 60
  const d = setMilliseconds(setSeconds(setMinutes(setHours(new Date(), h), m), 0), 0)
  return format(d, 'h:mm a', { locale })
}

export const AppointmentScheduleGrid: FC<AppointmentScheduleGridProps> = ({
  doctors,
  appointments,
  dayStart,
  dayEnd,
  slotMinutes,
  search,
  onSlotAdd,
}) => {
  const { i18n, t } = useTranslation()
  const locale = i18n.language.startsWith('ar') ? ar : enUS

  const slotStarts = useMemo(
    () => buildSlotStarts(dayStart, dayEnd, slotMinutes),
    [dayStart, dayEnd, slotMinutes]
  )

  const filteredAppointments = useMemo(() => {
    const q = search.trim()
    if (!q) return appointments
    return appointments.filter((apt) => {
      const doc = doctors.find((d) => d.id === apt.doctorId)
      return matchesAppointmentSearch(apt, doc?.name ?? '', q)
    })
  }, [appointments, doctors, search])

  const occupancies = useMemo(
    () =>
      doctors.map((d) =>
        buildDoctorColumnOccupancy(filteredAppointments, d.id, slotStarts, slotMinutes)
      ),
    [doctors, filteredAppointments, slotStarts, slotMinutes]
  )

  return (
    <div className="overflow-x-table" dir="ltr">
      <div
        className="grid min-w-[720px] gap-0 rounded-lg border border-border-card bg-surface"
        style={{
          gridTemplateColumns: `5.5rem repeat(${doctors.length}, minmax(10rem, 1fr))`,
          gridTemplateRows: `auto repeat(${slotStarts.length}, minmax(3.25rem, auto))`,
        }}
      >
        <div
          className="sticky start-0 z-[1] border-b border-e border-border-card bg-[#f8fafc] px-2 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          style={{ gridColumn: 1, gridRow: 1 }}
        >
          {t('appointments.grid.time')}
        </div>
        {doctors.map((doc, j) => (
          <div
            key={doc.id}
            className="border-b border-s border-border-card bg-[#f8fafc] px-3 py-3 text-center"
            style={{ gridColumn: j + 2, gridRow: 1 }}
          >
            <p className="text-sm font-bold text-[#0f172a]">{doc.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{doc.specialty}</p>
          </div>
        ))}

        {slotStarts.map((minutes, i) => {
          const rowIndex = i + 2
          const isLastRow = i === slotStarts.length - 1
          return (
            <div key={`row-${minutes}`} className="contents">
              <div
                className={`sticky start-0 z-[1] border-e border-border-card bg-surface px-2 py-2 text-sm font-medium text-[#3b82f6] ${
                  !isLastRow ? 'border-b' : ''
                }`}
                style={{ gridColumn: 1, gridRow: rowIndex }}
              >
                {slotLabel(minutes, locale)}
              </div>
              {doctors.map((doc, j) => {
                const occ = occupancies[j]?.[i]
                if (!occ) return null
                if (occ.kind === 'continuation') {
                  return null
                }
                if (occ.kind === 'start') {
                  const span = Math.max(1, occ.appointment.durationMinutes / slotMinutes)
                  return (
                    <div
                      key={`${doc.id}-${i}-apt`}
                      className={`min-h-0 p-1 ${!isLastRow ? 'border-b' : ''} border-s border-border-card`}
                      style={{
                        gridColumn: j + 2,
                        gridRow: `${rowIndex} / span ${span}`,
                      }}
                    >
                      <AppointmentBlock appointment={occ.appointment} />
                    </div>
                  )
                }
                return (
                  <div
                    key={`${doc.id}-${i}-empty`}
                    className={`p-1 ${!isLastRow ? 'border-b' : ''} border-s border-border-card bg-white`}
                    style={{ gridColumn: j + 2, gridRow: rowIndex }}
                  >
                    <button
                      type="button"
                      className="flex h-full min-h-[3rem] w-full items-center justify-center rounded-lg border border-dashed border-transparent bg-[#f8fafc] transition hover:border-[#bfdbfe] hover:bg-sky-50/80"
                      onClick={() => onSlotAdd(doc.id, minutesToTime(minutes))}
                      aria-label={t('appointments.grid.addAria', {
                        doctor: doc.name,
                        time: slotLabel(minutes, locale),
                      })}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dbeafe] text-primary">
                        <Plus className="h-4 w-4" strokeWidth={2.5} />
                      </span>
                    </button>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
