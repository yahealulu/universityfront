import { http, HttpResponse } from 'msw'

import {
  DOCTOR_MAX_SLOTS,
  seedDoctorRecords,
  seedPayments,
  seedSpecialties,
  seedTreatments,
  toDoctorFull,
  toListItem,
  type DoctorRecord,
} from '@/mocks/data/doctors.mock'
import { getTenantId, getTenantOrdinal } from '@/mocks/handlers/utils'
import type {
  DoctorCreateInput,
  DoctorDetailPayload,
  DoctorPayment,
  DoctorPaymentUpsertInput,
  DoctorsListPayload,
  DoctorsMetaPayload,
  DoctorTreatment,
  DoctorUpdateInput,
} from '@/types/doctor.types'

const json = <T>(data: T) =>
  HttpResponse.json({ success: true as const, data })

const cloneRecord = (r: DoctorRecord): DoctorRecord => ({
  ...r,
  detailStats: { ...r.detailStats },
})

type DoctorsState = {
  doctors: DoctorRecord[]
  payments: DoctorPayment[]
  treatments: DoctorTreatment[]
  nextPaySeq: number
}

const byTenant = new Map<string, DoctorsState>()

const getState = (request: Request): DoctorsState => {
  const tenantId = getTenantId(request)
  const cached = byTenant.get(tenantId)
  if (cached) return cached
  const ord = getTenantOrdinal(tenantId)
  const seeded: DoctorsState = {
    doctors: seedDoctorRecords.map((d) => ({
      ...cloneRecord(d),
      id: `${d.id}-c${ord + 1}`,
      name: `${d.name} C${ord + 1}`,
      firstName: `${d.firstName} C${ord + 1}`,
    })),
    payments: seedPayments.map((p) => ({ ...p, id: `${p.id}-c${ord + 1}` })),
    treatments: seedTreatments.map((t) => ({ ...t, id: `${t.id}-c${ord + 1}` })),
    nextPaySeq: 500000 + ord * 1000,
  }
  byTenant.set(tenantId, seeded)
  return seeded
}

const parsePath = (request: Request) => {
  const pathname = new URL(request.url).pathname.replace(/\/$/, '')
  return pathname.split('/').filter(Boolean)
}

const isDoctorsMetaGet = ({ request }: { request: Request }) => {
  if (request.method !== 'GET') return false
  const parts = parsePath(request)
  return (
    parts.length === 3 &&
    parts[0] === 'api' &&
    parts[1] === 'doctors' &&
    parts[2] === 'meta'
  )
}

const isDoctorsListGet = ({ request }: { request: Request }) => {
  if (request.method !== 'GET') return false
  const parts = parsePath(request)
  return parts.length === 2 && parts[0] === 'api' && parts[1] === 'doctors'
}

const isDoctorDetailGet = ({ request }: { request: Request }) => {
  if (request.method !== 'GET') return false
  const parts = parsePath(request)
  return (
    parts.length === 3 &&
    parts[0] === 'api' &&
    parts[1] === 'doctors' &&
    Boolean(parts[2]) &&
    parts[2] !== 'meta'
  )
}

const isDoctorsPost = ({ request }: { request: Request }) => {
  if (request.method !== 'POST') return false
  const parts = parsePath(request)
  return parts.length === 2 && parts[0] === 'api' && parts[1] === 'doctors'
}

const isDoctorPatch = ({ request }: { request: Request }) => {
  if (request.method !== 'PATCH') return false
  const parts = parsePath(request)
  return (
    parts.length === 3 && parts[0] === 'api' && parts[1] === 'doctors' && Boolean(parts[2])
  )
}

const isDoctorDelete = ({ request }: { request: Request }) => {
  if (request.method !== 'DELETE') return false
  const parts = parsePath(request)
  return (
    parts.length === 3 && parts[0] === 'api' && parts[1] === 'doctors' && Boolean(parts[2])
  )
}

const isDoctorPaymentsPost = ({ request }: { request: Request }) => {
  if (request.method !== 'POST') return false
  const parts = parsePath(request)
  return (
    parts.length === 4 &&
    parts[0] === 'api' &&
    parts[1] === 'doctors' &&
    parts[3] === 'payments'
  )
}

const isDoctorPaymentPatch = ({ request }: { request: Request }) => {
  if (request.method !== 'PATCH') return false
  const parts = parsePath(request)
  return (
    parts.length === 5 &&
    parts[0] === 'api' &&
    parts[1] === 'doctors' &&
    parts[3] === 'payments'
  )
}

const isDoctorPaymentDelete = ({ request }: { request: Request }) => {
  if (request.method !== 'DELETE') return false
  const parts = parsePath(request)
  return (
    parts.length === 5 &&
    parts[0] === 'api' &&
    parts[1] === 'doctors' &&
    parts[3] === 'payments'
  )
}

const findDoctor = (state: DoctorsState, id: string) => state.doctors.find((d) => d.id === id)

const buildListPayload = (state: DoctorsState): DoctorsListPayload => ({
  doctors: state.doctors.map((d) => toListItem(toDoctorFull(d))),
  quota: {
    max: DOCTOR_MAX_SLOTS,
    remaining: Math.max(0, DOCTOR_MAX_SLOTS - state.doctors.length),
  },
})

const buildMeta = (): DoctorsMetaPayload => ({
  specialties: seedSpecialties.map((s) => ({ id: s.id, label: s.label })),
})

const buildDetail = (state: DoctorsState, id: string): DoctorDetailPayload | null => {
  const doc = findDoctor(state, id)
  if (!doc) return null
  return {
    doctor: toDoctorFull(doc),
    stats: doc.detailStats,
    payments: state.payments.filter((p) => p.doctorId === id).map((p) => ({ ...p })),
    treatments: state.treatments.filter((t) => t.doctorId === id).map((t) => ({ ...t })),
  }
}

