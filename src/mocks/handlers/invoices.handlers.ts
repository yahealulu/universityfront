import { http, HttpResponse } from 'msw'

import { mockPatientOptions, mockTreatmentOptions } from '@/mocks/data/appointments.mock'
import { invoiceMetaPayload, seedInvoices } from '@/mocks/data/invoices.mock'
import { getAllSeedPatientInvoices } from '@/mocks/data/patients.mock'
import { getTenantId, getTenantOrdinal } from '@/mocks/handlers/utils'
import type { Invoice, InvoicePayment } from '@/types/invoice.types'

const json = <T>(data: T) =>
  HttpResponse.json({ success: true as const, data })

const pathEndsWith = (suffix: string) =>
  (({ request }: { request: Request }) => {
    const url = new URL(request.url)
    return url.pathname.endsWith(suffix)
  }) as ({ request }: { request: Request }) => boolean

const cloneInvoice = (i: Invoice): Invoice => ({
  ...i,
  payments: i.payments.map((p) => ({ ...p })),
})

type InvoiceState = { invoices: Invoice[]; nextInvNum: number; nextPayNum: number }
const byTenant = new Map<string, InvoiceState>()

const getState = (request: Request): InvoiceState => {
  const tenantId = getTenantId(request)
  const cached = byTenant.get(tenantId)
  if (cached) return cached
  const ord = getTenantOrdinal(tenantId)
  const fromGlobalList = seedInvoices.map((inv) => ({
    ...cloneInvoice(inv),
    id: `${inv.id}-c${ord + 1}`,
    invoiceNumber: `${inv.invoiceNumber}-C${ord + 1}`,
    patientName: `${inv.patientName} C${ord + 1}`,
    total: inv.total + ord * 120,
  }))
  const fromPatientDetails = getAllSeedPatientInvoices().map((inv) => ({
    ...cloneInvoice(inv),
    patientName: ord === 0 ? inv.patientName : `${inv.patientName.replace(/\s+C\d+$/, '')} C${ord + 1}`,
  }))
  const seeded: InvoiceState = {
    invoices: [...fromGlobalList, ...fromPatientDetails],
    nextInvNum: 123468 + ord * 1000,
    nextPayNum: 200 + ord * 200,
  }
  byTenant.set(tenantId, seeded)
  return seeded
}

const findInvoice = (state: InvoiceState, id: string) => state.invoices.find((x) => x.id === id)

const parsePath = (request: Request) => {
  const pathname = new URL(request.url).pathname.replace(/\/$/, '')
  return pathname.split('/').filter(Boolean)
}

const isInvoiceDetailGet = ({ request }: { request: Request }) => {
  if (request.method !== 'GET') return false
  const url = new URL(request.url)
  const m = url.pathname.match(/\/api\/invoices\/([^/]+)$/)
  return Boolean(m?.[1] && m[1] !== 'meta')
}

const isInvoiceListGet = ({ request }: { request: Request }) => {
  if (request.method !== 'GET') return false
  const parts = parsePath(request)
  return parts.length === 2 && parts[0] === 'api' && parts[1] === 'invoices'
}

const isPostPayments = ({ request }: { request: Request }) => {
  if (request.method !== 'POST') return false
  const url = new URL(request.url)
  return /\/api\/invoices\/[^/]+\/payments$/.test(url.pathname)
}

const isPaymentPath = (request: Request) => {
  const parts = parsePath(request)
  return (
    parts.length === 5 &&
    parts[0] === 'api' &&
    parts[1] === 'invoices' &&
    parts[3] === 'payments'
  )
}

const isPatchPayment = ({ request }: { request: Request }) =>
  request.method === 'PATCH' && isPaymentPath(request)

const isDeletePayment = ({ request }: { request: Request }) =>
  request.method === 'DELETE' && isPaymentPath(request)

