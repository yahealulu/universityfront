import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { queryClient } from '@/lib/queryClient'
import { useClinicStore } from '@/store/clinic.store'

type QueryProviderProps = {
  children: ReactNode
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  useEffect(() => {
    const unsub = useClinicStore.subscribe(
      (state, prev) => {
        if (state.activeClinicId !== prev.activeClinicId) {
          void queryClient.invalidateQueries()
        }
      }
    )
    return unsub
  }, [])

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
