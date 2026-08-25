import { useQuery } from '@tanstack/react-query'

import { labRequestsApi } from '@/api/modules/lab-requests.api'
import { queryKeys } from '@/constants/queryKeys'
import { useClinicStore } from '@/store/clinic.store'

export const useLabRequestsList = () => {
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useQuery({
    queryKey: queryKeys.labRequests.list(activeClinicId ?? '__none__'),
    queryFn: () => labRequestsApi.list(),
    enabled: Boolean(activeClinicId),
  })
}
