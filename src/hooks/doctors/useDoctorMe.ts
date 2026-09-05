import { useQuery } from '@tanstack/react-query'

import { doctorsApi } from '@/api/modules/doctors.api'
import { queryKeys } from '@/constants/queryKeys'
import { useClinicStore } from '@/store/clinic.store'

export const useDoctorMe = () => {
  const clinicId = useClinicStore((s) => s.activeClinicId)

  return useQuery({
    queryKey: [...queryKeys.doctors.all, 'me', clinicId] as const,
    queryFn: () => doctorsApi.getMe(),
    enabled: Boolean(clinicId),
    staleTime: 30_000,
  })
}
