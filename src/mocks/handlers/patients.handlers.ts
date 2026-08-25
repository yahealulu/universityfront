import { http, HttpResponse } from 'msw'

import { mockTreatmentOptions } from '@/mocks/data/appointments.mock'
import { invoiceMetaPayload } from '@/mocks/data/invoices.mock'
import { pushInvoiceToMockStore } from '@/mocks/handlers/invoices.handlers'
import { getTenantId, getTenantOrdinal } from '@/mocks/handlers/utils'
import {
  applyDentalMode,
  deepCloneDetail,
  seedPatientDetails,
  seedPatientList,
} from '@/mocks/data/patients.mock'
import type { CreateInvoiceInput, Invoice } from '@/types/invoice.types'
import { getInvoiceDerived } from '@/types/invoice.types'
import type {
  ClinicalHistorySummary,
  CreatePatientInput,
  PatchDentalChartInput,
  PatientDetailPayload,
  PatientListItem,
  PatientTreatment,
  ToothStatusKey,
  TreatmentStage,
} from '@/types/patient.types'

const json = <T>(data: T) =>
  HttpResponse.json({ success: true as const, data })

const parsePath = (request: Request) => {
  const pathname = new URL(request.url).pathname.replace(/\/$/, '')
  return pathname.split('/').filter(Boolean)
}

const summarize = (invoices: Invoice[]) => {
  let totalInvoiced = 0
  let totalPaid = 0
  let totalRemaining = 0
  for (const inv of invoices) {
    totalInvoiced += inv.total
    const d = getInvoiceDerived(inv)
    totalPaid += d.paidTotal
    totalRemaining += d.remaining
  }
  return { totalInvoiced, totalPaid, totalRemaining }
}

type PatientsState = {
  list: PatientListItem[]
  details: Record<string, PatientDetailPayload>
  nextPatientId: number
  nextInvLocal: number
}

const byTenant = new Map<string, PatientsState>()

const getState = (request: Request): PatientsState => {
  const tenantId = getTenantId(request)
  const cached = byTenant.get(tenantId)
  if (cached) return cached
  const ord = getTenantOrdinal(tenantId)
  const details: Record<string, PatientDetailPayload> = {}
  for (const id of Object.keys(seedPatientDetails)) {
    const d = deepCloneDetail(id)
    d.profile.name = `${d.profile.name} C${ord + 1}`
    details[id] = d
  }
  const seeded: PatientsState = {
    list: seedPatientList.map((r) => ({ ...r, name: `${r.name} C${ord + 1}` })),
    details,
    nextPatientId: 9000 + ord * 100,
    nextInvLocal: 500000 + ord * 1000,
  }
  byTenant.set(tenantId, seeded)
  return seeded
}

const findDetail = (state: PatientsState, id: string): PatientDetailPayload | undefined => state.details[id]

const isPatientsCollection = ({ request }: { request: Request }) => {
  const parts = parsePath(request)
  return parts.length === 2 && parts[0] === 'api' && parts[1] === 'patients'
}

const isPatientDetailGet = ({ request }: { request: Request }) => {
  if (request.method !== 'GET') return false
  const parts = parsePath(request)
  return parts.length === 3 && parts[0] === 'api' && parts[1] === 'patients' && Boolean(parts[2])
}

const isPatientDetailPatch = ({ request }: { request: Request }) => {
  if (request.method !== 'PATCH') return false
  const parts = parsePath(request)
  return parts.length === 3 && parts[0] === 'api' && parts[1] === 'patients' && Boolean(parts[2])
}

const isPatientInvoicePost = ({ request }: { request: Request }) => {
  if (request.method !== 'POST') return false
  const parts = parsePath(request)
  return (
    parts.length === 4 &&
    parts[0] === 'api' &&
    parts[1] === 'patients' &&
    parts[3] === 'invoices'
  )
}

const isDentalChartPatch = ({ request }: { request: Request }) => {
  if (request.method !== 'PATCH') return false
  const parts = parsePath(request)
  return (
    parts.length === 4 &&
    parts[0] === 'api' &&
    parts[1] === 'patients' &&
    parts[3] === 'dental-chart'
  )
}

const isStagesPost = ({ request }: { request: Request }) => {
  if (request.method !== 'POST') return false
  const parts = parsePath(request)
  return (
    parts.length === 6 &&
    parts[0] === 'api' &&
    parts[1] === 'patients' &&
    parts[3] === 'treatments' &&
    parts[5] === 'stages'
  )
}

const isClinicalPut = ({ request }: { request: Request }) => {
  if (request.method !== 'PUT') return false
  const parts = parsePath(request)
  return (
    parts.length === 4 &&
    parts[0] === 'api' &&
    parts[1] === 'patients' &&
    parts[3] === 'clinical-history'
  )
}

const isFileDelete = ({ request }: { request: Request }) => {
  if (request.method !== 'DELETE') return false
  const parts = parsePath(request)
  return (
    parts.length === 5 &&
    parts[0] === 'api' &&
    parts[1] === 'patients' &&
    parts[3] === 'files'
  )
}

