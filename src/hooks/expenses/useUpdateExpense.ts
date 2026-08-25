import { useMutation, useQueryClient } from '@tanstack/react-query'

import { expensesApi } from '@/api/modules/expenses.api'
import { queryKeys } from '@/constants/queryKeys'
import type { ExpenseUpdateInput } from '@/types/expense.types'
import { useClinicStore } from '@/store/clinic.store'

export const useUpdateExpense = () => {
  const queryClient = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)
  const cid = activeClinicId ?? '__none__'

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ExpenseUpdateInput }) =>
      expensesApi.update(id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.expenses.list(cid) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.expenses.summary(cid) })
    },
  })
}
