import { useMutation, useQueryClient } from '@tanstack/react-query'

import { labsApi } from '@/api/modules/labs.api'
import { queryKeys } from '@/constants/queryKeys'
import { useClinicStore } from '@/store/clinic.store'

export const useDeleteLab = () => {
  const queryClient = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useMutation({
    mutationFn: (id: string) => labsApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.labs.list(activeClinicId ?? '__none__'),
      })
    },
  })
}
