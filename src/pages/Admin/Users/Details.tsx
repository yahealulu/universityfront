import { Mail, MapPin, Pencil, Phone, Stethoscope, Trash2, UserCircle2, Users } from 'lucide-react'
import type { ComponentType, FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

type StatCard = {
  id: string
  icon: ComponentType<{ className?: string }>
  labelKey: string
  value: string
  iconBg: string
  valueColor: string
}

const summaryStats: StatCard[] = [
  { id: 'clinics', icon: Stethoscope, labelKey: 'admin.usersPage.details.stats.numberOfClinics', value: '4', iconBg: 'bg-blue-100', valueColor: 'text-blue-700' },
  { id: 'doctors', icon: UserCircle2, labelKey: 'admin.usersPage.details.stats.totalDoctors', value: '12', iconBg: 'bg-green-100', valueColor: 'text-green-700' },
  { id: 'secretaries', icon: Users, labelKey: 'admin.usersPage.details.stats.totalSecretaries', value: '3', iconBg: 'bg-amber-100', valueColor: 'text-amber-700' },
  { id: 'patients', icon: Users, labelKey: 'admin.usersPage.details.stats.totalPatients', value: '46', iconBg: 'bg-slate-100', valueColor: 'text-slate-700' },
]

const usageStats = [
  { id: 'appointments', titleKey: 'admin.usersPage.details.dailyUsage.appointments', value: '16', deltaKey: 'admin.usersPage.details.dailyUsage.upDelta', deltaColor: 'text-blue-600' },
  { id: 'treatments', titleKey: 'admin.usersPage.details.dailyUsage.treatments', value: '12', deltaKey: 'admin.usersPage.details.dailyUsage.upDelta', deltaColor: 'text-green-600' },
  { id: 'labs', titleKey: 'admin.usersPage.details.dailyUsage.labsRequests', value: '3', deltaKey: 'admin.usersPage.details.dailyUsage.downDelta', deltaColor: 'text-amber-600' },
  { id: 'patients', titleKey: 'admin.usersPage.details.dailyUsage.patientsCreated', value: '4', deltaKey: 'admin.usersPage.details.dailyUsage.upDelta', deltaColor: 'text-blue-600' },
]

const userSubscriptions = [
  { id: 'sub-1', userName: 'Username', planType: 'Plan Type', startedAt: '18/03/2026', expiresAt: '18/03/2026', remainingDays: 10, status: 'active' },
  { id: 'sub-2', userName: 'Username', planType: 'Plan Type', startedAt: '18/03/2026', expiresAt: '18/03/2026', remainingDays: 0, status: 'expired' },
  { id: 'sub-3', userName: 'Username', planType: 'Plan Type', startedAt: '18/03/2026', expiresAt: '18/03/2026', remainingDays: 0, status: 'expired' },
  { id: 'sub-4', userName: 'Username', planType: 'Plan Type', startedAt: '18/03/2026', expiresAt: '18/03/2026', remainingDays: 0, status: 'expired' },
] as const

export const AdminUserDetailsPage: FC = () => {
  const { t } = useTranslation()

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl font-bold text-blue-900">Username</h2>
          <Button type="button" variant="outline" className="h-10 rounded-xl px-4 text-blue-700">
            <Pencil className="h-4 w-4" />
            {t('admin.usersPage.details.edit')}
          </Button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="inline-flex items-center gap-3 text-slate-600">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              <Mail className="h-4 w-4 text-slate-500" />
            </span>
            <span className="text-sm">example123@gmail.com</span>
          </div>
          <div className="inline-flex items-center gap-3 text-slate-600">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              <Phone className="h-4 w-4 text-slate-500" />
            </span>
            <span className="text-sm">+963944759214</span>
          </div>
          <div className="inline-flex items-center gap-3 text-slate-600">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              <MapPin className="h-4 w-4 text-slate-500" />
            </span>
            <span className="text-sm">Location, Address, Location, Address</span>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryStats.map(({ id, icon: Icon, labelKey, value, iconBg, valueColor }) => (
          <article key={id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className={['inline-flex h-10 w-10 items-center justify-center rounded-xl', iconBg].join(' ')}>
                <Icon className="h-5 w-5 text-slate-700" />
              </span>
              <div>
                <p className="text-sm text-slate-500">{t(labelKey)}</p>
                <p className={['text-2xl font-bold', valueColor].join(' ')}>{value}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h3 className="text-3xl font-bold text-slate-900">{t('admin.usersPage.details.dailyUsage.title')}</h3>
          <p className="text-sm text-slate-500">{t('admin.usersPage.details.dailyUsage.subtitle')}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {usageStats.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">{t(item.titleKey)}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{item.value}</p>
              <p className={['mt-2 text-sm', item.deltaColor].join(' ')}>{t(item.deltaKey)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-3xl font-bold text-slate-900">{t('admin.usersPage.details.subscriptionsTitle')}</h3>
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
              {userSubscriptions.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 font-semibold text-blue-900">{row.userName}</td>
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
                    <div className="flex items-center gap-4">
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
      </section>
    </div>
  )
}
