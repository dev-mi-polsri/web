import EditAgendaPage from './edit-page'
import { getAgendaById } from '@/server-actions/agenda'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const agenda = await getAgendaById(id)

  return <EditAgendaPage agenda={agenda} />
}
