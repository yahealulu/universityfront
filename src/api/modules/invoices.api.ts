import { z } from 'zod'

import { apiClient } from '@/api/client'
import { endpoints } from '@/api/endpoints'
import type { CreateInvoiceInput, InvoicePaymentInput } from '@/types/invoice.types'
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

const invoicesListSchema = z.array(invoiceSchema)

const metaPatientSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  patientCode: z.string(),
})

const metaTreatmentSchema = z.object({
  id: z.string(),
  label: z.string(),
  subtitle: z.string(),
})

const invoicesMetaSchema = z.object({
  patients: z.array(metaPatientSchema),
  treatments: z.array(metaTreatmentSchema),
})

export const invoicesApi = {
  list: async () => {
    const res = await apiClient.get<unknown>(endpoints.invoices.list)
    return parseApiResponse(res.data, invoicesListSchema)
  },

  getById: async (id: string) => {
    const res = await apiClient.get<unknown>(endpoints.invoices.detail(id))
    return parseApiResponse(res.data, invoiceSchema)
  },

  getMeta: async () => {
    const res = await apiClient.get<unknown>(endpoints.invoices.meta)
    return parseApiResponse(res.data, invoicesMetaSchema)
  },

  create: async (body: CreateInvoiceInput) => {
    const res = await apiClient.post<unknown>(endpoints.invoices.list, body)
    return parseApiResponse(res.data, invoiceSchema)
  },

  addPayments: async (invoiceId: string, payments: InvoicePaymentInput[]) => {
    const res = await apiClient.post<unknown>(endpoints.invoices.payments(invoiceId), {
      payments,
    })
    return parseApiResponse(res.data, invoiceSchema)
  },

  updatePayment: async (
    invoiceId: string,
    paymentId: string,
    body: InvoicePaymentInput
  ) => {
    const res = await apiClient.patch<unknown>(
      endpoints.invoices.payment(invoiceId, paymentId),
      body
    )
    return parseApiResponse(res.data, invoicePaymentSchema)
  },

  deletePayment: async (invoiceId: string, paymentId: string) => {
    await apiClient.delete(endpoints.invoices.payment(invoiceId, paymentId))
  },
}
