import { http, HttpResponse } from 'msw'

import { appendClinic, getClinicsSnapshot } from '@/mocks/data/clinics.mock'
import type { CreateClinicPayload } from '@/types/clinic.types'

const json = <T>(data: T) =>
  HttpResponse.json({ success: true as const, data })

const parsePath = (request: Request) => {
  const pathname = new URL(request.url).pathname.replace(/\/$/, '')
  return pathname.split('/').filter(Boolean)
}

const isClinicsListGet = ({ request }: { request: Request }) => {
  if (request.method !== 'GET') return false
  const parts = parsePath(request)
  return parts.length === 2 && parts[0] === 'api' && parts[1] === 'clinics'
}

const isClinicsCreatePost = ({ request }: { request: Request }) => {
  if (request.method !== 'POST') return false
  const parts = parsePath(request)
  return parts.length === 2 && parts[0] === 'api' && parts[1] === 'clinics'
}

export const clinicsHandlers = [
  http.get(isClinicsListGet, () => json(getClinicsSnapshot())),

  http.post(isClinicsCreatePost, async ({ request }) => {
    const body = (await request.json()) as CreateClinicPayload
    const id = crypto.randomUUID()
    const created = appendClinic(body, id)
    return json({ id: created.id, name: created.name })
  }),
]
