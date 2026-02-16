import getSession from '../../_lib/auth'
import NewUserClient from './new-user-client'
import { connection } from 'next/server'

export default async function NewUserPage() {
  await connection()
  const session = await getSession()
  if (session.role !== 'admin') {
    return <div>You are not allowed to access this page.</div>
  }

  return <NewUserClient />
}
