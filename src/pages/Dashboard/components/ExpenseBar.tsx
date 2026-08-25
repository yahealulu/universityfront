import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import type { ExpenseCategory } from '@/types/dashboard.types'
import { formatCurrencyUsd } from '@/utils/formatters'

export type ExpenseBarProps = {
  category: ExpenseCategory
  locale: string
}

export const ExpenseBar: FC<ExpenseBarProps> = ({ category, locale }) => {
  const { t } = useTranslation()
  const label = t(`dashboard.expenseCategories.${category.id}`, {
    defaultValue: category.label,
  })
  const pct = Math.min(100, Math.max(0, category.percentage))

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="shrink-0 text-muted-foreground">
          {formatCurrencyUsd(category.amount, locale)} ({t('common.percent', { value: category.percentage })})
        </span>
      </div>
      <svg
        className="h-2 w-full overflow-visible"
        viewBox="0 0 100 4"
        preserveAspectRatio="none"
        role="img"
        aria-label={label}
      >
        <title>{label}</title>
        <rect width="100" height="4" rx="2" fill="var(--color-border)" />
        <rect width={pct} height="4" rx="2" fill="var(--color-accent)" />
      </svg>
    </div>
  )
}
