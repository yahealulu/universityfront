import { useMutation, useQueryClient } from '@tanstack/react-query'

import { labRequestsApi } from '@/api/modules/lab-requests.api'
import { queryKeys } from '@/constants/queryKeys'
import type { LabRequestUpsertInput } from '@/types/lab-request.types'
import { useClinicStore } from '@/store/clinic.store'

export const useCreateLabRequest = () => {
  const queryClient = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useMutation({
    mutationFn: (body: LabRequestUpsertInput) => labRequestsApi.create(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.labRequests.list(activeClinicId ?? '__none__'),
      })
    },
  })
}
