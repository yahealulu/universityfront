import { cn } from '@/lib/utils'
import type { ToothStatusKey } from '@/types/patient.types'

export const DENTAL_LEGEND_ORDER: ToothStatusKey[] = [
  'natural',
  'filling',
  'extracted',
  'crown',
  'implant',
  'decay',
  'previous',
]

/** Fill + border for tooth body and legend swatch (mock-aligned colors). */
export const statusSurfaceClass = (status: ToothStatusKey): string => {
  switch (status) {
    case 'natural':
      return 'border-border-card bg-surface'
    case 'filling':
      return 'border-emerald-600 bg-emerald-500'
    case 'extracted':
      return 'border-red-700 bg-red-500'
    case 'crown':
      return 'border-amber-500 bg-amber-300'
    case 'implant':
      return 'border-violet-700 bg-violet-300'
    case 'decay':
      return 'border-slate-800 bg-slate-800'
    case 'previous':
      return 'border-amber-900 bg-amber-800'
    default:
      return 'border-border-card bg-surface'
  }
}

export const toothShapeClass = (status: ToothStatusKey, active: boolean): string => {
  const base = 'h-12 w-7 shrink-0 rounded-md border-2 transition-colors'
  const ring = active ? ' ring-2 ring-primary ring-offset-2' : ''
  return cn(base, statusSurfaceClass(status), ring)
}
