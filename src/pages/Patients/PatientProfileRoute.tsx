import { lazy, Suspense, type FC } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

const PatientProfilePage = lazy(() =>
  import('@/pages/Patients/PatientProfilePage').then((m) => ({
    default: m.PatientProfilePage,
  }))
)

export const PatientProfileRoute: FC = () => (
  <Suspense
    fallback={
      <div className="space-y-4">
        <Skeleton className="h-12 w-full max-w-3xl" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    }
  >
    <PatientProfilePage />
  </Suspense>
)
