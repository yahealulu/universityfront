import { useMutation, useQueryClient } from '@tanstack/react-query'

import { invoicesApi } from '@/api/modules/invoices.api'
import { queryKeys } from '@/constants/queryKeys'
import type { Invoice, InvoicePaymentInput } from '@/types/invoice.types'
import { useClinicStore } from '@/store/clinic.store'

export const useUpdateInvoicePayment = () => {
  const queryClient = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useMutation({
    mutationFn: ({
      invoiceId,
      paymentId,
      body,
    }: {
      invoiceId: string
      paymentId: string
      body: InvoicePaymentInput
    }) => invoicesApi.updatePayment(invoiceId, paymentId, body),
    onSuccess: (_data, variables) => {
      const cid = activeClinicId ?? '__none__'
      void queryClient.invalidateQueries({ queryKey: queryKeys.invoices.list(cid) })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.invoices.detail(cid, variables.invoiceId),
      })
      const inv = queryClient.getQueryData<Invoice>(queryKeys.invoices.detail(cid, variables.invoiceId))
      if (inv?.patientId) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.patients.detail(cid, inv.patientId) })
      }
    },
  })
}
