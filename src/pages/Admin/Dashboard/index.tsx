import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

const stats = [
  { key: 'admin.dashboard.totalUsers', value: '56', delta: '+5.9%' },
  { key: 'admin.dashboard.activeUsers', value: '49', delta: '15' },
  { key: 'admin.dashboard.clinicsCount', value: '124', delta: '3.1' },
  { key: 'admin.dashboard.totalSubscriptions', value: '60', delta: '+5.9%' },
  { key: 'admin.dashboard.popularPlan', value: 'admin.dashboard.basicPlan', delta: '42' },
  { key: 'admin.dashboard.totalRevenue', value: '1,000$', delta: '+5.9%' },
] as const

const topSellers = Array.from({ length: 5 }).map((_, index) => ({
  id: `seller-${index + 1}`,
  name: 'admin.dashboard.username',
  subscriptions: 32,
  amount: '2,600$',
}))

const topPlans = [
  { id: 'plan-1', name: 'admin.dashboard.basicPlan', subscriptions: 28, amount: '12,000$' },
  { id: 'plan-2', name: 'admin.dashboard.proPlan', subscriptions: 28, amount: '12,000$' },
  { id: 'plan-3', name: 'admin.dashboard.freeTrial', subscriptions: 28, amount: '12,000$' },
] as const

const revenueBarClasses = ['h-[40%]', 'h-[46%]', 'h-[52%]', 'h-[49%]', 'h-[57%]', 'h-[63%]'] as const

export const AdminDashboardPage: FC = () => {
  const { t } = useTranslation()

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <article key={stat.key} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{t(stat.key)}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {stat.value.startsWith('admin.dashboard.') ? t(stat.value) : stat.value}
            </p>
            <p className="mt-1 text-xs text-slate-400">{stat.delta}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{t('admin.dashboard.topSellers')}</h2>
          <div className="mt-4 space-y-2">
            {topSellers.map((seller, index) => (
              <div key={seller.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{t(seller.name)}</p>
                    <p className="text-xs text-slate-500">
                      {seller.subscriptions} {t('admin.dashboard.subscriptionLabel')}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-blue-700">{seller.amount}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{t('admin.dashboard.revenuePerMonth')}</h2>
          <div className="mt-6 flex h-64 items-end justify-between gap-3 rounded-lg bg-slate-50 p-4">
            {revenueBarClasses.map((barClass, index) => (
              <div key={`bar-${index + 1}`} className="flex h-full flex-1 items-end justify-center">
                <div className={['w-full max-w-8 rounded-md bg-blue-600', barClass].join(' ')} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{t('admin.dashboard.topPlans')}</h2>
        <div className="mt-4 space-y-2">
          {topPlans.map((plan, index) => (
            <div key={plan.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                  {index + 1}
                </span>
                <p className="text-sm font-medium text-blue-700">{t(plan.name)}</p>
              </div>
              <div className="text-end">
                <p className="text-sm font-semibold text-blue-700">{plan.amount}</p>
                <p className="text-xs text-slate-500">
                  {plan.subscriptions} {t('admin.dashboard.subscriptionLabel')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
