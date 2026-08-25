import { useMutation, useQueryClient } from '@tanstack/react-query'

import { appointmentsApi } from '@/api/modules/appointments.api'
import { queryKeys } from '@/constants/queryKeys'
import type { CreateAppointmentInput } from '@/types/appointment-schedule.types'
import { useClinicStore } from '@/store/clinic.store'

export const useCreateAppointment = () => {
  const queryClient = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useMutation({
    mutationFn: (input: CreateAppointmentInput) => appointmentsApi.create(input),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.schedule(activeClinicId ?? '__none__', variables.date),
      })
    },
  })
}
