import { useQuery } from '@tanstack/react-query'

import { invoicesApi } from '@/api/modules/invoices.api'
import { queryKeys } from '@/constants/queryKeys'
import { useClinicStore } from '@/store/clinic.store'

export const useInvoice = (id: string | null) => {
  const activeClinicId = useClinicStore((s) => s.activeClinicId)

  return useQuery({
    queryKey: queryKeys.invoices.detail(activeClinicId ?? '__none__', id ?? '__none__'),
    queryFn: () => invoicesApi.getById(id as string),
    enabled: Boolean(activeClinicId && id),
  })
}
