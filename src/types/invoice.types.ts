export type InvoiceStatus = 'unpaid' | 'partially_paid' | 'paid'

export type InvoicePayment = {
  id: string
  invoiceId: string
  paidAt: string
  amount: number
}

export type Invoice = {
  id: string
  invoiceNumber: string
  patientId: string
  patientName: string
  patientRecordId: string
  treatmentTitle: string
  treatmentSubtitle: string
  invoiceDate: string
  total: number
  notes: string
  payments: InvoicePayment[]
}

export type InvoiceDerived = {
  paidTotal: number
  remaining: number
  status: InvoiceStatus
}

export const getInvoiceDerived = (invoice: Pick<Invoice, 'total' | 'payments'>): InvoiceDerived => {
  const paidTotal = invoice.payments.reduce((s, p) => s + p.amount, 0)
  const remaining = Math.max(0, invoice.total - paidTotal)
  let status: InvoiceStatus
  if (paidTotal <= 0) status = 'unpaid'
  else if (remaining <= 0) status = 'paid'
  else status = 'partially_paid'
  return { paidTotal, remaining, status }
}

export type CreateInvoiceInput = {
  patientId: string
  treatmentId: string
  total: number
  paidAmount?: number | null
  notes?: string
}

export type InvoicePaymentInput = {
  paidAt: string
  amount: number
}

export type InvoicesMetaPayload = {
  patients: { id: string; displayName: string; patientCode: string }[]
  treatments: { id: string; label: string; subtitle: string }[]
}
