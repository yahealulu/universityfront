import { useQuery } from '@tanstack/react-query'

import { patientsApi } from '@/api/modules/patients.api'
import { queryKeys } from '@/constants/queryKeys'
import { useClinicStore } from '@/store/clinic.store'

type UsePatientDetailOptions = {
  enabled?: boolean
}

export const usePatientDetail = (
  patientId: string | undefined,
  options?: UsePatientDetailOptions
) => {
  const activeClinicId = useClinicStore((s) => s.activeClinicId)
  const cid = activeClinicId ?? '__none__'
  const extraEnabled = options?.enabled ?? true

  return useQuery({
    queryKey: queryKeys.patients.detail(cid, patientId ?? '__none__'),
    queryFn: () => patientsApi.getDetail(patientId as string),
    enabled: Boolean(activeClinicId && patientId) && extraEnabled,
  })
}
