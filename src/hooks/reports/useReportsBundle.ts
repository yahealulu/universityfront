import { useQuery } from '@tanstack/react-query'

import { reportsApi } from '@/api/modules/reports.api'
import { queryKeys } from '@/constants/queryKeys'
import type { ReportsPeriod } from '@/types/reports.types'
import { useClinicStore } from '@/store/clinic.store'

export const useReportsBundle = (period: ReportsPeriod, clinicId: string | null) => {
  const activeClinicId = useClinicStore((s) => s.activeClinicId)
  const effectiveClinicId = clinicId ?? activeClinicId

  return useQuery({
    queryKey: queryKeys.reports.bundle(effectiveClinicId ?? '__none__', period),
    queryFn: () =>
      reportsApi.getBundle({
        period,
        clinicId: effectiveClinicId ?? '',
      }),
    enabled: Boolean(effectiveClinicId),
  })
}
