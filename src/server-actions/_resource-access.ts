import { AppRole, auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { ServerActionError } from './_common'

export async function getSession(requiredRoles?: AppRole[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: {
      disableCookieCache: true,
    },
  })

  if (!session) {
    return null
  }

  if (requiredRoles && !(requiredRoles as string[]).includes(session.user.role || '')) {
    return null
  }

  return session.user
}

export async function getSessionThrowable(requiredRoles?: AppRole[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: {
      disableCookieCache: true,
    },
  })

  if (!session) {
    throw new ServerActionError('Unauthorized', 'UNAUTHORIZED')
  }

  if (requiredRoles && !(requiredRoles as string[]).includes(session.user.role || '')) {
    throw new ServerActionError('Unauthorized', 'UNAUTHORIZED')
  }

  return session.user
}
