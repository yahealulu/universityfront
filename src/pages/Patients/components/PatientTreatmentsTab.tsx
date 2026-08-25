import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react'
import type { FC } from 'react'
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import type { PatientTreatment } from '@/types/patient.types'
import { formatInvoiceMoney, formatIsoDateLocale } from '@/utils/formatters'

import { NewStageModal } from './NewStageModal'

export type PatientTreatmentsTabProps = {
  patientId: string
  treatments: PatientTreatment[]
  locale: string
}

export const PatientTreatmentsTab: FC<PatientTreatmentsTabProps> = ({
  patientId,
  treatments,
  locale,
}) => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState<string | null>(treatments[0]?.id ?? null)
  const [stageOpen, setStageOpen] = useState(false)
  const [stageTreatmentId, setStageTreatmentId] = useState<string | null>(null)

  const toggle = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id))
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border-card bg-surface shadow-sm">
        <div className="overflow-x-table">
          <table className="w-full min-w-[960px] text-sm">
            <thead className="rounded-t-xl border-b border-border-card bg-muted/40">
              <tr>
                <th className="w-10 px-2" />
                <th className="px-4 py-3 text-start text-xs font-semibold text-muted-foreground">
                  {t('patients.treatments.columns.type')}
                </th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-muted-foreground">
                  {t('patients.treatments.columns.tooth')}
                </th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-muted-foreground">
                  {t('patients.treatments.columns.date')}
                </th>
                <th className="px-4 py-3 text-start text-xs font-semibold text-muted-foreground">
                  {t('patients.treatments.columns.notes')}
                </th>
                <th className="px-4 py-3 text-end text-xs font-semibold text-muted-foreground">
                  {t('patients.treatments.columns.price')}
                </th>
                <th className="px-4 py-3 text-end text-xs font-semibold text-muted-foreground">
                  {t('patients.treatments.columns.paid')}
                </th>
                <th className="px-4 py-3 text-end text-xs font-semibold text-muted-foreground">
                  {t('patients.treatments.columns.remaining')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-card">
              {treatments.map((tr) => {
                const isOpen = expanded === tr.id
                return (
                  <Fragment key={tr.id}>
                    <tr className="cursor-pointer bg-surface hover:bg-muted/10" onClick={() => toggle(tr.id)}>
                      <td className="px-2 py-3">
                        <button
                          type="button"
                          className="rounded-md p-1 hover:bg-muted"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggle(tr.id)
                          }}
                          aria-label={t('patients.treatments.expand')}
                        >
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4 text-primary" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-primary">{tr.treatmentType}</p>
                        <p className="text-xs text-muted-foreground">{tr.category}</p>
                      </td>
                      <td className="px-4 py-3 text-foreground">{tr.toothLabel}</td>
                      <td className="px-4 py-3 text-foreground">
                        {formatIsoDateLocale(tr.date, locale)}
                      </td>
                      <td className="max-w-xs px-4 py-3 text-muted-foreground">{tr.notes}</td>
                      <td className="px-4 py-3 text-end font-semibold text-primary">
                        {formatInvoiceMoney(tr.price)}
                      </td>
                      <td className="px-4 py-3 text-end font-semibold text-foreground">
                        {formatInvoiceMoney(tr.paid)}
                      </td>
                      <td className="px-4 py-3 text-end font-semibold text-danger">
                        {formatInvoiceMoney(tr.remaining)}
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="bg-muted/10">
                        <td colSpan={8} className="px-4 py-4">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-bold text-foreground">{t('patients.treatments.stagesTitle')}</p>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="gap-1 border-primary bg-primary/10 text-primary hover:bg-primary/15"
                              onClick={(e) => {
                                e.stopPropagation()
                                setStageTreatmentId(tr.id)
                                setStageOpen(true)
                              }}
                            >
                              <Plus className="h-4 w-4" />
                              {t('patients.treatments.newStage')}
                            </Button>
                          </div>
                          <ul className="mt-4 space-y-3">
                            {tr.stages.map((st) => (
                              <li
                                key={st.id}
                                className="flex flex-col gap-3 rounded-lg border border-border-card bg-muted/20 p-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                              >
                                <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-start sm:gap-4">
                                  <p className="shrink-0 text-xs text-muted-foreground sm:pt-0.5">
                                    {formatIsoDateLocale(st.date, locale)}
                                  </p>
                                  <p className="shrink-0 text-sm font-semibold text-primary sm:w-24">
                                    {t('patients.treatments.stageLabel', { n: st.stageNumber })}
                                  </p>
                                  <p className="min-w-0 flex-1 text-sm text-muted-foreground">{st.description}</p>
                                </div>
                                <div className="flex shrink-0 justify-end gap-2 sm:pt-0">
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    aria-label={t('patients.treatments.edit')}
                                  >
                                    <Pencil className="h-4 w-4 text-primary" />
                                  </Button>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    aria-label={t('patients.treatments.delete')}
                                  >
                                    <Trash2 className="h-4 w-4 text-danger" />
                                  </Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
        {treatments.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            {t('patients.treatments.empty')}
          </div>
        )}
      </div>

      <NewStageModal
        open={stageOpen}
        onOpenChange={setStageOpen}
        patientId={patientId}
        treatmentId={stageTreatmentId}
      />
    </div>
  )
}
