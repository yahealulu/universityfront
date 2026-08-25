import { useMutation, useQueryClient } from '@tanstack/react-query'

import { doctorsApi } from '@/api/modules/doctors.api'
import { queryKeys } from '@/constants/queryKeys'
import { useClinicStore } from '@/store/clinic.store'

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useMutation({
    mutationFn: (id: string) => doctorsApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.doctors.list(activeClinicId ?? '__none__'),
      })
    },
  })
}
