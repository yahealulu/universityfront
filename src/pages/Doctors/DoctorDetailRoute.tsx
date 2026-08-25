import { lazy, Suspense, type FC } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

const DoctorDetailPage = lazy(() =>
  import('@/pages/Doctors/DoctorDetailPage').then((m) => ({ default: m.DoctorDetailPage }))
)

export const DoctorDetailRoute: FC = () => (
  <Suspense
    fallback={
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    }
  >
    <DoctorDetailPage />
  </Suspense>
)
