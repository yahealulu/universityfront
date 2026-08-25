import { zodResolver } from '@hookform/resolvers/zod'
import type { FC } from 'react'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAddTreatmentStage } from '@/hooks/patients/usePatientMutations'

const buildSchema = (t: (k: string) => string) =>
  z.object({
    description: z.string().min(1, t('patients.treatments.stage.validation')).max(100),
  })

type FormValues = z.infer<ReturnType<typeof buildSchema>>

export type NewStageModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId: string
  treatmentId: string | null
}

export const NewStageModal: FC<NewStageModalProps> = ({
  open,
  onOpenChange,
  patientId,
  treatmentId,
}) => {
  const { t } = useTranslation()
  const schema = useMemo(() => buildSchema(t), [t])
  const addStage = useAddTreatmentStage(patientId)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { description: '' },
  })

  useEffect(() => {
    if (!open) return
    form.reset({ description: '' })
  }, [open, form])

  const onSubmit = form.handleSubmit(async (values) => {
    if (!treatmentId) return
    await addStage.mutateAsync({
      treatmentId,
      description: values.description.trim(),
    })
    onOpenChange(false)
    form.reset()
  })

  const descLen = form.watch('description')?.length ?? 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-start text-lg font-bold text-primary-navy">
            {t('patients.treatments.newStageTitle')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label className="text-sm font-semibold text-foreground" htmlFor="stage-note">
              {t('patients.treatments.stage.noteLabel')}
            </Label>
            <Textarea
              id="stage-note"
              className="mt-2"
              rows={4}
              maxLength={100}
              placeholder={t('patients.treatments.stage.notePlaceholder')}
              {...form.register('description')}
            />
            <p className="mt-1 text-end text-xs text-muted-foreground">
              {t('patients.treatments.stage.charCount', { current: descLen, max: 100 })}
            </p>
            {form.formState.errors.description ? (
              <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="outline" className="border-primary text-primary" onClick={() => onOpenChange(false)}>
              {t('patients.treatments.stage.back')}
            </Button>
            <Button type="submit" disabled={addStage.isPending || !treatmentId}>
              {addStage.isPending ? t('patients.treatments.stage.saving') : t('patients.treatments.stage.confirm')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
