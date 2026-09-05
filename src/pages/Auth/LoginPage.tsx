import { Building2 } from 'lucide-react'
import type { FC, FormEvent } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { authApi } from '@/api/modules/auth.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { PortalType } from '@/store/auth.store'
import { useAuthStore } from '@/store/auth.store'
import { getHomePathForRole } from '@/utils/permissions'

export const LoginPage: FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setAuthSession = useAuthStore((state) => state.setAuthSession)

  const [identifier, setIdentifier] = useState('admin@clinic.com')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const portalType: PortalType = 'clinic'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const data = await authApi.login({ identifier: identifier.trim(), password })
      setAuthSession({ ...data, portalType })
      navigate(getHomePathForRole(data.user.role), { replace: true })
    } catch {
      setError(
        t('auth.login.error', {
          defaultValue: 'Invalid email/username or password',
        }),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-header-bg px-4 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[980px] items-center justify-center">
        <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
              <Building2 className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{t('auth.login.brand')}</h1>
              <p className="text-sm text-slate-500">{t('auth.login.subtitle')}</p>
            </div>
          </div>

          <h2 className="text-center text-xl font-semibold text-slate-800">{t('auth.login.title')}</h2>
          <p className="mt-1 text-center text-sm text-slate-500">{t('auth.login.description')}</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="login-identifier">{t('auth.login.identifier')}</Label>
              <Input
                id="login-identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder={t('auth.login.identifierPlaceholder')}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="login-password">{t('auth.login.password')}</Label>
              <Input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t('auth.login.passwordPlaceholder')}
                required
              />
            </div>

            {error ? <p className="text-sm text-red-500">{error}</p> : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? t('auth.login.submitting', { defaultValue: 'Signing in...' })
                : t('auth.login.submit')}
            </Button>
          </form>
        </section>
      </div>
    </main>
  )
}
