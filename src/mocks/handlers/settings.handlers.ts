import { http, HttpResponse } from 'msw'

import { seedSettings } from '@/mocks/data/settings.mock'
import { getTenantId, getTenantOrdinal } from '@/mocks/handlers/utils'
import type { SettingsPatchPayload, SettingsPayload } from '@/types/settings.types'

const json = <T>(data: T) =>
  HttpResponse.json({ success: true as const, data })

const parsePath = (request: Request) => {
  const pathname = new URL(request.url).pathname.replace(/\/$/, '')
  return pathname.split('/').filter(Boolean)
}

const deepMergeSettings = (
  base: SettingsPayload,
  patch: SettingsPatchPayload
): SettingsPayload => ({
  clinic: { ...base.clinic, ...patch.clinic },
  workDays: { ...base.workDays, ...patch.workDays },
  workHours: { ...base.workHours, ...patch.workHours },
})

const byTenant = new Map<string, SettingsPayload>()

const getStore = (request: Request): SettingsPayload => {
  const tenantId = getTenantId(request)
  const cached = byTenant.get(tenantId)
  if (cached) return cached
  const ord = getTenantOrdinal(tenantId)
  const seeded = structuredClone(seedSettings)
  seeded.clinic.name = `${seeded.clinic.name} C${ord + 1}`
  byTenant.set(tenantId, seeded)
  return seeded
}

const isSettingsRoot = ({ request }: { request: Request }) => {
  const parts = parsePath(request)
  return parts.length === 2 && parts[0] === 'api' && parts[1] === 'settings'
}

const isLogoPost = ({ request }: { request: Request }) => {
  if (request.method !== 'POST') return false
  const parts = parsePath(request)
  return parts.length === 3 && parts[0] === 'api' && parts[1] === 'settings' && parts[2] === 'logo'
}

export const settingsHandlers = [
  http.get(isSettingsRoot, ({ request }) => json<SettingsPayload>(getStore(request))),

  http.patch(isSettingsRoot, async ({ request }) => {
    const store = getStore(request)
    const body = (await request.json()) as SettingsPatchPayload
    const updated = deepMergeSettings(store, body)
    byTenant.set(getTenantId(request), updated)
    return json<SettingsPayload>(updated)
  }),

  http.post(isLogoPost, async ({ request }) => {
    const store = getStore(request)
    /** Pretend upload succeeded; serve existing public asset. */
    const logoUrl = '/logo-astroclinics.png'
    const updated = deepMergeSettings(store, { clinic: { ...store.clinic, logoUrl } })
    byTenant.set(getTenantId(request), updated)
    return json({ logoUrl })
  }),
]
