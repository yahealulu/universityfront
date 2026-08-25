import { MapPin, Pencil, Phone, Search, Trash2, UserRoundPlus } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

type LabRow = {
  id: string
  name: string
  location: string
  phone: string
  totalRequests: string
  usedBy: string
}

const labsSeed: LabRow[] = [
  { id: 'lab-1', name: 'Lab Name', location: 'Location \\ Address', phone: '+963944759214', totalRequests: '28 Requests', usedBy: '28 Clinics' },
  { id: 'lab-2', name: 'Lab Name', location: 'Location \\ Address', phone: '+963944759214', totalRequests: '28 Requests', usedBy: '28 Clinics' },
  { id: 'lab-3', name: 'Lab Name', location: 'Location \\ Address', phone: '+963944759214', totalRequests: '28 Requests', usedBy: '28 Clinics' },
  { id: 'lab-4', name: 'Lab Name', location: 'Location \\ Address', phone: '+963944759214', totalRequests: '28 Requests', usedBy: '28 Clinics' },
  { id: 'lab-5', name: 'Lab Name', location: 'Location \\ Address', phone: '+963944759214', totalRequests: '28 Requests', usedBy: '28 Clinics' },
  { id: 'lab-6', name: 'Lab Name', location: 'Location \\ Address', phone: '+963944759214', totalRequests: '28 Requests', usedBy: '28 Clinics' },
]

export const AdminLabsManagementPage: FC = () => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-4xl font-bold text-slate-900">{t('admin.labsManagement.title')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('admin.labsManagement.subtitle')}</p>
        </div>
        <Button className="h-11 rounded-xl px-5" onClick={() => setIsModalOpen(true)}>
          <UserRoundPlus className="h-4 w-4" />
          {t('admin.labsManagement.addLab')}
        </Button>
      </div>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative min-w-0 w-full flex-1 sm:min-w-[200px] lg:min-w-[260px]">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input className="h-11 ps-9" placeholder={t('admin.labsManagement.searchPlaceholder')} />
        </div>

        <div className="overflow-x-table rounded-xl border border-slate-200">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="border-b border-slate-200 bg-slate-100/80 text-slate-500">
              <tr>
                {(['lab', 'phoneNumber', 'totalRequests', 'usedBy', 'actions'] as const).map((column) => (
                  <th key={column} className="px-4 py-3 text-left text-xs font-semibold">
                    {t(`admin.labsManagement.columns.${column}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {labsSeed.map((lab) => (
                <tr key={lab.id}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{lab.name}</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-blue-500" />
                      {lab.location}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-blue-500" />
                      {lab.phone}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-blue-700">{lab.totalRequests}</td>
                  <td className="px-4 py-3 text-slate-600">{lab.usedBy}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4">
                      <button type="button" className="text-slate-500 hover:text-slate-700" aria-label={t('admin.labsManagement.actions.edit')}>
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" className="text-red-500 hover:text-red-600" aria-label={t('admin.labsManagement.actions.delete')}>
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
            {t('admin.labsManagement.pagination.previous')}
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
            {t('admin.labsManagement.pagination.next')}
          </button>
        </div>
      </section>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[680px]">
          <DialogHeader>
            <DialogTitle>{t('admin.labsManagement.modal.title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">{t('admin.labsManagement.modal.laboratoryName')}</p>
              <Input placeholder={t('admin.labsManagement.modal.placeholder')} />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">{t('admin.labsManagement.modal.phoneNumber')}</p>
              <Input placeholder={t('admin.labsManagement.modal.placeholder')} />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">{t('admin.labsManagement.modal.address')}</p>
              <Input placeholder={t('admin.labsManagement.modal.placeholder')} />
            </div>
            <div className="grid gap-3 pt-1 sm:grid-cols-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                {t('admin.labsManagement.modal.cancel')}
              </Button>
              <Button type="button">{t('admin.labsManagement.modal.confirm')}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
