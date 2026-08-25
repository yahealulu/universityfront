import { useMutation, useQueryClient } from '@tanstack/react-query'

import { labsApi } from '@/api/modules/labs.api'
import { queryKeys } from '@/constants/queryKeys'
import type { LabUpsertInput } from '@/types/lab.types'
import { useClinicStore } from '@/store/clinic.store'

export const useCreateLab = () => {
  const queryClient = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useMutation({
    mutationFn: (body: LabUpsertInput) => labsApi.create(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.labs.list(activeClinicId ?? '__none__'),
      })
    },
  })
}
