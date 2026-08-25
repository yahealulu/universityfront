import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import type { ScheduleAppointment } from '@/types/appointment-schedule.types'

export type AppointmentBlockProps = {
  appointment: ScheduleAppointment
}

export const AppointmentBlock: FC<AppointmentBlockProps> = ({ appointment }) => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-2 rounded-xl bg-[#E0F2FE] p-3 text-start shadow-sm">
      <div>
        <p className="font-bold text-[#0f172a]">{appointment.patientName}</p>
        <p className="mt-0.5 text-xs text-[#64748b]">
          {t('appointments.card.patientId', { id: appointment.patientCode })}
        </p>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <span className="inline-flex rounded-md bg-[#1D4ED8] px-2 py-1 text-xs font-semibold text-white">
          {appointment.procedureLabel}
        </span>
        <span className="text-xs font-medium text-[#3b82f6]">
          {t('appointments.card.durationMin', { count: appointment.durationMinutes })}
        </span>
      </div>
    </div>
  )
}
