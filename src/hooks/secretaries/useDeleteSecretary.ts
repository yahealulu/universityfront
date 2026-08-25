import { useMutation, useQueryClient } from '@tanstack/react-query'

import { secretariesApi } from '@/api/modules/secretaries.api'
import { queryKeys } from '@/constants/queryKeys'
import { useClinicStore } from '@/store/clinic.store'

export const useDeleteSecretary = () => {
  const queryClient = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useMutation({
    mutationFn: (id: string) => secretariesApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.secretaries.list(activeClinicId ?? '__none__'),
      })
    },
  })
}
