import { Building2, Languages, LogOut, Menu, User } from 'lucide-react'
import { format } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'
import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { ClinicSwitcherPopover } from '@/components/common/ClinicSwitcher/ClinicSwitcherPopover'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useActiveClinicSync } from '@/hooks/clinics/useActiveClinicSync'
import { useLgBreakpoint } from '@/hooks/useLgBreakpoint'
import { getNavItemsForRole } from '@/layouts/shell/clinicNavConfig'
import { ClinicMobileNavSheet } from '@/layouts/shell/ClinicMobileNavSheet'
import { useAuthStore } from '@/store/auth.store'
import { useUiStore } from '@/store/ui.store'

export const AppLayout: FC = () => {
  const { t, i18n } = useTranslation()
  const logout = useAuthStore((s) => s.logout)
  const user = useAuthStore((s) => s.user)
  const role = useAuthStore((s) => s.role)
  const navItems = useMemo(() => getNavItemsForRole(role), [role])
  const location = useLocation()
  const [isLanguageSwitching, setIsLanguageSwitching] = useState(false)
  const { activeClinicName } = useActiveClinicSync()
  const isSidebarCollapsed = useUiStore((s) => s.isSidebarCollapsed)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  const isMobileNavOpen = useUiStore((s) => s.isMobileNavOpen)
  const openMobileNav = useUiStore((s) => s.openMobileNav)
  const closeMobileNav = useUiStore((s) => s.closeMobileNav)
  const isLgUp = useLgBreakpoint()

  const headerDate = useMemo(() => {
    const locale = i18n.language.startsWith('ar') ? ar : enUS
    return format(new Date(), 'EEEE, MMMM d, yyyy', { locale })
  }, [i18n.language])

  const isArabicUi = i18n.language.startsWith('ar')
  const targetLocaleCode = isArabicUi ? 'EN' : 'AR'
  const languageAriaLabel = isArabicUi ? t('app.language.switchToEn') : t('app.language.switchToAr')
  const sidebarToggleAria = isSidebarCollapsed
    ? t('app.sidebar.expand')
    : t('app.sidebar.collapse')

  const handleLanguageToggle = () => {
    setIsLanguageSwitching(true)
    void i18n.changeLanguage(isArabicUi ? 'en' : 'ar')
  }

  useEffect(() => {
    if (!isLanguageSwitching) return
    const timer = window.setTimeout(() => {
      setIsLanguageSwitching(false)
    }, 240)
    return () => window.clearTimeout(timer)
  }, [isLanguageSwitching])

  useEffect(() => {
    document.documentElement.lang = isArabicUi ? 'ar' : 'en'
    document.documentElement.dir = isArabicUi ? 'rtl' : 'ltr'
  }, [isArabicUi])

  useEffect(() => {
    closeMobileNav()
  }, [location.pathname, closeMobileNav])

  useEffect(() => {
    if (isLgUp) closeMobileNav()
  }, [isLgUp, closeMobileNav])

  const handleLogout = () => {
    logout()
  }

  const handleMobileNavOpenChange = (next: boolean) => {
    if (next) {
      openMobileNav()
      return
    }
    closeMobileNav()
  }

  return (
    <div
      className={[
        'flex min-h-screen bg-page',
        isLanguageSwitching ? 'locale-switch-enter' : '',
      ].join(' ')}
      dir={isArabicUi ? 'rtl' : 'ltr'}
    >
      <aside
        className={[
          'hidden shrink-0 flex-col text-white transition-[width] duration-200 ease-out lg:flex',
          isSidebarCollapsed ? 'w-20' : 'w-60',
        ].join(' ')}
        style={{ backgroundColor: 'var(--color-primary)' }}
        aria-label={t('app.name')}
      >
        <div
          className={[
            'flex border-b border-white/10 px-4 py-5',
            isSidebarCollapsed ? 'justify-center' : 'items-center gap-2 justify-between',
          ].join(' ')}
        >
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 shrink-0 text-primary" aria-hidden />
              <span className="text-lg font-semibold">{t('app.name')}</span>
            </div>
          ) : (
            <Building2 className="h-8 w-8 shrink-0 text-primary" aria-hidden />
          )}
          <button
            type="button"
            onClick={toggleSidebar}
            className="rounded-xl p-0 text-white transition-opacity hover:opacity-85"
            aria-label={sidebarToggleAria}
            title={sidebarToggleAria}
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={isSidebarCollapsed ? 'rtl:rotate-180' : 'rtl:rotate-180 rotate-180'}
              aria-hidden
            >
              <path
                d="M19.3333 14V30M15.7778 14H28.2222C29.2041 14 30 14.7959 30 15.7778V28.2222C30 29.2041 29.2041 30 28.2222 30H15.7778C14.7959 30 14 29.2041 14 28.2222V15.7778C14 14.7959 14.7959 14 15.7778 14Z"
                stroke="#FEFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="px-3 py-4">
          <ClinicSwitcherPopover collapsed={isSidebarCollapsed} />
        </div>
        <nav className={['flex flex-1 flex-col gap-0.5 pb-6', isSidebarCollapsed ? 'px-3' : 'px-2'].join(' ')}>
          {navItems.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={t(key)}
              className={({ isActive }) =>
                [
                  'rounded-lg text-sm font-medium transition-colors duration-200 ease-out',
                  isSidebarCollapsed
                    ? 'flex h-11 w-full items-center justify-center px-0'
                    : 'flex items-center gap-3 px-3 py-2.5',
                  isActive
                    ? 'bg-[var(--color-primary-light)] text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white',
                ].join(' ')
              }
            >
              <Icon className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
              {!isSidebarCollapsed ? t(key) : null}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border-card bg-header-bg px-4 py-4 md:px-6 lg:px-8">
          <button
            type="button"
            onClick={openMobileNav}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border-card bg-surface text-header-title shadow-sm transition-opacity hover:opacity-90 lg:hidden"
            aria-label={t('app.mobileNav.openMenu')}
          >
            <Menu className="h-6 w-6" strokeWidth={2} aria-hidden />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-bold text-header-title md:text-lg">
              {activeClinicName ?? t('app.clinicNamePlaceholder')}
            </h1>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">{headerDate}</p>
          </div>
          <div className="flex shrink-0 items-center gap-3 md:gap-6">
            <button
              type="button"
              onClick={handleLanguageToggle}
              className="flex items-center gap-2 rounded-lg px-1 py-1 text-sm font-semibold text-header-title transition-opacity hover:opacity-80"
              aria-label={languageAriaLabel}
            >
              <Languages className="h-5 w-5 shrink-0" aria-hidden />
              <span>{targetLocaleCode}</span>
            </button>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-opacity hover:opacity-90"
                  aria-label={t('app.userMenu')}
                >
                  <User className="h-5 w-5" strokeWidth={2} aria-hidden />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                sideOffset={8}
                className="w-[16.75rem] rounded-2xl border-0 bg-white p-0 shadow-xl"
              >
                <div className="space-y-2 p-4">
                  <div>
                    <p className="text-xl font-semibold leading-none text-slate-900">
                      {user?.name ?? t('app.user.name')}
                    </p>
                    <p className="mt-2 text-lg text-[#6a7fa9] underline decoration-[#d7e0ef] underline-offset-4">
                      {user?.email ?? user?.username ?? t('app.user.email')}
                    </p>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 text-xl font-semibold text-[#0d65d9] transition-opacity hover:opacity-80"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>{t('app.user.logout')}</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-6">
          <div key={`${location.pathname}-${i18n.language}`} className="route-section-enter">
            <Outlet />
          </div>
        </main>
      </div>
      <ClinicMobileNavSheet open={isMobileNavOpen} onOpenChange={handleMobileNavOpenChange} />
    </div>
  )
}
