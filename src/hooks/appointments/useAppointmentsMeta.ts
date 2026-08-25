import { useQuery } from '@tanstack/react-query'

import { appointmentsApi } from '@/api/modules/appointments.api'
import { queryKeys } from '@/constants/queryKeys'
import { useClinicStore } from '@/store/clinic.store'

export const useAppointmentsMeta = () => {
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useQuery({
    queryKey: queryKeys.appointments.meta(activeClinicId ?? '__none__'),
    queryFn: () => appointmentsApi.getMeta(),
    enabled: Boolean(activeClinicId),
    staleTime: 60_000,
  })
}
