import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

export type YesNoTilesProps = {
  value: boolean | null
  onChange: (v: boolean) => void
}

export const YesNoTiles: FC<YesNoTilesProps> = ({ value, onChange }) => {
  const { t } = useTranslation()

  const Tile = ({ v, label }: { v: boolean; label: string }) => (
    <button
      type="button"
      onClick={() => onChange(v)}
      className={cn(
        'flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-6 text-sm font-semibold transition-colors',
        value === v ? 'border-primary bg-primary/10 text-primary' : 'border-border-card bg-surface text-foreground'
      )}
    >
      <span
        className={cn(
          'flex h-5 w-5 items-center justify-center rounded border',
          value === v ? 'border-primary bg-primary text-white' : 'border-muted-foreground/40'
        )}
      >
        {value === v ? '✓' : ''}
      </span>
      {label}
    </button>
  )

  return (
    <div className="flex gap-3">
      <Tile v={false} label={t('patients.clinicalHistory.no')} />
      <Tile v label={t('patients.clinicalHistory.yes')} />
    </div>
  )
}
