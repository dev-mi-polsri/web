import getSession from '../../_lib/auth'
import NewAgendaClient from './new-agenda-client'

export default async function NewAgendaPage() {
  await getSession()

  return <NewAgendaClient />
}
