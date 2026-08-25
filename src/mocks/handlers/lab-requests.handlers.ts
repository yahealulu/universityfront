import { http, HttpResponse } from 'msw'

import { mockPatientOptions } from '@/mocks/data/appointments.mock'
import {
  mockWorkTypes,
  seedLabRequests,
} from '@/mocks/data/lab-requests.mock'
import { seedLabs } from '@/mocks/data/labs.mock'
import { getTenantId, getTenantOrdinal } from '@/mocks/handlers/utils'
import type { LabRequest, LabRequestUpsertInput } from '@/types/lab-request.types'

const json = <T>(data: T) =>
  HttpResponse.json({ success: true as const, data })

const cloneReq = (r: LabRequest): LabRequest => ({ ...r })

const byTenant = new Map<string, LabRequest[]>()

const getRequests = (request: Request): LabRequest[] => {
  const tenantId = getTenantId(request)
  const cached = byTenant.get(tenantId)
  if (cached) return cached
  const ord = getTenantOrdinal(tenantId)
  const seeded = seedLabRequests.map((r) => ({
    ...cloneReq(r),
    id: `${r.id}-c${ord + 1}`,
    patientName: `${r.patientName} C${ord + 1}`,
  }))
  byTenant.set(tenantId, seeded)
  return seeded
}

const metaPayload = {
  labs: seedLabs.map((l) => ({ id: l.id, name: l.name })),
  patients: mockPatientOptions.map((p) => ({
    id: p.id,
    displayName: p.displayName,
    patientCode: p.patientCode,
  })),
  workTypes: mockWorkTypes.map((w) => ({ id: w.id, label: w.label })),
}

const parsePath = (request: Request) => {
  const pathname = new URL(request.url).pathname.replace(/\/$/, '')
  return pathname.split('/').filter(Boolean)
}

const isLabRequestsMetaGet = ({ request }: { request: Request }) => {
  if (request.method !== 'GET') return false
  const parts = parsePath(request)
  return (
    parts.length === 3 &&
    parts[0] === 'api' &&
    parts[1] === 'lab-requests' &&
    parts[2] === 'meta'
  )
}

const isLabRequestsListGet = ({ request }: { request: Request }) => {
  if (request.method !== 'GET') return false
  const parts = parsePath(request)
  return parts.length === 2 && parts[0] === 'api' && parts[1] === 'lab-requests'
}

const isLabRequestByIdPath = (request: Request) => {
  const parts = parsePath(request)
  return (
    parts.length === 3 &&
    parts[0] === 'api' &&
    parts[1] === 'lab-requests' &&
    Boolean(parts[2]) &&
    parts[2] !== 'meta'
  )
}

const isLabRequestPost = ({ request }: { request: Request }) => {
  if (request.method !== 'POST') return false
  const parts = parsePath(request)
  return parts.length === 2 && parts[0] === 'api' && parts[1] === 'lab-requests'
}

const isLabRequestPatch = ({ request }: { request: Request }) =>
  request.method === 'PATCH' && isLabRequestByIdPath(request)

const isLabRequestDelete = ({ request }: { request: Request }) =>
  request.method === 'DELETE' && isLabRequestByIdPath(request)

const resolveDenormalized = (body: LabRequestUpsertInput): Omit<LabRequest, 'id' | 'status'> => {
  const lab = seedLabs.find((l) => body.labId.startsWith(l.id))
  const patient = mockPatientOptions.find((p) => body.patientId.startsWith(p.id))
  const wt = mockWorkTypes.find((w) => w.id === body.workTypeId)
  if (!lab || !patient || !wt) {
    throw new Error('Invalid references')
  }
  return {
    labId: body.labId,
    labName: lab.name,
    patientId: body.patientId,
    patientName: patient.displayName,
    patientCode: patient.patientCode,
    workTypeId: body.workTypeId,
    workTypeLabel: wt.label,
    quantity: body.quantity,
    requestDate: body.requestDate,
    costUsd: body.costUsd,
    notes: body.notes,
  }
}

export const labRequestsHandlers = [
  http.get(isLabRequestsMetaGet, ({ request }) => {
    const ord = getTenantOrdinal(getTenantId(request))
    return json({
      ...metaPayload,
      patients: metaPayload.patients.map((p) => ({
        ...p,
        id: `${p.id}-c${ord + 1}`,
        displayName: `${p.displayName} C${ord + 1}`,
      })),
      labs: metaPayload.labs.map((l) => ({ ...l, id: `${l.id}-c${ord + 1}`, name: `${l.name} C${ord + 1}` })),
    })
  }),

  http.get(isLabRequestsListGet, ({ request }) => {
    const requests = getRequests(request)
    return json(requests.map(cloneReq))
  }),

  http.post(isLabRequestPost, async ({ request }) => {
    const requests = getRequests(request)
    const body = (await request.json()) as LabRequestUpsertInput
    try {
      const row: LabRequest = {
        id: `lr-${crypto.randomUUID()}`,
        ...resolveDenormalized(body),
        status: body.status ?? 'pending',
      }
      requests.push(row)
      return json(cloneReq(row))
    } catch {
      return HttpResponse.json({ success: false as const, message: 'Bad request' }, { status: 400 })
    }
  }),

  http.patch(isLabRequestPatch, async ({ request }) => {
    const requests = getRequests(request)
    const parts = parsePath(request)
    const id = parts[2] as string
    const idx = requests.findIndex((r) => r.id === id)
    if (idx === -1) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    const body = (await request.json()) as LabRequestUpsertInput
    const prev = requests[idx] as LabRequest
    try {
      const merged: LabRequest = {
        id,
        ...resolveDenormalized(body),
        status: body.status ?? prev.status,
      }
      requests[idx] = merged
      return json(cloneReq(merged))
    } catch {
      return HttpResponse.json({ success: false as const, message: 'Bad request' }, { status: 400 })
    }
  }),

  http.delete(isLabRequestDelete, ({ request }) => {
    const requests = getRequests(request)
    const parts = parsePath(request)
    const id = parts[2] as string
    const idx = requests.findIndex((r) => r.id === id)
    if (idx === -1) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    requests.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
