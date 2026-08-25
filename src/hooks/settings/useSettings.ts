import { useQuery } from '@tanstack/react-query'

import { settingsApi } from '@/api/modules/settings.api'
import { queryKeys } from '@/constants/queryKeys'
import { useClinicStore } from '@/store/clinic.store'

export const useSettings = () => {
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useQuery({
    queryKey: queryKeys.settings.detail(activeClinicId ?? '__none__'),
    queryFn: () => settingsApi.get(),
    enabled: Boolean(activeClinicId),
  })
}
