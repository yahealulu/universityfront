import { z } from 'zod'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type { DoctorCreateInput, DoctorPaymentUpsertInput, DoctorUpdateInput } from '@/types/doctor.types'
import { parseApiResponse } from '@/types/api.types'

const doctorListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  specialization: z.string(),
  phone: z.string(),
  treatmentsThisMonth: z.number(),
  revenueThisMonth: z.number(),
  outstandingThisMonth: z.number(),
})

const doctorsListPayloadSchema = z.object({
  doctors: z.array(doctorListItemSchema),
  quota: z.object({
    max: z.number(),
    remaining: z.number(),
  }),
})

const specialtySchema = z.object({
  id: z.string(),
  label: z.string(),
})

const doctorsMetaSchema = z.object({
  specialties: z.array(specialtySchema),
})

const doctorFullSchema = z.object({
  id: z.string(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  name: z.string(),
  specialtyId: z.string(),
  specialtyLabel: z.string(),
  specialization: z.string(),
  phone: z.string(),
  commissionPercent: z.number(),
  certificateNumber: z.string().nullable(),
  email: z.string(),
  registeredAt: z.string(),
  hasAllClinics: z.boolean().optional().default(false),
  clinicIds: z.array(z.string()).optional().default([]),
  treatmentsThisMonth: z.number(),
  revenueThisMonth: z.number(),
  outstandingThisMonth: z.number(),
})

const doctorDetailStatsSchema = z.object({
  totalTreatments: z.number(),
  totalRevenue: z.number(),
  outstandingPayments: z.number(),
  remainingPayments: z.number(),
})

const doctorPaymentSchema = z.object({
  id: z.string(),
  doctorId: z.string(),
  paymentNumber: z.string(),
  paidAt: z.string(),
  amount: z.number(),
  paymentMethod: z.string(),
})

const doctorTreatmentSchema = z.object({
  id: z.string(),
  doctorId: z.string(),
  date: z.string(),
  treatmentTitle: z.string(),
  category: z.string(),
  toothArea: z.string(),
  patientName: z.string(),
  price: z.number(),
  paid: z.number(),
  remaining: z.number(),
})

const doctorDetailPayloadSchema = z.object({
  doctor: doctorFullSchema,
  stats: doctorDetailStatsSchema,
  payments: z.array(doctorPaymentSchema),
  treatments: z.array(doctorTreatmentSchema),
})

export const doctorsApi = {
  list: async () => {
    const res = await apiClient.get<unknown>(endpoints.doctors.list)
    return parseApiResponse(res.data, doctorsListPayloadSchema)
  },

  getMeta: async () => {
    const res = await apiClient.get<unknown>(endpoints.doctors.meta)
    return parseApiResponse(res.data, doctorsMetaSchema)
  },

  getDetail: async (id: string) => {
    const res = await apiClient.get<unknown>(endpoints.doctors.detail(id))
    return parseApiResponse(res.data, doctorDetailPayloadSchema)
  },

  getMe: async () => {
    const res = await apiClient.get<unknown>(endpoints.doctors.me)
    return parseApiResponse(res.data, doctorDetailPayloadSchema)
  },

  create: async (body: DoctorCreateInput) => {
    const res = await apiClient.post<unknown>(endpoints.doctors.list, body)
    return parseApiResponse(res.data, doctorFullSchema)
  },

  update: async (id: string, body: DoctorUpdateInput) => {
    const res = await apiClient.patch<unknown>(endpoints.doctors.detail(id), body)
    return parseApiResponse(res.data, doctorFullSchema)
  },

  delete: async (id: string) => {
    await apiClient.delete(endpoints.doctors.detail(id))
  },

  createPayment: async (doctorId: string, body: DoctorPaymentUpsertInput) => {
    const res = await apiClient.post<unknown>(endpoints.doctors.payments(doctorId), body)
    return parseApiResponse(res.data, doctorPaymentSchema)
  },

  updatePayment: async (
    doctorId: string,
    paymentId: string,
    body: DoctorPaymentUpsertInput
  ) => {
    const res = await apiClient.patch<unknown>(
      endpoints.doctors.payment(doctorId, paymentId),
      body
    )
    return parseApiResponse(res.data, doctorPaymentSchema)
  },

  deletePayment: async (doctorId: string, paymentId: string) => {
    await apiClient.delete(endpoints.doctors.payment(doctorId, paymentId))
  },
}
