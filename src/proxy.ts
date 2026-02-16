import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { defaultLocale, locales } from './i18n/routing'
import { auth } from './lib/auth'
import { headers } from 'next/headers'

export default async function proxy(request: NextRequest) {
  // Handle dashboard routes separately (no i18n)
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }

    return NextResponse.next()
  }

  // Apply i18n middleware to all other routes
  const handleI18nRouting = createMiddleware({
    locales: locales,
    defaultLocale: defaultLocale,
    localePrefix: 'always',
  })

  return handleI18nRouting(request)
}

export const config = {
  matcher: ['/', '/(id|en)/:path*', '/dashboard/:path*'],
}
