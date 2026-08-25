import { Check, CirclePlus, Pencil, Trash2 } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

type BillingPlanCard = {
  id: string
  name: string
  features: string[]
  priceValue: string
  period: string
  usersCount: string
  incomeText: string
}

const billingPlansSeed: BillingPlanCard[] = [
  {
    id: 'plan-free',
    name: 'Free Trial',
    features: ['1 Clinic', '3 Doctors In Each Clinic', '1 Secretary In Each Clinic'],
    priceValue: '0$',
    period: '14 Days',
    usersCount: '20 Users Are Using This Plan',
    incomeText: '0$ Income From This Plan',
  },
  {
    id: 'plan-basic',
    name: 'Basic Plan',
    features: ['3 Clinics', '5 Doctors In Each Clinic', '2 Secretary In Each Clinic'],
    priceValue: '10$',
    period: 'Month',
    usersCount: '127 Users Are Using This Plan',
    incomeText: '1270$ Income From This Plan',
  },
  {
    id: 'plan-pro',
    name: 'Pro Plan',
    features: ['6 Clinics', '12 Doctors In Each Clinic', '3 Secretary In Each Clinic'],
    priceValue: '20$',
    period: 'Month',
    usersCount: '38 Users Are Using This Plan',
    incomeText: '760$ Income From This Plan',
  },
]

export const AdminBillingPlansPage: FC = () => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-4xl font-bold text-slate-900">{t('admin.billingPlans.title')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('admin.billingPlans.subtitle')}</p>
        </div>
        <Button className="h-11 rounded-xl px-5" onClick={() => setIsModalOpen(true)}>
          <CirclePlus className="h-4 w-4" />
          {t('admin.billingPlans.newPlan')}
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {billingPlansSeed.map((plan) => (
          <article key={plan.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-3xl font-bold text-blue-700">{plan.name}</h3>

            <ul className="mt-4 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-4xl font-bold text-blue-700">
              {plan.priceValue}
              <span className="text-xl font-semibold text-slate-400"> / {plan.period}</span>
            </p>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="text-sm font-bold text-blue-700">{plan.usersCount}</p>
              <p className="mt-1 text-sm text-slate-400">{plan.incomeText}</p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button type="button" variant="outline" className="h-10 bg-blue-50 text-blue-700 hover:bg-blue-100">
                <Pencil className="h-4 w-4" />
                {t('admin.billingPlans.actions.edit')}
              </Button>
              <Button type="button" variant="outline" className="h-10 text-slate-800 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4 text-red-500" />
                {t('admin.billingPlans.actions.delete')}
              </Button>
            </div>
          </article>
        ))}
      </section>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{t('admin.billingPlans.modal.title')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">{t('admin.billingPlans.modal.planName')}</p>
              <Input placeholder={t('admin.billingPlans.modal.planNamePlaceholder')} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">{t('admin.billingPlans.modal.price')}</p>
                <Input placeholder={t('admin.billingPlans.modal.pricePlaceholder')} />
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">{t('admin.billingPlans.modal.duration')}</p>
                <Input placeholder={t('admin.billingPlans.modal.durationPlaceholder')} />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="mb-2 text-sm font-semibold text-slate-700">{t('admin.billingPlans.modal.feature1')}</p>
              <Input placeholder={t('admin.billingPlans.modal.featurePlaceholder')} />
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">{t('admin.billingPlans.modal.feature2')}</p>
              <Input placeholder={t('admin.billingPlans.modal.featurePlaceholder')} />
            </div>

            <div className="flex justify-end">
              <Button type="button" variant="outline" className="h-10 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100">
                <CirclePlus className="h-4 w-4" />
                {t('admin.billingPlans.modal.moreFeatures')}
              </Button>
            </div>

            <div className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                {t('admin.billingPlans.modal.cancel')}
              </Button>
              <Button type="button">{t('admin.billingPlans.modal.confirm')}</Button>
            </div>
          </div>

        </DialogContent>
      </Dialog>
    </div>
  )
}
