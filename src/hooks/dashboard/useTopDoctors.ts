import { useQuery } from '@tanstack/react-query'

import { dashboardApi } from '@/api/modules/dashboard.api'
import { queryKeys } from '@/constants/queryKeys'
import { useClinicStore } from '@/store/clinic.store'

export const useTopDoctors = () => {
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useQuery({
    queryKey: queryKeys.dashboard.topDoctors(activeClinicId ?? '__none__'),
    queryFn: () => dashboardApi.getTopDoctors(),
    enabled: Boolean(activeClinicId),
    staleTime: 1000 * 60 * 5,
  })
}
