import { RouterProvider } from 'react-router-dom'

import { DocumentLang } from '@/providers/DocumentLang'
import { QueryProvider } from '@/providers/QueryProvider'
import { router } from '@/router'

export const App = () => {
  return (
    <QueryProvider>
      <DocumentLang>
        <RouterProvider router={router} />
      </DocumentLang>
    </QueryProvider>
  )
}
