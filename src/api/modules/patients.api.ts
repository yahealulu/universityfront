import { z } from 'zod'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type { CreateInvoiceInput } from '@/types/invoice.types'
import type {
  CreatePatientInput,
  CreateTreatmentStageInput,
  PatchDentalChartInput,
  PatientDetailPayload,
  UpsertClinicalHistoryInput,
} from '@/types/patient.types'
import { parseApiResponse } from '@/types/api.types'

const invoicePaymentSchema = z.object({
  id: z.string(),
  invoiceId: z.string(),
  paidAt: z.string(),
  amount: z.number(),
})

const invoiceSchema = z.object({
  id: z.string(),
  invoiceNumber: z.string(),
  patientId: z.string(),
  patientName: z.string(),
  patientRecordId: z.string(),
  treatmentTitle: z.string(),
  treatmentSubtitle: z.string(),
  invoiceDate: z.string(),
  total: z.number(),
  notes: z.string(),
  payments: z.array(invoicePaymentSchema),
})

const patientListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  patientCode: z.string(),
  phone: z.string(),
  email: z.string(),
  lastVisit: z.string(),
  nextVisit: z.string(),
  ageYears: z.number(),
  genderLabelKey: z.enum(['male', 'female', 'other']),
})

const patientListResponseSchema = z.object({
  items: z.array(patientListItemSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
})

const patientFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  uploadedAt: z.string(),
})

const patientProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  patientCode: z.string(),
  genderLabelKey: z.enum(['male', 'female', 'other']),
  bloodType: z.string(),
  ageYears: z.number(),
  contact: z.object({
    email: z.string(),
    phone: z.string(),
    address: z.string(),
  }),
  activities: z.object({
    lastVisit: z.string(),
    nextVisit: z.string(),
  }),
  files: z.array(patientFileSchema),
})

const appointmentRowSchema = z.object({
  id: z.string(),
  date: z.string(),
  time: z.string(),
  doctorName: z.string(),
  doctorSpecialization: z.string(),
  treatmentType: z.string(),
  treatmentCategory: z.string(),
  statusKey: z.enum(['scheduled', 'completed', 'cancelled']),
  notes: z.string(),
})

const invoicesSummarySchema = z.object({
  totalInvoiced: z.number(),
  totalPaid: z.number(),
  totalRemaining: z.number(),
})

const toothStatusSchema = z.enum([
  'natural',
  'filling',
  'extracted',
  'crown',
  'implant',
  'decay',
  'previous',
])

const dentalChartSchema = z.object({
  mode: z.enum(['adult', 'child']),
  teeth: z.record(toothStatusSchema),
})

const treatmentStageSchema = z.object({
  id: z.string(),
  stageNumber: z.number(),
  date: z.string(),
  description: z.string(),
})

const patientTreatmentSchema = z.object({
  id: z.string(),
  category: z.string(),
  treatmentType: z.string(),
  toothLabel: z.string(),
  toothFdiId: z.string().optional(),
  date: z.string(),
  notes: z.string(),
  price: z.number(),
  paid: z.number(),
  remaining: z.number(),
  stages: z.array(treatmentStageSchema),
})

const clinicalHistorySchema = z
  .object({
    diseaseIds: z.array(z.string()),
    otherDiseases: z.string(),
    takesMedicinesRegularly: z.boolean().nullable(),
    medicinesNote: z.string(),
    hasDrugAllergies: z.boolean().nullable(),
    allergiesNote: z.string(),
    hadPreviousSurgery: z.boolean().nullable(),
    surgeriesNote: z.string(),
    pregnant: z.boolean().nullable(),
    smokes: z.boolean().nullable(),
    drinksAlcohol: z.boolean().nullable(),
  })
  .nullable()

const patientDetailSchema = z.object({
  profile: patientProfileSchema,
  appointments: z.array(appointmentRowSchema),
  invoicesSummary: invoicesSummarySchema,
  invoices: z.array(invoiceSchema),
  dentalChart: dentalChartSchema,
  treatments: z.array(patientTreatmentSchema),
  clinicalHistory: clinicalHistorySchema,
})

export const patientsApi = {
  list: async (params: { q?: string; page?: number; pageSize?: number }) => {
    const res = await apiClient.get<unknown>(endpoints.patients.list, { params })
    return parseApiResponse(res.data, patientListResponseSchema)
  },

  getDetail: async (id: string) => {
    const res = await apiClient.get<unknown>(endpoints.patients.detail(id))
    return parseApiResponse(res.data, patientDetailSchema)
  },

  create: async (body: CreatePatientInput) => {
    const res = await apiClient.post<unknown>(endpoints.patients.list, body)
    return parseApiResponse(res.data, patientListItemSchema)
  },

  patchProfile: async (id: string, body: Partial<PatientDetailPayload['profile']>) => {
    const res = await apiClient.patch<unknown>(endpoints.patients.detail(id), body)
    return parseApiResponse(res.data, patientDetailSchema)
  },

  createInvoice: async (patientId: string, body: CreateInvoiceInput) => {
    const res = await apiClient.post<unknown>(endpoints.patients.invoices(patientId), body)
    return parseApiResponse(res.data, patientDetailSchema)
  },

  patchDentalChart: async (id: string, body: PatchDentalChartInput) => {
    const res = await apiClient.patch<unknown>(endpoints.patients.dentalChart(id), body)
    return parseApiResponse(res.data, patientDetailSchema)
  },

  addTreatmentStage: async (patientId: string, input: CreateTreatmentStageInput) => {
    const res = await apiClient.post<unknown>(
      endpoints.patients.treatmentStage(patientId, input.treatmentId),
      { description: input.description }
    )
    return parseApiResponse(res.data, patientDetailSchema)
  },

  putClinicalHistory: async (id: string, body: UpsertClinicalHistoryInput) => {
    const res = await apiClient.put<unknown>(endpoints.patients.clinicalHistory(id), body)
    return parseApiResponse(res.data, patientDetailSchema)
  },

  deleteFile: async (patientId: string, fileId: string) => {
    const res = await apiClient.delete<unknown>(endpoints.patients.file(patientId, fileId))
    return parseApiResponse(res.data, patientDetailSchema)
  },

  deleteAppointment: async (patientId: string, appointmentId: string) => {
    const res = await apiClient.delete<unknown>(endpoints.patients.appointment(patientId, appointmentId))
    return parseApiResponse(res.data, patientDetailSchema)
  },

  delete: async (id: string) => {
    const res = await apiClient.delete<unknown>(endpoints.patients.detail(id))
    return parseApiResponse(res.data, z.null())
  },
}
