import { Plus, Search } from 'lucide-react'
import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { doctorsApi } from '@/api/modules/doctors.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useDeleteDoctor } from '@/hooks/doctors/useDeleteDoctor'
import { useDoctorsList } from '@/hooks/doctors/useDoctorsList'
import { useDoctorsMeta } from '@/hooks/doctors/useDoctorsMeta'
import type { DoctorFull, DoctorListItem } from '@/types/doctor.types'

import { AddDoctorWizardModal } from './components/AddDoctorWizardModal'
import { DoctorsPagination } from './components/DoctorsPagination'
import { DoctorsTable } from './components/DoctorsTable'

const PAGE_SIZE = 8

const filterDoctors = (rows: DoctorListItem[], q: string): DoctorListItem[] => {
  const query = q.trim().toLowerCase()
  if (!query) return rows
  return rows.filter((row) => {
    const hay = [row.id, row.name, row.specialization, row.phone].join(' ').toLowerCase()
    return hay.includes(query)
  })
}

export const DoctorsPage: FC = () => {
  const { t } = useTranslation()
  const listQuery = useDoctorsList()
  const metaQuery = useDoctorsMeta()
  const deleteMutation = useDeleteDoctor()

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [wizardOpen, setWizardOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<DoctorFull | null>(null)

  const doctors = useMemo(() => listQuery.data?.doctors ?? [], [listQuery.data])
  const quota = listQuery.data?.quota

  useEffect(() => {
    setPage(1)
  }, [search])

  const filtered = useMemo(() => filterDoctors(doctors, search), [doctors, search])

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
    setEditingDoctor(null)
    setWizardOpen(true)
  }

  const handleEditFromTable = async (row: DoctorListItem) => {
    const detail = await doctorsApi.getDetail(row.id)
    setEditingDoctor(detail.doctor)
    setWizardOpen(true)
  }

  const handleModalOpenChange = (open: boolean) => {
    setWizardOpen(open)
    if (!open) setEditingDoctor(null)
  }

  const handleDelete = (row: DoctorListItem) => {
    if (!window.confirm(t('doctors.deleteConfirm', { name: row.name }))) return
    void deleteMutation.mutateAsync(row.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">{t('doctors.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">{t('doctors.subtitle')}</p>
        </div>
        {quota && (
          <div
            className="shrink-0 rounded-full border-2 border-amber-500 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800"
            role="status"
          >
            {t('doctors.quota.remaining', { count: quota.remaining })}
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
            placeholder={t('doctors.searchPlaceholder')}
            aria-label={t('doctors.searchAria')}
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
          {t('doctors.addButton')}
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
            <p className="text-sm text-muted-foreground">{t('doctors.error.load')}</p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => void listQuery.refetch()}
            >
              {t('doctors.error.retry')}
            </Button>
          </div>
        )}

        {listQuery.data && !listQuery.isPending && (
          <>
            {filtered.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">{t('doctors.empty')}</p>
            ) : (
              <>
                <DoctorsTable
                  doctors={pageRows}
                  onEdit={handleEditFromTable}
                  onDelete={handleDelete}
                />
                <DoctorsPagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
              </>
            )}
          </>
        )}
      </div>

      <AddDoctorWizardModal
        open={wizardOpen}
        onOpenChange={handleModalOpenChange}
        editingDoctor={editingDoctor}
        meta={metaQuery.data}
      />
    </div>
  )
}
