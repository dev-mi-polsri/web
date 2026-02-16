import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'id'],

  // Used when no locale matches
  defaultLocale: 'id',
  localePrefix: 'always',
})

export const locales = routing.locales
export const defaultLocale = routing.defaultLocale
