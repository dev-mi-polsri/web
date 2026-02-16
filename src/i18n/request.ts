// import { notFound } from 'next/navigation'
// import { getRequestConfig } from 'next-intl/server'

// const locales = ['en', 'id']

// export default getRequestConfig(async ({ locale }: { locale?: string }) => {
//   if (!locale) {
//     locale = 'id'
//   }

//   if (!locales.includes(locale)) notFound()

//   return {
//     locale,
//     messages: (await import(`../../messages/${locale}.json`)).default,
//   }
// })

import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
