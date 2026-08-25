import { lazy, Suspense, type FC } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

const AppointmentsPage = lazy(() =>
  import('@/pages/Appointments').then((m) => ({ default: m.AppointmentsPage }))
)

export const AppointmentsRoute: FC = () => (
  <Suspense
    fallback={
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[28rem] w-full max-w-5xl" />
      </div>
    }
  >
    <AppointmentsPage />
  </Suspense>
)
