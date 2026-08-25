import { getClinicsSnapshot } from '@/mocks/data/clinics.mock'

const DEV_DEFAULT_TENANT = '00000000-0000-4000-8000-000000000001'

export const getTenantId = (request: Request): string => {
  const header = request.headers.get('X-Tenant-ID')?.trim()
  if (header) return header
  return DEV_DEFAULT_TENANT
}

export const getTenantOrdinal = (tenantId: string): number => {
  const clinics = getClinicsSnapshot()
  const idx = clinics.findIndex((c) => c.id === tenantId)
  if (idx >= 0) return idx
  return 0
}

export const getTenantLabel = (tenantId: string): string => {
  const clinics = getClinicsSnapshot()
  const found = clinics.find((c) => c.id === tenantId)
  return found?.name ?? 'Clinic'
}
