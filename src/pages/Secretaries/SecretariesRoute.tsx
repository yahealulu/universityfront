import { lazy, Suspense, type FC } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

const SecretariesPage = lazy(() =>
  import('@/pages/Secretaries').then((m) => ({ default: m.SecretariesPage }))
)

export const SecretariesRoute: FC = () => (
  <Suspense
    fallback={
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-12 w-full max-w-xl" />
        <Skeleton className="h-72 w-full" />
      </div>
    }
  >
    <SecretariesPage />
  </Suspense>
)
