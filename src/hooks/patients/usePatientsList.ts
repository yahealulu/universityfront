import { useQuery } from '@tanstack/react-query'

import { patientsApi } from '@/api/modules/patients.api'
import { queryKeys } from '@/constants/queryKeys'
import { useClinicStore } from '@/store/clinic.store'

export const usePatientsList = (q: string, page: number, pageSize: number) => {
  const activeClinicId = useClinicStore((s) => s.activeClinicId)
  const cid = activeClinicId ?? '__none__'

  return useQuery({
    queryKey: queryKeys.patients.list(cid, q, page, pageSize),
    queryFn: () => patientsApi.list({ q: q || undefined, page, pageSize }),
    enabled: Boolean(activeClinicId),
  })
}
