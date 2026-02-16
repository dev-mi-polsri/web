import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'
import { auth } from './lib/auth'
import { headers } from 'next/headers'

export default async function proxy(request: NextRequest) {
  const handleI18nRouting = createMiddleware(routing)
  const response = handleI18nRouting(request)

  if (request.nextUrl.pathname.startsWith('/dashboard/')) {
    // Dashboard routes
    // Don't apply i18n middleware to dashboard routes

    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }

    return response
  }

  return response
}

export const config = {
  matcher: ['/', '/(id|en)/:path*'],
}
