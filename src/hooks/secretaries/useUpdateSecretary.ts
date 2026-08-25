import { useMutation, useQueryClient } from '@tanstack/react-query'

import { secretariesApi } from '@/api/modules/secretaries.api'
import { queryKeys } from '@/constants/queryKeys'
import type { SecretaryUpdateInput } from '@/types/secretary.types'
import { useClinicStore } from '@/store/clinic.store'

export const useUpdateSecretary = () => {
  const queryClient = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: SecretaryUpdateInput }) =>
      secretariesApi.update(id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.secretaries.list(activeClinicId ?? '__none__'),
      })
    },
  })
}
