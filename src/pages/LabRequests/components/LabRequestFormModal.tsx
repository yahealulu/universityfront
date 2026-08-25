import { zodResolver } from '@hookform/resolvers/zod'
import { format, formatISO, parse, parseISO, startOfDay } from 'date-fns'
import { Search } from 'lucide-react'
import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import { Textarea } from '@/components/ui/textarea'
import { useCreateLabRequest } from '@/hooks/lab-requests/useCreateLabRequest'
import { useUpdateLabRequest } from '@/hooks/lab-requests/useUpdateLabRequest'
import type { LabRequest, LabRequestsMetaPayload } from '@/types/lab-request.types'

const toDateInputValue = (iso: string) => format(parseISO(iso), 'yyyy-MM-dd')

const fromDateInputValue = (yyyyMmDd: string) =>
  formatISO(startOfDay(parse(yyyyMmDd, 'yyyy-MM-dd', new Date())))

const createFormSchema = (t: (k: string) => string) =>
  z.object({
    labId: z.string().min(1, t('labRequests.modal.validation.lab')),
    patientId: z.string().min(1, t('labRequests.modal.validation.patient')),
    workTypeId: z.string().min(1, t('labRequests.modal.validation.workType')),
    quantity: z
      .string()
      .min(1, t('labRequests.modal.validation.quantity'))
      .refine((s) => {
        const n = Number(s)
        return !Number.isNaN(n) && Number.isInteger(n) && n >= 1
      }, t('labRequests.modal.validation.quantity')),
    costUsd: z.string().optional(),
    notes: z.string().max(100, t('labRequests.modal.validation.notesMax')),
    requestDate: z.string().min(1, t('labRequests.modal.validation.requestDate')),
  })

type FormValues = z.infer<ReturnType<typeof createFormSchema>>

export type LabRequestFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingRequest: LabRequest | null
  meta: LabRequestsMetaPayload | undefined
  initialLabId: string | null
}

