import { ChevronDown, Pencil, Phone, Search, Trash2, UserRoundPlus } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

type UserStatus = 'active' | 'expired'

type UserRow = {
  id: string
  name: string
  phone: string
  clinicEmail: string
  subscriptions: number
  revenue: string
  status: UserStatus
  statusDate: string
}

const usersSeed: UserRow[] = [
  {
    id: 'user-1',
    name: 'Username',
    phone: '+963944759214',
    clinicEmail: 'example123@gmail.com',
    subscriptions: 8,
    revenue: '12,000 $',
    status: 'active',
    statusDate: 'Until 18/03/2026',
  },
  {
    id: 'user-2',
    name: 'Username',
    phone: '+963944759214',
    clinicEmail: 'example123@gmail.com',
    subscriptions: 8,
    revenue: '12,000 $',
    status: 'active',
    statusDate: 'Until 18/03/2026',
  },
  {
    id: 'user-3',
    name: 'Username',
    phone: '+963944759214',
    clinicEmail: 'example123@gmail.com',
    subscriptions: 8,
    revenue: '12,000 $',
    status: 'active',
    statusDate: 'Until 18/03/2026',
  },
  {
    id: 'user-4',
    name: 'Username',
    phone: '+963944759214',
    clinicEmail: 'example123@gmail.com',
    subscriptions: 8,
    revenue: '12,000 $',
    status: 'expired',
    statusDate: 'Since 18/03/2026',
  },
  {
    id: 'user-5',
    name: 'Username',
    phone: '+963944759214',
    clinicEmail: 'example123@gmail.com',
    subscriptions: 8,
    revenue: '12,000 $',
    status: 'expired',
    statusDate: 'Since 18/03/2026',
  },
]

export const AdminUsersPage: FC = () => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-4xl font-bold text-slate-900">{t('admin.usersPage.title')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('admin.usersPage.subtitle')}</p>
        </div>
        <Button className="h-11 rounded-xl px-5" onClick={() => setIsModalOpen(true)}>
          <UserRoundPlus className="h-4 w-4" />
          {t('admin.usersPage.newUser')}
        </Button>
      </div>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 w-full flex-1 sm:min-w-[200px] lg:min-w-[260px]">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input className="h-11 ps-9" placeholder={t('admin.usersPage.searchPlaceholder')} />
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-full min-w-0 items-center justify-between rounded-xl border border-slate-200 px-3 text-sm text-slate-500 sm:w-auto sm:min-w-[140px]"
          >
            <span>{t('admin.usersPage.filterBy')}</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
            {(['all', 'active', 'expired'] as const).map((filterKey) => (
              <button
                key={filterKey}
                type="button"
                className={[
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  filterKey === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700',
                ].join(' ')}
              >
                {t(`admin.usersPage.filters.${filterKey}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-table rounded-xl border border-slate-200">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="border-b border-slate-200 bg-slate-100/80 text-slate-500">
              <tr>
                {(['user', 'phoneNumber', 'clinics', 'subscriptions', 'revenue', 'status', 'actions'] as const).map((column) => (
                  <th key={column} className="px-4 py-3 text-left text-xs font-semibold">
                    {t(`admin.usersPage.columns.${column}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersSeed.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 font-semibold text-blue-900">
                    <Link to={`/admin/users/${row.id}`} className="hover:underline">
                      {row.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-blue-500" />
                      {row.phone}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.clinicEmail}</td>
                  <td className="px-4 py-3 text-slate-600">{row.subscriptions}</td>
                  <td className="px-4 py-3 font-semibold text-blue-700">{row.revenue}</td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <span
                        className={[
                          'inline-flex rounded-full px-3 py-1 text-xs font-medium',
                          row.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
                        ].join(' ')}
                      >
                        {t(`admin.usersPage.status.${row.status}`)}
                      </span>
                      <p className="text-xs text-slate-500">{row.statusDate}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4">
                      <button type="button" className="text-slate-500 hover:text-slate-700" aria-label={t('admin.usersPage.actions.edit')}>
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" className="text-red-500 hover:text-red-600" aria-label={t('admin.usersPage.actions.delete')}>
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
          <button type="button" className="rounded-md px-2 py-1 text-blue-600 hover:bg-blue-50">
            {t('admin.usersPage.pagination.previous')}
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              type="button"
              className={['h-8 min-w-8 rounded-md px-2', page === 1 ? 'bg-blue-100 text-blue-700' : 'text-slate-700 hover:bg-slate-100'].join(' ')}
            >
              {page}
            </button>
          ))}
          <span className="px-1 text-slate-500">...</span>
          <button type="button" className="rounded-md bg-blue-600 px-3 py-1 text-white hover:opacity-90">
            {t('admin.usersPage.pagination.next')}
          </button>
        </div>
      </section>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[680px]">
          <DialogHeader>
            <DialogTitle>{t('admin.usersPage.modal.title')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">{t('admin.usersPage.modal.userName')}</p>
              <Input placeholder={t('admin.usersPage.modal.userNamePlaceholder')} />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">{t('admin.usersPage.modal.email')}</p>
              <Input placeholder={t('admin.usersPage.modal.emailPlaceholder')} />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">{t('admin.usersPage.modal.phone')}</p>
              <Input placeholder={t('admin.usersPage.modal.phonePlaceholder')} />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">{t('admin.usersPage.modal.address')}</p>
              <Input placeholder={t('admin.usersPage.modal.addressPlaceholder')} />
            </div>
            <div className="grid gap-3 pt-1 sm:grid-cols-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                {t('admin.usersPage.modal.cancel')}
              </Button>
              <Button type="button">{t('admin.usersPage.modal.confirm')}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
