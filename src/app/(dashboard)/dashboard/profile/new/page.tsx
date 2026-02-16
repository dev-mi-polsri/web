import getSession from '../../_lib/auth'
import NewProfileClient from './new-profile-client'
import { connection } from 'next/server'

export default async function NewProfilePage() {
  await connection()
  await getSession()

  return <NewProfileClient />
}
