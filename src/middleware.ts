import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['en', 'id'],
  defaultLocale: 'id',
  localePrefix: 'always',
})

export const config = {
  matcher: ['/', '/(id|en)/:path*'],
}

