import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

export const PlaceholderPage: FC = () => {
  const { t } = useTranslation()
  return (
    <div className="rounded-card border border-border-card bg-surface p-8 text-center text-muted-foreground shadow-card">
      {t('common.comingSoon')}
    </div>
  )
}
