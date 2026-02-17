import getSession from '../../../_lib/auth'
import { getUserById, getUsers } from '@/server-actions/auth'
import EditUserPage from './edit-page'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (session.role !== 'admin') {
    return <div>You are not allowed to access this page.</div>
  }

  const { id } = await params
  const user = await getUserById(id)

  if (user && 'error' in user) {
    return <div>Failed to load users.</div>
  }

  return (
    <EditUserPage
      user={{
        id: user.id,
        email: user.email,
        name: user.name ?? '',
        role: (user.role as 'admin' | 'user') ?? 'user',
      }}
    />
  )
}
