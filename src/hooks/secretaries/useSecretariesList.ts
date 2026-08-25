import { useQuery } from '@tanstack/react-query'

import { secretariesApi } from '@/api/modules/secretaries.api'
import { queryKeys } from '@/constants/queryKeys'
import { useClinicStore } from '@/store/clinic.store'

export const useSecretariesList = () => {
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useQuery({
    queryKey: queryKeys.secretaries.list(activeClinicId ?? '__none__'),
    queryFn: () => secretariesApi.list(),
    enabled: Boolean(activeClinicId),
  })
}
