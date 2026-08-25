import { ChevronRight, Plus, Search } from 'lucide-react'
import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { usePatientDetail } from '@/hooks/patients/usePatientDetail'
import { useDeletePatient } from '@/hooks/patients/usePatientMutations'
import { usePatientsList } from '@/hooks/patients/usePatientsList'
import { cn } from '@/lib/utils'
import { getPatientListVisiblePages } from '@/utils/patientListPagination'

import { AddPatientModal } from './components/AddPatientModal'
import { EditPatientProfileModal } from './components/EditPatientProfileModal'
import { PatientsTable } from './components/PatientsTable'

const PAGE_SIZE = 5

export const PatientsPage: FC = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [page, setPage] = useState(1)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editPatientId, setEditPatientId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const deletePatient = useDeletePatient()

  const editDetailQuery = usePatientDetail(editPatientId ?? undefined, {
    enabled: editOpen && Boolean(editPatientId),
  })

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(search.trim()), 300)
    return () => window.clearTimeout(id)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [debounced])

  const listQuery = usePatientsList(debounced, page, PAGE_SIZE)

  const totalPages = useMemo(() => {
    const total = listQuery.data?.total ?? 0
    return Math.max(1, Math.ceil(total / PAGE_SIZE))
  }, [listQuery.data?.total])

  const safePage = Math.min(page, totalPages)

  useEffect(() => {
    if (page !== safePage) setPage(safePage)
  }, [page, safePage])

  const rows = listQuery.data?.items ?? []

  const pageItems = useMemo(
    () => getPatientListVisiblePages(safePage, totalPages),
    [safePage, totalPages]
  )

  const handleEditOpenChange = (open: boolean) => {
    setEditOpen(open)
    if (!open) setEditPatientId(null)
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    try {
      await deletePatient.mutateAsync(deleteId)
      setDeleteId(null)
    } catch {
      /* error surfaced via mutation state */
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">{t('patients.list.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">{t('patients.list.subtitle')}</p>
      </div>

      <div className="rounded-card border border-border-card bg-surface p-4 shadow-card md:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('patients.list.searchPlaceholder')}
              className="ps-9"
              aria-label={t('patients.list.searchAria')}
            />
          </div>
          <Button type="button" className="shrink-0 gap-2" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            {t('patients.list.addPatient')}
          </Button>
        </div>

        {listQuery.isPending && (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        )}

        {listQuery.isError && (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">{t('patients.list.error')}</p>
            <Button type="button" className="mt-4" onClick={() => void listQuery.refetch()}>
              {t('patients.list.retry')}
            </Button>
          </div>
        )}

        {listQuery.data && rows.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">{t('patients.list.empty')}</div>
        )}

        {listQuery.data && rows.length > 0 && (
          <PatientsTable
            rows={rows}
            onEdit={(id) => {
              setEditPatientId(id)
              setEditOpen(true)
            }}
            onDelete={setDeleteId}
          />
        )}

        {listQuery.data && rows.length > 0 && (
          <nav
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
            aria-label={t('patients.list.paginationAria')}
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              {t('patients.list.prev')}
            </Button>
            {pageItems.map((item, idx) =>
              item === 'ellipsis' ? (
                <span
                  key={`e-${idx}`}
                  className="px-2 text-sm text-muted-foreground"
                  aria-hidden
                >
                  …
                </span>
              ) : (
                <Button
                  key={item}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'min-w-9',
                    item === safePage
                      ? 'bg-primary/15 font-semibold text-primary hover:bg-primary/20'
                      : 'text-muted-foreground'
                  )}
                  onClick={() => setPage(item)}
                  aria-label={t('patients.list.pageAria', { page: item })}
                  aria-current={item === safePage ? 'page' : undefined}
                >
                  {item}
                </Button>
              )
            )}
            <Button
              type="button"
              size="sm"
              disabled={safePage >= totalPages}
              className="gap-1 bg-primary-navy text-white hover:bg-primary-navy/90"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              {t('patients.list.next')}
              <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Button>
          </nav>
        )}
      </div>

      <AddPatientModal open={addOpen} onOpenChange={setAddOpen} />

      {editPatientId ? (
        <EditPatientProfileModal
          open={editOpen}
          onOpenChange={handleEditOpenChange}
          patientId={editPatientId}
          profile={editDetailQuery.data?.profile}
        />
      ) : null}

      <Dialog
        open={deleteId !== null}
        onOpenChange={(o) => {
          if (!o) {
            setDeleteId(null)
            deletePatient.reset()
          }
        }}
      >
        <DialogContent className="sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t('patients.list.deleteConfirmTitle')}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{t('patients.list.deleteConfirmDescription')}</p>
          {deletePatient.isError && (
            <p className="text-sm text-danger" role="alert">
              {t('patients.list.deleteError')}
            </p>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={deletePatient.isPending}
            >
              {t('patients.list.deleteConfirmCancel')}
            </Button>
            <Button
              type="button"
              className="bg-danger text-white hover:opacity-90"
              disabled={deletePatient.isPending}
              onClick={() => void handleConfirmDelete()}
            >
              {deletePatient.isPending
                ? t('patients.list.deleteConfirmLoading')
                : t('patients.list.deleteConfirmAction')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
