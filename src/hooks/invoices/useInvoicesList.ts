import { useQuery } from '@tanstack/react-query'

import { invoicesApi } from '@/api/modules/invoices.api'
import { queryKeys } from '@/constants/queryKeys'
import { useClinicStore } from '@/store/clinic.store'

export const useInvoicesList = () => {
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useQuery({
    queryKey: queryKeys.invoices.list(activeClinicId ?? '__none__'),
    queryFn: () => invoicesApi.list(),
    enabled: Boolean(activeClinicId),
  })
}