const isAppointmentDelete = ({ request }: { request: Request }) => {
  if (request.method !== 'DELETE') return false
  const parts = parsePath(request)
  return (
    parts.length === 5 &&
    parts[0] === 'api' &&
    parts[1] === 'patients' &&
    parts[3] === 'appointments'
  )
}

const isPatientDelete = ({ request }: { request: Request }) => {
  if (request.method !== 'DELETE') return false
  const parts = parsePath(request)
  return parts.length === 3 && parts[0] === 'api' && parts[1] === 'patients' && Boolean(parts[2])
}

export const patientsHandlers = [
  http.post(isPatientInvoicePost, async ({ request }) => {
    const state = getState(request)
    const tenantId = getTenantId(request)
    const parts = parsePath(request)
    const patientId = parts[2] as string
    const d = findDetail(state, patientId)
    if (!d) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    const body = (await request.json()) as CreateInvoiceInput
    const treatment = mockTreatmentOptions.find((t) => t.id === body.treatmentId)
    const metaTr = invoiceMetaPayload.treatments.find((t) => t.id === body.treatmentId)
    const id = `inv-${crypto.randomUUID()}`
    const num = `IN-${state.nextInvLocal++}`
    const payments =
      body.paidAmount != null && body.paidAmount > 0
        ? [
            {
              id: `pay-${crypto.randomUUID()}`,
              invoiceId: id,
              paidAt: new Date().toISOString().slice(0, 10),
              amount: Math.min(body.paidAmount, body.total),
            },
          ]
        : []
    const digits = d.profile.patientCode.replace(/\D/g, '') || '0'
    const inv: Invoice = {
      id,
      invoiceNumber: num,
      patientId,
      patientName: d.profile.name,
      patientRecordId: digits.slice(-9).padStart(9, '0'),
      treatmentTitle: treatment?.label ?? 'Treatment',
      treatmentSubtitle: metaTr?.subtitle ?? 'General Dentistry',
      invoiceDate: new Date().toISOString().slice(0, 10),
      total: body.total,
      notes: body.notes ?? '',
      payments,
    }
    d.invoices = [...d.invoices, inv]
    d.invoicesSummary = summarize(d.invoices)
    pushInvoiceToMockStore(tenantId, inv)
    return json(d)
  }),

  http.get(isPatientsCollection, ({ request }) => {
    const state = getState(request)
    const url = new URL(request.url)
    const q = (url.searchParams.get('q') ?? '').trim().toLowerCase()
    const page = Math.max(1, Number(url.searchParams.get('page') ?? '1') || 1)
    const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get('pageSize') ?? '8') || 8))

    let rows = state.list
    if (q) {
      rows = state.list.filter((p) => {
        const hay = [p.name, p.patientCode, p.phone, p.email, p.id].join(' ').toLowerCase()
        return hay.includes(q)
      })
    }
    const total = rows.length
    const start = (page - 1) * pageSize
    const items = rows.slice(start, start + pageSize)
    return json({ items, total, page, pageSize })
  }),

  http.post(isPatientsCollection, async ({ request }) => {
    const state = getState(request)
    const ord = getTenantOrdinal(getTenantId(request))
    const body = (await request.json()) as CreatePatientInput
    const id = `pt-new-${state.nextPatientId++}`
    const ageYears = new Date().getFullYear() - body.birthYear
    const row: PatientListItem = {
      id,
      name: `${body.fullName} C${ord + 1}`,
      patientCode: String(state.nextPatientId).padStart(9, '0'),
      phone: body.phone,
      email: body.email,
      lastVisit: new Date().toISOString().slice(0, 10),
      nextVisit: new Date().toISOString().slice(0, 10),
      ageYears,
      genderLabelKey: body.gender,
    }
    state.list = [...state.list, row]
    const blank: PatientDetailPayload = {
      profile: {
        id,
        name: `${body.fullName} C${ord + 1}`,
        patientCode: row.patientCode,
        genderLabelKey: body.gender,
        bloodType: body.bloodType,
        ageYears,
        contact: {
          email: body.email,
          phone: body.phone,
          address: body.address,
        },
        activities: {
          lastVisit: row.lastVisit,
          nextVisit: row.nextVisit,
        },
        files: [],
      },
      appointments: [],
      invoicesSummary: { totalInvoiced: 0, totalPaid: 0, totalRemaining: 0 },
      invoices: [],
      dentalChart: applyDentalMode({ mode: 'adult', teeth: {} }, 'adult'),
      treatments: [],
      clinicalHistory: null,
    }
    state.details[id] = blank
    return json(row)
  }),

  http.get(isPatientDetailGet, ({ request }) => {
    const state = getState(request)
    const parts = parsePath(request)
    const id = parts[2] as string
    const d = findDetail(state, id)
    if (!d) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    d.invoicesSummary = summarize(d.invoices)
    return json({ ...d, invoices: d.invoices.map((x) => ({ ...x, payments: x.payments.map((p) => ({ ...p })) })) })
  }),

  http.patch(isPatientDetailPatch, async ({ request }) => {
    const state = getState(request)
    const parts = parsePath(request)
    const id = parts[2] as string
    const d = findDetail(state, id)
    if (!d) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    const body = (await request.json()) as Partial<PatientDetailPayload['profile']> & {
      contact?: PatientDetailPayload['profile']['contact']
      activities?: PatientDetailPayload['profile']['activities']
    }
    if (body.name != null) d.profile.name = body.name
    if (body.patientCode != null) d.profile.patientCode = body.patientCode
    if (body.genderLabelKey != null) d.profile.genderLabelKey = body.genderLabelKey
    if (body.bloodType != null) d.profile.bloodType = body.bloodType
    if (body.ageYears != null) d.profile.ageYears = body.ageYears
    if (body.contact) {
      d.profile.contact = { ...d.profile.contact, ...body.contact }
    }
    if (body.activities) {
      d.profile.activities = { ...d.profile.activities, ...body.activities }
    }
    const row = state.list.find((x) => x.id === id)
    if (row) {
      row.name = d.profile.name
      row.patientCode = d.profile.patientCode
      row.phone = d.profile.contact.phone
      row.email = d.profile.contact.email
      row.lastVisit = d.profile.activities.lastVisit
      row.nextVisit = d.profile.activities.nextVisit
      row.ageYears = d.profile.ageYears
      row.genderLabelKey = d.profile.genderLabelKey
    }
    d.invoicesSummary = summarize(d.invoices)
    return json(d)
  }),

  http.patch(isDentalChartPatch, async ({ request }) => {
    const state = getState(request)
    const parts = parsePath(request)
    const id = parts[2] as string
    const d = findDetail(state, id)
    if (!d) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    const body = (await request.json()) as PatchDentalChartInput
    if (body.mode != null) {
      d.dentalChart = applyDentalMode(d.dentalChart, body.mode)
    }
    if (body.teeth) {
      const next: Record<string, ToothStatusKey> = { ...d.dentalChart.teeth }
      for (const [k, v] of Object.entries(body.teeth)) {
        if (v !== undefined) next[k] = v
      }
      d.dentalChart.teeth = next
    }
    if (body.treatmentDraft) {
      const { toothId, category, treatmentType, notes, price, paid } = body.treatmentDraft
      const parsedPrice = Number.isFinite(price) ? price : 0
      const parsedPaid = Number.isFinite(paid) ? paid : 0
      const treatment: PatientTreatment = {
        id: `tr-${crypto.randomUUID()}`,
        category: category.trim() || 'Category',
        treatmentType: treatmentType.trim() || 'Treatment',
        toothLabel: `Tooth ${toothId}`,
        toothFdiId: toothId,
        date: new Date().toISOString().slice(0, 10),
        notes: notes.trim(),
        price: parsedPrice,
        paid: parsedPaid,
        remaining: Math.max(0, parsedPrice - parsedPaid),
        stages: [],
      }
      d.treatments = [treatment, ...d.treatments]
    }
    return json(d)
  }),

  http.post(isStagesPost, async ({ request }) => {
    const state = getState(request)
    const parts = parsePath(request)
    const patientId = parts[2] as string
    const treatmentId = parts[4] as string
    const d = findDetail(state, patientId)
    if (!d) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    const body = (await request.json()) as { description: string }
    const t = d.treatments.find((x) => x.id === treatmentId)
    if (!t) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    const nextNum =
      t.stages.length > 0 ? Math.max(...t.stages.map((s) => s.stageNumber)) + 1 : 1
    const stage: TreatmentStage = {
      id: `st-${crypto.randomUUID()}`,
      stageNumber: nextNum,
      date: new Date().toISOString().slice(0, 10),
      description: body.description.trim(),
    }
    t.stages = [stage, ...t.stages]
    return json(d)
  }),

  http.put(isClinicalPut, async ({ request }) => {
    const state = getState(request)
    const parts = parsePath(request)
    const id = parts[2] as string
    const d = findDetail(state, id)
    if (!d) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    const body = (await request.json()) as ClinicalHistorySummary
    d.clinicalHistory = { ...body }
    return json(d)
  }),

  http.delete(isAppointmentDelete, ({ request }) => {
    const state = getState(request)
    const parts = parsePath(request)
    const patientId = parts[2] as string
    const appointmentId = parts[4] as string
    const d = findDetail(state, patientId)
    if (!d) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    const before = d.appointments.length
    d.appointments = d.appointments.filter((a) => a.id !== appointmentId)
    if (d.appointments.length === before) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    return json(d)
  }),

  http.delete(isFileDelete, ({ request }) => {
    const state = getState(request)
    const parts = parsePath(request)
    const patientId = parts[2] as string
    const fileId = parts[4] as string
    const d = findDetail(state, patientId)
    if (!d) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    d.profile.files = d.profile.files.filter((f) => f.id !== fileId)
    return json(d)
  }),

  http.delete(isPatientDelete, ({ request }) => {
    const state = getState(request)
    const parts = parsePath(request)
    const id = parts[2] as string
    const idx = state.list.findIndex((x) => x.id === id)
    if (idx === -1) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    state.list = state.list.filter((x) => x.id !== id)
    delete state.details[id]
    return json(null)
  }),
]
