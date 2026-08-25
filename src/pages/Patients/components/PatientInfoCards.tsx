import { Calendar, CloudUpload, FileText, Mail, MapPin, Phone } from 'lucide-react'
import type { FC } from 'react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useDeletePatientFile } from '@/hooks/patients/usePatientMutations'
import type { PatientProfile } from '@/types/patient.types'
import { formatIsoDateLocale } from '@/utils/formatters'

export type PatientInfoCardsProps = {
  patientId: string
  profile: PatientProfile
}

export const PatientInfoCards: FC<PatientInfoCardsProps> = ({ patientId, profile }) => {
  const { t, i18n } = useTranslation()
  const deleteFile = useDeletePatientFile(patientId)
  const fileInputId = useId()

  const lastVisitDisplay = formatIsoDateLocale(profile.activities.lastVisit, i18n.language)
  const nextVisitDisplay = formatIsoDateLocale(profile.activities.nextVisit, i18n.language)

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-xl border border-border-card bg-surface p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-foreground">{t('patients.profile.contactTitle')}</h2>
        <ul className="space-y-4 text-sm">
          <li className="flex gap-3">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <div>
              <p className="text-xs font-semibold text-muted-foreground">{t('patients.profile.email')}</p>
              <p className="font-medium text-foreground">{profile.contact.email}</p>
            </div>
          </li>
          <li className="flex gap-3">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <div>
              <p className="text-xs font-semibold text-muted-foreground">{t('patients.profile.phone')}</p>
              <p className="font-medium text-foreground">{profile.contact.phone}</p>
            </div>
          </li>
          <li className="flex gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <div>
              <p className="text-xs font-semibold text-muted-foreground">{t('patients.profile.address')}</p>
              <p className="font-medium text-foreground">{profile.contact.address}</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="rounded-xl border border-border-card bg-surface p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-foreground">{t('patients.profile.activitiesTitle')}</h2>
        <div className="space-y-3">
          <div className="rounded-lg border border-border-card bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2 text-primary">
              <Calendar className="h-4 w-4" aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-wide">
                {t('patients.profile.lastVisit')}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">{lastVisitDisplay}</p>
          </div>
          <div className="rounded-lg border-2 border-primary bg-primary/5 px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2 text-primary">
              <Calendar className="h-4 w-4" aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-wide">
                {t('patients.profile.nextVisit')}
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold text-primary">{nextVisitDisplay}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border-card bg-surface p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-foreground">{t('patients.profile.filesTitle')}</h2>
        {profile.files.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-card bg-muted/20 px-4 py-8 text-center">
            <input
              id={fileInputId}
              type="file"
              accept="image/png,image/jpeg"
              className="sr-only"
              aria-label={t('patients.profile.uploadFileAria')}
              onChange={(e) => {
                e.target.value = ''
              }}
            />
            <div className="mb-3 flex justify-center">
              <CloudUpload className="h-8 w-8 text-primary" aria-hidden />
            </div>
            <label
              htmlFor={fileInputId}
              className="cursor-pointer text-base font-semibold text-primary hover:underline"
            >
              {t('patients.profile.uploadFileTitle')}
            </label>
            <p className="mt-2 text-xs text-muted-foreground">{t('patients.profile.uploadFileHint')}</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {profile.files.map((f) => (
              <li
                key={f.id}
                className="flex flex-col gap-3 rounded-lg border border-border-card p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex gap-3">
                  <FileText className="h-8 w-8 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="font-medium text-foreground">{f.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('patients.profile.uploaded', { date: f.uploadedAt })}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-danger hover:text-danger"
                    disabled={deleteFile.isPending}
                    onClick={() => void deleteFile.mutateAsync(f.id)}
                  >
                    {t('patients.profile.deleteFile')}
                  </Button>
                  <Button type="button" variant="default" size="sm">
                    {t('patients.profile.openFile')}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
