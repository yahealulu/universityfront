import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type DocumentLangProps = {
  children: ReactNode
}

export const DocumentLang = ({ children }: DocumentLangProps) => {
  const { i18n } = useTranslation()

  useEffect(() => {
    const lang = i18n.language.startsWith('ar') ? 'ar' : 'en'
    const dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [i18n.language])

  return children
}
