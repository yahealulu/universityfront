import { useMutation, useQueryClient } from '@tanstack/react-query'

import { invoicesApi } from '@/api/modules/invoices.api'
import { queryKeys } from '@/constants/queryKeys'
import type { Invoice, InvoicePaymentInput } from '@/types/invoice.types'
import { useClinicStore } from '@/store/clinic.store'

export const useAddInvoicePayments = () => {
  const queryClient = useQueryClient()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useMutation({
    mutationFn: ({ invoiceId, payments }: { invoiceId: string; payments: InvoicePaymentInput[] }) =>
      invoicesApi.addPayments(invoiceId, payments),
    onSuccess: (invoice: Invoice) => {
      const cid = activeClinicId ?? '__none__'
      void queryClient.invalidateQueries({ queryKey: queryKeys.invoices.list(cid) })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.invoices.detail(cid, invoice.id),
      })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.patients.detail(cid, invoice.patientId),
      })
    },
  })
}
