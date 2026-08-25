import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import { TOOTH_SURFACE_IDS, TOOTH_SURFACE_PATHS, type ToothSurfaceId } from './toothSurfaces.constants'

export type ToothSurfaceSvgProps = {
  surfaces: Partial<Record<ToothSurfaceId, boolean>>
  onToggle: (id: ToothSurfaceId) => void
}

export const ToothSurfaceSvg: FC<ToothSurfaceSvgProps> = ({ surfaces, onToggle }) => {
  const { t } = useTranslation()

  return (
    <div className="mx-auto w-full max-w-[min(100%,20rem)] shrink-0">
      <svg
        viewBox="0 0 100 100"
        className="aspect-square w-full text-border-card"
        role="img"
        aria-label={t('patients.dental.choosePart')}
      >
        {TOOTH_SURFACE_IDS.map((id) => {
          const d = TOOTH_SURFACE_PATHS[id]
          const active = Boolean(surfaces[id])
          return (
            <path
              key={id}
              d={d}
              className={cn(
                'cursor-pointer stroke-[1.25] transition-colors',
                active
                  ? 'fill-primary/20 stroke-primary'
                  : 'fill-surface stroke-border-card hover:fill-muted/30'
              )}
              vectorEffect="non-scaling-stroke"
              tabIndex={0}
              role="button"
              aria-pressed={active}
              aria-label={t(`patients.dental.surfaces.${id}`)}
              onClick={() => onToggle(id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onToggle(id)
                }
              }}
            />
          )
        })}
      </svg>
    </div>
  )
}
