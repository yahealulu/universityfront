import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { dashboardApi } from '@/api/modules/dashboard.api'
import { queryKeys } from '@/constants/queryKeys'
import { useClinicStore } from '@/store/clinic.store'

export const useRevenueChart = () => {
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  const { from, to } = useMemo(() => {
    const y = new Date().getFullYear()
    return { from: `${y}-01-01`, to: `${y}-06-30` }
  }, [])

  return useQuery({
    queryKey: queryKeys.dashboard.revenueExpenses(activeClinicId ?? '__none__', from, to),
    queryFn: () => dashboardApi.getRevenueExpenses({ from, to }),
    enabled: Boolean(activeClinicId),
    staleTime: 1000 * 60 * 5,
  })
}
