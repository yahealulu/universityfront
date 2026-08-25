import { zodResolver } from '@hookform/resolvers/zod'
import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { usePatchDentalChart } from '@/hooks/patients/usePatientMutations'
import type { PatientTreatment, ToothStatusKey } from '@/types/patient.types'

import { ToothModalLegend } from './ToothModalLegend'
import { ToothSurfaceSvg } from './ToothSurfaceSvg'
import { TOOTH_SURFACE_IDS, type ToothSurfaceId } from './toothSurfaces.constants'
import {
  ToothTreatmentFormFields,
  type ToothTreatmentDraftValues,
} from './ToothTreatmentFormFields'
import { ToothTreatmentHistoryTable } from './ToothTreatmentHistoryTable'

const NONE = '__none__'

const numericOptional = (message: string) =>
  z.string().refine((s) => !s.trim() || /^[0-9]+(\.[0-9]{0,2})?$/.test(s.trim()), { message })

const buildTreatmentDraftSchema = (t: TFunction) =>
  z.object({
    category: z.string(),
    treatmentType: z.string(),
    price: numericOptional(t('patients.dental.validationNumericOptional')),
    paid: numericOptional(t('patients.dental.validationNumericOptional')),
    notes: z.string().max(100, t('patients.dental.notesMax')),
  })

const ToothOutlineIcon: FC = () => (
  <svg className="h-7 w-5 shrink-0 text-primary" viewBox="0 0 24 36" aria-hidden>
    <rect x="2" y="2" width="20" height="32" rx="6" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const treatmentMatchesTooth = (
  tr: PatientTreatment,
  toothId: string,
  localizedTitle: string
): boolean => {
  if (tr.toothFdiId != null && tr.toothFdiId === toothId) return true
  if (tr.toothLabel === localizedTitle) return true
  return tr.toothLabel === `Tooth ${toothId}`
}

export type ToothDetailModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId: string
  toothId: string | null
  treatments: PatientTreatment[]
  currentStatus: ToothStatusKey
}

export const ToothDetailModal: FC<ToothDetailModalProps> = ({
  open,
  onOpenChange,
  patientId,
  toothId,
  treatments,
  currentStatus,
}) => {
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const patch = usePatchDentalChart(patientId)
  const [step, setStep] = useState<'history' | 'form'>('history')
  const [showSaveCtaOnHistory, setShowSaveCtaOnHistory] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<ToothStatusKey>(currentStatus)
  const [surfaces, setSurfaces] = useState<Partial<Record<ToothSurfaceId, boolean>>>({})
  const [selectAll, setSelectAll] = useState(false)
  const [canals, setCanals] = useState<{ name: string; length: string }[]>([{ name: '', length: '' }])

  const schema = useMemo(() => buildTreatmentDraftSchema(t), [t])
  const treatmentForm = useForm<ToothTreatmentDraftValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: NONE,
      treatmentType: NONE,
      price: '',
      paid: '',
      notes: '',
    },
  })

  const title = useMemo(
    () => (toothId ? t('patients.dental.toothTitle', { id: toothId }) : ''),
    [t, toothId]
  )

  const filteredTreatments = useMemo(() => {
    if (!toothId) return []
    const localized = t('patients.dental.toothTitle', { id: toothId })
    return treatments.filter((tr) => treatmentMatchesTooth(tr, toothId, localized))
  }, [treatments, toothId, t])

  useEffect(() => {
    if (!open) return
    setStep('history')
    setShowSaveCtaOnHistory(false)
    setSelectedStatus(currentStatus)
    setSurfaces({})
    setSelectAll(false)
    setCanals([{ name: '', length: '' }])
    treatmentForm.reset({
      category: NONE,
      treatmentType: NONE,
      price: '',
      paid: '',
      notes: '',
    })
  }, [open, currentStatus, treatmentForm])

  const toggleSurface = (id: ToothSurfaceId) => {
    setSurfaces((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      const allOn = TOOTH_SURFACE_IDS.every((s) => next[s])
      setSelectAll(allOn)
      return next
    })
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      const next: Partial<Record<ToothSurfaceId, boolean>> = {}
      for (const s of TOOTH_SURFACE_IDS) next[s] = true
      setSurfaces(next)
    } else {
      setSurfaces({})
    }
  }

  const toNumber = (v: string): number => {
    const n = Number(v.trim())
    return Number.isFinite(n) ? n : 0
  }

  const handleSaveTreatment = treatmentForm.handleSubmit(async (values) => {
    if (!toothId) return
    await patch.mutateAsync({
      teeth: { [toothId]: selectedStatus },
      treatmentDraft: {
        toothId,
        category: values.category === NONE ? '' : values.category,
        treatmentType: values.treatmentType === NONE ? '' : values.treatmentType,
        notes: values.notes,
        price: toNumber(values.price),
        paid: toNumber(values.paid),
      },
    })
    setStep('history')
    setShowSaveCtaOnHistory(true)
    treatmentForm.reset({
      category: NONE,
      treatmentType: NONE,
      price: '',
      paid: '',
      notes: '',
    })
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(90dvh,calc(100vh-2rem))] w-[min(100vw-1rem,64rem)] max-w-5xl overflow-y-auto p-4 sm:p-6 sm:rounded-2xl">
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0">
          <ToothOutlineIcon />
          <DialogTitle className="text-start text-lg font-bold text-primary-navy">{title}</DialogTitle>
        </DialogHeader>

        {!toothId ? null : step === 'history' ? (
          <div className="space-y-6">
            <ToothTreatmentHistoryTable rows={filteredTreatments} locale={locale} />
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('patients.dental.modalHistoryBack')}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (showSaveCtaOnHistory) {
                    onOpenChange(false)
                    return
                  }
                  setStep('form')
                }}
              >
                {showSaveCtaOnHistory ? t('patients.dental.save') : t('patients.dental.addTreatment')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <ToothModalLegend selectedStatus={selectedStatus} onSelectStatus={setSelectedStatus} />

            <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
              <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t('patients.dental.choosePart')}</p>
                    <p className="text-xs text-muted-foreground">{t('patients.dental.choosePartHint')}</p>
                  </div>
                  <label className="flex shrink-0 items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 rounded border-input"
                    />
                    {t('patients.dental.selectAll')}
                  </label>
                </div>
                <ToothSurfaceSvg surfaces={surfaces} onToggle={toggleSurface} />
              </div>

              <ToothTreatmentFormFields form={treatmentForm} />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-bold text-foreground">{t('patients.dental.canalsTitle')}</h3>
              <div className="space-y-2">
                {canals.map((c, i) => (
                  <div key={i} className="grid gap-2 sm:grid-cols-2">
                    <Input
                      placeholder={t('patients.dental.canalName')}
                      value={c.name}
                      onChange={(e) => {
                        const next = [...canals]
                        next[i] = { ...next[i]!, name: e.target.value }
                        setCanals(next)
                      }}
                    />
                    <Input
                      placeholder={t('patients.dental.canalLength')}
                      value={c.length}
                      onChange={(e) => {
                        const next = [...canals]
                        next[i] = { ...next[i]!, length: e.target.value }
                        setCanals(next)
                      }}
                    />
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setCanals([...canals, { name: '', length: '' }])}
              >
                {t('patients.dental.addCanal')}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Button type="button" variant="outline" onClick={() => setStep('history')}>
                {t('patients.dental.modalFormBack')}
              </Button>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('patients.dental.cancel')}
              </Button>
              <Button type="button" onClick={() => void handleSaveTreatment()} disabled={patch.isPending}>
                {patch.isPending ? t('patients.dental.saving') : t('patients.dental.save')}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
