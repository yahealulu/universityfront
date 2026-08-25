import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type LabRequestsPaginationProps = {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
}

export const LabRequestsPagination: FC<LabRequestsPaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  const { t } = useTranslation()

  if (totalPages <= 1) return null

  const pages: (number | 'ellipsis')[] = []
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1, 2, 3)
    if (totalPages > 4) pages.push('ellipsis')
    if (!pages.includes(totalPages)) pages.push(totalPages)
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="gap-1 text-muted-foreground"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
        {t('labRequests.pagination.previous')}
      </Button>
      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`e-${i}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={cn(
              'flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-semibold transition-colors',
              page === p ? 'bg-primary text-white' : 'text-foreground hover:bg-page'
            )}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        )
      )}
      <Button
        type="button"
        size="sm"
        className="gap-1 bg-primary text-white hover:opacity-90"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        {t('labRequests.pagination.next')}
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
