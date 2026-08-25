import { lazy, Suspense, type FC } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

const PatientsPage = lazy(() =>
  import('@/pages/Patients').then((m) => ({ default: m.PatientsPage }))
)

export const PatientsRoute: FC = () => (
  <Suspense
    fallback={
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    }
  >
    <PatientsPage />
  </Suspense>
)
