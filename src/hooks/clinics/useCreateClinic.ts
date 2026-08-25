import { useMutation, useQueryClient } from '@tanstack/react-query'

import { clinicsApi } from '@/api/modules/clinics.api'
import { queryKeys } from '@/constants/queryKeys'
import { useClinicStore } from '@/store/clinic.store'
import type { CreateClinicPayload } from '@/types/clinic.types'

export const useCreateClinic = () => {
  const queryClient = useQueryClient()
  const setActiveClinicId = useClinicStore((s) => s.setActiveClinicId)

  return useMutation({
    mutationFn: (payload: CreateClinicPayload) => clinicsApi.create(payload),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.clinics.list() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.reports.all })
      setActiveClinicId(data.id)
    },
  })
}
