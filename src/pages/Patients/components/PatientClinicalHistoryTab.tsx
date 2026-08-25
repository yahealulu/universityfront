import { Pencil, Plus } from 'lucide-react'
import type { FC, ReactNode } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { clinicalHistoryDiseaseOptions } from '@/mocks/data/patients.mock'
import type { ClinicalHistorySummary } from '@/types/patient.types'

import { ClinicalHistoryWizardModal } from './ClinicalHistoryWizardModal'

export type PatientClinicalHistoryTabProps = {
  patientId: string
  clinicalHistory: ClinicalHistorySummary | null
}

const SummaryField: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-primary">
    {children}
  </div>
)

export const PatientClinicalHistoryTab: FC<PatientClinicalHistoryTabProps> = ({
  patientId,
  clinicalHistory,
}) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const diseaseLabel = (id: string) => {
    const opt = clinicalHistoryDiseaseOptions.find((o) => o.id === id)
    return opt ? t(opt.labelKey) : id
  }

  const openWizard = () => setOpen(true)

  if (!clinicalHistory) {
    return (
      <>
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-border-card bg-surface p-8 shadow-sm">
          <Button type="button" className="w-full max-w-md gap-2 py-6 text-base" onClick={openWizard}>
            <Plus className="h-5 w-5" />
            {t('patients.clinicalHistory.addCta')}
          </Button>
        </div>
        <ClinicalHistoryWizardModal
          open={open}
          onOpenChange={setOpen}
          patientId={patientId}
          initial={null}
        />
      </>
    )
  }

  const displayOrDash = (value: string) =>
    value.trim() ? value : t('patients.clinicalHistory.notProvided')

  const diseasesInline =
    clinicalHistory.diseaseIds.length > 0
      ? clinicalHistory.diseaseIds
          .map((id, index) => `${index + 1}. ${diseaseLabel(id)}`)
          .join('   ')
      : null

  return (
    <>
      <div className="rounded-xl border border-border-card bg-surface p-6 shadow-sm">
        <div className="space-y-6 divide-y divide-border-card">
          <div className="pb-6">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-foreground">
                {t('patients.clinicalHistory.sectionDiseases')}
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1 border-primary text-primary hover:bg-primary/10"
                onClick={openWizard}
              >
                <Pencil className="h-4 w-4" />
                {t('patients.clinicalHistory.edit')}
              </Button>
            </div>
            {diseasesInline ? (
              <p className="text-sm text-muted-foreground">{diseasesInline}</p>
            ) : (
              <SummaryField>{t('patients.clinicalHistory.notProvided')}</SummaryField>
            )}
            {clinicalHistory.otherDiseases.trim() ? (
              <div className="mt-3">
                <p className="mb-1 text-xs font-semibold text-muted-foreground">
                  {t('patients.clinicalHistory.otherDiseases')}
                </p>
                <SummaryField>{clinicalHistory.otherDiseases}</SummaryField>
              </div>
            ) : null}
          </div>

          <div className="space-y-3 pb-6 pt-6">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-foreground">
                {t('patients.clinicalHistory.sectionMedicines')}
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1 border-primary text-primary hover:bg-primary/10"
                onClick={openWizard}
              >
                <Pencil className="h-4 w-4" />
                {t('patients.clinicalHistory.edit')}
              </Button>
            </div>
            <SummaryField>{displayOrDash(clinicalHistory.medicinesNote)}</SummaryField>
          </div>

          <div className="space-y-3 pb-6 pt-6">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-foreground">
                {t('patients.clinicalHistory.sectionAllergies')}
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1 border-primary text-primary hover:bg-primary/10"
                onClick={openWizard}
              >
                <Pencil className="h-4 w-4" />
                {t('patients.clinicalHistory.edit')}
              </Button>
            </div>
            <SummaryField>{displayOrDash(clinicalHistory.allergiesNote)}</SummaryField>
          </div>

          <div className="space-y-3 pb-6 pt-6">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-foreground">
                {t('patients.clinicalHistory.sectionSurgeries')}
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1 border-primary text-primary hover:bg-primary/10"
                onClick={openWizard}
              >
                <Pencil className="h-4 w-4" />
                {t('patients.clinicalHistory.edit')}
              </Button>
            </div>
            <SummaryField>{displayOrDash(clinicalHistory.surgeriesNote)}</SummaryField>
          </div>

          <div className="space-y-3 pt-6">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-foreground">
                {t('patients.clinicalHistory.sectionOthers')}
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1 border-primary text-primary hover:bg-primary/10"
                onClick={openWizard}
              >
                <Pencil className="h-4 w-4" />
                {t('patients.clinicalHistory.edit')}
              </Button>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <p>
                <span className="text-foreground">{t('patients.clinicalHistory.smokeShort')}: </span>
                <span className="font-semibold text-primary">{yn(clinicalHistory.smokes, t)}</span>
              </p>
              <p>
                <span className="text-foreground">{t('patients.clinicalHistory.alcoholShort')}: </span>
                <span className="font-semibold text-primary">{yn(clinicalHistory.drinksAlcohol, t)}</span>
              </p>
              <p>
                <span className="text-foreground">{t('patients.clinicalHistory.pregnantShort')}: </span>
                <span className="font-semibold text-primary">{yn(clinicalHistory.pregnant, t)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <ClinicalHistoryWizardModal
        open={open}
        onOpenChange={setOpen}
        patientId={patientId}
        initial={clinicalHistory}
      />
    </>
  )
}

const yn = (v: boolean | null, t: (k: string) => string) => {
  if (v === null) return t('patients.clinicalHistory.notProvided')
  return v ? t('patients.clinicalHistory.yes') : t('patients.clinicalHistory.no')
}
