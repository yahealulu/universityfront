import { useQuery } from '@tanstack/react-query'

import { clinicsApi } from '@/api/modules/clinics.api'
import { queryKeys } from '@/constants/queryKeys'

type UseClinicsListOptions = {
  enabled?: boolean
}

export const useClinicsList = (options?: UseClinicsListOptions) =>
  useQuery({
    queryKey: queryKeys.clinics.list(),
    queryFn: () => clinicsApi.getList(),
    staleTime: 60_000,
    enabled: options?.enabled ?? true,
  })
