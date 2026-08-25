import { Plus, Search } from 'lucide-react'
import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { secretariesApi } from '@/api/modules/secretaries.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useDeleteSecretary } from '@/hooks/secretaries/useDeleteSecretary'
import { useSecretariesList } from '@/hooks/secretaries/useSecretariesList'
import type { SecretaryFull, SecretaryListItem } from '@/types/secretary.types'

import { AddSecretaryWizardModal } from './components/AddSecretaryWizardModal'
import { SecretariesPagination } from './components/SecretariesPagination'
import { SecretariesTable } from './components/SecretariesTable'

const PAGE_SIZE = 8

const filterRows = (rows: SecretaryListItem[], q: string): SecretaryListItem[] => {
  const query = q.trim().toLowerCase()
  if (!query) return rows
  return rows.filter((row) => {
    const hay = [row.id, row.name, row.phone, row.username].join(' ').toLowerCase()
    return hay.includes(query)
  })
}

export const SecretariesPage: FC = () => {
  const { t } = useTranslation()
  const listQuery = useSecretariesList()
  const deleteMutation = useDeleteSecretary()

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [wizardOpen, setWizardOpen] = useState(false)
  const [editingSecretary, setEditingSecretary] = useState<SecretaryFull | null>(null)

  const secretaries = useMemo(() => listQuery.data?.secretaries ?? [], [listQuery.data])
  const quota = listQuery.data?.quota

  useEffect(() => {
    setPage(1)
  }, [search])

  const filtered = useMemo(() => filterRows(secretaries, search), [secretaries, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage]
  )

  useEffect(() => {
    if (page !== safePage) setPage(safePage)
  }, [page, safePage])

  const openCreate = () => {
    setEditingSecretary(null)
    setWizardOpen(true)
  }

  const handleEditFromTable = async (row: SecretaryListItem) => {
    const detail = await secretariesApi.getDetail(row.id)
    setEditingSecretary(detail)
    setWizardOpen(true)
  }

  const handleModalOpenChange = (open: boolean) => {
    setWizardOpen(open)
    if (!open) setEditingSecretary(null)
  }

  const handleDelete = (row: SecretaryListItem) => {
    if (!window.confirm(t('secretaries.deleteConfirm', { name: row.name }))) return
    void deleteMutation.mutateAsync(row.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">{t('secretaries.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">{t('secretaries.subtitle')}</p>
        </div>
        {quota && (
          <div
            className="shrink-0 rounded-full border-2 border-amber-500 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800"
            role="status"
          >
            {t('secretaries.quota.remaining', { count: quota.remaining })}
          </div>
        )}
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
            placeholder={t('secretaries.searchPlaceholder')}
            aria-label={t('secretaries.searchAria')}
            className="ps-9"
          />
        </div>
        <Button
          type="button"
          className="shrink-0 gap-1"
          onClick={openCreate}
          disabled={quota !== undefined && quota.remaining <= 0}
        >
          <Plus className="h-4 w-4" />
          {t('secretaries.addNurse')}
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
            <p className="text-sm text-muted-foreground">{t('secretaries.error.load')}</p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => void listQuery.refetch()}
            >
              {t('secretaries.error.retry')}
            </Button>
          </div>
        )}

        {listQuery.data && !listQuery.isPending && (
          <>
            {filtered.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">{t('secretaries.empty')}</p>
            ) : (
              <>
                <SecretariesTable rows={pageRows} onEdit={handleEditFromTable} onDelete={handleDelete} />
                <SecretariesPagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
              </>
            )}
          </>
        )}
      </div>

      <AddSecretaryWizardModal
        open={wizardOpen}
        onOpenChange={handleModalOpenChange}
        editingSecretary={editingSecretary}
      />
    </div>
  )
}
