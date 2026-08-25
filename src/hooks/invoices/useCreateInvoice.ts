import { useMutation, useQueryClient } from '@tanstack/react-query'

import { invoicesApi } from '@/api/modules/invoices.api'
import { queryKeys } from '@/constants/queryKeys'
import type { CreateInvoiceInput } from '@/types/invoice.types'
import { useClinicStore } from '@/store/clinic.store'

export const useCreateInvoice = () => {
  const queryClient = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useMutation({
    mutationFn: (input: CreateInvoiceInput) => invoicesApi.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.invoices.list(activeClinicId ?? '__none__'),
      })
    },
  })
}
