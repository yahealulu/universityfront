import { Pencil, Phone, Trash2 } from 'lucide-react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import type { SecretaryListItem } from '@/types/secretary.types'

export type SecretariesTableProps = {
  rows: SecretaryListItem[]
  onEdit: (row: SecretaryListItem) => void
  onDelete: (row: SecretaryListItem) => void
}

export const SecretariesTable: FC<SecretariesTableProps> = ({ rows, onEdit, onDelete }) => {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language.startsWith('ar')

  return (
    <div className="overflow-x-table rounded-xl border border-border-card" dir={isArabic ? 'rtl' : 'ltr'}>
      <table className="w-full min-w-[900px] border-collapse text-sm">
        <thead>
          {isArabic ? (
            <tr className="bg-[#e0f2fe]">
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('secretaries.table.actions')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('secretaries.table.password')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('secretaries.table.username')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('secretaries.table.phone')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('secretaries.table.name')}</th>
            </tr>
          ) : (
            <tr className="bg-[#e0f2fe]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('secretaries.table.name')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('secretaries.table.phone')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('secretaries.table.username')}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('secretaries.table.password')}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t('secretaries.table.actions')}</th>
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
                      aria-label={t('secretaries.table.editAria')}
                      onClick={() => onEdit(row)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-danger"
                      aria-label={t('secretaries.table.deleteAria')}
                      onClick={() => onDelete(row)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-sm text-muted-foreground">
                  {row.passwordDisplay}
                </td>
                <td className="px-4 py-3 text-foreground">{row.username}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                    {row.phone}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="font-bold text-foreground">{row.name}</p>
                </td>
              </tr>
            ) : (
              <tr key={row.id} className="hover:bg-page/80">
                <td className="px-4 py-3">
                  <p className="font-bold text-foreground">{row.name}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                    {row.phone}
                  </span>
                </td>
                <td className="px-4 py-3 text-foreground">{row.username}</td>
                <td className="px-4 py-3 font-mono text-sm text-muted-foreground">
                  {row.passwordDisplay}
                </td>
                <td className="px-4 py-3 text-end">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary"
                      aria-label={t('secretaries.table.editAria')}
                      onClick={() => onEdit(row)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-danger"
                      aria-label={t('secretaries.table.deleteAria')}
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
