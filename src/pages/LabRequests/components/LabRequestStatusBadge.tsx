import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import type { LabRequestStatus } from '@/types/lab-request.types'

const STATUS_STYLES: Record<
  LabRequestStatus,
  { bg: string; text: string; key: 'delivered' | 'pending' | 'canceled' }
> = {
  delivered: { bg: 'bg-green-100', text: 'text-green-800', key: 'delivered' },
  pending: { bg: 'bg-orange-100', text: 'text-orange-800', key: 'pending' },
  canceled: { bg: 'bg-red-100', text: 'text-red-800', key: 'canceled' },
}

export type LabRequestStatusBadgeProps = {
  status: LabRequestStatus
}

export const LabRequestStatusBadge: FC<LabRequestStatusBadgeProps> = ({ status }) => {
  const { t } = useTranslation()
  const cfg = STATUS_STYLES[status]
  const label = t(`labRequests.status.${cfg.key}`)

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
        cfg.bg,
        cfg.text
      )}
    >
      {label}
    </span>
  )
}
