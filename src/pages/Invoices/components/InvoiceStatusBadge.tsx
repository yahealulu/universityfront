import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import type { InvoiceStatus } from '@/types/invoice.types'
import { cn } from '@/lib/utils'

export type InvoiceStatusBadgeProps = {
  status: InvoiceStatus
}

export const InvoiceStatusBadge: FC<InvoiceStatusBadgeProps> = ({ status }) => {
  const { t } = useTranslation()

  const cls = cn(
    'inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold',
    status === 'unpaid' && 'bg-rose-100 text-red-600',
    status === 'partially_paid' && 'bg-orange-100 text-amber-700',
    status === 'paid' && 'bg-green-100 text-green-700'
  )

  return <span className={cls}>{t(`invoices.status.${status}`)}</span>
}
