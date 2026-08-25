import { Cake, Droplet, User2 } from 'lucide-react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import type { PatientProfile } from '@/types/patient.types'

export type PatientDemographicsRowProps = {
  profile: PatientProfile
}

const chipClass =
  'flex items-center gap-3 rounded-xl border border-border-card bg-primary/5 px-4 py-3 shadow-sm'

export const PatientDemographicsRow: FC<PatientDemographicsRowProps> = ({ profile }) => {
  const { t } = useTranslation()

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className={chipClass}>
        <User2 className="h-5 w-5 shrink-0 text-primary" aria-hidden />
        <div>
          <p className="text-xs font-semibold text-muted-foreground">{t('patients.profile.gender')}</p>
          <p className="font-semibold text-foreground">{t(`patients.gender.${profile.genderLabelKey}`)}</p>
        </div>
      </div>
      <div className={chipClass}>
        <Droplet className="h-5 w-5 shrink-0 text-primary" aria-hidden />
        <div>
          <p className="text-xs font-semibold text-muted-foreground">{t('patients.profile.bloodType')}</p>
          <p className="font-semibold text-foreground">{profile.bloodType}</p>
        </div>
      </div>
      <div className={chipClass}>
        <Cake className="h-5 w-5 shrink-0 text-primary" aria-hidden />
        <div>
          <p className="text-xs font-semibold text-muted-foreground">{t('patients.profile.age')}</p>
          <p className="font-semibold text-foreground">
            {t('patients.profile.ageYears', { count: profile.ageYears })}
          </p>
        </div>
      </div>
    </div>
  )
}
