import { MapPin, Pencil, Phone, Trash2 } from 'lucide-react'
import type { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import type { Lab } from '@/types/lab.types'

export type LabsTableProps = {
  labs: Lab[]
  onEdit: (lab: Lab) => void
  onDelete: (lab: Lab) => void
}

export const LabsTable: FC<LabsTableProps> = ({ labs, onEdit, onDelete }) => {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language.startsWith('ar')
  const navigate = useNavigate()

  const goToLabRequests = (labId: string) => {
    navigate(`/clinic/lab-requests?labId=${encodeURIComponent(labId)}`)
  }

  return (
    <div className="overflow-x-table rounded-xl border border-border-card" dir={isArabic ? 'rtl' : 'ltr'}>
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          {isArabic ? (
            <tr className="bg-[#e0f2fe]">
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labs.table.actions')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labs.table.activeRequests')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labs.table.totalRequests')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labs.table.phone')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labs.table.lab')}</th>
            </tr>
          ) : (
            <tr className="bg-[#e0f2fe]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labs.table.lab')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labs.table.phone')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labs.table.totalRequests')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labs.table.activeRequests')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('labs.table.actions')}</th>
            </tr>
          )}
        </thead>
        <tbody className="divide-y divide-border-card bg-surface">
          {labs.map((lab) => (
            isArabic ? (
              <tr key={lab.id} className="hover:bg-page/80">
                <td className="px-4 py-3 text-start">
                  <div className="flex items-center justify-start gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary"
                      aria-label={t('labs.table.editAria')}
                      onClick={() => onEdit(lab)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-danger"
                      aria-label={t('labs.table.deleteAria')}
                      onClick={() => onDelete(lab)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="font-semibold text-success underline-offset-2 hover:underline"
                    onClick={() => goToLabRequests(lab.id)}
                  >
                    <Trans
                      i18nKey="labs.table.requestsCountActive"
                      count={lab.activeRequests}
                      values={{ count: lab.activeRequests }}
                    />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="font-semibold text-primary underline-offset-2 hover:underline"
                    onClick={() => goToLabRequests(lab.id)}
                  >
                    <Trans
                      i18nKey="labs.table.requestsCountTotal"
                      count={lab.totalRequests}
                      values={{ count: lab.totalRequests }}
                    />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                    {lab.phone}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="font-bold text-foreground">{lab.name}</p>
                  <p className="mt-0.5 flex items-start gap-1 text-xs text-muted-foreground">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span>{lab.address}</span>
                  </p>
                </td>
              </tr>
            ) : (
              <tr key={lab.id} className="hover:bg-page/80">
                <td className="px-4 py-3">
                  <p className="font-bold text-foreground">{lab.name}</p>
                  <p className="mt-0.5 flex items-start gap-1 text-xs text-muted-foreground">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span>{lab.address}</span>
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                    {lab.phone}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="font-semibold text-primary underline-offset-2 hover:underline"
                    onClick={() => goToLabRequests(lab.id)}
                  >
                    <Trans
                      i18nKey="labs.table.requestsCountTotal"
                      count={lab.totalRequests}
                      values={{ count: lab.totalRequests }}
                    />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="font-semibold text-success underline-offset-2 hover:underline"
                    onClick={() => goToLabRequests(lab.id)}
                  >
                    <Trans
                      i18nKey="labs.table.requestsCountActive"
                      count={lab.activeRequests}
                      values={{ count: lab.activeRequests }}
                    />
                  </button>
                </td>
                <td className="px-4 py-3 text-end">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary"
                      aria-label={t('labs.table.editAria')}
                      onClick={() => onEdit(lab)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-danger"
                      aria-label={t('labs.table.deleteAria')}
                      onClick={() => onDelete(lab)}
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
