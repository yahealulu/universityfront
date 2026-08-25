import { format, parseISO } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'
import { Pencil, Trash2 } from 'lucide-react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import type { ExpenseListItem } from '@/types/expense.types'
import { formatInvoiceMoney } from '@/utils/formatters'

export type ExpensesTableProps = {
  rows: ExpenseListItem[]
  onEdit: (row: ExpenseListItem) => void
  onDelete: (row: ExpenseListItem) => void
}

export const ExpensesTable: FC<ExpensesTableProps> = ({ rows, onEdit, onDelete }) => {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language.startsWith('ar')
  const locale = i18n.language.startsWith('ar') ? ar : enUS
  const datePattern = i18n.language.startsWith('ar') ? 'd/M/yyyy' : 'M/d/yyyy'

  return (
    <div className="overflow-x-table rounded-xl border border-border-card" dir={isArabic ? 'rtl' : 'ltr'}>
      <table className="w-full min-w-[960px] border-collapse text-sm">
        <thead>
          {isArabic ? (
            <tr className="bg-[#e0f2fe]">
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('expenses.table.actions')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('expenses.table.amount')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('expenses.table.description')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('expenses.table.category')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('expenses.table.title')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('expenses.table.date')}</th>
            </tr>
          ) : (
            <tr className="bg-[#e0f2fe]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('expenses.table.date')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('expenses.table.title')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('expenses.table.category')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('expenses.table.description')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('expenses.table.amount')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('expenses.table.actions')}</th>
            </tr>
          )}
        </thead>
        <tbody className="divide-y divide-border-card bg-surface">
          {rows.map((row) => (
            isArabic ? (
              <tr key={row.id} className="hover:bg-page/80">
                <td className="px-4 py-3 text-start">
                  <div className="flex items-center justify-start gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary"
                      aria-label={t('expenses.table.editAria')}
                      onClick={() => onEdit(row)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-danger"
                      aria-label={t('expenses.table.deleteAria')}
                      onClick={() => onDelete(row)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-primary">{formatInvoiceMoney(row.amount)}</td>
                <td className="max-w-xs px-4 py-3 text-muted-foreground line-clamp-2">{row.description}</td>
                <td className="px-4 py-3 text-foreground">{t(`expenses.categories.${row.category}`)}</td>
                <td className="px-4 py-3 font-bold text-foreground">{row.title}</td>
                <td className="whitespace-nowrap px-4 py-3 text-foreground">
                  {format(parseISO(row.date), datePattern, { locale })}
                </td>
              </tr>
            ) : (
              <tr key={row.id} className="hover:bg-page/80">
                <td className="whitespace-nowrap px-4 py-3 text-foreground">
                  {format(parseISO(row.date), datePattern, { locale })}
                </td>
                <td className="px-4 py-3 font-bold text-foreground">{row.title}</td>
                <td className="px-4 py-3 text-foreground">{t(`expenses.categories.${row.category}`)}</td>
                <td className="max-w-xs px-4 py-3 text-muted-foreground line-clamp-2">{row.description}</td>
                <td className="px-4 py-3 font-semibold text-primary">{formatInvoiceMoney(row.amount)}</td>
                <td className="px-4 py-3 text-end">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary"
                      aria-label={t('expenses.table.editAria')}
                      onClick={() => onEdit(row)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-danger"
                      aria-label={t('expenses.table.deleteAria')}
                      onClick={() => onDelete(row)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  )
}
