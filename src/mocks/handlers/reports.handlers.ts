import { http, HttpResponse } from 'msw'

import { getClinicsSnapshot } from '@/mocks/data/clinics.mock'
import { getReportsBundle } from '@/mocks/data/reports.mock'
import { getTenantId } from '@/mocks/handlers/utils'

const json = <T>(data: T) =>
  HttpResponse.json({ success: true as const, data })

const isReportsBundleGet = ({ request }: { request: Request }) => {
  if (request.method !== 'GET') return false
  const url = new URL(request.url)
  return url.pathname.replace(/\/$/, '').endsWith('/api/reports') && !url.pathname.includes('clinics')
}

const isReportsClinicsGet = ({ request }: { request: Request }) => {
  if (request.method !== 'GET') return false
  const url = new URL(request.url)
  return url.pathname.replace(/\/$/, '').endsWith('/api/reports/clinics')
}

export const reportsHandlers = [
  http.get(isReportsBundleGet, ({ request }) => json(getReportsBundle(getTenantId(request)))),
  http.get(isReportsClinicsGet, () => json(getClinicsSnapshot())),
]
