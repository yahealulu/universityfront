export type WeekdayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

/** Display order: Sunday first (matches common clinic week UIs). */
export const WEEKDAY_KEYS_ORDER: WeekdayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

export type ClinicInfo = {
  name: string
  phone: string
  address: string
  logoUrl?: string
}

export type WorkDaysState = Record<WeekdayKey, boolean>

export type WorkHoursState = {
  startTime: string
  endTime: string
}

export type SettingsPayload = {
  clinic: ClinicInfo
  workDays: WorkDaysState
  workHours: WorkHoursState
}

export type SettingsPatchPayload = {
  clinic?: Partial<ClinicInfo>
  workDays?: Partial<WorkDaysState>
  workHours?: Partial<WorkHoursState>
}
