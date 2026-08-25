import type { WorkDayId } from '@/types/clinic.types'

export type WizardFormValues = {
  name: string
  phone: string
  address: string
  workDays: WorkDayId[]
  startTime: string
  endTime: string
}
