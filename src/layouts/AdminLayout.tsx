import { Building2, LogOut, Menu } from 'lucide-react'
import type { FC } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { useLgBreakpoint } from '@/hooks/useLgBreakpoint'
import { adminNavItems } from '@/layouts/shell/adminNavConfig'
import { AdminMobileNavSheet } from '@/layouts/shell/AdminMobileNavSheet'
import { useAuthStore } from '@/store/auth.store'
import { useUiStore } from '@/store/ui.store'

export const AdminLayout: FC = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const logout = useAuthStore((state) => state.logout)
  const isSidebarCollapsed = useUiStore((state) => state.isSidebarCollapsed)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  const isMobileNavOpen = useUiStore((s) => s.isMobileNavOpen)
  const openMobileNav = useUiStore((s) => s.openMobileNav)
  const closeMobileNav = useUiStore((s) => s.closeMobileNav)
  const isLgUp = useLgBreakpoint()
  const sidebarToggleAria = isSidebarCollapsed ? t('app.sidebar.expand') : t('app.sidebar.collapse')

  useEffect(() => {
    closeMobileNav()
  }, [location.pathname, closeMobileNav])

  useEffect(() => {
    if (isLgUp) closeMobileNav()
  }, [isLgUp, closeMobileNav])

  const handleMobileNavOpenChange = (next: boolean) => {
    if (next) {
      openMobileNav()
      return
    }
    closeMobileNav()
  }

  return (
    <div className="min-h-screen bg-page">
      <aside
        className={[
          'fixed inset-y-0 start-0 z-30 hidden shrink-0 flex-col overflow-x-hidden px-3 py-4 text-white transition-[width] duration-200 ease-out lg:flex',
          isSidebarCollapsed ? 'w-20' : 'w-64',
        ].join(' ')}
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        <div
          className={[
            'mb-6 flex border-b border-white/10 px-4 py-5',
            isSidebarCollapsed ? 'justify-center' : 'items-center justify-between gap-3',
          ].join(' ')}
        >
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <Building2 className="h-5 w-5" />
              </span>
              <p className="text-lg font-semibold">{t('admin.brand')}</p>
            </div>
          ) : (
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
              <Building2 className="h-5 w-5 shrink-0" />
            </span>
          )}
          <button
            type="button"
            onClick={toggleSidebar}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition-opacity hover:opacity-85"
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

        <nav className={['flex flex-1 flex-col gap-1', isSidebarCollapsed ? 'px-0.5' : ''].join(' ')}>
          {adminNavItems.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={t(key)}
              className={({ isActive }) =>
                [
                  'rounded-lg text-sm transition-colors',
                  isSidebarCollapsed ? 'flex h-11 w-full items-center justify-center px-0 py-0' : 'flex items-center gap-2 px-3 py-2',
                  isActive ? 'bg-[var(--color-accent)] text-white' : 'text-white/85 hover:bg-white/10 hover:text-white',
                ].join(' ')
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!isSidebarCollapsed ? <span>{t(key)}</span> : null}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={logout}
          title={t('admin.logout')}
          className={[
            'mt-4 inline-flex rounded-lg text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white',
            isSidebarCollapsed ? 'h-11 w-full items-center justify-center px-0 py-0' : 'items-center gap-2 px-3 py-2',
          ].join(' ')}
        >
          <LogOut className="h-4 w-4" />
          {!isSidebarCollapsed ? <span>{t('admin.logout')}</span> : null}
        </button>
      </aside>

      <div
        className={[
          'flex min-w-0 flex-1 flex-col transition-[margin] duration-200 ease-out',
          'ms-0',
          isSidebarCollapsed ? 'lg:ms-20' : 'lg:ms-64',
        ].join(' ')}
      >
        <header className="flex items-center gap-3 border-b border-slate-200 bg-header-bg px-4 py-4 md:px-6 lg:px-8">
          <button
            type="button"
            onClick={openMobileNav}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border-card bg-surface text-slate-800 shadow-sm transition-opacity hover:opacity-90 lg:hidden"
            aria-label={t('app.mobileNav.openMenu')}
          >
            <Menu className="h-6 w-6" strokeWidth={2} aria-hidden />
          </button>
          <h1 className="min-w-0 flex-1 truncate text-lg font-semibold text-slate-800 md:text-xl">{t('admin.headerTitle')}</h1>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-6">
          <Outlet />
        </main>
      </div>
      <AdminMobileNavSheet open={isMobileNavOpen} onOpenChange={handleMobileNavOpenChange} />
    </div>
  )
}
