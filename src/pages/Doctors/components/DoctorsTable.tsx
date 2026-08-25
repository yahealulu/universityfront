import { Pencil, Phone, Trash2 } from 'lucide-react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import type { DoctorListItem } from '@/types/doctor.types'
import { formatInvoiceMoney } from '@/utils/formatters'

export type DoctorsTableProps = {
  doctors: DoctorListItem[]
  onEdit: (row: DoctorListItem) => void
  onDelete: (row: DoctorListItem) => void
}

export const DoctorsTable: FC<DoctorsTableProps> = ({ doctors, onEdit, onDelete }) => {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language.startsWith('ar')
  const navigate = useNavigate()

  return (
    <div className="overflow-x-table rounded-xl border border-border-card" dir={isArabic ? 'rtl' : 'ltr'}>
      <table className="w-full min-w-[1024px] border-collapse text-sm">
        <thead>
          {isArabic ? (
            <tr className="bg-[#e0f2fe]">
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('doctors.table.actions')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('doctors.table.outstanding')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('doctors.table.revenue')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('doctors.table.treatments')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('doctors.table.phone')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('doctors.table.doctor')}</th>
            </tr>
          ) : (
            <tr className="bg-[#e0f2fe]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('doctors.table.doctor')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('doctors.table.phone')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('doctors.table.treatments')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('doctors.table.revenue')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('doctors.table.outstanding')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('doctors.table.actions')}</th>
            </tr>
          )}
        </thead>
        <tbody className="divide-y divide-border-card bg-surface">
          {doctors.map((row) => (
            isArabic ? (
              <tr key={row.id} className="hover:bg-page/80">
                <td className="px-4 py-3 text-start">
                  <div className="flex items-center justify-start gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary"
                      aria-label={t('doctors.table.editAria')}
                      onClick={() => onEdit(row)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-danger"
                      aria-label={t('doctors.table.deleteAria')}
                      onClick={() => onDelete(row)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-primary">{formatInvoiceMoney(row.outstandingThisMonth)}</p>
                  <p className="text-xs text-muted-foreground">{t('doctors.table.thisMonth')}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-success">{formatInvoiceMoney(row.revenueThisMonth)}</p>
                  <p className="text-xs text-muted-foreground">{t('doctors.table.thisMonth')}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-foreground">{row.treatmentsThisMonth}</p>
                  <p className="text-xs text-muted-foreground">{t('doctors.table.thisMonth')}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                    {row.phone}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="text-start"
                    onClick={() => navigate(`/clinic/doctors/${row.id}`)}
                  >
                    <p className="font-bold text-foreground hover:text-primary">{row.name}</p>
                    <p className="text-xs text-muted-foreground">{row.specialization}</p>
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={row.id} className="hover:bg-page/80">
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="text-start"
                    onClick={() => navigate(`/clinic/doctors/${row.id}`)}
                  >
                    <p className="font-bold text-foreground hover:text-primary">{row.name}</p>
                    <p className="text-xs text-muted-foreground">{row.specialization}</p>
                  </button>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                    {row.phone}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-foreground">{row.treatmentsThisMonth}</p>
                  <p className="text-xs text-muted-foreground">{t('doctors.table.thisMonth')}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-success">{formatInvoiceMoney(row.revenueThisMonth)}</p>
                  <p className="text-xs text-muted-foreground">{t('doctors.table.thisMonth')}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-primary">{formatInvoiceMoney(row.outstandingThisMonth)}</p>
                  <p className="text-xs text-muted-foreground">{t('doctors.table.thisMonth')}</p>
                </td>
                <td className="px-4 py-3 text-end">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary"
                      aria-label={t('doctors.table.editAria')}
                      onClick={() => onEdit(row)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-danger"
                      aria-label={t('doctors.table.deleteAria')}
                      onClick={() => onDelete(row)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  )
}
