import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useInvoicesList } from '@/hooks/invoices/useInvoicesList'
import { useInvoicesMeta } from '@/hooks/invoices/useInvoicesMeta'
import type { Invoice } from '@/types/invoice.types'
import { getInvoiceDerived } from '@/types/invoice.types'

import { AddInvoiceModal } from './components/AddInvoiceModal'
import type { InvoiceFilter } from './components/InvoiceToolbar'
import { InvoiceDetailsModal } from './components/InvoiceDetailsModal'
import { InvoicePagination } from './components/InvoicePagination'
import { InvoicesTable } from './components/InvoicesTable'
import { InvoiceToolbar } from './components/InvoiceToolbar'

const PAGE_SIZE = 8

const filterInvoice = (inv: Invoice, filter: InvoiceFilter, q: string): boolean => {
  const { status } = getInvoiceDerived(inv)
  if (filter !== 'all' && status !== filter) return false
  const query = q.trim().toLowerCase()
  if (!query) return true
  const hay = [
    inv.invoiceNumber,
    inv.patientName,
    inv.treatmentTitle,
    inv.patientRecordId,
    inv.id,
  ]
    .join(' ')
    .toLowerCase()
  return hay.includes(query)
}

export const InvoicesPage: FC = () => {
  const { t } = useTranslation()
  const listQuery = useInvoicesList()
  const metaQuery = useInvoicesMeta()

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<InvoiceFilter>('all')
  const [page, setPage] = useState(1)
  const [addOpen, setAddOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsId, setDetailsId] = useState<string | null>(null)

  useEffect(() => {
    setPage(1)
  }, [search, filter])

  const filtered = useMemo(() => {
    const data = listQuery.data
    if (!data) return []
    return data.filter((inv) => filterInvoice(inv, filter, search))
  }, [listQuery.data, filter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage]
  )

  useEffect(() => {
    if (page !== safePage) setPage(safePage)
  }, [page, safePage])

  const openDetails = (id: string) => {
    setDetailsId(id)
    setDetailsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">{t('invoices.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">{t('invoices.subtitle')}</p>
        </div>
        <Button type="button" className="shrink-0" onClick={() => setAddOpen(true)}>
          {t('invoices.addButton')}
        </Button>
      </div>

      <div className="rounded-card border border-border-card bg-surface p-4 shadow-card md:p-6">
        {listQuery.isPending && (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        )}

        {listQuery.isError && (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">{t('invoices.error.load')}</p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => void listQuery.refetch()}
            >
              {t('invoices.error.retry')}
            </Button>
          </div>
        )}

        {listQuery.data && (
          <>
            <InvoiceToolbar
              search={search}
              onSearchChange={setSearch}
              filter={filter}
              onFilterChange={setFilter}
            />
            {filtered.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">{t('invoices.empty')}</p>
            ) : (
              <>
                <InvoicesTable invoices={pageRows} onEdit={openDetails} />
                <InvoicePagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
              </>
            )}
          </>
        )}
      </div>

      <AddInvoiceModal open={addOpen} onOpenChange={setAddOpen} meta={metaQuery.data} />

      <InvoiceDetailsModal
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) setDetailsId(null)
        }}
        invoiceId={detailsId}
      />
    </div>
  )
}