export const invoicesHandlers = [
  http.get(pathEndsWith('/api/invoices/meta'), ({ request }) => {
    const ord = getTenantOrdinal(getTenantId(request))
    return json({
      ...invoiceMetaPayload,
      patients: invoiceMetaPayload.patients.map((p) => ({
        ...p,
        id: `${p.id}-c${ord + 1}`,
        displayName: `${p.displayName} C${ord + 1}`,
      })),
    })
  }),

  http.get(isInvoiceDetailGet, ({ request }) => {
    const state = getState(request)
    const url = new URL(request.url)
    const m = url.pathname.match(/\/api\/invoices\/([^/]+)$/)
    const id = m?.[1]
    if (!id) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    const inv = findInvoice(state, id)
    if (!inv) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    return json(cloneInvoice(inv))
  }),

  http.get(isInvoiceListGet, ({ request }) => {
    const state = getState(request)
    return json(state.invoices.map(cloneInvoice))
  }),

  http.post(isPostPayments, async ({ request }) => {
    const state = getState(request)
    const url = new URL(request.url)
    const m = url.pathname.match(/\/api\/invoices\/([^/]+)\/payments$/)
    const invoiceId = m?.[1]
    if (!invoiceId) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    const inv = findInvoice(state, invoiceId)
    if (!inv) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    const body = (await request.json()) as { payments: { paidAt: string; amount: number }[] }
    for (const row of body.payments) {
      inv.payments.push({
        id: `pay-${state.nextPayNum++}`,
        invoiceId,
        paidAt: row.paidAt,
        amount: row.amount,
      })
    }
    return json(cloneInvoice(inv))
  }),

  http.post(pathEndsWith('/api/invoices'), async ({ request }) => {
    const state = getState(request)
    const ord = getTenantOrdinal(getTenantId(request))
    const parts = parsePath(request)
    if (parts.length !== 2) {
      return HttpResponse.json({ success: false as const, message: 'Bad request' }, { status: 400 })
    }
    const body = (await request.json()) as {
      patientId: string
      treatmentId: string
      total: number
      paidAmount?: number | null
      notes?: string
    }
    const patient = mockPatientOptions.find((p) => body.patientId.startsWith(p.id))
    const treatment = mockTreatmentOptions.find((t) => t.id === body.treatmentId)
    const metaTr = invoiceMetaPayload.treatments.find((t) => t.id === body.treatmentId)
    const id = `inv-${crypto.randomUUID()}`
    const num = `IN-${state.nextInvNum++}`
    const payments: InvoicePayment[] = []
    if (body.paidAmount != null && body.paidAmount > 0) {
      payments.push({
        id: `pay-${state.nextPayNum++}`,
        invoiceId: id,
        paidAt: new Date().toISOString().slice(0, 10),
        amount: Math.min(body.paidAmount, body.total),
      })
    }
    const digits = patient?.patientCode.replace(/\D/g, '') ?? '0'
    const inv: Invoice = {
      id,
      invoiceNumber: num,
      patientId: body.patientId,
      patientName: `${patient?.displayName ?? 'Unknown'} C${ord + 1}`,
      patientRecordId: digits.slice(-9).padStart(9, '0'),
      treatmentTitle: treatment?.label ?? 'Treatment',
      treatmentSubtitle: metaTr?.subtitle ?? 'General Dentistry',
      invoiceDate: new Date().toISOString().slice(0, 10),
      total: body.total,
      notes: body.notes ?? '',
      payments,
    }
    state.invoices.push(inv)
    return json(cloneInvoice(inv))
  }),

  http.patch(isPatchPayment, async ({ request }) => {
    const state = getState(request)
    const parts = parsePath(request)
    const invoiceId = parts[2] as string
    const paymentId = parts[4] as string
    const inv = findInvoice(state, invoiceId)
    if (!inv) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    const body = (await request.json()) as { paidAt: string; amount: number }
    const p = inv.payments.find((x) => x.id === paymentId)
    if (!p) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    p.paidAt = body.paidAt
    p.amount = body.amount
    return json({ ...p })
  }),

  http.delete(isDeletePayment, ({ request }) => {
    const state = getState(request)
    const parts = parsePath(request)
    const invoiceId = parts[2] as string
    const paymentId = parts[4] as string
    const inv = findInvoice(state, invoiceId)
    if (!inv) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    inv.payments = inv.payments.filter((x) => x.id !== paymentId)
    return new HttpResponse(null, { status: 204 })
  }),
]

/** Allow other mock handlers (e.g. patients) to keep global invoice list in sync. */
export const pushInvoiceToMockStore = (tenantId: string, inv: Invoice) => {
  const state =
    byTenant.get(tenantId) ??
    (() => {
      const seeded: InvoiceState = { invoices: [], nextInvNum: 123468, nextPayNum: 200 }
      byTenant.set(tenantId, seeded)
      return seeded
    })()
  state.invoices.push(cloneInvoice(inv))
}
