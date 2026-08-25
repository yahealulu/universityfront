import { Building2 } from 'lucide-react'
import type { FC, FormEvent } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { PortalType } from '@/store/auth.store'
import { useAuthStore } from '@/store/auth.store'

const DEFAULT_PORTAL: PortalType = 'clinic'

export const LoginPage: FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)

  const [email, setEmail] = useState('clinic@example.com')
  const [password, setPassword] = useState('********')
  const portalType: PortalType = 'clinic'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setSession({
      token: `mock-${portalType}-token`,
      portalType,
    })

    navigate('/clinic/dashboard', { replace: true })
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
              <Label htmlFor="login-email">{t('auth.login.email')}</Label>
              <Input
                id="login-email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t('auth.login.emailPlaceholder')}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="login-password">{t('auth.login.password')}</Label>
              <Input
                id="login-password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t('auth.login.passwordPlaceholder')}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              {t('auth.login.submit')}
            </Button>
          </form>
        </section>
      </div>
    </main>
  )
}
