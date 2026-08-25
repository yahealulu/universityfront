import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { usePutClinicalHistory } from '@/hooks/patients/usePatientMutations'
import { cn } from '@/lib/utils'
import { clinicalHistoryDiseaseOptions } from '@/mocks/data/patients.mock'
import type { ClinicalHistorySummary } from '@/types/patient.types'

import { YesNoTiles } from './YesNoTiles'

const emptySummary = (): ClinicalHistorySummary => ({
  diseaseIds: [],
  otherDiseases: '',
  takesMedicinesRegularly: null,
  medicinesNote: '',
  hasDrugAllergies: null,
  allergiesNote: '',
  hadPreviousSurgery: null,
  surgeriesNote: '',
  pregnant: null,
  smokes: null,
  drinksAlcohol: null,
})

const MAX_STEP = 4

export type ClinicalHistoryWizardModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId: string
  initial: ClinicalHistorySummary | null
}

export const ClinicalHistoryWizardModal: FC<ClinicalHistoryWizardModalProps> = ({
  open,
  onOpenChange,
  patientId,
  initial,
}) => {
  const { t } = useTranslation()
  const put = usePutClinicalHistory(patientId)
  const [step, setStep] = useState(0)
  const [data, setData] = useState<ClinicalHistorySummary>(emptySummary())

  useEffect(() => {
    if (!open) return
    setStep(0)
    setData(initial ? { ...initial } : emptySummary())
  }, [open, initial])

  const toggleDisease = (id: string) => {
    setData((prev) => {
      const has = prev.diseaseIds.includes(id)
      return {
        ...prev,
        diseaseIds: has ? prev.diseaseIds.filter((x) => x !== id) : [...prev.diseaseIds, id],
      }
    })
  }

  const handleSave = async () => {
    await put.mutateAsync(data)
    onOpenChange(false)
  }

  const charCount = (len: number) => t('patients.clinicalHistory.charCount', { current: len, max: 100 })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'max-h-[92vh] overflow-y-auto sm:rounded-2xl',
          step === 0 ? 'max-w-2xl' : 'max-w-lg'
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-start text-lg font-bold text-primary-navy">
            {t('patients.clinicalHistory.wizardTitle')}
          </DialogTitle>
        </DialogHeader>

        {step === 0 && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-foreground">
              {t('patients.clinicalHistory.diseasesQuestion')}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {clinicalHistoryDiseaseOptions.map((d) => (
                <label
                  key={d.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-border-card bg-muted/20 px-4 py-3 text-sm shadow-sm"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 shrink-0 rounded border-input"
                    checked={data.diseaseIds.includes(d.id)}
                    onChange={() => toggleDisease(d.id)}
                  />
                  <span>{t(d.labelKey)}</span>
                </label>
              ))}
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground" htmlFor="clinical-other-diseases">
                {t('patients.clinicalHistory.otherDiseases')}
              </label>
              <Textarea
                id="clinical-other-diseases"
                className="mt-2"
                rows={3}
                maxLength={100}
                placeholder={t('patients.clinicalHistory.placeholders.otherDiseases')}
                value={data.otherDiseases}
                onChange={(e) => setData((p) => ({ ...p, otherDiseases: e.target.value }))}
              />
              <p className="mt-1 text-end text-xs text-muted-foreground">{charCount(data.otherDiseases.length)}</p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-foreground">{t('patients.clinicalHistory.medicinesQuestion')}</p>
            <YesNoTiles
              value={data.takesMedicinesRegularly}
              onChange={(v) =>
                setData((p) => ({
                  ...p,
                  takesMedicinesRegularly: v,
                  medicinesNote: v ? p.medicinesNote : '',
                }))
              }
            />
            {data.takesMedicinesRegularly === true ? (
              <div>
                <label className="text-sm font-semibold text-foreground" htmlFor="clinical-medicines-note">
                  {t('patients.clinicalHistory.medicinesLabel')}
                </label>
                <Textarea
                  id="clinical-medicines-note"
                  className="mt-2"
                  rows={3}
                  maxLength={100}
                  placeholder={t('patients.clinicalHistory.placeholders.medicines')}
                  value={data.medicinesNote}
                  onChange={(e) => setData((p) => ({ ...p, medicinesNote: e.target.value }))}
                />
                <p className="mt-1 text-end text-xs text-muted-foreground">{charCount(data.medicinesNote.length)}</p>
              </div>
            ) : null}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-foreground">{t('patients.clinicalHistory.allergiesQuestion')}</p>
            <YesNoTiles
              value={data.hasDrugAllergies}
              onChange={(v) =>
                setData((p) => ({
                  ...p,
                  hasDrugAllergies: v,
                  allergiesNote: v ? p.allergiesNote : '',
                }))
              }
            />
            {data.hasDrugAllergies === true ? (
              <div>
                <label className="text-sm font-semibold text-foreground" htmlFor="clinical-allergies-note">
                  {t('patients.clinicalHistory.allergiesLabel')}
                </label>
                <Textarea
                  id="clinical-allergies-note"
                  className="mt-2"
                  rows={3}
                  maxLength={100}
                  placeholder={t('patients.clinicalHistory.placeholders.allergies')}
                  value={data.allergiesNote}
                  onChange={(e) => setData((p) => ({ ...p, allergiesNote: e.target.value }))}
                />
                <p className="mt-1 text-end text-xs text-muted-foreground">{charCount(data.allergiesNote.length)}</p>
              </div>
            ) : null}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-foreground">{t('patients.clinicalHistory.surgeryQuestion')}</p>
            <YesNoTiles
              value={data.hadPreviousSurgery}
              onChange={(v) =>
                setData((p) => ({
                  ...p,
                  hadPreviousSurgery: v,
                  surgeriesNote: v ? p.surgeriesNote : '',
                }))
              }
            />
            {data.hadPreviousSurgery === true ? (
              <div>
                <label className="text-sm font-semibold text-foreground" htmlFor="clinical-surgeries-note">
                  {t('patients.clinicalHistory.surgeriesLabel')}
                </label>
                <Textarea
                  id="clinical-surgeries-note"
                  className="mt-2"
                  rows={3}
                  maxLength={100}
                  placeholder={t('patients.clinicalHistory.placeholders.surgeries')}
                  value={data.surgeriesNote}
                  onChange={(e) => setData((p) => ({ ...p, surgeriesNote: e.target.value }))}
                />
                <p className="mt-1 text-end text-xs text-muted-foreground">{charCount(data.surgeriesNote.length)}</p>
              </div>
            ) : null}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">{t('patients.clinicalHistory.pregnantQuestion')}</p>
              <YesNoTiles value={data.pregnant} onChange={(v) => setData((p) => ({ ...p, pregnant: v }))} />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">{t('patients.clinicalHistory.smokeQuestion')}</p>
              <YesNoTiles value={data.smokes} onChange={(v) => setData((p) => ({ ...p, smokes: v }))} />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">{t('patients.clinicalHistory.alcoholQuestion')}</p>
              <YesNoTiles
                value={data.drinksAlcohol}
                onChange={(v) => setData((p) => ({ ...p, drinksAlcohol: v }))}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => (step === 0 ? onOpenChange(false) : setStep((s) => s - 1))}
          >
            {step === 0 ? t('patients.clinicalHistory.cancel') : t('patients.clinicalHistory.back')}
          </Button>
          {step < MAX_STEP ? (
            <Button type="button" onClick={() => setStep((s) => Math.min(MAX_STEP, s + 1))}>
              {t('patients.clinicalHistory.next')}
            </Button>
          ) : (
            <Button type="button" onClick={() => void handleSave()} disabled={put.isPending}>
              {put.isPending ? t('patients.clinicalHistory.saving') : t('patients.clinicalHistory.save')}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
