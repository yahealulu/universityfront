import { useMutation, useQueryClient } from '@tanstack/react-query'

import { settingsApi } from '@/api/modules/settings.api'
import { queryKeys } from '@/constants/queryKeys'
import type { SettingsPatchPayload } from '@/types/settings.types'
import { useClinicStore } from '@/store/clinic.store'

export const useUpdateSettings = () => {
  const queryClient = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)
  const cid = activeClinicId ?? '__none__'

  return useMutation({
    mutationFn: (body: SettingsPatchPayload) => settingsApi.patch(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.settings.detail(cid) })
    },
  })
}
