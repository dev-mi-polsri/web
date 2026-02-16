import EditAgendaPage from './edit-page'
import { getAgendaById } from '@/server-actions/agenda'
import { connection } from 'next/server'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await connection()
  const { id } = await params
  const agenda = await getAgendaById(id)

  return <EditAgendaPage agenda={agenda} />
}
