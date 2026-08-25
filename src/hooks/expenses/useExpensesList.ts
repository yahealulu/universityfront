import { useQuery } from '@tanstack/react-query'

import { expensesApi } from '@/api/modules/expenses.api'
import { queryKeys } from '@/constants/queryKeys'
import { useClinicStore } from '@/store/clinic.store'

export const useExpensesList = () => {
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useQuery({
    queryKey: queryKeys.expenses.list(activeClinicId ?? '__none__'),
    queryFn: () => expensesApi.list(),
    enabled: Boolean(activeClinicId),
  })
}
