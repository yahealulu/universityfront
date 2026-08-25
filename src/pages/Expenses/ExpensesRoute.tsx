import { lazy, Suspense, type FC } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

const ExpensesPage = lazy(() => import('@/pages/Expenses').then((m) => ({ default: m.ExpensesPage })))

export const ExpensesRoute: FC = () => (
  <Suspense
    fallback={
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    }
  >
    <ExpensesPage />
  </Suspense>
)
