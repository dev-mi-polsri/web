import { AppRole, auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function getSession(requiredRoles?: AppRole[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/auth')
  }

  if (requiredRoles && !(requiredRoles as string[]).includes(session?.user.role || '')) {
    redirect('/auth')
  }

  return session.user
}
