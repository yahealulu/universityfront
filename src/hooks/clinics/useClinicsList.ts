import { useQuery } from '@tanstack/react-query'

import { clinicsApi } from '@/api/modules/clinics.api'
import { queryKeys } from '@/constants/queryKeys'

export const useClinicsList = () =>
  useQuery({
    queryKey: queryKeys.clinics.list(),
    queryFn: () => clinicsApi.getList(),
    staleTime: 60_000,
  })
