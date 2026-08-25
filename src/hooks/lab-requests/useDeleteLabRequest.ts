import { useMutation, useQueryClient } from '@tanstack/react-query'

import { labRequestsApi } from '@/api/modules/lab-requests.api'
import { queryKeys } from '@/constants/queryKeys'
import { useClinicStore } from '@/store/clinic.store'

export const useDeleteLabRequest = () => {
  const queryClient = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useMutation({
    mutationFn: (id: string) => labRequestsApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.labRequests.list(activeClinicId ?? '__none__'),
      })
    },
  })
}
