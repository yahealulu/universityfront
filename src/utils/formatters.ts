import { format, parse, parseISO } from 'date-fns'
import { arSA, enUS } from 'date-fns/locale'

/** Matches invoice table / modal mockups (e.g. `400$`). */
export const formatInvoiceMoney = (value: number) => `${value}$`

export const formatCurrencyUsd = (value: number, locale: string) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export const formatPercent = (value: number, locale: string) => {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  }).format(value)
}

export const formatAxisThousands = (value: number) => {
  if (value >= 1000) {
    return `${Math.round(value / 1000)}K`
  }
  return String(value)
}

/** Display label for patient record in lists (e.g. PT-0123456789). */
export const formatPatientRecordLabel = (patientCode: string) => `PT-${patientCode}`

/** Short locale date from ISO date string (yyyy-MM-dd). */
export const formatIsoDateLocale = (isoDate: string, language: string): string => {
  const parsed = parseISO(isoDate)
  if (Number.isNaN(parsed.getTime())) return isoDate
  const loc = language.startsWith('ar') ? arSA : enUS
  return format(parsed, 'P', { locale: loc })
}

/** 12-hour time from 24h "HH:mm" string. */
export const formatTime24hTo12hLocale = (time24: string, language: string): string => {
  const parsed = parse(time24, 'HH:mm', new Date())
  if (Number.isNaN(parsed.getTime())) return time24
  const loc = language.startsWith('ar') ? arSA : enUS
  return format(parsed, 'h:mm a', { locale: loc })
}
