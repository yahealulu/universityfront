/** Day ids in UI order: Saturday → Friday */
export type WorkDayId =
  | 'saturday'
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'

export type ClinicSummary = {
  id: string
  name: string
}

export type WorkHours = {
  startTime: string
  endTime: string
}

/** Full payload for creating a clinic (wizard submits once on final step). */
export type CreateClinicPayload = {
  name: string
  phone: string
  address: string
  /** Optional logo file name for mock display; binary not stored in MSW. */
  logoFileName: string | null
  workDays: WorkDayId[]
  workHours: WorkHours
}

export type CreatedClinicResponse = {
  id: string
  name: string
}
