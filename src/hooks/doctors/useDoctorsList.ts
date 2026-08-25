import { useQuery } from '@tanstack/react-query'

import { doctorsApi } from '@/api/modules/doctors.api'
import { queryKeys } from '@/constants/queryKeys'
import { useClinicStore } from '@/store/clinic.store'

export const useDoctorsList = () => {
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useQuery({
    queryKey: queryKeys.doctors.list(activeClinicId ?? '__none__'),
    queryFn: () => doctorsApi.list(),
    enabled: Boolean(activeClinicId),
  })
}