export const LabRequestFormModal: FC<LabRequestFormModalProps> = ({
  open,
  onOpenChange,
  editingRequest,
  meta,
  initialLabId,
}) => {
  const { t } = useTranslation()
  const schema = useMemo(() => createFormSchema(t), [t])
  const createMutation = useCreateLabRequest()
  const updateMutation = useUpdateLabRequest()
  const isEdit = Boolean(editingRequest)

  const [patientOpen, setPatientOpen] = useState(false)
  const [patientQuery, setPatientQuery] = useState('')

  const defaultRequestDate = useMemo(
    () => formatISO(startOfDay(new Date())).slice(0, 10),
    []
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      labId: '',
      patientId: '',
      workTypeId: '',
      quantity: '1',
      costUsd: '',
      notes: '',
      requestDate: defaultRequestDate,
    },
  })

  const { control, handleSubmit, reset, watch, setError, formState } = form
  const notesLen = watch('notes')?.length ?? 0
  const patientId = watch('patientId')

  const patients = useMemo(() => meta?.patients ?? [], [meta?.patients])
  const filteredPatients = useMemo(() => {
    const q = patientQuery.trim().toLowerCase()
    if (!q) return patients
    return patients.filter(
      (p) =>
        p.displayName.toLowerCase().includes(q) ||
        p.patientCode.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    )
  }, [patients, patientQuery])

  const selectedPatient = useMemo(
    () => patients.find((p) => p.id === patientId),
    [patients, patientId]
  )

  useEffect(() => {
    if (!open) {
      setPatientQuery('')
      setPatientOpen(false)
      return
    }
    if (editingRequest) {
      reset({
        labId: editingRequest.labId,
        patientId: editingRequest.patientId,
        workTypeId: editingRequest.workTypeId,
        quantity: String(editingRequest.quantity),
        costUsd: editingRequest.costUsd === null ? '' : String(editingRequest.costUsd),
        notes: editingRequest.notes,
        requestDate: toDateInputValue(editingRequest.requestDate),
      })
    } else {
      reset({
        labId: initialLabId ?? '',
        patientId: '',
        workTypeId: '',
        quantity: '1',
        costUsd: '',
        notes: '',
        requestDate: defaultRequestDate,
      })
    }
  }, [open, editingRequest, initialLabId, reset, defaultRequestDate])

  const onSubmit = handleSubmit(async (values) => {
    const costRaw = values.costUsd?.trim()
    let costUsd: number | null = null
    if (costRaw) {
      const n = Number(costRaw)
      if (Number.isNaN(n) || n < 0) {
        setError('costUsd', { message: t('labRequests.modal.validation.cost') })
        return
      }
      costUsd = n
    }

    const body = {
      labId: values.labId,
      patientId: values.patientId,
      workTypeId: values.workTypeId,
      quantity: Number(values.quantity),
      costUsd,
      notes: values.notes ?? '',
      requestDate: fromDateInputValue(values.requestDate),
    }

    try {
      if (editingRequest) {
        await updateMutation.mutateAsync({ id: editingRequest.id, body })
      } else {
        await createMutation.mutateAsync(body)
      }
      onOpenChange(false)
    } catch {
      // errors surfaced via mutation state
    }
  })

  const saving = createMutation.isPending || updateMutation.isPending
  const submitError = isEdit ? updateMutation.error : createMutation.error

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('labRequests.modal.titleEdit') : t('labRequests.modal.titleAdd')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('labRequests.modal.lab')}</Label>
            <Controller
              name="labId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full border-border-card">
                    <SelectValue placeholder={t('labRequests.modal.labPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {(meta?.labs ?? []).map((lab) => (
                      <SelectItem key={lab.id} value={lab.id}>
                        {lab.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {formState.errors.labId && (
              <p className="text-sm text-danger">{formState.errors.labId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t('labRequests.modal.patient')}</Label>
            <Controller
              name="patientId"
              control={control}
              render={({ field }) => (
                <Popover open={patientOpen} onOpenChange={setPatientOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 w-full justify-start border-border-card font-normal"
                    >
                      {selectedPatient ? (
                        <span className="truncate">{selectedPatient.displayName}</span>
                      ) : (
                        <span className="text-muted-foreground">
                          {t('labRequests.modal.patientPlaceholder')}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-2" align="start">
                    <div className="relative mb-2">
                      <Search className="pointer-events-none absolute start-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={patientQuery}
                        onChange={(e) => setPatientQuery(e.target.value)}
                        placeholder={t('labRequests.modal.patientSearchPlaceholder')}
                        className="h-9 ps-8"
                      />
                    </div>
                    <ul className="max-h-48 overflow-y-auto text-sm">
                      {filteredPatients.map((p) => (
                        <li key={p.id}>
                          <button
                            type="button"
                            className="w-full rounded-md px-2 py-1.5 text-start hover:bg-page"
                            onClick={() => {
                              field.onChange(p.id)
                              setPatientOpen(false)
                              setPatientQuery('')
                            }}
                          >
                            <span className="font-medium">{p.displayName}</span>
                            <span className="ms-2 text-xs text-muted-foreground">
                              #{p.patientCode}
                            </span>
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
            <Label>{t('labRequests.modal.workType')}</Label>
            <Controller
              name="workTypeId"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full border-border-card">
                    <SelectValue placeholder={t('labRequests.modal.workTypePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {(meta?.workTypes ?? []).map((wt) => (
                      <SelectItem key={wt.id} value={wt.id}>
                        {wt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {formState.errors.workTypeId && (
              <p className="text-sm text-danger">{formState.errors.workTypeId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lr-qty">{t('labRequests.modal.quantity')}</Label>
              <Input
                id="lr-qty"
                inputMode="numeric"
                placeholder={t('labRequests.modal.quantityPlaceholder')}
                {...form.register('quantity')}
              />
              {formState.errors.quantity && (
                <p className="text-sm text-danger">{formState.errors.quantity.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lr-cost">{t('labRequests.modal.cost')}</Label>
              <Input
                id="lr-cost"
                inputMode="decimal"
                placeholder={t('labRequests.modal.costPlaceholder')}
                {...form.register('costUsd')}
              />
              {formState.errors.costUsd && (
                <p className="text-sm text-danger">{formState.errors.costUsd.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lr-date">{t('labRequests.modal.requestDate')}</Label>
            <Input id="lr-date" type="date" {...form.register('requestDate')} />
            {formState.errors.requestDate && (
              <p className="text-sm text-danger">{formState.errors.requestDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="lr-notes">{t('labRequests.modal.notes')}</Label>
              <span className="text-xs text-muted-foreground">{notesLen}/100</span>
            </div>
            <Textarea
              id="lr-notes"
              maxLength={100}
              rows={4}
              placeholder={t('labRequests.modal.notesPlaceholder')}
              {...form.register('notes')}
            />
            {formState.errors.notes && (
              <p className="text-sm text-danger">{formState.errors.notes.message}</p>
            )}
          </div>

          {submitError && (
            <p className="text-sm text-danger">{t('labRequests.modal.submitError')}</p>
          )}

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="border-border-card"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              {t('labRequests.modal.cancel')}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving
                ? t('labRequests.modal.saving')
                : isEdit
                  ? t('labRequests.modal.save')
                  : t('labRequests.modal.submit')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
