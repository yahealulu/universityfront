import { Building2 } from 'lucide-react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import { ClinicSwitcherPopover } from '@/components/common/ClinicSwitcher/ClinicSwitcherPopover'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useUiStore } from '@/store/ui.store'

import { clinicNavItems } from './clinicNavConfig'

type ClinicMobileNavSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ClinicMobileNavSheet: FC<ClinicMobileNavSheetProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation()
  const closeMobileNav = useUiStore((s) => s.closeMobileNav)

  const handleNavigate = () => {
    closeMobileNav()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent aria-describedby={undefined} className="lg:hidden">
        <SheetTitle className="sr-only">{t('app.mobileNav.sheetTitle')}</SheetTitle>
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-4 pe-14">
          <Building2 className="h-8 w-8 shrink-0 text-primary" aria-hidden />
          <span className="text-lg font-semibold">{t('app.name')}</span>
        </div>
        <div className="px-3 py-4">
          <ClinicSwitcherPopover collapsed={false} />
        </div>
        <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-8" aria-label={t('app.mobileNav.sheetTitle')}>
          {clinicNavItems.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={t(key)}
              onClick={handleNavigate}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ease-out',
                  isActive
                    ? 'bg-[var(--color-primary-light)] text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white',
                ].join(' ')
              }
            >
              <Icon className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
              {t(key)}
            </NavLink>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
