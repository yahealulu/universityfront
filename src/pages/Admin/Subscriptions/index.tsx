import { Calendar, Circle, CirclePlus, Pencil, Search, Trash2, XCircle } from 'lucide-react'
import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type SubscriptionStatus = 'active' | 'expired'

type SubscriptionRow = {
  id: string
  userName: string
  planType: string
  startedAt: string
  expiresAt: string
  remainingDays: number
  status: SubscriptionStatus
}

const subscriptionsSeed: SubscriptionRow[] = [
  { id: 'sub-1', userName: 'Username', planType: 'Plan Type', startedAt: '18/03/2026', expiresAt: '18/03/2026', remainingDays: 10, status: 'active' },
  { id: 'sub-2', userName: 'Username', planType: 'Plan Type', startedAt: '18/03/2026', expiresAt: '18/03/2026', remainingDays: 10, status: 'active' },
  { id: 'sub-3', userName: 'Username', planType: 'Plan Type', startedAt: '18/03/2026', expiresAt: '18/03/2026', remainingDays: 10, status: 'active' },
  { id: 'sub-4', userName: 'Username', planType: 'Plan Type', startedAt: '18/03/2026', expiresAt: '18/03/2026', remainingDays: 10, status: 'active' },
  { id: 'sub-5', userName: 'Username', planType: 'Plan Type', startedAt: '18/03/2026', expiresAt: '18/03/2026', remainingDays: 10, status: 'active' },
  { id: 'sub-6', userName: 'Username', planType: 'Plan Type', startedAt: '18/03/2026', expiresAt: '18/03/2026', remainingDays: 0, status: 'expired' },
  { id: 'sub-7', userName: 'Username', planType: 'Plan Type', startedAt: '18/03/2026', expiresAt: '18/03/2026', remainingDays: 0, status: 'expired' },
]

const PAGE_SIZE = 7

export const AdminSubscriptionsPage: FC = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | SubscriptionStatus>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const filteredRows = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return subscriptionsSeed.filter((row) => {
      const matchesStatus = statusFilter === 'all' ? true : row.status === statusFilter
      if (!matchesStatus) return false
      if (!normalizedQuery) return true

      return [row.userName, row.planType, row.startedAt, row.expiresAt].join(' ').toLowerCase().includes(normalizedQuery)
    })
  }, [searchQuery, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))

  const visibleRows = useMemo(() => {
    const page = Math.min(currentPage, totalPages)
    const startIndex = (page - 1) * PAGE_SIZE
    return filteredRows.slice(startIndex, startIndex + PAGE_SIZE)
  }, [currentPage, filteredRows, totalPages])

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const handleFilterChange = (value: 'all' | SubscriptionStatus) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-4xl font-bold text-slate-900">{t('admin.subscriptions.title')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('admin.subscriptions.subtitle')}</p>
        </div>
        <Button className="h-11 rounded-xl px-5" onClick={() => setIsModalOpen(true)}>
          <CirclePlus className="h-4 w-4" />
          {t('admin.subscriptions.newSubscription')}
        </Button>
      </div>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 w-full flex-1 sm:min-w-[200px] lg:min-w-[260px]">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t('admin.subscriptions.searchPlaceholder')}
              className="h-11 ps-9"
            />
          </div>

          <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
            {(['all', 'active', 'expired'] as const).map((filterKey) => (
              <button
                key={filterKey}
                type="button"
                onClick={() => handleFilterChange(filterKey)}
                className={[
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  statusFilter === filterKey ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700',
                ].join(' ')}
              >
                {t(`admin.subscriptions.filters.${filterKey}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-table rounded-xl border border-slate-200">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="border-b border-slate-200 bg-slate-100/80 text-slate-500">
              <tr>
                {(['user', 'planType', 'startedAt', 'expiresAt', 'remainingDays', 'status', 'actions'] as const).map((column) => (
                  <th key={column} className="px-4 py-3 text-left text-xs font-semibold">
                    {t(`admin.subscriptions.columns.${column}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleRows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 font-semibold text-slate-800">{row.userName}</td>
                  <td className="px-4 py-3 text-slate-600">{row.planType}</td>
                  <td className="px-4 py-3 text-slate-600">{row.startedAt}</td>
                  <td className="px-4 py-3 text-slate-600">{row.expiresAt}</td>
                  <td className={['px-4 py-3 font-semibold', row.remainingDays > 0 ? 'text-green-600' : 'text-red-600'].join(' ')}>
                    {row.remainingDays} {t('admin.subscriptions.days')}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={[
                        'inline-flex rounded-full px-3 py-1 text-xs font-medium',
                        row.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
                      ].join(' ')}
                    >
                      {t(`admin.subscriptions.status.${row.status}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4 text-xs">
                      <button type="button" className={['inline-flex items-center gap-1.5', row.status === 'active' ? 'text-red-600' : 'text-blue-600'].join(' ')}>
                        {row.status === 'active' ? <XCircle className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                        <span>{row.status === 'active' ? t('admin.subscriptions.actions.suspend') : t('admin.subscriptions.actions.renew')}</span>
                      </button>
                      <button type="button" className="text-slate-500 hover:text-slate-700" aria-label={t('admin.subscriptions.actions.edit')}>
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" className="text-red-500 hover:text-red-600" aria-label={t('admin.subscriptions.actions.delete')}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 py-2 text-sm">
          <button type="button" onClick={() => goToPage(currentPage - 1)} className="rounded-md px-2 py-1 text-blue-600 hover:bg-blue-50">
            {t('admin.subscriptions.pagination.previous')}
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              className={[
                'h-8 min-w-8 rounded-md px-2',
                currentPage === page ? 'bg-blue-100 text-blue-700' : 'text-slate-700 hover:bg-slate-100',
              ].join(' ')}
            >
              {page}
            </button>
          ))}
          <span className="px-1 text-slate-500">...</span>
          <button type="button" onClick={() => goToPage(currentPage + 1)} className="rounded-md bg-blue-600 px-3 py-1 text-white hover:opacity-90">
            {t('admin.subscriptions.pagination.next')}
          </button>
        </div>
      </section>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[680px]">
          <DialogHeader>
            <DialogTitle>{t('admin.subscriptions.modal.title')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">{t('admin.subscriptions.modal.userLabel')}</p>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.subscriptions.modal.selectPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user-1">Username 1</SelectItem>
                  <SelectItem value="user-2">Username 2</SelectItem>
                  <SelectItem value="user-3">Username 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">{t('admin.subscriptions.modal.planLabel')}</p>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.subscriptions.modal.selectPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Plan</SelectItem>
                  <SelectItem value="pro">Pro Plan</SelectItem>
                  <SelectItem value="trial">Free Trial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">{t('admin.subscriptions.modal.fromLabel')}</p>
                <div className="relative">
                  <Input
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    placeholder={t('admin.subscriptions.modal.datePlaceholder')}
                  />
                  <Calendar className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">{t('admin.subscriptions.modal.toLabel')}</p>
                <div className="relative">
                  <Input value={endDate} onChange={(event) => setEndDate(event.target.value)} placeholder={t('admin.subscriptions.modal.datePlaceholder')} />
                  <Calendar className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="grid gap-3 pt-1 sm:grid-cols-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                {t('admin.subscriptions.modal.cancel')}
              </Button>
              <Button type="button">{t('admin.subscriptions.modal.confirm')}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
