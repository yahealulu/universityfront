import type { WorkDayId } from '@/types/clinic.types'

export const WORK_DAY_ORDER: WorkDayId[] = [
  'saturday',
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
]

/** Default selection aligned with typical Sun–Thu work week */
export const DEFAULT_WORK_DAYS: WorkDayId[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
]
