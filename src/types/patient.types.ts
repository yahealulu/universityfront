import type { Invoice } from '@/types/invoice.types'

/** FDI tooth notation key, e.g. "11" … "48" */
export type ToothId = string

export type ToothStatusKey =
  | 'natural'
  | 'filling'
  | 'extracted'
  | 'crown'
  | 'implant'
  | 'decay'
  | 'previous'

export type DentalChartMode = 'adult' | 'child'

export type PatientListItem = {
  id: string
  name: string
  patientCode: string
  phone: string
  email: string
  lastVisit: string
  nextVisit: string
  ageYears: number
  genderLabelKey: 'male' | 'female' | 'other'
}

export type PatientProfile = {
  id: string
  name: string
  patientCode: string
  genderLabelKey: 'male' | 'female' | 'other'
  bloodType: string
  ageYears: number
  contact: {
    email: string
    phone: string
    address: string
  }
  activities: {
    lastVisit: string
    nextVisit: string
  }
  files: PatientFile[]
}

export type PatientFile = {
  id: string
  name: string
  uploadedAt: string
}

export type PatientAppointmentRow = {
  id: string
  date: string
  time: string
  doctorName: string
  doctorSpecialization: string
  treatmentType: string
  treatmentCategory: string
  statusKey: 'scheduled' | 'completed' | 'cancelled'
  notes: string
}

export type InvoicesTabSummary = {
  totalInvoiced: number
  totalPaid: number
  totalRemaining: number
}

export type DentalChartState = {
  mode: DentalChartMode
  /** Map tooth id → status */
  teeth: Record<ToothId, ToothStatusKey>
}

export type TreatmentStage = {
  id: string
  stageNumber: number
  date: string
  description: string
}

export type PatientTreatment = {
  id: string
  category: string
  treatmentType: string
  toothLabel: string
  /** When set, dental chart modal matches this tooth regardless of localized `toothLabel`. */
  toothFdiId?: string
  date: string
  notes: string
  price: number
  paid: number
  remaining: number
  stages: TreatmentStage[]
}

export type ClinicalHistoryDiseaseOption = {
  id: string
  labelKey: string
}

export type ClinicalHistorySummary = {
  diseaseIds: string[]
  otherDiseases: string
  takesMedicinesRegularly: boolean | null
  medicinesNote: string
  hasDrugAllergies: boolean | null
  allergiesNote: string
  hadPreviousSurgery: boolean | null
  surgeriesNote: string
  pregnant: boolean | null
  smokes: boolean | null
  drinksAlcohol: boolean | null
}

export type PatientDetailPayload = {
  profile: PatientProfile
  appointments: PatientAppointmentRow[]
  invoicesSummary: InvoicesTabSummary
  invoices: Invoice[]
  dentalChart: DentalChartState
  treatments: PatientTreatment[]
  clinicalHistory: ClinicalHistorySummary | null
}

export type CreatePatientInput = {
  fullName: string
  phone: string
  email: string
  gender: 'male' | 'female' | 'other'
  birthYear: number
  address: string
  bloodType: string
}

export type UpdatePatientProfileInput = Partial<{
  name: string
  contact: Partial<PatientProfile['contact']>
  activities: Partial<PatientProfile['activities']>
}>

export type PatchDentalChartInput = {
  mode?: DentalChartMode
  teeth?: Partial<Record<ToothId, ToothStatusKey>>
  treatmentDraft?: {
    toothId: ToothId
    category: string
    treatmentType: string
    notes: string
    price: number
    paid: number
  }
}

export type CreateTreatmentStageInput = {
  treatmentId: string
  description: string
}

export type UpsertClinicalHistoryInput = ClinicalHistorySummary
