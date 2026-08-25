import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { usePatchDentalChart } from '@/hooks/patients/usePatientMutations'
import { cn } from '@/lib/utils'
import type { DentalChartState, PatientTreatment } from '@/types/patient.types'

import { ADULT_QUADRANTS, CHILD_QUADRANTS } from './dentalChart.constants'
import { DENTAL_LEGEND_ORDER, statusSurfaceClass, toothShapeClass } from './dentalStatus.styles'
import { ToothDetailModal } from './ToothDetailModal'

const modeSegmentClass = (active: boolean): string =>
  cn(
    'rounded-lg px-4 py-2 text-sm font-semibold transition-all',
    active
      ? 'bg-surface text-primary shadow-sm'
      : 'text-muted-foreground hover:text-foreground'
  )

const renderLegendList = (
  t: (key: string) => string,
  legendCardClassName: string
) => (
  <div className={legendCardClassName}>
    <p className="mb-3 text-sm font-semibold text-foreground">{t('patients.dental.legendTitle')}</p>
    <ul className="flex flex-wrap gap-x-6 gap-y-2">
      {DENTAL_LEGEND_ORDER.map((key) => (
        <li key={key} className="flex items-center gap-2">
          <span
            className={cn('h-4 w-4 shrink-0 rounded-sm border-2', statusSurfaceClass(key))}
            aria-hidden
          />
          <span className="text-sm text-foreground">{t(`patients.dental.status.${key}`)}</span>
        </li>
      ))}
    </ul>
  </div>
)

export type PatientDentalChartTabProps = {
  patientId: string
  dentalChart: DentalChartState
  treatments: PatientTreatment[]
}

export const PatientDentalChartTab: FC<PatientDentalChartTabProps> = ({
  patientId,
  dentalChart,
  treatments,
}) => {
  const { t } = useTranslation()
  const patch = usePatchDentalChart(patientId)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTooth, setActiveTooth] = useState<string | null>(null)

  const handleMode = async (mode: DentalChartState['mode']) => {
    await patch.mutateAsync({ mode })
  }

  const openTooth = (id: string) => {
    setActiveTooth(id)
    setModalOpen(true)
  }

  const renderAdultArch = (quadrantStartIndex: 0 | 2) => (
    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
      {[0, 1].map((offset) => {
        const row = ADULT_QUADRANTS[quadrantStartIndex + offset]
        if (!row) return null
        return (
          <div key={offset} className="flex justify-center gap-1.5">
            {row.map((n) => {
              const id = String(n)
              const st = dentalChart.teeth[id] ?? 'natural'
              return (
                <button
                  key={id}
                  type="button"
                  className="flex flex-col items-center gap-1 rounded-md p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-label={t('patients.dental.toothTitle', { id })}
                  onClick={() => openTooth(id)}
                >
                  <span className={toothShapeClass(st, activeTooth === id)} aria-hidden />
                  <span className="text-xs font-semibold text-foreground">{id}</span>
                </button>
              )
            })}
          </div>
        )
      })}
    </div>
  )

  const renderChildArch = (quadrantStartIndex: 0 | 2) => (
    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
      {[0, 1].map((offset) => {
        const row = CHILD_QUADRANTS[quadrantStartIndex + offset]
        if (!row) return null
        return (
          <div key={offset} className="flex justify-center gap-1.5">
            {row.map((n) => {
              const id = String(n)
              const st = dentalChart.teeth[id] ?? 'natural'
              return (
                <button
                  key={id}
                  type="button"
                  className="flex flex-col items-center gap-1 rounded-md p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-label={t('patients.dental.toothTitle', { id })}
                  onClick={() => openTooth(id)}
                >
                  <span className={toothShapeClass(st, activeTooth === id)} aria-hidden />
                  <span className="text-xs font-semibold text-foreground">{id}</span>
                </button>
              )
            })}
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-primary-navy">{t('patients.dental.title')}</h2>
        <div
          className="inline-flex gap-1 rounded-xl bg-muted/40 p-1"
          role="group"
          aria-label={t('patients.dental.modeLabel')}
        >
          <button
            type="button"
            className={modeSegmentClass(dentalChart.mode === 'adult')}
            disabled={patch.isPending}
            onClick={() => void handleMode('adult')}
          >
            {t('patients.dental.modeAdult')}
          </button>
          <button
            type="button"
            className={modeSegmentClass(dentalChart.mode === 'child')}
            disabled={patch.isPending}
            onClick={() => void handleMode('child')}
          >
            {t('patients.dental.modeChild')}
          </button>
        </div>
      </div>

      {dentalChart.mode === 'adult' && (
        <div className="space-y-4" dir="ltr">
          <div className="rounded-xl border border-border-card bg-surface p-4 shadow-sm md:p-6">
            <p className="mb-4 text-sm font-semibold text-primary">{t('patients.dental.upperJaw')}</p>
            {renderAdultArch(0)}
          </div>
          <div className="rounded-xl border border-border-card bg-surface p-4 shadow-sm md:p-6">
            <p className="mb-4 text-sm font-semibold text-primary">{t('patients.dental.lowerJaw')}</p>
            {renderAdultArch(2)}
          </div>

          {renderLegendList(
            t,
            'rounded-xl border border-border-card bg-surface p-4 shadow-sm md:p-6'
          )}
        </div>
      )}

      {dentalChart.mode === 'child' && (
        <div className="space-y-4" dir="ltr">
          <div className="rounded-xl border border-border-card bg-surface p-4 shadow-sm md:p-6">
            <p className="mb-4 text-sm font-semibold text-primary">{t('patients.dental.upperJaw')}</p>
            {renderChildArch(0)}
          </div>
          <div className="rounded-xl border border-border-card bg-surface p-4 shadow-sm md:p-6">
            <p className="mb-4 text-sm font-semibold text-primary">{t('patients.dental.lowerJaw')}</p>
            {renderChildArch(2)}
          </div>

          {renderLegendList(
            t,
            'rounded-xl border border-border-card bg-muted/30 p-4 shadow-sm md:p-6'
          )}
        </div>
      )}

      <ToothDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        patientId={patientId}
        toothId={activeTooth}
        treatments={treatments}
        currentStatus={
          activeTooth ? (dentalChart.teeth[activeTooth] ?? 'natural') : 'natural'
        }
      />
    </div>
  )
}
