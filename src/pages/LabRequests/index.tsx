import { Plus, Search } from 'lucide-react'
import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useDeleteLabRequest } from '@/hooks/lab-requests/useDeleteLabRequest'
import { useLabRequestsList } from '@/hooks/lab-requests/useLabRequestsList'
import { useLabRequestsMeta } from '@/hooks/lab-requests/useLabRequestsMeta'
import type { LabRequest } from '@/types/lab-request.types'

import { LabRequestFormModal } from './components/LabRequestFormModal'
import { LabRequestsPagination } from './components/LabRequestsPagination'
import { LabRequestsTable } from './components/LabRequestsTable'

const PAGE_SIZE = 8

const filterRequests = (rows: LabRequest[], q: string): LabRequest[] => {
  const query = q.trim().toLowerCase()
  if (!query) return rows
  return rows.filter((row) => {
    const hay = [
      row.id,
      row.labName,
      row.patientName,
      row.patientCode,
      row.workTypeLabel,
      row.requestDate,
    ]
      .join(' ')
      .toLowerCase()
    return hay.includes(query)
  })
}

export const LabRequestsPage: FC = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const labIdFromUrl = searchParams.get('labId')

  const listQuery = useLabRequestsList()
  const metaQuery = useLabRequestsMeta()
  const deleteMutation = useDeleteLabRequest()

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRequest, setEditingRequest] = useState<LabRequest | null>(null)

  useEffect(() => {
    setPage(1)
  }, [search])

  const filtered = useMemo(() => {
    const data = listQuery.data
    if (!data) return []
    return filterRequests(data, search)
  }, [listQuery.data, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage]
  )

  useEffect(() => {
    if (page !== safePage) setPage(safePage)
  }, [page, safePage])

  const openAdd = () => {
    setEditingRequest(null)
    setModalOpen(true)
  }

  const openEdit = (row: LabRequest) => {
    setEditingRequest(row)
    setModalOpen(true)
  }

  const handleModalOpenChange = (open: boolean) => {
    setModalOpen(open)
    if (!open) setEditingRequest(null)
  }

  const handleDelete = (row: LabRequest) => {
    if (
      !window.confirm(
        t('labRequests.deleteConfirm', { labName: row.labName, patientName: row.patientName })
      )
    )
      return
    void deleteMutation.mutateAsync(row.id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">{t('labRequests.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">{t('labRequests.subtitle')}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search
            className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('labRequests.searchPlaceholder')}
            aria-label={t('labRequests.searchAria')}
            className="ps-9"
          />
        </div>
        <Button type="button" className="shrink-0 gap-1" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          {t('labRequests.addButton')}
        </Button>
      </div>

      <div className="rounded-card border border-border-card bg-surface p-4 shadow-card md:p-6">
        {(listQuery.isPending || metaQuery.isPending) && (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        )}

        {listQuery.isError && (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">{t('labRequests.error.load')}</p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => void listQuery.refetch()}
            >
              {t('labRequests.error.retry')}
            </Button>
          </div>
        )}

        {listQuery.data && !listQuery.isPending && (
          <>
            {filtered.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                {t('labRequests.empty')}
              </p>
            ) : (
              <>
                <LabRequestsTable
                  requests={pageRows}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
                <LabRequestsPagination
                  page={safePage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </>
            )}
          </>
        )}
      </div>

      <LabRequestFormModal
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
        editingRequest={editingRequest}
        meta={metaQuery.data}
        initialLabId={editingRequest ? null : labIdFromUrl}
      />
    </div>
  )
}
