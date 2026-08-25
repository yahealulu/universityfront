import { AlertCircle, Building2, CalendarDays, CreditCard, Phone, Sparkles, Wallet } from 'lucide-react'
import type { FC, SVGProps } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router-dom'

import type { PatientPortalAppointmentItem } from '@/types/patientPortal.types'
import {
  formatCurrencyUsd,
  formatIsoDateLocale,
  formatPatientRecordLabel,
  formatTime24hTo12hLocale,
} from '@/utils/formatters'
import { buildPatientPortalViewModel, parsePatientPortalSearchParams } from '@/utils/patientPortalMock'

type StatIcon = FC<SVGProps<SVGSVGElement>>

const StatCard: FC<{
  title: string
  value: string
  icon: StatIcon
  accentClass: string
}> = ({ title, value, icon: Icon, accentClass }) => (
  <div className="rounded-card border border-border-card bg-surface p-5 shadow-card">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
        <p className="mt-2 text-2xl font-bold text-primary-navy">{value}</p>
      </div>
      <div className={`rounded-xl p-3 ${accentClass}`}>
        <Icon className="h-5 w-5" aria-hidden />
      </div>
    </div>
  </div>
)

export const PatientPortalPage: FC = () => {
  const { patientId = '' } = useParams<{ patientId: string }>()
  const [searchParams] = useSearchParams()
  const { t, i18n } = useTranslation()
  const locale = i18n.language

  const view = useMemo(() => {
    const query = parsePatientPortalSearchParams(searchParams)
    return buildPatientPortalViewModel(patientId || 'unknown', query)
  }, [patientId, searchParams])

  const displayName =
    view.queryDisplayName ?? t('patientPortal.fallbackName', { code: formatPatientRecordLabel(view.fallbackPatientCode) })

  const displayCode = view.queryDisplayCode ?? formatPatientRecordLabel(view.fallbackPatientCode)

  const resolveAppointmentCopy = (row: PatientPortalAppointmentItem) => ({
    doctor: t(`patientPortal.mock.doctors.${row.doctorIndex}`),
    treatment: t(`patientPortal.mock.treatments.${row.treatmentIndex}`),
    notes: t(`patientPortal.mock.notes.${row.notesIndex}`),
  })

  const phoneDisplay = t('patientPortal.phoneDisplay', { digits: view.clinicPhoneDigits })

  return (
    <div className="min-h-screen bg-page text-foreground">
      <div className="relative overflow-hidden border-b border-border-card bg-gradient-to-br from-primary-navy via-primary-navy-light to-primary">
        <div className="pointer-events-none absolute -end-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-16 -start-16 h-48 w-48 rounded-full bg-primary/30 blur-2xl" aria-hidden />
        <header className="relative mx-auto max-w-3xl px-4 py-12 text-white sm:px-6">
          <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-white/90">
            <Building2 className="h-4 w-4 shrink-0" aria-hidden />
            <span>{t('patientPortal.clinicName')}</span>
            <Sparkles className="h-4 w-4 shrink-0 text-warning" aria-hidden />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{t('patientPortal.title')}</h1>
          <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">{t('patientPortal.subtitle')}</p>
          <div className="mt-8 rounded-card border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/80">{t('patientPortal.patientLabel')}</p>
            <p className="mt-1 text-2xl font-bold text-white">{displayName}</p>
            <p className="mt-2 text-sm text-white/85">
              {t('patientPortal.recordId', { code: displayCode })}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/90">
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              <a href={`tel:${view.clinicPhoneDigits}`} className="underline-offset-2 hover:underline">
                {phoneDisplay}
              </a>
            </div>
          </div>
        </header>
      </div>

      <main className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
        <section aria-labelledby="patient-portal-balance-heading">
          <h2 id="patient-portal-balance-heading" className="text-lg font-bold text-primary-navy">
            {t('patientPortal.balanceSectionTitle')}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t('patientPortal.balanceSectionHint')}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <StatCard
              title={t('patientPortal.stats.totalInvoiced')}
              value={formatCurrencyUsd(view.totalInvoiced, locale)}
              icon={Wallet}
              accentClass="bg-white text-primary shadow-sm ring-1 ring-border-card"
            />
            <StatCard
              title={t('patientPortal.stats.totalPaid')}
              value={formatCurrencyUsd(view.totalPaid, locale)}
              icon={CreditCard}
              accentClass="bg-success/15 text-success"
            />
            <StatCard
              title={t('patientPortal.stats.totalRemaining')}
              value={formatCurrencyUsd(view.totalRemaining, locale)}
              icon={AlertCircle}
              accentClass="bg-warning/15 text-warning"
            />
          </div>
          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary-navy">
            <span className="font-semibold">{t('patientPortal.nextDueLabel')} </span>
            {formatIsoDateLocale(view.nextPaymentDueIso, locale)}
          </div>
        </section>

        <section aria-labelledby="patient-portal-appointments-heading">
          <h2 id="patient-portal-appointments-heading" className="flex items-center gap-2 text-lg font-bold text-primary-navy">
            <CalendarDays className="h-5 w-5 text-primary" aria-hidden />
            {t('patientPortal.appointmentsTitle')}
          </h2>
          <ul className="mt-5 space-y-4">
            {view.appointments.map((row) => {
              const copy = resolveAppointmentCopy(row)
              return (
                <li
                  key={row.id}
                  className="rounded-card border border-border-card border-s-4 border-s-primary bg-surface p-5 shadow-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-primary-navy">
                      {formatIsoDateLocale(row.date, locale)} · {formatTime24hTo12hLocale(row.time24, locale)}
                    </p>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {t(`patients.appointments.status.${row.status}`)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-foreground">{copy.treatment}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{copy.doctor}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{copy.notes}</p>
                </li>
              )
            })}
          </ul>
        </section>

        <footer className="rounded-card border border-dashed border-border-card bg-surface/80 p-5 text-center text-sm text-muted-foreground">
          {t('patientPortal.footerDisclaimer')}
        </footer>
      </main>
    </div>
  )
}
