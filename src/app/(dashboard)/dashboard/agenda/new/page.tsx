import getSession from '../../_lib/auth'
import NewAgendaClient from './new-agenda-client'
import { connection } from 'next/server'

export default async function NewAgendaPage() {
  await connection()
  await getSession()

  return <NewAgendaClient />
}
