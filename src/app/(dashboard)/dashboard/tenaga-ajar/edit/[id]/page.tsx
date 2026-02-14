import EditTenagaAjarPage from './edit-page'
import { getTenagaAjarById } from '@/server-actions/tenaga-ajar'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tenagaAjar = await getTenagaAjarById(id)

  return <EditTenagaAjarPage tenagaAjar={tenagaAjar} />
}
