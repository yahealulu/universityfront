import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { WORK_DAY_ORDER } from '@/components/common/ClinicSwitcher/clinicWizard.constants'
import type { WorkDayId } from '@/types/clinic.types'

type NewClinicWorkDaysStepProps = {
  selected: WorkDayId[]
  onToggle: (id: WorkDayId) => void
}

export const NewClinicWorkDaysStep: FC<NewClinicWorkDaysStepProps> = ({ selected, onToggle }) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">{t('clinics.newWizard.step2.heading')}</h3>
        <p className="text-sm text-muted-foreground">{t('clinics.newWizard.step2.subheading')}</p>
      </div>
      <ul className="space-y-2">
        {WORK_DAY_ORDER.map((id) => {
          const checked = selected.includes(id)
          return (
            <li
              key={id}
              className="flex items-center gap-3 rounded-lg border border-border-card bg-surface px-3 py-2.5"
            >
              <input
                type="checkbox"
                id={`day-${id}`}
                checked={checked}
                onChange={() => {
                  onToggle(id)
                }}
                className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-primary/30"
              />
              <label htmlFor={`day-${id}`} className="flex-1 cursor-pointer text-sm font-medium text-foreground">
                {t(`clinics.newWizard.days.${id}`)}
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
