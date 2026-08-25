import { Plus, Search } from 'lucide-react'
import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { expensesApi } from '@/api/modules/expenses.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useDeleteExpense } from '@/hooks/expenses/useDeleteExpense'
import { useExpensesList } from '@/hooks/expenses/useExpensesList'
import { useExpensesSummary } from '@/hooks/expenses/useExpensesSummary'
import { StatCard } from '@/pages/Dashboard/components/StatCard'
import type { ExpenseCategoryFilter, ExpenseListItem } from '@/types/expense.types'
import { formatCurrencyUsd } from '@/utils/formatters'

import { ExpenseFormModal } from './components/ExpenseFormModal'
import { ExpensesPagination } from './components/ExpensesPagination'
import { ExpensesTable } from './components/ExpensesTable'

const PAGE_SIZE = 8

const filterRows = (
  rows: ExpenseListItem[],
  q: string,
  category: ExpenseCategoryFilter
): ExpenseListItem[] => {
  let out = rows
  if (category !== 'all') {
    out = out.filter((r) => r.category === category)
  }
  const query = q.trim().toLowerCase()
  if (!query) return out
  return out.filter((row) => {
    const hay = [row.title, row.description, row.id, row.category].join(' ').toLowerCase()
    return hay.includes(query)
  })
}

export const ExpensesPage: FC = () => {
  const { t, i18n } = useTranslation()
  const locale = i18n.language

  const listQuery = useExpensesList()
  const summaryQuery = useExpensesSummary()
  const deleteMutation = useDeleteExpense()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ExpenseCategoryFilter>('all')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ExpenseListItem | null>(null)

  const expenses = useMemo(() => listQuery.data?.expenses ?? [], [listQuery.data])

  useEffect(() => {
    setPage(1)
  }, [search, category])

  const filtered = useMemo(
    () => filterRows(expenses, search, category),
    [expenses, search, category]
  )

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
    setEditing(null)
    setModalOpen(true)
  }

  const handleEdit = async (row: ExpenseListItem) => {
    const detail = await expensesApi.getDetail(row.id)
    setEditing(detail)
    setModalOpen(true)
  }

  const handleModalOpenChange = (open: boolean) => {
    setModalOpen(open)
    if (!open) setEditing(null)
  }

  const handleDelete = (row: ExpenseListItem) => {
    if (!window.confirm(t('expenses.deleteConfirm', { title: row.title }))) return
    void deleteMutation.mutateAsync(row.id)
  }

  const summary = summaryQuery.data
  const filterPills: { id: ExpenseCategoryFilter; labelKey: string }[] = [
    { id: 'all', labelKey: 'expenses.filters.all' },
    { id: 'labs', labelKey: 'expenses.filters.labs' },
    { id: 'doctors', labelKey: 'expenses.filters.doctors' },
    { id: 'others', labelKey: 'expenses.filters.others' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">{t('expenses.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">{t('expenses.subtitle')}</p>
        </div>
        <Button type="button" className="shrink-0 gap-1" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          {t('expenses.addButton')}
        </Button>
      </div>

      {summaryQuery.isPending && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-card" />
          ))}
        </div>
      )}

      {summary && !summaryQuery.isPending && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            titleKey="expenses.summary.labPayments"
            valueLabel={formatCurrencyUsd(summary.labPayments, locale)}
            valueTone="neutral"
            showDelta={false}
            deltaPercent={0}
            deltaTone="neutral"
          />
          <StatCard
            titleKey="expenses.summary.totalExpenses"
            valueLabel={formatCurrencyUsd(summary.totalExpenses, locale)}
            valueTone="danger"
            showDelta={false}
            deltaPercent={0}
            deltaTone="neutral"
          />
          <StatCard
            titleKey="expenses.summary.doctorPayments"
            valueLabel={formatCurrencyUsd(summary.doctorPayments, locale)}
            valueTone="neutral"
            showDelta={false}
            deltaPercent={0}
            deltaTone="neutral"
          />
          <StatCard
            titleKey="expenses.summary.others"
            valueLabel={formatCurrencyUsd(summary.others, locale)}
            valueTone="warning"
            showDelta={false}
            deltaPercent={0}
            deltaTone="neutral"
          />
        </div>
      )}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search
            className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('expenses.searchPlaceholder')}
            aria-label={t('expenses.searchAria')}
            className="ps-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filterPills.map((pill) => (
            <Button
              key={pill.id}
              type="button"
              size="sm"
              variant={category === pill.id ? 'default' : 'outline'}
              className={category === pill.id ? '' : 'border-border-card'}
              onClick={() => setCategory(pill.id)}
            >
              {t(pill.labelKey)}
            </Button>
          ))}
        </div>
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
            <p className="text-sm text-muted-foreground">{t('expenses.error.load')}</p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => void listQuery.refetch()}
            >
              {t('expenses.error.retry')}
            </Button>
          </div>
        )}

        {listQuery.data && !listQuery.isPending && (
          <>
            {filtered.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">{t('expenses.empty')}</p>
            ) : (
              <>
                <ExpensesTable rows={pageRows} onEdit={handleEdit} onDelete={handleDelete} />
                <ExpensesPagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
              </>
            )}
          </>
        )}
      </div>

      <ExpenseFormModal open={modalOpen} onOpenChange={handleModalOpenChange} editing={editing} />
    </div>
  )
}
