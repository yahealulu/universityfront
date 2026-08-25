import { useQuery } from '@tanstack/react-query'

import { doctorsApi } from '@/api/modules/doctors.api'
import { queryKeys } from '@/constants/queryKeys'
import { useClinicStore } from '@/store/clinic.store'

export const useDoctorsMeta = () => {
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useQuery({
    queryKey: queryKeys.doctors.meta(activeClinicId ?? '__none__'),
    queryFn: () => doctorsApi.getMeta(),
    enabled: Boolean(activeClinicId),
  })
}