export const doctorsHandlers = [
  http.get(isDoctorsMetaGet, () => json(buildMeta())),

  http.get(isDoctorsListGet, ({ request }) => json(buildListPayload(getState(request)))),

  http.get(isDoctorDetailGet, ({ request }) => {
    const state = getState(request)
    const parts = parsePath(request)
    const id = parts[2] as string
    const detail = buildDetail(state, id)
    if (!detail) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    return json(detail)
  }),

  http.post(isDoctorsPost, async ({ request }) => {
    const state = getState(request)
    if (state.doctors.length >= DOCTOR_MAX_SLOTS) {
      return HttpResponse.json({ success: false as const, message: 'Quota full' }, { status: 400 })
    }
    const body = (await request.json()) as DoctorCreateInput
    const sp = seedSpecialties.find((s) => s.id === body.specialtyId)
    const specialtyLabel = sp?.label ?? 'General Dentistry'
    const id = `dr-${crypto.randomUUID()}`
    const registeredAt = new Date().toISOString()
    const email = `${body.firstName.toLowerCase()}.${body.lastName.toLowerCase()}@clinic.com`
    const record: DoctorRecord = {
      id,
      username: body.username,
      firstName: body.firstName,
      lastName: body.lastName,
      name: `Dr. ${body.firstName} ${body.lastName}`,
      specialtyId: body.specialtyId,
      specialtyLabel,
      specialization: specialtyLabel,
      phone: body.phone,
      commissionPercent: body.commissionPercent,
      certificateNumber: body.certificateNumber?.trim() ? body.certificateNumber.trim() : null,
      email,
      registeredAt,
      hasAllClinics: body.hasAllClinics ?? false,
      clinicIds: body.clinicIds ?? [],
      treatmentsThisMonth: 0,
      revenueThisMonth: 0,
      outstandingThisMonth: 0,
      detailStats: {
        totalTreatments: 0,
        totalRevenue: 0,
        outstandingPayments: 0,
        remainingPayments: 0,
      },
    }
    state.doctors.push(record)
    return json(toDoctorFull(record))
  }),

  http.patch(isDoctorPatch, async ({ request }) => {
    const state = getState(request)
    const parts = parsePath(request)
    const id = parts[2] as string
    const idx = state.doctors.findIndex((d) => d.id === id)
    if (idx === -1) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    const prev = state.doctors[idx]!
    const body = (await request.json()) as DoctorUpdateInput
    const sp = seedSpecialties.find((s) => s.id === body.specialtyId)
    const specialtyLabel = sp?.label ?? prev.specialtyLabel
    const updated: DoctorRecord = {
      ...prev,
      firstName: body.firstName,
      lastName: body.lastName,
      name: `Dr. ${body.firstName} ${body.lastName}`,
      specialtyId: body.specialtyId,
      specialtyLabel,
      specialization: specialtyLabel,
      phone: body.phone,
      commissionPercent: body.commissionPercent,
      certificateNumber: body.certificateNumber?.trim() ? body.certificateNumber.trim() : null,
      email: `${body.firstName.toLowerCase()}.${body.lastName.toLowerCase()}@clinic.com`,
    }
    state.doctors[idx] = updated
    return json(toDoctorFull(updated))
  }),

  http.delete(isDoctorDelete, ({ request }) => {
    const state = getState(request)
    const parts = parsePath(request)
    const id = parts[2] as string
    const idx = state.doctors.findIndex((d) => d.id === id)
    if (idx === -1) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    state.doctors.splice(idx, 1)
    state.payments = state.payments.filter((p) => p.doctorId !== id)
    state.treatments = state.treatments.filter((t) => t.doctorId !== id)
    return new HttpResponse(null, { status: 204 })
  }),

  http.post(isDoctorPaymentsPost, async ({ request }) => {
    const state = getState(request)
    const parts = parsePath(request)
    const doctorId = parts[2] as string
    if (!findDoctor(state, doctorId)) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    const body = (await request.json()) as DoctorPaymentUpsertInput
    state.nextPaySeq += 1
    const row: DoctorPayment = {
      id: `dp-${crypto.randomUUID()}`,
      doctorId,
      paymentNumber: `P-${state.nextPaySeq}`,
      paidAt: body.paidAt,
      amount: body.amount,
      paymentMethod: body.paymentMethod?.trim() ?? '',
    }
    state.payments.push(row)
    return json({ ...row })
  }),

  http.patch(isDoctorPaymentPatch, async ({ request }) => {
    const state = getState(request)
    const parts = parsePath(request)
    const doctorId = parts[2] as string
    const paymentId = parts[4] as string
    const idx = state.payments.findIndex((p) => p.id === paymentId && p.doctorId === doctorId)
    if (idx === -1) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    const body = (await request.json()) as DoctorPaymentUpsertInput
    const prev = state.payments[idx] as DoctorPayment
    state.payments[idx] = {
      ...prev,
      paidAt: body.paidAt,
      amount: body.amount,
      paymentMethod: body.paymentMethod?.trim() ?? '',
    }
    return json({ ...state.payments[idx] })
  }),

  http.delete(isDoctorPaymentDelete, ({ request }) => {
    const state = getState(request)
    const parts = parsePath(request)
    const doctorId = parts[2] as string
    const paymentId = parts[4] as string
    const idx = state.payments.findIndex((p) => p.id === paymentId && p.doctorId === doctorId)
    if (idx === -1) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    state.payments.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
