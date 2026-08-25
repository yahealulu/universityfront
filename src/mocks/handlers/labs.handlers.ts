import { http, HttpResponse } from 'msw'

import { seedLabs } from '@/mocks/data/labs.mock'
import { getTenantId, getTenantOrdinal } from '@/mocks/handlers/utils'
import type { Lab } from '@/types/lab.types'

const json = <T>(data: T) =>
  HttpResponse.json({ success: true as const, data })

const cloneLab = (l: Lab): Lab => ({ ...l })

const byTenant = new Map<string, Lab[]>()

const getLabs = (request: Request): Lab[] => {
  const tenantId = getTenantId(request)
  const cached = byTenant.get(tenantId)
  if (cached) return cached
  const ord = getTenantOrdinal(tenantId)
  const seeded = seedLabs.map((l) => ({
    ...cloneLab(l),
    id: `${l.id}-c${ord + 1}`,
    name: `${l.name} C${ord + 1}`,
  }))
  byTenant.set(tenantId, seeded)
  return seeded
}

const parsePath = (request: Request) => {
  const pathname = new URL(request.url).pathname.replace(/\/$/, '')
  return pathname.split('/').filter(Boolean)
}

const isLabsListGet = ({ request }: { request: Request }) => {
  if (request.method !== 'GET') return false
  const parts = parsePath(request)
  return parts.length === 2 && parts[0] === 'api' && parts[1] === 'labs'
}

const isLabByIdPath = (request: Request) => {
  const parts = parsePath(request)
  return (
    parts.length === 3 && parts[0] === 'api' && parts[1] === 'labs' && Boolean(parts[2])
  )
}

const isLabPatch = ({ request }: { request: Request }) =>
  request.method === 'PATCH' && isLabByIdPath(request)

const isLabDelete = ({ request }: { request: Request }) =>
  request.method === 'DELETE' && isLabByIdPath(request)

const isLabsPost = ({ request }: { request: Request }) => {
  if (request.method !== 'POST') return false
  const parts = parsePath(request)
  return parts.length === 2 && parts[0] === 'api' && parts[1] === 'labs'
}

export const labsHandlers = [
  http.get(isLabsListGet, ({ request }) => {
    const labs = getLabs(request)
    return json(labs.map(cloneLab))
  }),

  http.post(isLabsPost, async ({ request }) => {
    const labs = getLabs(request)
    const body = (await request.json()) as { name: string; phone: string; address: string }
    const id = `lab-${crypto.randomUUID()}`
    const lab: Lab = {
      id,
      name: body.name,
      phone: body.phone,
      address: body.address,
      totalRequests: 0,
      activeRequests: 0,
    }
    labs.push(lab)
    return json(cloneLab(lab))
  }),

  http.patch(isLabPatch, async ({ request }) => {
    const labs = getLabs(request)
    const parts = parsePath(request)
    const id = parts[2] as string
    const idx = labs.findIndex((l) => l.id === id)
    if (idx === -1) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    const body = (await request.json()) as { name: string; phone: string; address: string }
    const prev = labs[idx] as Lab
    labs[idx] = {
      ...prev,
      name: body.name,
      phone: body.phone,
      address: body.address,
    }
    return json(cloneLab(labs[idx] as Lab))
  }),

  http.delete(isLabDelete, ({ request }) => {
    const labs = getLabs(request)
    const parts = parsePath(request)
    const id = parts[2] as string
    const idx = labs.findIndex((l) => l.id === id)
    if (idx === -1) {
      return HttpResponse.json({ success: false as const, message: 'Not found' }, { status: 404 })
    }
    labs.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
