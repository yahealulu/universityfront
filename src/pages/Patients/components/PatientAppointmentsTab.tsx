import { Pencil, Trash2 } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useDeletePatientAppointment } from '@/hooks/patients/usePatientMutations'
import type { PatientAppointmentRow } from '@/types/patient.types'
import { formatIsoDateLocale, formatTime24hTo12hLocale } from '@/utils/formatters'

export type PatientAppointmentsTabProps = {
  patientId: string
  rows: PatientAppointmentRow[]
}

export const PatientAppointmentsTab: FC<PatientAppointmentsTabProps> = ({ patientId, rows }) => {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language.startsWith('ar')
  const deleteAppointment = useDeletePatientAppointment(patientId)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const thClass = isArabic
    ? 'px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground'
    : 'px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-muted-foreground'

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return
    try {
      await deleteAppointment.mutateAsync(pendingDeleteId)
      setPendingDeleteId(null)
    } catch {
      /* surfaced via mutation state */
    }
  }

  const renderRow = (row: PatientAppointmentRow) => {
    const dateDisplay = formatIsoDateLocale(row.date, i18n.language)
    const timeDisplay = formatTime24hTo12hLocale(row.time, i18n.language)

    const doctorCell = (
      <td key="doc" className="px-4 py-3">
        <p className="font-bold text-foreground">{row.doctorName}</p>
        <p className="text-sm text-muted-foreground">{row.doctorSpecialization}</p>
      </td>
    )

    const treatmentCell = (
      <td key="tr" className="px-4 py-3">
        <p className="font-bold text-foreground">{row.treatmentType}</p>
        <p className="text-sm text-muted-foreground">{row.treatmentCategory}</p>
      </td>
    )

    const dateCell = (
      <td key="dt" className="px-4 py-3 text-foreground">
        {dateDisplay}
      </td>
    )

    const timeCell = (
      <td key="tm" className="px-4 py-3 text-foreground">
        {timeDisplay}
      </td>
    )

    const actionsCell = (
      <td key="act" className={isArabic ? 'px-4 py-3 text-start' : 'px-4 py-3 text-end'}>
        <div className="inline-flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-primary"
            disabled
            title={t('patients.appointments.editNotAvailable')}
            aria-label={t('patients.appointments.editAppointment')}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-danger hover:text-danger"
            aria-label={t('patients.appointments.deleteAppointment')}
            onClick={() => setPendingDeleteId(row.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    )

    const cellsLtr = [doctorCell, treatmentCell, dateCell, timeCell, actionsCell]
    const cells = isArabic ? [...cellsLtr].reverse() : cellsLtr

    return (
      <tr key={row.id} className="hover:bg-muted/20">
        {cells}
      </tr>
    )
  }

  const headersLtr = [
    { key: 'doctor', label: t('patients.appointments.columns.doctor') },
    { key: 'treatment', label: t('patients.appointments.columns.treatment') },
    { key: 'date', label: t('patients.appointments.columns.date') },
    { key: 'time', label: t('patients.appointments.columns.time') },
    { key: 'actions', label: t('patients.appointments.columns.actions'), alignEnd: true },
  ] as { key: string; label: string; alignEnd?: boolean }[]

  const headers = isArabic ? [...headersLtr].reverse() : headersLtr

  return (
    <>
      {rows.length === 0 ? (
        <div className="rounded-xl border border-border-card bg-surface py-12 text-center text-sm text-muted-foreground">
          {t('patients.appointments.empty')}
        </div>
      ) : (
        <div
          className="overflow-x-table rounded-xl border border-border-card bg-surface"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-border-card bg-muted/40">
              <tr>
                {headers.map((h) => (
                  <th
                    key={h.key}
                    className={
                      h.alignEnd && !isArabic
                        ? `${thClass} text-end`
                        : h.alignEnd && isArabic
                          ? `${thClass} text-start`
                          : thClass
                    }
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-card">{rows.map((row) => renderRow(row))}</tbody>
          </table>
        </div>
      )}

      <Dialog
        open={pendingDeleteId !== null}
        onOpenChange={(o) => {
          if (!o) {
            setPendingDeleteId(null)
            deleteAppointment.reset()
          }
        }}
      >
        <DialogContent className="sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t('patients.appointments.deleteConfirmTitle')}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{t('patients.appointments.deleteConfirmDescription')}</p>
          {deleteAppointment.isError && (
            <p className="text-sm text-danger" role="alert">
              {t('patients.appointments.deleteError')}
            </p>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={deleteAppointment.isPending}
              onClick={() => setPendingDeleteId(null)}
            >
              {t('patients.appointments.deleteConfirmCancel')}
            </Button>
            <Button
              type="button"
              className="bg-danger text-white hover:opacity-90"
              disabled={deleteAppointment.isPending}
              onClick={() => void handleConfirmDelete()}
            >
              {deleteAppointment.isPending
                ? t('patients.appointments.deleteConfirmLoading')
                : t('patients.appointments.deleteConfirmAction')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
