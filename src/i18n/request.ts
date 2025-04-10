import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

const locales = ['en', 'id']

export default getRequestConfig(async ({ locale }: { locale?: string }) => {
  if (!locale) {
    locale = 'id'
  }

  if (!locales.includes(locale)) notFound()
  console.log('Locale', locale)

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
