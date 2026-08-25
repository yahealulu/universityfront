import { useQuery } from '@tanstack/react-query'

import { labsApi } from '@/api/modules/labs.api'
import { queryKeys } from '@/constants/queryKeys'
import { useClinicStore } from '@/store/clinic.store'

export const useLabsList = () => {
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useQuery({
    queryKey: queryKeys.labs.list(activeClinicId ?? '__none__'),
    queryFn: () => labsApi.list(),
    enabled: Boolean(activeClinicId),
  })
}
