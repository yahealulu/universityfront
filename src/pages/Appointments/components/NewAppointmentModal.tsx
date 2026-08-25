import { zodResolver } from '@hookform/resolvers/zod'
import { Search } from 'lucide-react'
import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateAppointment } from '@/hooks/appointments/useCreateAppointment'
import type { AppointmentsMetaPayload } from '@/types/appointment-schedule.types'
import { cn } from '@/lib/utils'

const NONE_TREATMENT = '__none__'

const durationOptions = [30, 60, 90, 120] as const

const createAppointmentFormSchema = (translate: (key: string) => string) =>
  z.object({
    doctorId: z.string().min(1, translate('appointments.modal.validation.doctor')),
    patientId: z.string().min(1, translate('appointments.modal.validation.patient')),
    treatmentType: z.string().optional(),
    durationMinutes: z.union([z.literal(30), z.literal(60), z.literal(90), z.literal(120)]),
  })

export type NewAppointmentModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: string
  defaultDoctorId: string
  defaultStartTime: string
  meta: AppointmentsMetaPayload | undefined
}

type FormValues = z.infer<ReturnType<typeof createAppointmentFormSchema>>

export const NewAppointmentModal: FC<NewAppointmentModalProps> = ({
  open,
  onOpenChange,
  selectedDate,
  defaultDoctorId,
  defaultStartTime,
  meta,
}) => {
  const { t } = useTranslation()
  const schema = useMemo(() => createAppointmentFormSchema(t), [t])
  const createMutation = useCreateAppointment()
  const [patientOpen, setPatientOpen] = useState(false)
  const [patientQuery, setPatientQuery] = useState('')

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      doctorId: '',
      patientId: '',
      treatmentType: NONE_TREATMENT,
      durationMinutes: 60,
    },
  })

  const { control, handleSubmit, reset, watch, formState } = form
  const patientId = watch('patientId')

  useEffect(() => {
    if (open) {
      reset({
        doctorId: defaultDoctorId || '',
        patientId: '',
        treatmentType: NONE_TREATMENT,
        durationMinutes: 60,
      })
      setPatientQuery('')
      setPatientOpen(false)
    }
  }, [open, defaultDoctorId, reset])

  const selectedPatient = useMemo(() => {
    if (!meta || !patientId) return null
    return meta.patients.find((p) => p.id === patientId) ?? null
  }, [meta, patientId])

  const filteredPatients = useMemo(() => {
    if (!meta) return []
    const q = patientQuery.trim().toLowerCase()
    if (!q) return meta.patients
    return meta.patients.filter(
      (p) =>
        p.displayName.toLowerCase().includes(q) || p.patientCode.toLowerCase().includes(q)
    )
  }, [meta, patientQuery])

  const onSubmit = handleSubmit(async (values) => {
    const treatmentType =
      values.treatmentType && values.treatmentType !== NONE_TREATMENT
        ? values.treatmentType
        : null
    await createMutation.mutateAsync({
      doctorId: values.doctorId,
      patientId: values.patientId,
      treatmentType,
      durationMinutes: values.durationMinutes,
      date: selectedDate,
      startTime: defaultStartTime,
    })
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-6" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{t('appointments.modal.title')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="appt-doctor">{t('appointments.modal.doctor')}</Label>
            <Controller
              name="doctorId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="appt-doctor" className="w-full">
                    <SelectValue placeholder={t('appointments.modal.doctorPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {meta?.doctors.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {formState.errors.doctorId && (
              <p className="text-sm text-danger">{formState.errors.doctorId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="appt-patient-trigger">{t('appointments.modal.patient')}</Label>
            <Controller
              name="patientId"
              control={control}
              render={({ field }) => (
                <Popover open={patientOpen} onOpenChange={setPatientOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="appt-patient-trigger"
                      type="button"
                      variant="outline"
                      className="h-10 w-full justify-between border-border-card font-normal text-foreground"
                    >
                      <span className="truncate text-start">
                        {selectedPatient
                          ? `${selectedPatient.displayName} (${selectedPatient.patientCode})`
                          : t('appointments.modal.patientPlaceholder')}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <div className="relative border-b border-border-card">
                      <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="border-0 pe-3 ps-9 shadow-none focus-visible:ring-0"
                        placeholder={t('appointments.modal.patientSearchPlaceholder')}
                        value={patientQuery}
                        onChange={(e) => setPatientQuery(e.target.value)}
                      />
                    </div>
                    <ul className="max-h-52 overflow-y-auto p-1" role="listbox">
                      {filteredPatients.map((p) => (
                        <li key={p.id}>
                          <button
                            type="button"
                            className="w-full rounded-md px-3 py-2 text-start text-sm hover:bg-page"
                            onClick={() => {
                              field.onChange(p.id)
                              setPatientOpen(false)
                              setPatientQuery('')
                            }}
                          >
                            <span className="font-medium">{p.displayName}</span>
                            <span className="ms-2 text-muted-foreground">{p.patientCode}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </PopoverContent>
                </Popover>
              )}
            />
            {formState.errors.patientId && (
              <p className="text-sm text-danger">{formState.errors.patientId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="appt-treatment">{t('appointments.modal.treatment')}</Label>
            <Controller
              name="treatmentType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="appt-treatment" className="w-full">
                    <SelectValue placeholder={t('appointments.modal.treatmentPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value={NONE_TREATMENT}>
                      {t('appointments.modal.treatmentNone')}
                    </SelectItem>
                    {meta?.treatments.map((tr) => (
                      <SelectItem key={tr.id} value={tr.id}>
                        {tr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <span className="text-sm font-bold text-foreground">{t('appointments.modal.duration')}</span>
            <Controller
              name="durationMinutes"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {durationOptions.map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={cn(
                        'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                        field.value === m
                          ? 'border-primary text-primary bg-white shadow-sm'
                          : 'border-border-card bg-[#f8fafc] text-muted-foreground hover:border-border-card'
                      )}
                      onClick={() => field.onChange(m)}
                    >
                      {t(`appointments.modal.durationMinutes.${m}`)}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {createMutation.isError && (
            <p className="text-sm text-danger">{t('appointments.modal.submitError')}</p>
          )}

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="min-w-[6rem] border-border-card"
              onClick={() => onOpenChange(false)}
            >
              {t('appointments.modal.cancel')}
            </Button>
            <Button type="submit" className="min-w-[7rem]" disabled={createMutation.isPending}>
              {createMutation.isPending
                ? t('appointments.modal.saving')
                : t('appointments.modal.submit')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
