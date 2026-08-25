import { http, HttpResponse } from 'msw'

import {
  SECRETARY_MAX_SLOTS,
  seedSecretaryRecords,
  toListItem,
  toSecretaryFull,
  type SecretaryRecord,
} from '@/mocks/data/secretaries.mock'
import { getTenantId, getTenantOrdinal } from '@/mocks/handlers/utils'
import type {
  SecretariesListPayload,
  SecretaryCreateInput,
  SecretaryUpdateInput,
} from '@/types/secretary.types'

const json = <T>(data: T) =>
  HttpResponse.json({ success: true as const, data })

const cloneRecord = (r: SecretaryRecord): SecretaryRecord => ({ ...r })

const byTenant = new Map<string, SecretaryRecord[]>()

const getSecretaries = (request: Request): SecretaryRecord[] => {
  const tenantId = getTenantId(request)
  const cached = byTenant.get(tenantId)
  if (cached) return cached
  const ord = getTenantOrdinal(tenantId)
  const seeded = seedSecretaryRecords.map((s) => ({
    ...cloneRecord(s),
    id: `${s.id}-c${ord + 1}`,
    name: `${s.name} C${ord + 1}`,
  }))
  byTenant.set(tenantId, seeded)
  return seeded
}

const parsePath = (request: Request) => {
  const pathname = new URL(request.url).pathname.replace(/\/$/, '')
  return pathname.split('/').filter(Boolean)
}

const isSecretariesListGet = ({ request }: { request: Request }) => {
  if (request.method !== 'GET') return false
  const parts = parsePath(request)
  return parts.length === 2 && parts[0] === 'api' && parts[1] === 'secretaries'
}

const isSecretaryDetailGet = ({ request }: { request: Request }) => {
  if (request.method !== 'GET') return false
  const parts = parsePath(request)
  return (
    parts.length === 3 && parts[0] === 'api' && parts[1] === 'secretaries' && Boolean(parts[2])
  )
}

const isSecretariesPost = ({ request }: { request: Request }) => {
  if (request.method !== 'POST') return false
  const parts = parsePath(request)
  return parts.length === 2 && parts[0] === 'api' && parts[1] === 'secretaries'
}

const isSecretaryPatch = ({ request }: { request: Request }) => {
  if (request.method !== 'PATCH') return false
  const parts = parsePath(request)
  return (
    parts.length === 3 && parts[0] === 'api' && parts[1] === 'secretaries' && Boolean(parts[2])
  )
}

const isSecretaryDelete = ({ request }: { request: Request }) => {
  if (request.method !== 'DELETE') return false
  const parts = parsePath(request)
  return (
    parts.length === 3 && parts[0] === 'api' && parts[1] === 'secretaries' && Boolean(parts[2])
  )
}

const findSecretary = (secretaries: SecretaryRecord[], id: string) => secretaries.find((s) => s.id === id)

const buildListPayload = (secretaries: SecretaryRecord[]): SecretariesListPayload => ({
  secretaries: secretaries.map((s) => toListItem(s)),
  quota: {
    max: SECRETARY_MAX_SLOTS,
    remaining: Math.max(0, SECRETARY_MAX_SLOTS - secretaries.length),
  },
})

export const secretariesHandlers = [
  http.get(isSecretariesListGet, ({ request }) => {
    const secretaries = getSecretaries(request)
    return json(buildListPayload(secretaries))
  }),

  http.get(isSecretaryDetailGet, ({ request }) => {
    const secretaries = getSecretaries(request)
    const parts = parsePath(request)
    const id = parts[2] as string
    const row = findSecretary(secretaries, id)
    if (!row) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    return json(toSecretaryFull(row))
  }),

  http.post(isSecretariesPost, async ({ request }) => {
    const secretaries = getSecretaries(request)
    if (secretaries.length >= SECRETARY_MAX_SLOTS) {
      return HttpResponse.json({ success: false as const, message: 'Quota full' }, { status: 400 })
    }
    const body = (await request.json()) as SecretaryCreateInput
    const id = `sec-${crypto.randomUUID()}`
    const record: SecretaryRecord = {
      id,
      username: body.username,
      firstName: body.firstName,
      lastName: body.lastName,
      name: `${body.firstName} ${body.lastName}`,
      phone: body.phone,
      salary: body.salary,
      passwordMock: body.password,
    }
    secretaries.push(record)
    return json(toSecretaryFull(record))
  }),

  http.patch(isSecretaryPatch, async ({ request }) => {
    const secretaries = getSecretaries(request)
    const parts = parsePath(request)
    const id = parts[2] as string
    const idx = secretaries.findIndex((s) => s.id === id)
    if (idx === -1) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    const prev = secretaries[idx]!
    const body = (await request.json()) as SecretaryUpdateInput
    const updated: SecretaryRecord = {
      ...prev,
      firstName: body.firstName,
      lastName: body.lastName,
      name: `${body.firstName} ${body.lastName}`,
      phone: body.phone,
      salary: body.salary,
    }
    secretaries[idx] = updated
    return json(toSecretaryFull(updated))
  }),

  http.delete(isSecretaryDelete, ({ request }) => {
    const secretaries = getSecretaries(request)
    const parts = parsePath(request)
    const id = parts[2] as string
    const idx = secretaries.findIndex((s) => s.id === id)
    if (idx === -1) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    secretaries.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
