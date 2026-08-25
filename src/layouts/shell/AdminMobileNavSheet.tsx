import { Building2, LogOut } from 'lucide-react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useAuthStore } from '@/store/auth.store'
import { useUiStore } from '@/store/ui.store'

import { adminNavItems } from './adminNavConfig'

type AdminMobileNavSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const AdminMobileNavSheet: FC<AdminMobileNavSheetProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation()
  const logout = useAuthStore((s) => s.logout)
  const closeMobileNav = useUiStore((s) => s.closeMobileNav)

  const handleNavigate = () => {
    closeMobileNav()
  }

  const handleLogout = () => {
    closeMobileNav()
    logout()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent aria-describedby={undefined} className="lg:hidden">
        <SheetTitle className="sr-only">{t('app.mobileNav.adminSheetTitle')}</SheetTitle>
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4 pe-14">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
            <Building2 className="h-5 w-5" aria-hidden />
          </span>
          <p className="text-lg font-semibold">{t('admin.brand')}</p>
        </div>
        <nav className="mt-4 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-1 pb-4" aria-label={t('app.mobileNav.adminSheetTitle')}>
          {adminNavItems.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={t(key)}
              onClick={handleNavigate}
              className={({ isActive }) =>
                [
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive ? 'bg-[var(--color-accent)] text-white' : 'text-white/85 hover:bg-white/10 hover:text-white',
                ].join(' ')
              }
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span>{t(key)}</span>
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="mx-2 mt-auto inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden />
          <span>{t('admin.logout')}</span>
        </button>
      </SheetContent>
    </Sheet>
  )
}
