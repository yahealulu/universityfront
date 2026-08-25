import { Search } from 'lucide-react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { InvoiceStatus } from '@/types/invoice.types'
import { cn } from '@/lib/utils'

export type InvoiceFilter = 'all' | InvoiceStatus

export type InvoiceToolbarProps = {
  search: string
  onSearchChange: (v: string) => void
  filter: InvoiceFilter
  onFilterChange: (f: InvoiceFilter) => void
}

const filters: InvoiceFilter[] = ['all', 'paid', 'partially_paid', 'unpaid']

export const InvoiceToolbar: FC<InvoiceToolbarProps> = ({
  search,
  onSearchChange,
  filter,
  onFilterChange,
}) => {
  const { t } = useTranslation()

  return (
    <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-md">
        <Search
          className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('invoices.toolbar.searchPlaceholder')}
          className="ps-10"
          aria-label={t('invoices.toolbar.searchAria')}
        />
      </div>
      <div className="flex flex-wrap gap-1 rounded-xl bg-[#f1f5f9] p-1">
        {filters.map((f) => (
          <Button
            key={f}
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              'h-9 rounded-lg px-4 text-sm font-semibold',
              filter === f
                ? 'bg-surface text-foreground shadow-sm hover:bg-surface'
                : 'text-muted-foreground hover:bg-transparent hover:text-foreground'
            )}
            onClick={() => onFilterChange(f)}
          >
            {t(`invoices.filters.${f}`)}
          </Button>
        ))}
      </div>
    </div>
  )
}
