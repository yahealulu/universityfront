import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/App'
import '@/i18n'
import '@/styles/globals.css'

const rootEl = document.getElementById('root')

async function bootstrap() {
  if (import.meta.env.VITE_ENABLE_MOCKS === 'true') {
    const { worker } = await import('@/mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }

  if (!rootEl) {
    throw new Error('Root element #root not found')
  }

  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

void bootstrap()
