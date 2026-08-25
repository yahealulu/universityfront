import { Plus, Search } from 'lucide-react'
import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useDeleteLab } from '@/hooks/labs/useDeleteLab'
import { useLabsList } from '@/hooks/labs/useLabsList'
import type { Lab } from '@/types/lab.types'

import { LabFormModal } from './components/LabFormModal'
import { LabsPagination } from './components/LabsPagination'
import { LabsTable } from './components/LabsTable'

const PAGE_SIZE = 8

const filterLabs = (labs: Lab[], q: string): Lab[] => {
  const query = q.trim().toLowerCase()
  if (!query) return labs
  return labs.filter((lab) => {
    const hay = [lab.name, lab.address, lab.phone, lab.id].join(' ').toLowerCase()
    return hay.includes(query)
  })
}

export const LabsPage: FC = () => {
  const { t } = useTranslation()
  const listQuery = useLabsList()
  const deleteMutation = useDeleteLab()

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingLab, setEditingLab] = useState<Lab | null>(null)

  useEffect(() => {
    setPage(1)
  }, [search])

  const filtered = useMemo(() => {
    const data = listQuery.data
    if (!data) return []
    return filterLabs(data, search)
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
    setEditingLab(null)
    setModalOpen(true)
  }

  const openEdit = (lab: Lab) => {
    setEditingLab(lab)
    setModalOpen(true)
  }

  const handleModalOpenChange = (open: boolean) => {
    setModalOpen(open)
    if (!open) setEditingLab(null)
  }

  const handleDelete = (lab: Lab) => {
    if (!window.confirm(t('labs.deleteConfirm', { name: lab.name }))) return
    void deleteMutation.mutateAsync(lab.id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">{t('labs.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">{t('labs.subtitle')}</p>
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
            placeholder={t('labs.searchPlaceholder')}
            aria-label={t('labs.searchAria')}
            className="ps-9"
          />
        </div>
        <Button type="button" className="shrink-0 gap-1" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          {t('labs.addButton')}
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
            <p className="text-sm text-muted-foreground">{t('labs.error.load')}</p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => void listQuery.refetch()}
            >
              {t('labs.error.retry')}
            </Button>
          </div>
        )}

        {listQuery.data && (
          <>
            {filtered.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">{t('labs.empty')}</p>
            ) : (
              <>
                <LabsTable labs={pageRows} onEdit={openEdit} onDelete={handleDelete} />
                <LabsPagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
              </>
            )}
          </>
        )}
      </div>

      <LabFormModal open={modalOpen} onOpenChange={handleModalOpenChange} editingLab={editingLab} />
    </div>
  )
}
