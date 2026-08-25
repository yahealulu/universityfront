import { useMutation, useQueryClient } from '@tanstack/react-query'

import { doctorsApi } from '@/api/modules/doctors.api'
import { queryKeys } from '@/constants/queryKeys'
import type { DoctorUpdateInput } from '@/types/doctor.types'
import { useClinicStore } from '@/store/clinic.store'

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: DoctorUpdateInput }) =>
      doctorsApi.update(id, body),
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.doctors.list(activeClinicId ?? '__none__'),
      })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.doctors.detail(activeClinicId ?? '__none__', id),
      })
    },
  })
}
