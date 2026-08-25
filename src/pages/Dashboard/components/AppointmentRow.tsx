import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import type { TodayAppointment } from '@/types/dashboard.types'

export type AppointmentRowProps = {
  appointment: TodayAppointment
}

export const AppointmentRow: FC<AppointmentRowProps> = ({ appointment }) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border-card bg-surface px-4 py-3 transition-colors hover:border-primary/30 hover:bg-page">
      <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-white">
        {appointment.time}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-foreground">{appointment.patientName}</p>
        <p className="text-sm text-muted-foreground">
          {t('dashboard.appointments.patientId', { id: appointment.patientId })}
        </p>
      </div>
      <p className="shrink-0 text-sm font-medium text-primary">{appointment.doctorName}</p>
    </div>
  )
}
