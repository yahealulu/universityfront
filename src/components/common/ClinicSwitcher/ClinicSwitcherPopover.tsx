import { ChevronDown, ChevronRight, Plus } from 'lucide-react'
import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { NewClinicWizardModal } from '@/components/common/ClinicSwitcher/NewClinicWizardModal'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { useClinicsList } from '@/hooks/clinics/useClinicsList'
import { useClinicStore } from '@/store/clinic.store'
import { cn } from '@/lib/utils'

export type ClinicSwitcherPopoverProps = {
  collapsed?: boolean
}

export const ClinicSwitcherPopover: FC<ClinicSwitcherPopoverProps> = ({ collapsed = false }) => {
  const { t } = useTranslation()
  const { data: clinics, isLoading } = useClinicsList()
  const activeClinicId = useClinicStore((s) => s.activeClinicId)
  const setActiveClinicId = useClinicStore((s) => s.setActiveClinicId)
  const [open, setOpen] = useState(false)
  const [wizardOpen, setWizardOpen] = useState(false)

  const triggerLabel = useMemo(() => {
    if (!clinics?.length) return t('app.clinicNamePlaceholder')
    const row = clinics.find((c) => c.id === activeClinicId) ?? clinics[0]
    return row?.name ?? t('app.clinicNamePlaceholder')
  }, [clinics, activeClinicId, t])

  const selectClinic = (id: string) => {
    setActiveClinicId(id)
    setOpen(false)
  }

  const openWizard = () => {
    setOpen(false)
    setWizardOpen(true)
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              'flex w-full items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-start text-sm text-white transition-colors hover:bg-white/10',
              collapsed && 'justify-center px-0',
              open && 'bg-white/10'
            )}
            aria-expanded={open}
            aria-label={t('clinics.switcher.triggerAria')}
            title={triggerLabel}
          >
            <span className="h-8 w-8 shrink-0 rounded bg-white/20" aria-hidden />
            {!collapsed ? (
              <>
                <span className="min-w-0 flex-1 truncate font-medium text-white/90">{triggerLabel}</span>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
              </>
            ) : null}
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          align="start"
          sideOffset={8}
          className="clinic-switcher-popover w-[min(20rem,calc(100vw-2rem))] border-border-card p-0 shadow-xl"
        >
          <div className="border-b border-border-card px-4 py-3">
            <p className="text-sm font-bold text-foreground">{t('clinics.switcher.title')}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{t('clinics.switcher.subtitle')}</p>
          </div>
          <div className="max-h-64 overflow-y-auto py-2">
            {isLoading ? (
              <div className="space-y-2 px-3">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ) : (
              <ul className="px-2">
                {(clinics ?? []).map((c) => {
                  const isActive = c.id === activeClinicId
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => selectClinic(c.id)}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-start text-sm transition-colors',
                          isActive
                            ? 'bg-primary/10 font-semibold text-primary'
                            : 'text-foreground hover:bg-muted/60'
                        )}
                        aria-current={isActive ? 'true' : undefined}
                      >
                        <span className="min-w-0 flex-1 truncate">{c.name}</span>
                        {!isActive ? (
                          <ChevronRight className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                        ) : null}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
          <div className="border-t border-border-card p-3">
            <Button
              type="button"
              className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={openWizard}
            >
              <Plus className="h-4 w-4" aria-hidden />
              {t('clinics.switcher.addClinic')}
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <NewClinicWizardModal open={wizardOpen} onOpenChange={setWizardOpen} />
    </>
  )
}
