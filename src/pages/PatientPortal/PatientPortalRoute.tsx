import { lazy, Suspense, type FC } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

const PatientPortalPage = lazy(() =>
  import('@/pages/PatientPortal/PatientPortalPage').then((m) => ({
    default: m.PatientPortalPage,
  }))
)

export const PatientPortalRoute: FC = () => (
  <Suspense
    fallback={
      <div className="min-h-screen bg-page p-6">
        <Skeleton className="mx-auto h-12 w-full max-w-2xl" />
        <div className="mx-auto mt-8 max-w-2xl space-y-4">
          <Skeleton className="h-40 w-full rounded-card" />
          <Skeleton className="h-32 w-full rounded-card" />
        </div>
      </div>
    }
  >
    <PatientPortalPage />
  </Suspense>
)
