import { useQuery } from '@tanstack/react-query'

import { appointmentsApi } from '@/api/modules/appointments.api'
import { queryKeys } from '@/constants/queryKeys'
import { useClinicStore } from '@/store/clinic.store'

export const useAppointmentSchedule = (date: string) => {
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useQuery({
    queryKey: queryKeys.appointments.schedule(activeClinicId ?? '__none__', date),
    queryFn: () => appointmentsApi.getSchedule({ date }),
    enabled: Boolean(activeClinicId),
  })
}
