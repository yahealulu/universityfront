import { format, parseISO } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Mail,
  Pencil,
  Phone,
  Plus,
  Trash2,
} from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDoctorDetail } from '@/hooks/doctors/useDoctorDetail'
import {
  useCreateDoctorPayment,
  useDeleteDoctorPayment,
  useUpdateDoctorPayment,
} from '@/hooks/doctors/useDoctorPaymentMutations'
import { useDoctorsMeta } from '@/hooks/doctors/useDoctorsMeta'
import type { DoctorPayment } from '@/types/doctor.types'
import { formatInvoiceMoney } from '@/utils/formatters'

import { AddDoctorWizardModal } from './components/AddDoctorWizardModal'
import { DoctorPaymentFormModal } from './components/DoctorPaymentFormModal'

export const DoctorDetailPage: FC = () => {
  const { t, i18n } = useTranslation()
  const { doctorId } = useParams<{ doctorId: string }>()
  const locale = i18n.language.startsWith('ar') ? ar : enUS
  const datePattern = i18n.language.startsWith('ar') ? 'd/M/yyyy' : 'M/d/yyyy'

  const detailQuery = useDoctorDetail(doctorId)
  const metaQuery = useDoctorsMeta()

  const [wizardOpen, setWizardOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<DoctorPayment | null>(null)

  const createPayment = useCreateDoctorPayment(doctorId ?? '')
  const updatePayment = useUpdateDoctorPayment(doctorId ?? '')
  const deletePayment = useDeleteDoctorPayment(doctorId ?? '')

  const doctor = detailQuery.data?.doctor
  const stats = detailQuery.data?.stats
  const payments = detailQuery.data?.payments ?? []
  const treatments = detailQuery.data?.treatments ?? []

  const openRecordPayment = () => {
    setEditingPayment(null)
    setPaymentOpen(true)
  }

  const openEditPayment = (p: DoctorPayment) => {
    setEditingPayment(p)
    setPaymentOpen(true)
  }

  const handlePaymentSave = async (values: {
    paidAt: string
    amount: number
    paymentMethod?: string
  }) => {
    if (!doctorId) return
    if (editingPayment) {
      await updatePayment.mutateAsync({
        paymentId: editingPayment.id,
        body: values,
      })
    } else {
      await createPayment.mutateAsync(values)
    }
    setPaymentOpen(false)
    setEditingPayment(null)
  }

  const handleDeletePayment = (p: DoctorPayment) => {
    if (!window.confirm(t('doctors.detail.paymentDeleteConfirm', { id: p.paymentNumber }))) return
    void deletePayment.mutateAsync(p.id)
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/clinic/doctors"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('doctors.detail.back')}
        </Link>
      </div>

      {detailQuery.isPending && (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {detailQuery.isError && (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">{t('doctors.detail.error')}</p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => void detailQuery.refetch()}
          >
            {t('doctors.error.retry')}
          </Button>
        </div>
      )}

      {doctor && stats && (
        <>
          <div className="rounded-card border border-border-card bg-surface p-6 shadow-card">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{doctor.name}</h1>
                <p className="mt-1 text-muted-foreground">{doctor.specialization}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1 shrink-0"
                onClick={() => setWizardOpen(true)}
              >
                <Pencil className="h-4 w-4" />
                {t('doctors.detail.edit')}
              </Button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="flex items-start gap-3 rounded-lg border border-border-card bg-page/50 p-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <div>
                  <p className="text-xs text-muted-foreground">{t('doctors.detail.email')}</p>
                  <p className="break-all text-sm font-medium">{doctor.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border-card bg-page/50 p-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <div>
                  <p className="text-xs text-muted-foreground">{t('doctors.detail.phone')}</p>
                  <p className="text-sm font-medium">{doctor.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border-card bg-page/50 p-3">
                <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <div>
                  <p className="text-xs text-muted-foreground">{t('doctors.detail.registered')}</p>
                  <p className="text-sm font-medium">
                    {format(parseISO(doctor.registeredAt), datePattern, { locale })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-card border border-border-card bg-surface p-4 shadow-card">
              <p className="text-xs text-muted-foreground">{t('doctors.detail.stats.treatments')}</p>
              <p className="mt-1 text-2xl font-bold">{stats.totalTreatments}</p>
            </div>
            <div className="rounded-card border border-border-card bg-surface p-4 shadow-card">
              <p className="text-xs text-muted-foreground">{t('doctors.detail.stats.revenue')}</p>
              <p className="mt-1 text-2xl font-bold text-success">
                {formatInvoiceMoney(stats.totalRevenue)}
              </p>
            </div>
            <div className="rounded-card border border-border-card bg-surface p-4 shadow-card">
              <p className="text-xs text-muted-foreground">{t('doctors.detail.stats.outstanding')}</p>
              <p className="mt-1 text-2xl font-bold text-primary">
                {formatInvoiceMoney(stats.outstandingPayments)}
              </p>
            </div>
            <div className="rounded-card border border-border-card bg-surface p-4 shadow-card">
              <p className="text-xs text-muted-foreground">{t('doctors.detail.stats.remaining')}</p>
              <p className="mt-1 text-2xl font-bold text-danger">
                {formatInvoiceMoney(stats.remainingPayments)}
              </p>
            </div>
          </div>

          <Tabs defaultValue="payments" className="w-full">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="payments">{t('doctors.detail.tabs.payments')}</TabsTrigger>
              <TabsTrigger value="treatments">{t('doctors.detail.tabs.treatments')}</TabsTrigger>
            </TabsList>
            <TabsContent value="payments" className="mt-4 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold">{t('doctors.detail.paymentsTitle')}</h2>
                <Button type="button" className="gap-1" onClick={openRecordPayment}>
                  <Plus className="h-4 w-4" />
                  {t('doctors.detail.recordPayment')}
                </Button>
              </div>
              <div className="overflow-x-table rounded-xl border border-border-card" dir="ltr">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#e0f2fe] text-start text-xs font-semibold uppercase text-muted-foreground">
                      <th className="px-4 py-3">{t('doctors.detail.paymentTable.id')}</th>
                      <th className="px-4 py-3">{t('doctors.detail.paymentTable.date')}</th>
                      <th className="px-4 py-3">{t('doctors.detail.paymentTable.amount')}</th>
                      <th className="px-4 py-3">{t('doctors.detail.paymentTable.method')}</th>
                      <th className="px-4 py-3 text-center">{t('doctors.detail.paymentTable.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-card bg-surface">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-page/80">
                        <td className="px-4 py-3">
                          <span className="font-semibold text-primary">#{p.paymentNumber}</span>
                        </td>
                        <td className="px-4 py-3">
                          {format(parseISO(p.paidAt), datePattern, { locale })}
                        </td>
                        <td className="px-4 py-3 font-semibold text-primary">
                          {formatInvoiceMoney(p.amount)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{p.paymentMethod || '—'}</td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-primary"
                            aria-label={t('doctors.detail.editPayment')}
                            onClick={() => openEditPayment(p)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-danger"
                            aria-label={t('doctors.detail.deletePayment')}
                            onClick={() => handleDeletePayment(p)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="treatments" className="mt-4">
              <h2 className="mb-4 text-lg font-semibold">{t('doctors.detail.treatmentsTitle')}</h2>
              <div className="overflow-x-table rounded-xl border border-border-card" dir="ltr">
                <table className="w-full min-w-[960px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#e0f2fe] text-start text-xs font-semibold uppercase text-muted-foreground">
                      <th className="w-10 px-2 py-3" aria-hidden />
                      <th className="px-4 py-3">{t('doctors.detail.treatmentTable.date')}</th>
                      <th className="px-4 py-3">{t('doctors.detail.treatmentTable.type')}</th>
                      <th className="px-4 py-3">{t('doctors.detail.treatmentTable.tooth')}</th>
                      <th className="px-4 py-3">{t('doctors.detail.treatmentTable.patient')}</th>
                      <th className="px-4 py-3">{t('doctors.detail.treatmentTable.price')}</th>
                      <th className="px-4 py-3">{t('doctors.detail.treatmentTable.paid')}</th>
                      <th className="px-4 py-3">{t('doctors.detail.treatmentTable.remaining')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-card bg-surface">
                    {treatments.map((tr) => (
                      <tr key={tr.id} className="hover:bg-page/80">
                        <td className="px-2 py-3 text-muted-foreground">
                          <ChevronRight className="h-4 w-4" aria-hidden />
                        </td>
                        <td className="px-4 py-3">
                          {format(parseISO(tr.date), datePattern, { locale })}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold">{tr.treatmentTitle}</p>
                          <p className="text-xs text-muted-foreground">{tr.category}</p>
                        </td>
                        <td className="px-4 py-3">{tr.toothArea}</td>
                        <td className="px-4 py-3">{tr.patientName}</td>
                        <td className="px-4 py-3 font-bold text-primary">{formatInvoiceMoney(tr.price)}</td>
                        <td className="px-4 py-3">{formatInvoiceMoney(tr.paid)}</td>
                        <td className="px-4 py-3 font-bold text-danger">{formatInvoiceMoney(tr.remaining)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>

          <AddDoctorWizardModal
            open={wizardOpen}
            onOpenChange={setWizardOpen}
            editingDoctor={wizardOpen ? doctor : null}
            meta={metaQuery.data}
          />

          <DoctorPaymentFormModal
            open={paymentOpen}
            onOpenChange={setPaymentOpen}
            editing={editingPayment}
            onSave={handlePaymentSave}
            isSaving={createPayment.isPending || updatePayment.isPending}
          />
        </>
      )}
    </div>
  )
}
