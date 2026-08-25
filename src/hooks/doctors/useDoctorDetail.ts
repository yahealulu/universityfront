import { useQuery } from '@tanstack/react-query'

import { doctorsApi } from '@/api/modules/doctors.api'
import { queryKeys } from '@/constants/queryKeys'
import { useClinicStore } from '@/store/clinic.store'

export const useDoctorDetail = (doctorId: string | undefined) => {
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useQuery({
    queryKey: queryKeys.doctors.detail(activeClinicId ?? '__none__', doctorId ?? ''),
    queryFn: () => doctorsApi.getDetail(doctorId as string),
    enabled: Boolean(activeClinicId && doctorId),
  })
}
