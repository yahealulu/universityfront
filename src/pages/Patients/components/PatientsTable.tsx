import { Calendar, Pencil, Phone, Trash2 } from 'lucide-react'
import type { FC } from 'react'
import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { arSA, enUS } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import type { PatientListItem } from '@/types/patient.types'
import { formatPatientRecordLabel } from '@/utils/formatters'

export type PatientsTableProps = {
  rows: PatientListItem[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const formatListDate = (iso: string, localeCode: string): string => {
  const parsed = parseISO(iso)
  if (Number.isNaN(parsed.getTime())) return iso
  const loc = localeCode.startsWith('ar') ? arSA : enUS
  return format(parsed, 'P', { locale: loc })
}

export const PatientsTable: FC<PatientsTableProps> = ({ rows, onEdit, onDelete }) => {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language.startsWith('ar')

  const thClass = isArabic
    ? 'px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground'
    : 'px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-muted-foreground'

  const renderRow = (row: PatientListItem) => {
    const idCell = (
      <td key="id" className="px-4 py-3">
        <Link
          to={`/clinic/patients/${row.id}`}
          className="font-medium text-primary hover:underline"
          aria-label={t('patients.table.viewProfile')}
        >
          #{formatPatientRecordLabel(row.patientCode)}
        </Link>
      </td>
    )

    const nameCell = (
      <td key="name" className="px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-primary-navy">{row.name}</span>
          <span className="text-sm text-muted-foreground">
            {t(`patients.gender.${row.genderLabelKey}`)}
          </span>
        </div>
      </td>
    )

    const ageCell = (
      <td key="age" className="px-4 py-3 text-foreground">
        {row.ageYears}
      </td>
    )

    const phoneCell = (
      <td key="phone" className="px-4 py-3">
        <span className="inline-flex items-center gap-2 text-foreground">
          <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          {row.phone}
        </span>
      </td>
    )

    const lastCell = (
      <td key="last" className="px-4 py-3 text-muted-foreground">
        {formatListDate(row.lastVisit, i18n.language)}
      </td>
    )

    const nextCell = (
      <td key="next" className="px-4 py-3 font-semibold text-primary">
        {formatListDate(row.nextVisit, i18n.language)}
      </td>
    )

    const actionsCell = (
      <td key="actions" className={isArabic ? 'px-4 py-3 text-start' : 'px-4 py-3 text-end'}>
        <div className="inline-flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-primary" asChild>
            <Link
              to={`/clinic/patients/${row.id}`}
              aria-label={t('patients.table.openAppointments')}
            >
              <Calendar className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground"
            aria-label={t('patients.table.editPatient')}
            onClick={() => onEdit(row.id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-danger hover:text-danger"
            aria-label={t('patients.table.deletePatient')}
            onClick={() => onDelete(row.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    )

    const cellsLtr = [idCell, nameCell, ageCell, phoneCell, lastCell, nextCell, actionsCell]
    const cells = isArabic ? [...cellsLtr].reverse() : cellsLtr

    return (
      <tr key={row.id} className="hover:bg-muted/20">
        {cells}
      </tr>
    )
  }

  type HeaderKey =
    | 'patientId'
    | 'nameAndGender'
    | 'age'
    | 'phone'
    | 'lastVisit'
    | 'nextVisit'
    | 'actions'

  const headersLtr: { key: HeaderKey; label: string; alignEnd?: boolean }[] = [
    { key: 'patientId', label: t('patients.table.patientId') },
    { key: 'nameAndGender', label: t('patients.table.nameAndGender') },
    { key: 'age', label: t('patients.table.age') },
    { key: 'phone', label: t('patients.table.phone') },
    { key: 'lastVisit', label: t('patients.table.lastVisit') },
    { key: 'nextVisit', label: t('patients.table.nextVisit') },
    { key: 'actions', label: t('patients.table.actions'), alignEnd: true },
  ]

  const headers = isArabic ? [...headersLtr].reverse() : [...headersLtr]

  return (
    <div
      className="overflow-x-table rounded-xl border border-border-card bg-surface"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <table className="w-full min-w-[860px] text-sm">
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
        <tbody className="divide-y divide-border-card bg-surface">{rows.map(renderRow)}</tbody>
      </table>
    </div>
  )
}
