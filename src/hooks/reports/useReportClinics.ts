import { useQuery } from '@tanstack/react-query'

import { reportsApi } from '@/api/modules/reports.api'
import { queryKeys } from '@/constants/queryKeys'
import { useClinicStore } from '@/store/clinic.store'

export const useReportClinics = () => {
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useQuery({
    queryKey: queryKeys.reports.clinics(activeClinicId ?? '__none__'),
    queryFn: () => reportsApi.getClinics(),
    enabled: Boolean(activeClinicId),
  })
}
