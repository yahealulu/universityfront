import { useMutation, useQueryClient } from '@tanstack/react-query'

import { doctorsApi } from '@/api/modules/doctors.api'
import { queryKeys } from '@/constants/queryKeys'
import type { DoctorCreateInput } from '@/types/doctor.types'
import { useClinicStore } from '@/store/clinic.store'

export const useCreateDoctor = () => {
  const queryClient = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useMutation({
    mutationFn: (body: DoctorCreateInput) => doctorsApi.create(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.doctors.list(activeClinicId ?? '__none__'),
      })
    },
  })
}
