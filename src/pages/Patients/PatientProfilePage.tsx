import { ArrowLeft } from 'lucide-react'
import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePatientDetail } from '@/hooks/patients/usePatientDetail'
import { cn } from '@/lib/utils'

import { EditPatientProfileModal } from './components/EditPatientProfileModal'
import { PatientAppointmentsTab } from './components/PatientAppointmentsTab'
import { PatientClinicalHistoryTab } from './components/PatientClinicalHistoryTab'
import { PatientDemographicsRow } from './components/PatientDemographicsRow'
import { PatientDentalChartTab } from './components/PatientDentalChartTab'
import { PatientInfoCards } from './components/PatientInfoCards'
import { PatientInvoicesTab } from './components/PatientInvoicesTab'
import { PatientProfileHeader } from './components/PatientProfileHeader'
import { PatientTreatmentsTab } from './components/PatientTreatmentsTab'

const profileTabsListClass =
  'flex h-auto w-full flex-wrap justify-start gap-2 rounded-full border-0 bg-muted/40 p-1.5 shadow-none'

const profileTabsTriggerClass =
  'min-w-0 flex-1 rounded-full border-0 px-2 py-2 text-xs font-semibold text-muted-foreground shadow-none transition-colors hover:text-foreground data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:shadow-none sm:min-w-[7rem] sm:px-4 sm:py-2.5 sm:text-sm'

export const PatientProfilePage: FC = () => {
  const { patientId = '' } = useParams<{ patientId: string }>()
  const { t, i18n } = useTranslation()
  const locale = i18n.language
  const detailQuery = usePatientDetail(patientId)
  const [editOpen, setEditOpen] = useState(false)

  if (detailQuery.isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <div className="rounded-xl border border-danger/30 bg-danger/5 p-6 text-sm text-danger">
        {t('patients.profile.error')}
      </div>
    )
  }

  const d = detailQuery.data

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link to="/clinic/patients">
            <ArrowLeft className="h-4 w-4" />
            {t('patients.profile.back')}
          </Link>
        </Button>
      </div>

      <div className="space-y-6 rounded-card border border-border-card bg-surface p-4 shadow-card sm:p-6">
        <PatientProfileHeader patientId={patientId} profile={d.profile} onEdit={() => setEditOpen(true)} />
        <PatientDemographicsRow profile={d.profile} />
      </div>

      <PatientInfoCards patientId={patientId} profile={d.profile} />

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className={cn(profileTabsListClass)}>
          <TabsTrigger value="appointments" className={cn(profileTabsTriggerClass)}>
            {t('patients.tabs.appointments')}
          </TabsTrigger>
          <TabsTrigger value="invoices" className={cn(profileTabsTriggerClass)}>
            {t('patients.tabs.invoices')}
          </TabsTrigger>
          <TabsTrigger value="dental" className={cn(profileTabsTriggerClass)}>
            {t('patients.tabs.dental')}
          </TabsTrigger>
          <TabsTrigger value="treatments" className={cn(profileTabsTriggerClass)}>
            {t('patients.tabs.treatments')}
          </TabsTrigger>
          <TabsTrigger value="clinical" className={cn(profileTabsTriggerClass)}>
            {t('patients.tabs.clinical')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="mt-6 rounded-xl border border-border-card bg-surface p-4 shadow-sm md:p-6">
          <h2 className="mb-4 text-lg font-bold text-foreground">{t('patients.appointments.title')}</h2>
          <PatientAppointmentsTab patientId={patientId} rows={d.appointments} />
        </TabsContent>

        <TabsContent value="invoices" className="mt-6 rounded-xl border border-border-card bg-surface p-4 shadow-sm md:p-6">
          <PatientInvoicesTab
            patientId={patientId}
            patientDisplayName={d.profile.name}
            summary={d.invoicesSummary}
            invoices={d.invoices}
          />
        </TabsContent>

        <TabsContent value="dental" className="mt-6 rounded-xl border border-border-card bg-surface p-4 shadow-sm md:p-6">
          <PatientDentalChartTab
            patientId={patientId}
            dentalChart={d.dentalChart}
            treatments={d.treatments}
          />
        </TabsContent>

        <TabsContent value="treatments" className="mt-6 rounded-xl border border-border-card bg-surface p-4 shadow-sm md:p-6">
          <h2 className="mb-4 text-lg font-bold text-primary-navy">{t('patients.treatments.title')}</h2>
          <PatientTreatmentsTab patientId={patientId} treatments={d.treatments} locale={locale} />
        </TabsContent>

        <TabsContent value="clinical" className="mt-6 rounded-xl border border-border-card bg-surface p-4 shadow-sm md:p-6">
          <h2 className="mb-4 text-lg font-bold text-primary-navy">{t('patients.clinicalHistory.title')}</h2>
          <PatientClinicalHistoryTab patientId={patientId} clinicalHistory={d.clinicalHistory} />
        </TabsContent>
      </Tabs>

      <EditPatientProfileModal
        open={editOpen}
        onOpenChange={setEditOpen}
        patientId={patientId}
        profile={d.profile}
      />
    </div>
  )
}
